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
	}

	/**
	 * Render admin page
	 */
	public function render_admin_page() {
		echo '<div id="react-quiz-app-admin"></div>';
	}



}
