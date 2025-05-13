<?php
/**
 * Plugin Name: React Quiz App Dev
 * Plugin URI: https://example.com/react-quiz-app
 * Description: A WordPress plugin that allows admins to create multiple-choice quizzes and embed them using a Gutenberg block.
 * Version: 1.0.0
 * Author: Kamrul Hasan
 * Author URI: https://example.com
 * Text Domain: react-quiz-app
 * Domain Path: /languages
 * License: GPL v2 or later
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
define( 'REACT_QUIZ_APP_VERSION', '1.0.0' );
define( 'REACT_QUIZ_APP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'REACT_QUIZ_APP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'REACT_QUIZ_APP_PLUGIN_FILE', __FILE__ );

// Include the main plugin class.
require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app.php';

/**
 * Initialize the plugin
 *
 * @return void
 */
function react_quiz_app_init() {
	// Initialize the plugin.
	$plugin = new React_Quiz_App();
	$plugin->init();

	// Register shortcode for backward compatibility.
	add_shortcode( 'react-quiz-app', 'react_quiz_app_shortcode' );
}

/**
 * Register the Gutenberg block
 *
 * @param array $atts Block attributes.
 *
 * @return mixed
 */
function react_quiz_app_shortcode( $atts ) {
	$atts = shortcode_atts(
		array(
			'id' => 0,
		),
		$atts,
		'react-quiz-app'
	);

	$quiz_id = absint( $atts['id'] );

	if ( ! $quiz_id ) {
		return '<div class="react-quiz-app-error">Please specify a quiz ID.</div>';
	}

	return '<div id="react-quiz-app-' . $quiz_id . '" class="react-quiz-app" data-quiz-id="' . $quiz_id . '"></div>';
}

// Initialize the plugin.
add_action( 'plugins_loaded', 'react_quiz_app_init' );

/**
 * Register activation hook
 */
register_activation_hook( __FILE__, 'react_quiz_app_activate' );
function react_quiz_app_activate() {
	require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app-install.php';
	React_Quiz_App_Install::activate();
}

/**
 * Register deactivation hook
 */
register_deactivation_hook( __FILE__, 'react_quiz_app_deactivate' );
function react_quiz_app_deactivate() {
	// Flush rewrite rules on deactivation.
	flush_rewrite_rules();
}

/**
 * Add REST API nonce to admin
 */
function react_quiz_app_admin_scripts() {
	// Localize the script with new data.
	$script_data = array(
		'root'            => esc_url_raw( rest_url() ),
		'nonce'           => wp_create_nonce( 'wp_rest' ),
		'current_user_id' => get_current_user_id(),
	);

	// The handle should match the registered script.
	wp_localize_script( 'wp-api', 'wpApiSettings', $script_data );

	// If wp-api is not enqueued, enqueue a small script to make the data available.
	if ( ! wp_script_is( 'wp-api', 'enqueued' ) ) {
		wp_enqueue_script( 'react-quiz-app-api-settings', REACT_QUIZ_APP_PLUGIN_URL . 'assets/js/api-settings.js', array(), REACT_QUIZ_APP_VERSION, true );
		wp_localize_script( 'react-quiz-app-api-settings', 'wpApiSettings', $script_data );
	}
}
add_action( 'admin_enqueue_scripts', 'react_quiz_app_admin_scripts' );

/**
 * Add REST API support for all post types
 */
function react_quiz_app_add_rest_support() {
	global $wp_post_types;

	// Add REST API support to the quiz post type.
	if ( isset( $wp_post_types['quiz'] ) ) {
		$wp_post_types['quiz']->show_in_rest          = true;
		$wp_post_types['quiz']->rest_base             = 'quizzes';
		$wp_post_types['quiz']->rest_controller_class = 'WP_REST_Posts_Controller';
	}
}
add_action( 'init', 'react_quiz_app_add_rest_support', 25 );

/**
 * Enable CORS for REST API
 */
function react_quiz_app_enable_cors() {
	// Allow from any origin.
	if ( isset( $_SERVER['HTTP_ORIGIN'] ) ) {
		header( 'Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN'] );
		header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
		header( 'Access-Control-Allow-Credentials: true' );
		header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );
	}

	// Exit early for preflight requests.
	if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
		status_header( 200 );
		exit();
	}
}
add_action( 'rest_api_init', 'react_quiz_app_enable_cors', 15 );

/**
 * Check database tables on plugin load
 */
function react_quiz_app_check_tables() {
	require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app-install.php';
	React_Quiz_App_Install::check_tables();
}
add_action( 'plugins_loaded', 'react_quiz_app_check_tables', 5 );

/**
 * Hide database errors on frontend
 */
function react_quiz_app_hide_db_errors() {
	if ( ! is_admin() ) {
		// Hide database errors on frontend.
		$wpdb_show_errors             = $GLOBALS['wpdb']->show_errors;
		$GLOBALS['wpdb']->show_errors = false;

		// Store the original value to restore it later.
		$GLOBALS['wpdb']->wpdb_show_errors = $wpdb_show_errors;
	}
}
add_action( 'init', 'react_quiz_app_hide_db_errors' );

/**
 * Restore database error display setting
 */
function react_quiz_app_restore_db_errors() {
	if ( ! is_admin() && isset( $GLOBALS['wpdb']->wpdb_show_errors ) ) {
		$GLOBALS['wpdb']->show_errors = $GLOBALS['wpdb']->wpdb_show_errors;
	}
}
add_action( 'shutdown', 'react_quiz_app_restore_db_errors' );
