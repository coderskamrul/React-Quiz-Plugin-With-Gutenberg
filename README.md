# React Quiz Plugin with Gutenberg

A WordPress plugin that allows admins to create multiple-choice quizzes and embed them using a Gutenberg block.

## Ready Plugin Download

Upload plugin > Install > Activate 

[![Plugin Download Here](https://img.shields.io/badge/Download-ZIP-blue?style=for-the-badge)](https://drive.google.com/uc?export=download&id=1yVAUHkzLsjb-Tw4hrtPOz3o1PZBaxwpu)

## Description

React Quiz Plugin with Gutenberg is a powerful WordPress plugin that enables you to create interactive multiple-choice quizzes for your website. Built with React and integrated with the WordPress Gutenberg editor, this plugin provides a seamless experience for both administrators and users.

### Key Features

- **Custom Quiz Creation**: Create unlimited quizzes with multiple-choice questions
- **Gutenberg Block**: Easily embed quizzes in your posts and pages using the Gutenberg editor
- **Shortcode Support**: Use shortcodes to embed quizzes in classic editor or widgets
- **Interactive Frontend**: Modern, responsive quiz interface for users
- **Results Tracking**: Save and display quiz results
- **Admin Dashboard**: Manage quizzes from a dedicated dashboard

## Installation

1. Upload the `react-quiz-plugin-with-gutenberg` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to 'Quizzes' in the WordPress admin menu to start creating quizzes

## 📋 Requirements

- WordPress 5.0 or higher
- PHP 7.0 or higher
- Modern browser with JavaScript enabled

## 🔧 Prerequisites

- [Node.js and npm](https://nodejs.org/) installed
- WordPress installation
- [Visual Studio Code](https://code.visualstudio.com/) (or preferred code editor)
- [Git](https://git-scm.com/) installed

## 🚀 Setup and Running in Development Mode

Follow these steps to set up and run the plugin in development mode:

### 1. Clone the Repository

```bash
git clone https://github.com/coderskamrul/React-Quiz-Plugin-With-Gutenberg.git
```

### 2. Navigate to the Plugin Directory

- Open your file explorer or terminal
- Go to the cloned repository folder (`React-Quiz-Plugin-With-Gutenberg`)
- Ensure you are inside the plugin folder before proceeding

### 3. Install Dependencies

Open a terminal in Visual Studio Code:
1. Open VS Code
2. Go to `File > Open Folder` and select the `React-Quiz-Plugin-With-Gutenberg` folder
3. Open the terminal in VS Code (`Terminal > New Terminal`)

Run the following command to install the required dependencies:

```bash
npm install
```

> **Note:** If you encounter issues with `npm install`, ensure you are in the correct plugin folder path in the terminal.

### 4. Start Development Mode

In the same VS Code terminal (ensuring the path is the plugin folder), run:

```bash
npm start
```

This will start the development server, and you can preview the plugin in your WordPress Gutenberg editor.

### 5. Build for Production

To create a production-ready build of the plugin, run:

```bash
npm run build
```

The build files will be generated, ready for deployment in your WordPress plugin directory.

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


## Credits

- Built with React 18+
- Uses WordPress REST API
- Gutenberg integration for block editor

## Ready Plugin Download Link

[![Plugin Download Here](https://img.shields.io/badge/Download-ZIP-blue?style=for-the-badge)](https://drive.google.com/uc?export=download&id=1yVAUHkzLsjb-Tw4hrtPOz3o1PZBaxwpu)

## 📸 Screenshots

### Custom Quiz Post Type
![Github Banner](https://raw.githubusercontent.com/coderskamrul/assets/refs/heads/main/Custom%20Quiz%20Post.jpg)

### Simple Quiz Dashboard
![Github Banner](https://raw.githubusercontent.com/coderskamrul/assets/refs/heads/main/Dashboard.jpg)

### Gutenberg Quiz Block With Back-End Preview
![Github Banner](https://raw.githubusercontent.com/coderskamrul/assets/refs/heads/main/Block%20With%20Preview.jpg)

### Create Multiple Quiz List
![Github Banner](https://raw.githubusercontent.com/coderskamrul/assets/refs/heads/main/Quiz%20Generator.jpg)

### Front-End Quiz Preview
![Github Banner](https://raw.githubusercontent.com/coderskamrul/assets/refs/heads/main/Quiz%20Before%20Submit.jpg)

### Quiz Result Show Score
![Github Banner](https://raw.githubusercontent.com/coderskamrul/assets/refs/heads/main/Quiz%20Result.jpg)
