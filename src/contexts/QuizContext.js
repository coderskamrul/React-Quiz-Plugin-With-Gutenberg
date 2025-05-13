import { createContext, useContext, useReducer } from 'react';
import { __ } from '@wordpress/i18n';

// Initial state
const initialState = {
	quizzes: [],
	currentQuiz: null,
	questions: [],
	userAnswers: {},
	score: null,
	loading: false,
	error: null,
	results: [],
};

// Action types
const ActionTypes = {
	SET_LOADING: 'SET_LOADING',
	SET_ERROR: 'SET_ERROR',
	SET_QUIZZES: 'SET_QUIZZES',
	SET_CURRENT_QUIZ: 'SET_CURRENT_QUIZ',
	SET_QUESTIONS: 'SET_QUESTIONS',
	SET_USER_ANSWER: 'SET_USER_ANSWER',
	CALCULATE_SCORE: 'CALCULATE_SCORE',
	RESET_QUIZ: 'RESET_QUIZ',
	SET_RESULTS: 'SET_RESULTS',
};

// Reducer function
const quizReducer = ( state, action ) => {
	switch ( action.type ) {
		case ActionTypes.SET_LOADING:
			return { ...state, loading: action.payload };
		case ActionTypes.SET_ERROR:
			return { ...state, error: action.payload, loading: false };
		case ActionTypes.SET_QUIZZES:
			return { ...state, quizzes: action.payload, loading: false };
		case ActionTypes.SET_CURRENT_QUIZ:
			return { ...state, currentQuiz: action.payload, loading: false };
		case ActionTypes.SET_QUESTIONS:
			return { ...state, questions: action.payload, loading: false };
		case ActionTypes.SET_USER_ANSWER:
			return {
				...state,
				userAnswers: {
					...state.userAnswers,
					[ action.payload.questionId ]: action.payload.answerId,
				},
			};
		case ActionTypes.CALCULATE_SCORE:
			return { ...state, score: action.payload };
		case ActionTypes.RESET_QUIZ:
			return {
				...state,
				userAnswers: {},
				score: null,
			};
		case ActionTypes.SET_RESULTS:
			return { ...state, results: action.payload, loading: false };
		default:
			return state;
	}
};

// Create context
const QuizContext = createContext();

// Context provider component
export const QuizContextProvider = ( { children } ) => {
	const [ state, dispatch ] = useReducer( quizReducer, initialState );

	// API base URL
	const apiUrl =
		window.reactQuizApp?.apiUrl ||
		window.reactQuizAppAdmin?.apiUrl ||
		'/wp-json/react-quiz-app/v1';

	// Fetch quizzes
	const fetchQuizzes = async () => {
		dispatch( { type: ActionTypes.SET_LOADING, payload: true } );

		try {
			const response = await fetch( `${ apiUrl }/quizzes`, {
				headers: {
					'X-WP-Nonce':
						window.reactQuizApp?.nonce ||
						window.reactQuizAppAdmin?.nonce,
				},
			} );

			if ( ! response.ok ) {
				throw new Error(
					__( 'Failed to fetch quizzes', 'react-quiz-app' )
				);
			}

			const data = await response.json();
			dispatch( { type: ActionTypes.SET_QUIZZES, payload: data } );
		} catch ( error ) {
			dispatch( { type: ActionTypes.SET_ERROR, payload: error.message } );
		}
	};

	// Fetch quiz by ID
	const fetchQuiz = async ( quizId ) => {
		dispatch( { type: ActionTypes.SET_LOADING, payload: true } );

		try {
			const response = await fetch( `${ apiUrl }/quizzes/${ quizId }`, {
				headers: {
					'X-WP-Nonce':
						window.reactQuizApp?.nonce ||
						window.reactQuizAppAdmin?.nonce,
				},
			} );

			if ( ! response.ok ) {
				throw new Error(
					__( 'Failed to fetch quiz', 'react-quiz-app' )
				);
			}

			const data = await response.json();
			dispatch( { type: ActionTypes.SET_CURRENT_QUIZ, payload: data } );
			dispatch( {
				type: ActionTypes.SET_QUESTIONS,
				payload: data.questions || [],
			} );
		} catch ( error ) {
			dispatch( { type: ActionTypes.SET_ERROR, payload: error.message } );
		}
	};

	// Save quiz
	const saveQuiz = async ( quizId, questions ) => {
		dispatch( { type: ActionTypes.SET_LOADING, payload: true } );

		try {
			const response = await fetch( `${ apiUrl }/quizzes/${ quizId }`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window.reactQuizAppAdmin?.nonce,
				},
				body: JSON.stringify( { questions } ),
			} );

			if ( ! response.ok ) {
				throw new Error(
					__( 'Failed to save quiz', 'react-quiz-app' )
				);
			}

			const data = await response.json();
			dispatch( { type: ActionTypes.SET_QUESTIONS, payload: questions } );
			return data;
		} catch ( error ) {
			dispatch( { type: ActionTypes.SET_ERROR, payload: error.message } );
			throw error;
		}
	};

	// Set user answer
	const setUserAnswer = ( questionId, answerId ) => {
		dispatch( {
			type: ActionTypes.SET_USER_ANSWER,
			payload: { questionId, answerId },
		} );
	};

	// Calculate score
	const calculateScore = () => {
		const { questions, userAnswers } = state;
		let correctCount = 0;

		questions.forEach( ( question, index ) => {
			if ( userAnswers[ index ] === question.correctAnswer ) {
				correctCount++;
			}
		} );

		const score =
			questions.length > 0
				? ( correctCount / questions.length ) * 100
				: 0;
		dispatch( { type: ActionTypes.CALCULATE_SCORE, payload: score } );

		return score;
	};

	// Submit quiz
	const submitQuiz = async ( quizId ) => {
		const score = calculateScore();

		try {
			// Log the data being sent
			console.log( 'Submitting quiz data:', {
				score,
				answers: state.userAnswers,
			} );

			const response = await fetch(
				`${ apiUrl }/quizzes/${ quizId }/results`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': window.reactQuizApp?.nonce,
					},
					body: JSON.stringify( {
						score,
						answers: state.userAnswers,
					} ),
				}
			);

			// Log the response status
			console.log( 'Response status:', response.status );

			// Get the response text for debugging
			const responseText = await response.text();
			console.log( 'Response text:', responseText );

			// Parse the response as JSON
			let data;
			try {
				data = JSON.parse( responseText );
			} catch ( e ) {
				console.error( 'Failed to parse response as JSON:', e );
				throw new Error(
					__( 'Invalid response from server', 'react-quiz-app' )
				);
			}

			if ( ! response.ok ) {
				throw new Error(
					data.message ||
						__( 'Failed to submit quiz', 'react-quiz-app' )
				);
			}

			return data;
		} catch ( error ) {
			console.error( 'Error in submitQuiz:', error );
			dispatch( { type: ActionTypes.SET_ERROR, payload: error.message } );
			throw error;
		}
	};

	// Reset quiz
	const resetQuiz = () => {
		dispatch( { type: ActionTypes.RESET_QUIZ } );
	};

	// Fetch quiz results
	const fetchResults = async ( quizId, userId = null ) => {
		dispatch( { type: ActionTypes.SET_LOADING, payload: true } );

		try {
			let url = `${ apiUrl }/quizzes/${ quizId }/results`;

			if ( userId ) {
				url += `?user_id=${ userId }`;
			}

			const response = await fetch( url, {
				headers: {
					'X-WP-Nonce': window.reactQuizAppAdmin?.nonce,
				},
			} );

			if ( ! response.ok ) {
				throw new Error(
					__( 'Failed to fetch results', 'react-quiz-app' )
				);
			}

			const data = await response.json();
			dispatch( { type: ActionTypes.SET_RESULTS, payload: data } );
		} catch ( error ) {
			dispatch( { type: ActionTypes.SET_ERROR, payload: error.message } );
		}
	};

	// Context value
	const value = {
		...state,
		fetchQuizzes,
		fetchQuiz,
		saveQuiz,
		setUserAnswer,
		calculateScore,
		submitQuiz,
		resetQuiz,
		fetchResults,
	};

	return (
		<QuizContext.Provider value={ value }>
			{ children }
		</QuizContext.Provider>
	);
};

// Custom hook to use the quiz context
export const useQuiz = () => {
	const context = useContext( QuizContext );

	if ( ! context ) {
		throw new Error( 'useQuiz must be used within a QuizContextProvider' );
	}

	return context;
};
