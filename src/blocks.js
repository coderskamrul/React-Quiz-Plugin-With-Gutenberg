'use client';

import { registerBlockType } from '@wordpress/blocks';
import { SelectControl, Button, Spinner, Notice } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

// Register the block
registerBlockType( 'react-quiz-app/quiz-block', {
	title: __( 'Quiz', 'react-quiz-app' ),
	icon: 'list-view',
	category: 'widgets',
	attributes: {
		quizId: {
			type: 'number',
		},
	},

	edit: ( { attributes, setAttributes } ) => {
		const { quizId } = attributes;
		const [ quizzes, setQuizzes ] = useState( [] );
		const [ loading, setLoading ] = useState( true );
		const [ error, setError ] = useState( null );
		const [ debugInfo, setDebugInfo ] = useState( null );
		const [ selectedQuiz, setSelectedQuiz ] = useState( null );
		const [ loadingQuiz, setLoadingQuiz ] = useState( false );
		const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState( 0 );
		const [ showAllQuestions, setShowAllQuestions ] = useState( false );

		// Function to test the REST API
		const testRestApi = async () => {
			try {
				setLoading( true );
				setError( null );

				// Test the debug endpoint
				const response = await fetch(
					`${
						window.wpApiSettings?.root || '/wp-json/'
					}react-quiz-app/v1/debug`
				);
				const data = await response.json();

				setDebugInfo( {
					status: data.status,
					message: data.message,
					time: data.time,
					apiRoot: window.wpApiSettings?.root || '/wp-json/',
					hasNonce: !! window.wpApiSettings?.nonce,
				} );

				setLoading( false );
			} catch ( error ) {
				console.error( 'Error testing REST API:', error );
				setDebugInfo( {
					error: error.message,
					apiRoot: window.wpApiSettings?.root || '/wp-json/',
					hasNonce: !! window.wpApiSettings?.nonce,
				} );
				setLoading( false );
			}
		};

		useEffect( () => {
			fetchQuizzes();
			testRestApi(); // Test the REST API on component mount
		}, [] );

		useEffect( () => {
			if ( quizId ) {
				fetchQuizDetails( quizId );
			} else {
				setSelectedQuiz( null );
			}
		}, [ quizId ] );

		const fetchQuizzes = async () => {
			try {
				setLoading( true );
				setError( null );

				// Use the REST API to fetch quizzes
				const response = await fetch(
					`${
						window.wpApiSettings?.root || '/wp-json/'
					}react-quiz-app/v1/quizzes`,
					{
						headers: {
							'X-WP-Nonce': window.wpApiSettings?.nonce || '',
							'Content-Type': 'application/json',
						},
					}
				);

				if ( ! response.ok ) {
					throw new Error(
						`HTTP error! Status: ${ response.status }`
					);
				}

				const data = await response.json();

				if ( ! Array.isArray( data ) ) {
					throw new Error(
						'Invalid response format. Expected an array.'
					);
				}

				setQuizzes( data );
				setLoading( false );
			} catch ( error ) {
				console.error( 'Error fetching quizzes:', error );
				setError( error.message || 'Failed to fetch quizzes' );
				setLoading( false );
			}
		};

		const fetchQuizDetails = async ( id ) => {
			try {
				setLoadingQuiz( true );

				const response = await fetch(
					`${
						window.wpApiSettings?.root || '/wp-json/'
					}react-quiz-app/v1/quizzes/${ id }`,
					{
						headers: {
							'X-WP-Nonce': window.wpApiSettings?.nonce || '',
							'Content-Type': 'application/json',
						},
					}
				);

				if ( ! response.ok ) {
					throw new Error(
						`HTTP error! Status: ${ response.status }`
					);
				}

				const data = await response.json();
				setSelectedQuiz( data );
				setLoadingQuiz( false );
			} catch ( error ) {
				console.error( 'Error fetching quiz details:', error );
				setLoadingQuiz( false );
			}
		};

		const blockProps = useBlockProps( {
			className: 'react-quiz-app-block-editor',
		} );

		const quizOptions = [
			{ label: __( 'Select a quiz', 'react-quiz-app' ), value: '' },
			...quizzes.map( ( quiz ) => ( {
				label: quiz.title,
				value: quiz.id,
			} ) ),
		];

		const handleNextQuestion = () => {
			if (
				selectedQuiz &&
				currentQuestionIndex < selectedQuiz.questions.length - 1
			) {
				setCurrentQuestionIndex( currentQuestionIndex + 1 );
			}
		};

		const handlePrevQuestion = () => {
			if ( currentQuestionIndex > 0 ) {
				setCurrentQuestionIndex( currentQuestionIndex - 1 );
			}
		};

		const toggleViewMode = () => {
			setShowAllQuestions( ! showAllQuestions );
		};

		// Render a preview of the quiz that matches the frontend
		const renderQuizPreview = () => {
			if ( ! selectedQuiz ) return null;

			return (
				<div className="quiz-container preview-mode">
					<h2 className="quiz-title">{ selectedQuiz.title }</h2>

					<div className="quiz-controls">
						<button
							type="button"
							className="quiz-view-toggle"
							onClick={ toggleViewMode }
						>
							{ showAllQuestions
								? __(
										'Show One Question at a Time',
										'react-quiz-app'
								  )
								: __( 'Show All Questions', 'react-quiz-app' ) }
						</button>
					</div>

					{ showAllQuestions ? (
						<div className="quiz-questions-all">
							{ selectedQuiz.questions.map(
								( question, index ) => (
									<div
										key={ index }
										className="quiz-question"
									>
										<h3 className="question-text">
											{ question.text }
										</h3>

										<div className="question-answers">
											{ question.answers.map(
												( answer, answerIndex ) => (
													<div
														key={ answerIndex }
														className={ `answer-option ${
															answerIndex ===
															question.correctAnswer
																? 'preview-correct'
																: ''
														}` }
													>
														<input
															type="radio"
															id={ `preview-question-${ index }-answer-${ answerIndex }` }
															name={ `preview-question-${ index }` }
															value={
																answerIndex
															}
															checked={
																answerIndex ===
																question.correctAnswer
															}
															readOnly
														/>
														<label
															htmlFor={ `preview-question-${ index }-answer-${ answerIndex }` }
														>
															{ answer }
														</label>
													</div>
												)
											) }
										</div>
									</div>
								)
							) }
						</div>
					) : (
						<div className="quiz-questions-single">
							{ selectedQuiz.questions.length > 0 && (
								<div className="quiz-question">
									<h3 className="question-text">
										{
											selectedQuiz.questions[
												currentQuestionIndex
											].text
										}
									</h3>

									<div className="question-answers">
										{ selectedQuiz.questions[
											currentQuestionIndex
										].answers.map(
											( answer, answerIndex ) => (
												<div
													key={ answerIndex }
													className={ `answer-option ${
														answerIndex ===
														selectedQuiz.questions[
															currentQuestionIndex
														].correctAnswer
															? 'preview-correct'
															: ''
													}` }
												>
													<input
														type="radio"
														id={ `preview-question-${ currentQuestionIndex }-answer-${ answerIndex }` }
														name={ `preview-question-${ currentQuestionIndex }` }
														value={ answerIndex }
														checked={
															answerIndex ===
															selectedQuiz
																.questions[
																currentQuestionIndex
															].correctAnswer
														}
														readOnly
													/>
													<label
														htmlFor={ `preview-question-${ currentQuestionIndex }-answer-${ answerIndex }` }
													>
														{ answer }
													</label>
												</div>
											)
										) }
									</div>

									<div className="quiz-navigation">
										<button
											type="button"
											className="quiz-nav-button"
											onClick={ handlePrevQuestion }
											disabled={
												currentQuestionIndex === 0
											}
										>
											{ __(
												'Previous',
												'react-quiz-app'
											) }
										</button>

										<span className="quiz-progress">
											{ __(
												'Question',
												'react-quiz-app'
											) }{ ' ' }
											{ currentQuestionIndex + 1 }{ ' ' }
											{ __( 'of', 'react-quiz-app' ) }{ ' ' }
											{ selectedQuiz.questions.length }
										</span>

										<button
											type="button"
											className="quiz-nav-button"
											onClick={ handleNextQuestion }
											disabled={
												currentQuestionIndex ===
												selectedQuiz.questions.length -
													1
											}
										>
											{ __( 'Next', 'react-quiz-app' ) }
										</button>
									</div>
								</div>
							) }
						</div>
					) }

					<div className="quiz-submit">
						<button
							type="button"
							className="quiz-submit-button"
							disabled
						>
							{ __( 'Submit Quiz', 'react-quiz-app' ) }
						</button>
						<p className="quiz-preview-note">
							{ __(
								'This is a preview. The submit button will be active on the frontend.',
								'react-quiz-app'
							) }
						</p>
					</div>
				</div>
			);
		};

		return (
			<div { ...blockProps }>
				<div className="quiz-block-editor">
					<h3>{ __( 'Quiz Block', 'react-quiz-app' ) }</h3>

					{ loading ? (
						<div
							style={ {
								display: 'flex',
								alignItems: 'center',
								gap: '10px',
							} }
						>
							<Spinner />
							<p>{ __( 'Loading...', 'react-quiz-app' ) }</p>
						</div>
					) : error ? (
						<div className="quiz-block-error">
							<Notice status="error" isDismissible={ false }>
								<p>
									{ __(
										'Error loading quizzes:',
										'react-quiz-app'
									) }{ ' ' }
									{ error }
								</p>
							</Notice>

							<div style={ { marginTop: '10px' } }>
								<Button
									variant="secondary"
									onClick={ fetchQuizzes }
								>
									{ __( 'Try Again', 'react-quiz-app' ) }
								</Button>
							</div>

							{ debugInfo && (
								<div
									style={ {
										marginTop: '15px',
										padding: '10px',
										backgroundColor: '#f0f0f0',
										borderRadius: '4px',
									} }
								>
									<h4>
										{ __(
											'Debug Information',
											'react-quiz-app'
										) }
									</h4>
									<pre
										style={ {
											whiteSpace: 'pre-wrap',
											fontSize: '12px',
										} }
									>
										{ JSON.stringify( debugInfo, null, 2 ) }
									</pre>
								</div>
							) }
						</div>
					) : quizzes.length === 0 ? (
						<div>
							<Notice status="warning" isDismissible={ false }>
								<p>
									{ __(
										'No quizzes found. Please create a quiz first.',
										'react-quiz-app'
									) }
								</p>
							</Notice>
							<div style={ { marginTop: '10px' } }>
								<Button
									variant="secondary"
									href={ `${
										window.wpAdminSettings?.adminUrl ||
										'/wp-admin/'
									}post-new.php?post_type=quiz` }
								>
									{ __( 'Create a Quiz', 'react-quiz-app' ) }
								</Button>
							</div>
						</div>
					) : (
						<>
							<SelectControl
								label={ __( 'Select Quiz', 'react-quiz-app' ) }
								value={ quizId }
								options={ quizOptions }
								onChange={ ( value ) =>
									setAttributes( {
										quizId: value
											? Number.parseInt( value, 10 )
											: null,
									} )
								}
							/>

							{ quizId ? (
								loadingQuiz ? (
									<div
										style={ {
											display: 'flex',
											alignItems: 'center',
											gap: '10px',
											padding: '20px 0',
										} }
									>
										<Spinner />
										<p>
											{ __(
												'Loading quiz details...',
												'react-quiz-app'
											) }
										</p>
									</div>
								) : (
									renderQuizPreview()
								)
							) : (
								<p className="quiz-block-placeholder">
									{ __(
										'Please select a quiz to display.',
										'react-quiz-app'
									) }
								</p>
							) }
						</>
					) }
				</div>
			</div>
		);
	},

	save: () => {
		// Dynamic block, rendering is handled by PHP
		return null;
	},
} );
