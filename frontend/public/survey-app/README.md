# Survey App

## Overview
The Survey App is a full-stack application that allows users to fill out a survey after their first login. The survey collects information about the user's age, weight, experience, and gender. The data is stored in a MongoDB database.

## Project Structure
The project is organized into two main directories: `backend` and `frontend`.

### Backend
- **app.js**: Entry point of the backend application. Sets up the Express server, connects to MongoDB, and configures middleware and routes.
- **models/Survey.js**: Defines the Mongoose schema for the Survey model, including fields for age, weight, experience, and gender with validation rules.
- **routes/survey.js**: Exports a router that handles HTTP requests related to surveys, including routes for creating and retrieving survey data.
- **middleware/auth.js**: Middleware that checks for user authentication by verifying the JWT token and attaching user information to the request object.
- **package.json**: Configuration file for the backend, listing dependencies and scripts.
- **README.md**: Documentation for the backend part of the project.

### Frontend
- **src/components/SurveyPopup.jsx**: React component for the survey popup, including form fields and handling form submission to save data to the backend.
- **src/App.jsx**: Main application component that manages the state and conditionally renders the SurveyPopup component after user login.
- **src/index.js**: Entry point of the frontend application, rendering the App component into the DOM.
- **src/styles/SurveyPopup.css**: Styles for the SurveyPopup component to ensure it appears as a popup.
- **public/index.html**: Main HTML file for the frontend, including the root div for the React app.
- **package.json**: Configuration file for the frontend, listing dependencies and scripts.
- **README.md**: Documentation for the frontend part of the project.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd survey-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory and add your MongoDB URI and JWT secret.

5. Start the backend server:
   ```
   cd backend
   npm start
   ```

6. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

## Usage
- After logging in for the first time, users will see a popup survey where they can enter their age, weight, experience, and gender.
- The survey data will be saved to the MongoDB database for further analysis.

## License
This project is licensed under the MIT License.