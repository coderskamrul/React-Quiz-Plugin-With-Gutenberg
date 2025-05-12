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


// Create context
const QuizContext = createContext();

// Context provider component
export const QuizContextProvider = ( { children } ) => {
	const [ state, dispatch ] = useReducer( quizReducer, initialState );

	

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
