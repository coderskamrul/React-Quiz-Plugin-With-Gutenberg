<?php
/**
 * Quiz Post Type Class
 *
 * Handles the registration of the quiz custom post type and related meta boxes.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Quiz_Post_Type {

	/**
	 * Initialize the class
	 */
	public function init() {
		// Register the custom post type.
		add_action( 'init', array( $this, 'register_post_type' ) );

		// Add meta boxes.
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );

		// Save post meta.
		add_action( 'save_post', array( $this, 'save_post_meta' ), 10, 2 );
	}

	/**
	 * Register the quiz custom post type
	 */
	public function register_post_type() {
		$labels = array(
			'name'               => _x( 'Quizzes', 'post type general name', 'react-quiz-app' ),
			'singular_name'      => _x( 'Quiz', 'post type singular name', 'react-quiz-app' ),
			'menu_name'          => _x( 'Quizzes', 'admin menu', 'react-quiz-app' ),
			'name_admin_bar'     => _x( 'Quiz', 'add new on admin bar', 'react-quiz-app' ),
			'add_new'            => _x( 'Add New', 'quiz', 'react-quiz-app' ),
			'add_new_item'       => __( 'Add New Quiz', 'react-quiz-app' ),
			'new_item'           => __( 'New Quiz', 'react-quiz-app' ),
			'edit_item'          => __( 'Edit Quiz', 'react-quiz-app' ),
			'view_item'          => __( 'View Quiz', 'react-quiz-app' ),
			'all_items'          => __( 'All Quizzes', 'react-quiz-app' ),
			'search_items'       => __( 'Search Quizzes', 'react-quiz-app' ),
			'parent_item_colon'  => __( 'Parent Quizzes:', 'react-quiz-app' ),
			'not_found'          => __( 'No quizzes found.', 'react-quiz-app' ),
			'not_found_in_trash' => __( 'No quizzes found in Trash.', 'react-quiz-app' ),
		);

		$args = array(
			'labels'             => $labels,
			'description'        => __( 'Multiple-choice quizzes', 'react-quiz-app' ),
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'quiz' ),
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => null,
			'menu_icon'          => 'dashicons-clipboard',
			'supports'           => array( 'title', 'editor', 'thumbnail' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'quiz', $args );
	}

	/**
	 * Add meta boxes for the quiz post type
	 */
	public function add_meta_boxes() {
		add_meta_box(
			'quiz_questions',
			__( 'Quiz Questions', 'react-quiz-app' ),
			array( $this, 'render_questions_meta_box' ),
			'quiz',
			'normal',
			'high'
		);
	}

	/**
	 * Render the questions meta box
	 *
	 * @param WP_Post $post The post object.
	 */
	public function render_questions_meta_box( $post ) {
		// Add nonce for security
		wp_nonce_field( 'quiz_questions_meta_box', 'quiz_questions_meta_box_nonce' );

		// Get existing questions if any
		$questions = get_post_meta( $post->ID, '_quiz_questions', true );
		if ( empty( $questions ) ) {
			$questions = array(
				array(
					'question' => '',
					'answers'  => array( '', '', '', '' ),
					'correct'  => 0,
				),
			);
		}

		// Output the questions form.
		?>
		<div id="quiz-questions-container">
			<?php foreach ( $questions as $index => $question ) : ?>
				<div class="quiz-question" data-index="<?php echo esc_attr( $index ); ?>">
					<h3><?php printf( __( 'Question %d', 'react-quiz-app' ), $index + 1 ); ?></h3>
					
					<p>
						<label for="question-<?php echo esc_attr( $index ); ?>">
							<?php _e( 'Question Text:', 'react-quiz-app' ); ?>
						</label>
						<textarea 
							name="quiz_questions[<?php echo esc_attr( $index ); ?>][question]" 
							id="question-<?php echo esc_attr( $index ); ?>" 
							class="widefat"
							rows="2"
						><?php echo esc_textarea( $question['question'] ); ?></textarea>
					</p>
					
					<div class="quiz-answers">
						<p><?php _e( 'Answer Choices:', 'react-quiz-app' ); ?></p>
						<?php for ( $i = 0; $i < 4; $i++ ) : ?>
							<div class="quiz-answer">
								<input 
									type="radio" 
									name="quiz_questions[<?php echo esc_attr( $index ); ?>][correct]" 
									value="<?php echo esc_attr( $i ); ?>"
									<?php checked( $question['correct'], $i ); ?>
								>
								<input 
									type="text" 
									name="quiz_questions[<?php echo esc_attr( $index ); ?>][answers][<?php echo esc_attr( $i ); ?>]" 
									value="<?php echo esc_attr( isset( $question['answers'][ $i ] ) ? $question['answers'][ $i ] : '' ); ?>" 
									class="widefat"
									placeholder="<?php printf( __( 'Answer %d', 'react-quiz-app' ), $i + 1 ); ?>"
								>
							</div>
						<?php endfor; ?>
					</div>
					
					<p>
						<button type="button" class="button remove-question" <?php echo ( $index === 0 && count( $questions ) === 1 ) ? 'style="display:none;"' : ''; ?>>
							<?php _e( 'Remove Question', 'react-quiz-app' ); ?>
						</button>
					</p>
					
					<hr>
				</div>
			<?php endforeach; ?>
		</div>
		
		<p>
			<button type="button" class="button button-primary" id="add-question">
				<?php _e( 'Add Question', 'react-quiz-app' ); ?>
			</button>
		</p>
		
		<script>
			jQuery(document).ready(function($) {
				// Add new question
				$('#add-question').on('click', function() {
					var index = $('.quiz-question').length;
					var template = `
						<div class="quiz-question" data-index="${index}">
							<h3><?php _e( 'Question', 'react-quiz-app' ); ?> ${index + 1}</h3>
							
							<p>
								<label for="question-${index}">
									<?php _e( 'Question Text:', 'react-quiz-app' ); ?>
								</label>
								<textarea 
									name="quiz_questions[${index}][question]" 
									id="question-${index}" 
									class="widefat"
									rows="2"
								></textarea>
							</p>
							
							<div class="quiz-answers">
								<p><?php _e( 'Answer Choices:', 'react-quiz-app' ); ?></p>
								<?php for ( $i = 0; $i < 4; $i++ ) : ?>
									<div class="quiz-answer">
										<input 
											type="radio" 
											name="quiz_questions[${index}][correct]" 
											value="<?php echo esc_attr( $i ); ?>"
											<?php echo $i === 0 ? 'checked' : ''; ?>
										>
										<input 
											type="text" 
											name="quiz_questions[${index}][answers][<?php echo esc_attr( $i ); ?>]" 
											value="" 
											class="widefat"
											placeholder="<?php printf( __( 'Answer %d', 'react-quiz-app' ), $i + 1 ); ?>"
										>
									</div>
								<?php endfor; ?>
							</div>
							
							<p>
								<button type="button" class="button remove-question">
									<?php _e( 'Remove Question', 'react-quiz-app' ); ?>
								</button>
							</p>
							
							<hr>
						</div>
					`;
					
					$('#quiz-questions-container').append(template);
					
					// Show all remove buttons
					$('.remove-question').show();
				});
				
				// Remove question
				$(document).on('click', '.remove-question', function() {
					$(this).closest('.quiz-question').remove();
					
					// Renumber questions
					$('.quiz-question').each(function(index) {
						$(this).attr('data-index', index);
						$(this).find('h3').text('<?php _e( 'Question', 'react-quiz-app' ); ?> ' + (index + 1));
						
						// Update field names
						$(this).find('textarea').attr('name', `quiz_questions[${index}][question]`);
						$(this).find('textarea').attr('id', `question-${index}`);
						
						$(this).find('input[type="radio"]').attr('name', `quiz_questions[${index}][correct]`);
						
						$(this).find('.quiz-answer').each(function(i) {
							$(this).find('input[type="text"]').attr('name', `quiz_questions[${index}][answers][${i}]`);
						});
					});
					
					// Hide the remove button if only one question remains
					if ($('.quiz-question').length === 1) {
						$('.remove-question').hide();
					}
				});
			});
		</script>
		
		<style>
			.quiz-question {
				margin-bottom: 20px;
			}
			.quiz-answers {
				margin-left: 20px;
			}
			.quiz-answer {
				display: flex;
				align-items: center;
				margin-bottom: 10px;
			}
			.quiz-answer input[type="radio"] {
				margin-right: 10px;
			}
		</style>
		<?php
	}

	/**
	 * Save the quiz questions meta data
	 *
	 * @param int     $post_id The post ID.
	 * @param WP_Post $post    The post object.
	 */
	public function save_post_meta( $post_id, $post ) {
		// Check if our nonce is set.
		if ( ! isset( $_POST['quiz_questions_meta_box_nonce'] ) ) {
			return;
		}

		// Verify that the nonce is valid.
		if ( ! wp_verify_nonce( $_POST['quiz_questions_meta_box_nonce'], 'quiz_questions_meta_box' ) ) {
			return;
		}

		// If this is an autosave, our form has not been submitted, so we don't want to do anything.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Check the user's permissions.
		if ( 'quiz' === $_POST['post_type'] ) {
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return;
			}
		}

		// Save the quiz questions.
		if ( isset( $_POST['quiz_questions'] ) ) {
			$questions = array();

			foreach ( $_POST['quiz_questions'] as $index => $question_data ) {
				if ( empty( $question_data['question'] ) ) {
					continue;
				}

				$question = array(
					'question' => sanitize_textarea_field( $question_data['question'] ),
					'answers'  => array(),
					'correct'  => intval( $question_data['correct'] ),
				);

				foreach ( $question_data['answers'] as $i => $answer ) {
					$question['answers'][ $i ] = sanitize_text_field( $answer );
				}

				$questions[] = $question;
			}

			update_post_meta( $post_id, '_quiz_questions', $questions );
		}
	}
}
