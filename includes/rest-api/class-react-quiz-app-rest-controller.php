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

        register_rest_route( 'react-quiz-app/v1', '/quizzes', array(
            'methods' => 'GET',
            'callback' => array( $this, 'get_quizzes' ),
            'permission_callback' => '__return_true', // Allow anyone to view quizzes
        ) );
        
        register_rest_route( 'react-quiz-app/v1', '/quizzes/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array( $this, 'get_quiz' ),
            'permission_callback' => '__return_true', // Allow anyone to view a quiz
            'args' => array(
                'id' => array(
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ),
            ),
        ) );
        
        register_rest_route( 'react-quiz-app/v1', '/quizzes/(?P<id>\d+)', array(
            'methods' => 'POST',
            'callback' => array( $this, 'update_quiz' ),
            'permission_callback' => function() {
                return current_user_can( 'edit_posts' );
            },
            'args' => array(
                'id' => array(
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ),
            ),
        ) );
        
        register_rest_route( 'react-quiz-app/v1', '/quizzes/(?P<id>\d+)/results', array(
            'methods' => 'POST',
            'callback' => array( $this, 'save_result' ),
            'permission_callback' => '__return_true', // Allow anyone to submit results
            'args' => array(
                'id' => array(
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ),
                'score' => array(
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ),
                'answers' => array(
                    'validate_callback' => function( $param ) {
                        return is_array( $param );
                    }
                ),
            ),
        ) );
        
        register_rest_route( 'react-quiz-app/v1', '/quizzes/(?P<id>\d+)/results', array(
            'methods' => 'GET',
            'callback' => array( $this, 'get_results' ),
            'permission_callback' => function() {
                return current_user_can( 'edit_posts' );
            },
            'args' => array(
                'id' => array(
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ),
            ),
        ) );
    }

    /**
     * Get quizzes
     */
    public function get_quizzes() {
        $args = array(
            'post_type' => 'quiz',
            'post_status' => 'publish',
            'posts_per_page' => -1,
        );
        
        $quizzes = get_posts( $args );
        
        $data = array();
        
        foreach ( $quizzes as $quiz ) {
            $data[] = array(
                'id' => (int) $quiz->ID, // Ensure ID is an integer
                'title' => $quiz->post_title,
            );
        }
        
        return rest_ensure_response( $data );
    }

    /**
     * Get quiz
     */
    public function get_quiz( $request ) {
        $quiz_id = $request['id'];
        
        $quiz = get_post( $quiz_id );
        
        if ( ! $quiz || 'quiz' !== $quiz->post_type ) {
            return new WP_Error( 'quiz_not_found', __( 'Quiz not found', 'react-quiz-app' ), array( 'status' => 404 ) );
        }
        
        // Get quiz questions from post meta
        $questions = get_post_meta( $quiz_id, '_quiz_questions', true );
        
        if ( ! $questions ) {
            $questions = array();
        }
        
        // Format questions for the frontend
        $formatted_questions = array();
        foreach ( $questions as $index => $question ) {
            $formatted_questions[] = array(
                'text' => $question['question'],
                'answers' => $question['answers'],
                'correctAnswer' => (int) $question['correct'],
            );
        }
        
        $data = array(
            'id' => (int) $quiz_id,
            'title' => $quiz->post_title,
            'questions' => $formatted_questions,
        );
        
        return rest_ensure_response( $data );
    }

    /**
     * Update quiz
     */
    public function update_quiz( $request ) {
        $quiz_id = $request['id'];
        $questions = $request->get_param( 'questions' );
        
        if ( ! $questions ) {
            return new WP_Error( 'invalid_data', __( 'Invalid quiz data', 'react-quiz-app' ), array( 'status' => 400 ) );
        }
        
        // Format questions for post meta
        $formatted_questions = array();
        foreach ( $questions as $index => $question ) {
            $formatted_questions[] = array(
                'question' => $question['text'],
                'answers' => $question['answers'],
                'correct' => $question['correctAnswer'],
            );
        }
        
        // Update post meta
        $result = update_post_meta( $quiz_id, '_quiz_questions', $formatted_questions );
        
        if ( ! $result ) {
            return new WP_Error( 'save_failed', __( 'Failed to save quiz data', 'react-quiz-app' ), array( 'status' => 500 ) );
        }
        
        return rest_ensure_response( array(
            'success' => true,
            'message' => __( 'Quiz saved successfully', 'react-quiz-app' ),
        ) );
    }

    /**
     * Save quiz result
     */
    public function save_result( $request ) {
        global $wpdb;
        
        // Temporarily disable showing database errors
        $wpdb->hide_errors();
        
        $quiz_id = $request['id'];
        $user_id = get_current_user_id();
        $score = $request->get_param( 'score' );
        $answers = $request->get_param( 'answers' );
        
        // Check if score parameter exists (not if it's truthy)
        if ( !isset($request['score']) || !is_array($answers) ) {
            return new WP_Error( 'invalid_data', __( 'Invalid result data', 'react-quiz-app' ), array( 'status' => 400 ) );
        }
        
        // Log the received data for debugging
        error_log('Quiz submission data: ' . print_r([
            'quiz_id' => $quiz_id,
            'user_id' => $user_id,
            'score' => $score,
            'answers' => $answers
        ], true));
        
        // Make sure the database table exists
        require_once REACT_QUIZ_APP_PLUGIN_DIR . 'includes/class-react-quiz-app-install.php';
        React_Quiz_App_Install::check_tables();
        
        $result_id = React_Quiz_App_Functions::save_quiz_result( $quiz_id, $user_id, $score, $answers );
        
        if ( ! $result_id ) {
            return new WP_Error( 'save_failed', __( 'Failed to save quiz result', 'react-quiz-app' ), array( 'status' => 500 ) );
        }
        
        // Get the quiz data to include in the response
        $quiz = get_post( $quiz_id );
        $questions = get_post_meta( $quiz_id, '_quiz_questions', true );
        
        if ( ! $questions ) {
            $questions = array();
        }
        
        // Format questions for the frontend
        $formatted_questions = array();
        foreach ( $questions as $index => $question ) {
            $formatted_questions[] = array(
                'text' => $question['question'],
                'answers' => $question['answers'],
                'correctAnswer' => (int) $question['correct'],
            );
        }
        
        // Calculate correct answers
        $correct_count = 0;
        foreach ( $answers as $question_index => $answer_index ) {
            if ( isset( $formatted_questions[$question_index] ) && 
                 $answer_index == $formatted_questions[$question_index]['correctAnswer'] ) {
                $correct_count++;
            }
        }
        
        return rest_ensure_response( array(
            'success' => true,
            'message' => __( 'Result saved successfully', 'react-quiz-app' ),
            'result_id' => $result_id,
            'score' => $score,
            'correctCount' => $correct_count,
            'totalQuestions' => count( $formatted_questions ),
            'quiz' => array(
                'id' => (int) $quiz_id,
                'title' => $quiz->post_title,
            ),
        ) );
    }

    /**
     * Get quiz results
     */
    public function get_results( $request ) {
        $quiz_id = $request['id'];
        $user_id = $request->get_param( 'user_id' );
        
        $results = React_Quiz_App_Functions::get_quiz_results( $quiz_id, $user_id );
        
        return rest_ensure_response( $results );
    }
}
