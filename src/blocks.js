'use client';

import { registerBlockType } from '@wordpress/blocks';
import {
	SelectControl,
	Button,
	Spinner,
	Notice,
	Panel,
	PanelBody,
} from '@wordpress/components';
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

		// Render a preview of the quiz
		const renderQuizPreview = () => {
			if ( ! selectedQuiz ) return null;

			return (
				<div className="quiz-block-preview-detailed">
					<h3>{ selectedQuiz.title }</h3>

					<div className="quiz-preview-questions">
						{ selectedQuiz.questions
							.slice( 0, 3 )
							.map( ( question, index ) => (
								<div
									key={ index }
									className="quiz-preview-question"
								>
									<p className="quiz-preview-question-text">
										<strong>
											{ __(
												'Question',
												'react-quiz-app'
											) }{ ' ' }
											{ index + 1 }:
										</strong>{ ' ' }
										{ question.text }
									</p>
									<div className="quiz-preview-answers">
										{ question.answers.map(
											( answer, answerIndex ) => (
												<div
													key={ answerIndex }
													className="quiz-preview-answer"
												>
													<span
														className={
															answerIndex ===
															question.correctAnswer
																? 'quiz-preview-correct'
																: ''
														}
													>
														{ String.fromCharCode(
															65 + answerIndex
														) }
														. { answer }
														{ answerIndex ===
															question.correctAnswer && (
															<span className="quiz-preview-correct-indicator">
																{ ' ' }
																✓
															</span>
														) }
													</span>
												</div>
											)
										) }
									</div>
								</div>
							) ) }

						{ selectedQuiz.questions.length > 3 && (
							<p className="quiz-preview-more">
								{ __( 'And', 'react-quiz-app' ) }{ ' ' }
								{ selectedQuiz.questions.length - 3 }{ ' ' }
								{ __( 'more questions...', 'react-quiz-app' ) }
							</p>
						) }
					</div>

					<p className="quiz-preview-note">
						{ __(
							'This quiz will be displayed to users with',
							'react-quiz-app'
						) }{ ' ' }
						{ selectedQuiz.questions.length }{ ' ' }
						{ __( 'questions.', 'react-quiz-app' ) }
					</p>
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
								<Panel>
									<PanelBody
										title={ __(
											'Quiz Preview',
											'react-quiz-app'
										) }
										initialOpen={ true }
									>
										{ loadingQuiz ? (
											<div
												style={ {
													display: 'flex',
													alignItems: 'center',
													gap: '10px',
													padding: '10px 0',
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
										) }
									</PanelBody>
								</Panel>
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
