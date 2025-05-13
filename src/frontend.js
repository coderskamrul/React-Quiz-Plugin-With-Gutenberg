// Frontend entry point for the React Quiz App
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QuizContextProvider } from './contexts/QuizContext';
import QuizApp from './components/QuizApp';

// Initialize Frontend App
const initFrontendApp = () => {
	const quizContainers = document.querySelectorAll( '.react-quiz-app' );

	if ( quizContainers.length > 0 ) {
		quizContainers.forEach( ( container ) => {
			const quizId = container.dataset.quizId;

			if ( quizId ) {
				const root = createRoot( container );

				root.render(
					<React.StrictMode>
						<QuizContextProvider>
							<QuizApp quizId={ Number.parseInt( quizId, 10 ) } />
						</QuizContextProvider>
					</React.StrictMode>
				);
			}
		} );
	}
};

// Initialize the frontend app
document.addEventListener( 'DOMContentLoaded', initFrontendApp );
