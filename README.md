# Task Tracker Frontend

A modern React application for managing projects and tasks with user authentication and a clean interface.

## Features

- **User Authentication**: Secure login and registration
- **Project Management**: Create, view, edit, and delete projects
- **Task Tracking**: Add tasks with priorities, due dates, and status
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dashboard**: Visual overview of projects and task progress

## Project Structure

```
src/
├── assets/          # Static assets like images, icons
├── components/      # Reusable UI components
├── context/         # React context for state management
├── hooks/           # Custom React hooks
├── layouts/         # Page layout components
├── pages/           # Application pages/routes
├── services/        # API service functions
├── types/           # TypeScript type definitions
└── utils/           # Utility/helper functions
```

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   https://github.com/codeseeboy/task-tracker-frontend
   cd task-tracker-frontend
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

   ```
   REACT_APP_API_URL=https://task-tracker-rzm0.onrender.com/api
   ```

4. Start the development server

   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:5000) to view the application in your browser.

## API Integration

The application is designed to work with a RESTful API backend. The API endpoints are accessed through service functions in the `src/services` directory.

## Authentication

The application uses token-based authentication. Upon successful login, the API returns a token that is stored in local storage and included in subsequent API requests.
