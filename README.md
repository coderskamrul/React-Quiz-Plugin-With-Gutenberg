# React Quiz App

A WordPress plugin that allows admins to create multiple-choice quizzes and embed them using a Gutenberg block.

## Description

React Quiz App is a powerful WordPress plugin that enables you to create interactive multiple-choice quizzes for your website. Built with React and integrated with the WordPress Gutenberg editor, this plugin provides a seamless experience for both administrators and users.

### Key Features

- **Custom Quiz Creation**: Create unlimited quizzes with multiple-choice questions
- **Gutenberg Block**: Easily embed quizzes in your posts and pages using the Gutenberg editor
- **Shortcode Support**: Use shortcodes to embed quizzes in classic editor or widgets
- **Interactive Frontend**: Modern, responsive quiz interface for users
- **Results Tracking**: Save and display quiz results
- **Admin Dashboard**: Manage quizzes from a dedicated dashboard

## Installation

1. Upload the `react-quiz-app` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to 'Quizzes' in the WordPress admin menu to start creating quizzes

## Requirements

- WordPress 5.0 or higher
- PHP 7.0 or higher
- Modern browser with JavaScript enabled

## Usage

### Creating a Quiz

1. Go to 'Quizzes' > 'Add New' in the WordPress admin menu
2. Enter a title for your quiz
3. Add questions and answers using the Quiz Questions meta box
4. For each question:
   - Enter the question text
   - Add up to 4 possible answers
   - Select the correct answer by clicking the radio button
5. Click 'Add Question' to add more questions
6. Click 'Publish' to save your quiz

### Adding a Quiz to a Post or Page

#### Using the Gutenberg Block (Recommended)

1. Edit a post or page using the Gutenberg editor
2. Click the '+' button to add a new block
3. Search for 'Quiz' and select the Quiz block
4. Select your quiz from the dropdown menu
5. Preview your quiz in the editor
6. Update or publish your post

#### Using Shortcode

You can also embed quizzes using a shortcode:

\`\`\`
[react-quiz-app id="123"]
\`\`\`

Replace `123` with the ID of your quiz.

### Taking a Quiz

When users visit a page with an embedded quiz, they will see:

1. The quiz title and questions
2. Multiple-choice answers for each question
3. Navigation buttons to move between questions
4. A submit button to complete the quiz

After submitting, users will see:

1. Their score as a percentage
2. Which questions they answered correctly/incorrectly
3. The correct answers for each question
4. An option to retake the quiz

## Advanced Usage

### Quiz Management

- **Edit Quiz**: Go to 'Quizzes' > 'All Quizzes' and click on a quiz title to edit
- **Delete Quiz**: Hover over a quiz in the list and click 'Trash'
- **View Results**: Go to the Quiz App dashboard to view quiz results

### Customization

The plugin provides several ways to customize the appearance and behavior of quizzes:

- **CSS Customization**: Add custom CSS to your theme to style the quiz elements
- **Translation**: The plugin is translation-ready with all text strings properly localized

## Frequently Asked Questions

### How many questions can I add to a quiz?

There is no limit to the number of questions you can add to a quiz.

### Can users see their previous quiz attempts?

Currently, the plugin shows users their most recent attempt only. Future versions may include a history feature.

### Is the plugin compatible with page builders?

Yes, you can use the shortcode to embed quizzes in most page builders.

### Can I export quiz results?

Currently, quiz results are stored in the database but cannot be exported. This feature may be added in future updates.

### How can I report issues or request features?

Please submit issues or feature requests through our GitHub repository or support forum.

## Troubleshooting

### The quiz doesn't appear on my page

- Make sure you've published the quiz
- Check that you've selected the correct quiz ID in the block or shortcode
- Verify that your theme is not hiding the quiz container

### REST API errors

If you encounter REST API errors:

1. Make sure your WordPress REST API is enabled
2. Check that your server has proper permissions for the REST API
3. Disable any security plugins that might be blocking REST API requests
4. Verify that your permalink structure is not set to "Plain"

### Database errors

If you see database errors:

1. Deactivate and reactivate the plugin to ensure tables are created
2. Check your database permissions
3. Contact your hosting provider if database issues persist

## Changelog

### 1.0.0
- Initial release

## Credits

- Built with React 18+
- Uses WordPress REST API
- Gutenberg integration for block editor

## License

This plugin is licensed under the GPL v2 or later.
