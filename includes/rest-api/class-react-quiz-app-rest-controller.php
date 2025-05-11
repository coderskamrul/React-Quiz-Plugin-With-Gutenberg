<?php
/**
 * REST API Controller
 */
class React_Quiz_App_REST_Controller {

    /**
     * Initialize REST API
     */
    public function init() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Debug endpoint to test REST API functionality
        register_rest_route( 'react-quiz-app/v1', '/debug', array(
            'methods' => 'GET',
            'callback' => function() {
                return rest_ensure_response( array( 
                    'status' => 'ok',
                    'message' => 'REST API is working',
                    'time' => current_time('mysql')
                ));
            },
            'permission_callback' => '__return_true',
        ));
    }

}
