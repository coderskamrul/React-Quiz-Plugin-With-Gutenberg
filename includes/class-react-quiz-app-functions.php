<?php
/**
 * Plugin functions class
 */
class React_Quiz_App_Functions {

	/**
	 * Get quiz data
	 *
	 * @param int $quiz_id Quiz ID.
	 * @return array|false Quiz data or false if not found.
	 * @since 1.0.0
	 */
	public static function get_quiz_data( $quiz_id ) {
		$quiz = get_post( $quiz_id );

		if ( ! $quiz || 'quiz' !== $quiz->post_type ) {
			return false;
		}

		$questions = get_post_meta( $quiz_id, '_quiz_questions', true );

		if ( ! $questions ) {
			$questions = array();
		}

		return array(
			'id'        => $quiz_id,
			'title'     => $quiz->post_title,
			'questions' => $questions,
		);
	}

	/**
	 * Save quiz data
	 *
	 * @param int   $quiz_id Quiz ID.
	 * @param array $questions Quiz questions.
	 * @return bool True on success, false on failure.
	 * @since 1.0.0
	 */
	public static function save_quiz_data( $quiz_id, $questions ) {
		update_post_meta( $quiz_id, '_quiz_questions', $questions );

		return true;
	}

	/**
	 * Save quiz result
	 *
	 * @param int   $quiz_id Quiz ID.
	 * @param int   $user_id User ID.
	 * @param float $score Quiz score.
	 * @param array $answers User answers.
	 * @return int|false Quiz result ID or false on failure.
	 * @since 1.0.0
	 */
	public static function save_quiz_result( $quiz_id, $user_id, $score, $answers ) {
		global $wpdb;

		// Check if the table exists, create it if it doesn't.
		require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app-install.php';
		React_Quiz_App_Install::check_tables();

		$table_name = $wpdb->prefix . 'quiz_results';

		try {
			// Log the data being saved.
			error_log(
				'Saving quiz result: ' . print_r(
					array(
						'quiz_id' => $quiz_id,
						'user_id' => $user_id,
						'score'   => $score,
						'answers' => $answers,
					),
					true
				)
			);

			// Ensure score is a float.
			$score = floatval( $score );

			// Convert answers to JSON.
			$answers_json = is_array( $answers ) ? json_encode( $answers ) : '{}';

			$result = $wpdb->insert(
				$table_name,
				array(
					'quiz_id'    => $quiz_id,
					'user_id'    => $user_id,
					'score'      => $score,
					'answers'    => $answers_json,
					'created_at' => current_time( 'mysql' ),
				),
				array(
					'%d',
					'%d',
					'%f',
					'%s',
					'%s',
				)
			);

			if ( $result === false ) {
				error_log( 'Failed to insert quiz result: ' . $wpdb->last_error );
				return false;
			}

			return $wpdb->insert_id;
		} catch ( Exception $e ) {
			error_log( 'Exception when saving quiz result: ' . $e->getMessage() );
			return false;
		}
	}

	/**
	 * Get quiz results
	 *
	 * @param int $quiz_id Quiz ID.
	 * @param int $user_id User ID (optional).
	 * @return array Quiz results.
	 * @since 1.0.0
	 */
	public static function get_quiz_results( $quiz_id, $user_id = 0 ) {
		global $wpdb;

		// Check if the table exists, create it if it doesn't.
		require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app-install.php';
		React_Quiz_App_Install::check_tables();

		$table_name = $wpdb->prefix . 'quiz_results';

		$where  = 'quiz_id = %d';
		$params = array( $quiz_id );

		if ( $user_id ) {
			$where   .= ' AND user_id = %d';
			$params[] = $user_id;
		}

		try {
			$results = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT * FROM $table_name WHERE $where ORDER BY created_at DESC",
					$params
				)
			);

			return $results ? $results : array();
		} catch ( Exception $e ) {
			error_log( 'Exception when getting quiz results: ' . $e->getMessage() );
			return array();
		}
	}
}
