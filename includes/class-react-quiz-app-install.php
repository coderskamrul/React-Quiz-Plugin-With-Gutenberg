<?php
/**
 * Plugin installation class
 */
class React_Quiz_App_Install {

    /**
     * Activate the plugin
     */
    public static function activate() {
        // Create custom post type
        $plugin = new React_Quiz_App();
        
        // Register post types so flush_rewrite_rules() works properly
        $quiz_post_type = new Quiz_Post_Type();
        $quiz_post_type->register_post_type();
 
        
        // Set version
        update_option( 'react_quiz_app_version', REACT_QUIZ_APP_VERSION );
    }

}
