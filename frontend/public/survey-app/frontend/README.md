# Survey App

This project is a simple survey application that allows users to submit their survey data after logging in. The application is divided into two main parts: the backend and the frontend.

## Project Structure

```
survey-app
├── backend
│   ├── models
│   │   └── Survey.js        # Mongoose schema for the survey data
│   ├── routes
│   │   └── survey.js        # Routes for handling survey-related requests
│   ├── middleware
│   │   └── auth.js          # Middleware for user authentication
│   ├── app.js               # Entry point for the backend application
│   ├── package.json          # Backend dependencies and scripts
│   └── README.md            # Documentation for the backend
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── SurveyPopup.jsx # React component for the survey popup
│   │   ├── App.jsx          # Main application component
│   │   ├── index.js         # Entry point for the frontend application
│   │   └── styles
│   │       └── SurveyPopup.css # Styles for the survey popup
│   ├── public
│   │   └── index.html       # Main HTML file for the frontend
│   ├── package.json          # Frontend dependencies and scripts
│   └── README.md            # Documentation for the frontend
└── README.md                # Documentation for the entire project
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

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

### Running the Application

1. Start the backend server:
   ```
   cd backend
   node app.js
   ```

2. Start the frontend application:
   ```
   cd ../frontend
   npm start
   ```

### Usage

- After logging in, users will see a survey popup where they can enter their age, weight, experience, and gender.
- The survey data will be saved to the MongoDB database.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License

This project is licensed under the MIT License.