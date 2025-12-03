# TigerTix

## Project Overview
TigerTix is a ticketing platform designed to streamline the process of purchasing, managing, and interacting with event tickets. The platform features a React-based frontend, a Node.js and Express backend, and integrates with an LLM API to provide chatbot functionality for enhanced user support. The system is deployed with GitHub Pages for the frontend and Render for the backend, ensuring scalability and accessibility.

Live Demo: [TigerTix](https://bencahoon01.github.io/TigerTix)

---

## Tech Stack
- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: SQLite
- **API Integration**: OpenAI API for chatbot functionality
- **Deployment**: GitHub Pages (frontend), Render (backend)

---

## Architecture Summary
TigerTix follows a microservices architecture with the following components:

1. **Frontend**: A React application that provides a user-friendly interface for browsing events, purchasing tickets, and interacting with the chatbot.
2. **Backend**: A unified Node.js and Express server that handles authentication, event management, and chatbot requests.
3. **Database**: SQLite, has drawbacks when used through render
4. **Chatbot**: An LLM-powered chatbot integrated via the OpenAI API to assist users with queries and ticket-related tasks.

### Data Flow
- **Frontend**: Sends requests to the backend for authentication, event data, and chatbot interactions.
- **Backend**: Processes requests, interacts with the database, and communicates with the OpenAI API for chatbot responses.
- **Database**: Stores user, event, and ticket data.

---

## Installation & Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (Node Package Manager)
- SQLite (for local development)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/bencahoon01/TigerTix.git
   cd TigerTix
   ```
2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```
3. Initialize the database:
   ```bash
   cd backend
   npm run db:init
   ```
4. Set up environment variables (see below).
5. Start the development servers:
   - **Option 1: Run all microservices separately (recommended for development)**
     ```bash
     cd backend
     npm run dev
     ```
   - **Option 2: Run individual services**
     ```bash
     # Admin service
     npm run dev:admin
     
     # Client service
     npm run dev:client
     
     # Authentication service
     npm run dev:auth
     
     # LLM service
     npm run dev:llm
     ```
   - **Option 3: Run unified server (for production)**
     ```bash
     npm start
     ```
   - **Frontend**:
     ```bash
     cd frontend
     npm start
     ```

---

## Environment Variables Setup

### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# Backend Service Ports (for individual microservices in dev mode)
PORT_ADMIN=5001
PORT_CLIENT=6001
PORT_AUTH=3004
PORT_LLM=5003

# Unified server port (for production/Render)
PORT=3001

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend Environment Variables
Create a `.env.production` file in the `frontend` directory:

```env
REACT_APP_ADMIN_API_URL=https://your-backend-url.onrender.com
REACT_APP_CLIENT_API_URL=https://your-backend-url.onrender.com
REACT_APP_AUTH_API_URL=https://your-backend-url.onrender.com
REACT_APP_LLM_API_URL=https://your-backend-url.onrender.com
```

For local development, create a `.env.development.local` file in the `frontend` directory:

```env
REACT_APP_ADMIN_API_URL=http://localhost:5001
REACT_APP_CLIENT_API_URL=http://localhost:6001
REACT_APP_AUTH_API_URL=http://localhost:3004
REACT_APP_LLM_API_URL=http://localhost:5003
```

---

## How to Run Regression Tests

The project uses Jest for automated testing with comprehensive test coverage for both frontend and backend.

### Running Backend Tests
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the complete test suite:
   ```bash
   npm test
   ```

### Running Frontend Tests
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Run the test suite:
   ```bash
   npm test
   ```
   For CI/CD (non-interactive):
   ```bash
   CI=true npm test
   ```

### Backend Test Suite Details
The backend test suite includes:
- **Authentication Tests**: User registration, login, and JWT token validation (9 tests)
- **Admin Tests**: Admin-specific functionality and authorization (1 test)
- **Client Tests**: Client service endpoints and operations (6 tests)
- **Integration Tests**: End-to-end workflow testing (3 tests)
- **Token Expiration Tests**: JWT token lifecycle management (8 tests)
- **Auth Integration Tests**: Full authentication flow testing (7 tests)
- **Note**: LLM service tests are excluded from CI/CD (requires OpenAI API key)

**Total: 34 tests passing with 86% code coverage**

### Frontend Test Suite Details
The frontend test suite includes:
- **Component Tests**: Chat component functionality
- **Page Tests**: Sign In and Sign Up page rendering and interactions
- **Accessibility Tests**: WCAG compliance checks using jest-axe
- **E2E Workflow Tests**: Complete user workflows

### Test Results
After running backend tests, you can view:
- Console output with test results and coverage statistics
- `backend/tests/test-results.json`: Detailed test results in JSON format
- `backend/tests/test-results.md`: Human-readable test summary in Markdown
- `backend/coverage/`: Code coverage reports (HTML, LCOV, and text formats)

### CI/CD Test Execution
Tests are automatically run before deployment:
- **Frontend**: Tests run on every push to main/testing branches before GitHub Pages deployment
- **Backend**: Tests run before Render deployment confirmation
- Both must pass for deployment to proceed

### Test Configuration
Backend tests automatically:
- Clean previous test results before running
- Reset the database to a known state
- Use a custom reporter for enhanced output
- Generate coverage reports

---

## Team Members
- **Ben Cahoon**: Full Stack Developer
- **Jenson Wagner**: Full Stack Developer
- **Tyler Fry**: Full Stack Developer
- **Instructor**: Dr. Julian Brinkley
- **TAs**: Colt Doster, Atik Enam

---

## License
This project is licensed under the MIT License. See the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.
