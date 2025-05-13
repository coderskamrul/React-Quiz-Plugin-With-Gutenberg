<?php
/**
 * Main plugin class
 */
class React_Quiz_App {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Load plugin dependencies.
		$this->load_dependencies();
	}

	/**
	 * Load plugin dependencies
	 */
	private function load_dependencies() {
		// Load plugin functions.
		require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app-functions.php';

		// Load admin menu.
		require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/admin/class-react-quiz-app-menu.php';

		// Load frontend scripts.
		require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app-frontend-scripts.php';

		// Load REST API.
		require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/rest-api/class-react-quiz-app-rest-controller.php';

		// Load Quiz Post Type.
		require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-quiz-post-type.php';
	}

	/**
	 * Initialize the plugin
	 */
	public function init() {
		// Register custom post type.
		$quiz_post_type = new Quiz_Post_Type();
		$quiz_post_type->init();

		// Register Gutenberg block.
		add_action( 'init', array( $this, 'register_blocks' ) );

		// Initialize admin menu.
		$admin_menu = new React_Quiz_App_Menu();
		$admin_menu->init();

		// Initialize frontend scripts.
		$frontend_scripts = new React_Quiz_App_Frontend_Scripts();
		$frontend_scripts->init();

		// Initialize REST API.
		$rest_controller = new React_Quiz_App_REST_Controller();
		$rest_controller->init();

		// Load text domain.
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );

		// Add admin settings.
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_settings' ) );
	}

	/**
	 * Add admin settings to JavaScript
	 */
	public function admin_settings() {
		wp_localize_script(
			'wp-blocks',
			'wpAdminSettings',
			array(
				'adminUrl' => admin_url(),
			)
		);
	}

	/**
	 * Register Gutenberg blocks
	 */
	public function register_blocks() {
		// Check if Gutenberg is active.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		// Register block script.
		wp_register_script(
			'react-quiz-app-block',
			REACT_QUIZ_APP_PLUGIN_URL . 'assets/js/backend/blocks.js',
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data' ),
			REACT_QUIZ_APP_VERSION,
			true
		);

		// Register block.
		register_block_type(
			'react-quiz-app/quiz-block',
			array(
				'editor_script'   => 'react-quiz-app-block',
				'render_callback' => array( $this, 'render_quiz_block' ),
				'attributes'      => array(
					'quizId' => array(
						'type' => 'number',
					),
				),
			)
		);
	}

	/**
	 * Render quiz block
	 *
	 * @param array $attributes Block attributes.
	 * @return string HTML output for the quiz block.
	 * @since 1.0.0
	 */
	public function render_quiz_block( $attributes ) {
		if ( empty( $attributes['quizId'] ) ) {
			return '<div class="react-quiz-app-error">Please select a quiz.</div>';
		}

		$quiz_id = absint( $attributes['quizId'] );

		return '<div id="react-quiz-app-' . $quiz_id . '" class="react-quiz-app" data-quiz-id="' . $quiz_id . '"></div>';
	}

	/**
	 * Load plugin text domain
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'react-quiz-app', false, dirname( plugin_basename( REACT_QUIZ_APP_PLUGIN_FILE ) ) . '/languages/' );
	}
}
