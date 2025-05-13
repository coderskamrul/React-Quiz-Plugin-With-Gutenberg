<?php
/**
 * Plugin installation class
 */
class React_Quiz_App_Install {

	/**
	 * Activate the plugin
	 */
	public static function activate() {
		// Create custom post type.
		$plugin = new React_Quiz_App();

		// Register post types so flush_rewrite_rules() works properly.
		$quiz_post_type = new Quiz_Post_Type();
		$quiz_post_type->register_post_type();

		// Flush rewrite rules.
		flush_rewrite_rules();

		// Create custom database tables.
		self::create_tables();

		// Set version.
		update_option( 'react_quiz_app_version', REACT_QUIZ_APP_VERSION );
	}

	/**
	 * Create custom database tables
	 */
	private static function create_tables() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		// Create quiz results table.
		$table_name = $wpdb->prefix . 'quiz_results';

		$sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            quiz_id mediumint(9) NOT NULL,
            user_id mediumint(9) NOT NULL,
            score float NOT NULL,
            answers longtext NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Check if tables exist and create them if they don't
	 */
	public static function check_tables() {
		global $wpdb;

		$table_name = $wpdb->prefix . 'quiz_results';

		// Check if the table exists.
		$table_exists = $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) === $table_name;

		if ( ! $table_exists ) {
			self::create_tables();
			return true;
		}

		return false;
	}
}
