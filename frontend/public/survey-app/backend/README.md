# Survey App Backend

## Overview
This project is a survey application that allows users to submit their survey data, including age, weight, experience, and gender. The backend is built using Node.js and Express, and it connects to a MongoDB database to store survey responses.

## Project Structure
```
survey-app
├── backend
│   ├── models
│   │   └── Survey.js        # Mongoose schema for the Survey model
│   ├── routes
│   │   └── survey.js        # Routes for handling survey-related requests
│   ├── middleware
│   │   └── auth.js          # Middleware for user authentication
│   ├── app.js               # Entry point of the backend application
│   ├── package.json          # Backend dependencies and scripts
│   └── README.md            # Documentation for the backend
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── SurveyPopup.jsx # React component for the survey popup
│   │   ├── App.jsx          # Main application component
│   │   ├── index.js         # Entry point of the frontend application
│   │   └── styles
│   │       └── SurveyPopup.css # Styles for the SurveyPopup component
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
   ```
2. Navigate to the backend directory:
   ```
   cd survey-app/backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
1. Ensure MongoDB is running.
2. Start the backend server:
   ```
   npm start
   ```
3. The server will run on the specified port (default is 3001).

### API Endpoints
- **POST /api/survey**: Submit a new survey response.
- **GET /api/survey**: Retrieve all survey responses.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.