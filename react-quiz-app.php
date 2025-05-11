<?php
/**
 * Plugin Name: React Quiz App
 * Plugin URI: https://example.com/react-quiz-app
 * Description: A WordPress plugin that allows admins to create multiple-choice quizzes and embed them using a Gutenberg block.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * Text Domain: react-quiz-app
 * Domain Path: /languages
 * License: GPL v2 or later
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define plugin constants
define( 'REACT_QUIZ_APP_VERSION', '1.0.0' );
define( 'REACT_QUIZ_APP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'REACT_QUIZ_APP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'REACT_QUIZ_APP_PLUGIN_FILE', __FILE__ );
