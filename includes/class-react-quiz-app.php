<?php
/**
 * Main plugin class
 */
class React_Quiz_App {

    /**
     * Constructor
     */
    public function __construct() {
        // Load plugin dependencies
        $this->load_dependencies();
    }

    /**
     * Load plugin dependencies
     */
    private function load_dependencies() {
        // Load plugin functions
        require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app-functions.php';
        
        // Load admin menu
        require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/admin/class-react-quiz-app-menu.php';
        
        // Load frontend scripts
        require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app-frontend-scripts.php';
        
        // Load REST API
        require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/rest-api/class-react-quiz-app-rest-controller.php';
        
        // Load Quiz Post Type
        require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-quiz-post-type.php';
    }

    /**
     * Load plugin text domain
     */
    public function load_textdomain() {
        load_plugin_textdomain( 'react-quiz-app', false, dirname( plugin_basename( REACT_QUIZ_APP_PLUGIN_FILE ) ) . '/languages/' );
    }
}
