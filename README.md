# Task Tracker Frontend - Technical Assessment by Shashikant Rajput

**Live Frontend:** [https://task-tracker-v1.vercel.app/](https://task-tracker-v1.vercel.app/)

A modern React application for managing projects and tasks with user authentication and a clean interface.

## Features

- **User Authentication**: Secure login and registration with HTTP-only cookie support
- **Project Management**: Create, view, edit, and delete projects
- **Task Tracking**: Add tasks with priorities, due dates, and status
- **Server-side Pagination**: Paginated task listing with page controls
- **Search by Title**: Search tasks by title (server-side)
- **Filter by Status**: Filter tasks by status (server-side)
- **Payload Decryption**: AES-256-CBC decryption of sensitive response fields
- **Protected Routes**: Authenticated routes with automatic redirects
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dashboard**: Visual overview of projects and task progress
- **Dark/Light Theme**: Toggle between dark and light mode

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
   REACT_APP_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
   ```

   > **Note**: The `REACT_APP_ENCRYPTION_KEY` must match the backend's `ENCRYPTION_KEY` (64 hex characters for AES-256).

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

The application uses JWT-based authentication with HTTP-only cookies. Upon successful login, the API sets an HTTP-only secure cookie containing the JWT. The cookie is automatically sent with every request via `withCredentials: true` on the Axios client. A fallback `Authorization: Bearer` header is also supported for backward compatibility.

Sensitive user fields (such as email) are encrypted by the backend using AES-256-CBC and decrypted on the frontend using `crypto-js`.
