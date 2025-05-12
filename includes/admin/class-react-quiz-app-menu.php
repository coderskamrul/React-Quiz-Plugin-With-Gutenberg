<?php
/**
 * Admin menu class
 */
class React_Quiz_App_Menu {

	/**
	 * Initialize the admin menu
	 */
	public function init() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
	}

	/**
	 * Add admin menu
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'Quiz App', 'react-quiz-app' ),
			__( 'Quiz App', 'react-quiz-app' ),
			'manage_options',
			'react-quiz-app',
			array( $this, 'render_admin_page' ),
			'dashicons-list-view',
			30
		);

		add_submenu_page(
			'react-quiz-app',
			__( 'Dashboard', 'react-quiz-app' ),
			__( 'Dashboard', 'react-quiz-app' ),
			'manage_options',
			'react-quiz-app',
			array( $this, 'render_admin_page' )
		);

		add_submenu_page(
			'react-quiz-app',
			__( 'Settings', 'react-quiz-app' ),
			__( 'Settings', 'react-quiz-app' ),
			'manage_options',
			'react-quiz-app-settings',
			array( $this, 'render_admin_page' )
		);

		add_submenu_page(
			'react-quiz-app',
			__( 'Help', 'react-quiz-app' ),
			__( 'Help', 'react-quiz-app' ),
			'manage_options',
			'react-quiz-app-help',
			array( $this, 'render_admin_page' )
		);
	}

	/**
	 * Render admin page
	 */
	public function render_admin_page() {
		echo '<div id="react-quiz-app-admin"></div>';
	}

	/**
	 * Enqueue admin scripts
	 */
	public function enqueue_admin_scripts( $hook ) {
		// Only load on plugin pages
		if ( strpos( $hook, 'react-quiz-app' ) === false ) {
			return;
		}

		// Enqueue admin scripts
		wp_enqueue_script(
			'react-quiz-app-admin',
			REACT_QUIZ_APP_PLUGIN_URL . 'assets/js/backend/quiz-admin.js',
			array( 'wp-element', 'wp-api-fetch', 'wp-i18n' ),
			REACT_QUIZ_APP_VERSION,
			true
		);

		// Localize script
		wp_localize_script(
			'react-quiz-app-admin',
			'reactQuizAppAdmin',
			array(
				'apiUrl'      => rest_url( 'react-quiz-app/v1' ),
				'nonce'       => wp_create_nonce( 'wp_rest' ),
				'currentPage' => $this->get_current_page(),
			)
		);

		// Enqueue admin styles
		wp_enqueue_style(
			'react-quiz-app-admin',
			REACT_QUIZ_APP_PLUGIN_URL . 'assets/css/admin.css',
			array(),
			REACT_QUIZ_APP_VERSION
		);
	}

	/**
	 * Get current admin page
	 */
	private function get_current_page() {
		$page = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : 'react-quiz-app';

		switch ( $page ) {
			case 'react-quiz-app':
				return 'dashboard';
			case 'react-quiz-app-settings':
				return 'settings';
			case 'react-quiz-app-help':
				return 'help';
			default:
				return 'dashboard';
		}
	}
}
