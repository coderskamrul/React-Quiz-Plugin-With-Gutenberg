<?php
/**
 * Frontend scripts class
 */
class React_Quiz_App_Frontend_Scripts {

	/**
	 * Initialize frontend scripts
	 */
	public function init() {
		// Enqueue frontend scripts.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Enqueue frontend scripts
	 */
	public function enqueue_scripts() {
		// Register frontend scripts.
		wp_register_script(
			'react-quiz-app-frontend',
			REACT_QUIZ_APP_PLUGIN_URL . 'assets/js/backend/quiz-frontend.js',
			array( 'wp-element', 'wp-i18n' ),
			REACT_QUIZ_APP_VERSION,
			true
		);

		// Localize script.
		wp_localize_script(
			'react-quiz-app-frontend',
			'reactQuizApp',
			array(
				'apiUrl' => rest_url( 'react-quiz-app/v1' ),
				'nonce'  => wp_create_nonce( 'wp_rest' ),
				'userId' => get_current_user_id(),
			)
		);

		// Register frontend styles.
		wp_register_style(
			'react-quiz-app-frontend',
			REACT_QUIZ_APP_PLUGIN_URL . 'assets/css/frontend.css',
			array(),
			REACT_QUIZ_APP_VERSION
		);

		// Always enqueue scripts for blocks.
		if ( has_block( 'react-quiz-app/quiz-block' ) || is_singular( 'quiz' ) ) {
			wp_enqueue_script( 'react-quiz-app-frontend' );
			wp_enqueue_style( 'react-quiz-app-frontend' );
		}

		// Also check for quiz blocks in post content.
		global $post;
		if ( $post && has_shortcode( $post->post_content, 'react-quiz-app' ) ) {
			wp_enqueue_script( 'react-quiz-app-frontend' );
			wp_enqueue_style( 'react-quiz-app-frontend' );
		}
	}
}
