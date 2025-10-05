# MileApp Backend API

This is the backend API for **MileApp Task Management**, built with **Node.js** and **Express**, following the **route-controller pattern**. It includes **JWT-based authentication**, **cookie management**, and secure password handling with **bcrypt**.

## Features

- User registration, login, logout
- JWT authentication and authorization
- Cookie-based session handling
- Password hashing with bcrypt
- Task CRUD (Create, Read, Update, Delete) with authorization
- Middleware for authentication and authorization

## Technologies

- Node.js
- Express
- JWT (`jsonwebtoken`)
- Cookies (`cookie-parser`)
- Bcrypt (`bcryptjs`)
- ES Modules (import/export)

## Folder Structure

backend/
├─ controllers/
│ ├─ usersController.js
│ └─ tasksController.js
├─ middlewares/
│ └─ auth.js
├─ routes/
│ ├─ userRoutes.js
│ └─ taskRoutes.js
├─ ...ETC


## API Endpoints

### User Routes

| Method | Endpoint         | Description                       | Auth Required |
|--------|-----------------|-----------------------------------|---------------|
| GET    | `/`             | Welcome message                   | ❌             |
| POST   | `/register`     | Register a new user               | ❌             |
| POST   | `/login`        | Login a user (sets cookie)        | ❌             |
| POST   | `/logout`       | Logout a user (clears cookie)    | ❌             |
| GET    | `/token`        | Get user info by token            | ✅             |

### Task Routes

> All task routes require **authentication**. Some routes require **authorization** (user owns the task).

| Method | Endpoint        | Description              | Auth Required | Authorization Required |
|--------|----------------|--------------------------|---------------|-----------------------|
| POST   | `/tasks`       | Create a new task        | ✅             | ❌                     |
| GET    | `/tasks`       | Get all tasks            | ✅             | ❌                     |
| GET    | `/tasks/:id`   | Get task by ID           | ✅             | ✅                     |
| PUT    | `/tasks/:id`   | Update task by ID        | ✅             | ✅                     |
| DELETE | `/tasks/:id`   | Delete task by ID        | ✅             | ✅                     |

## Authentication & Authorization & Error Handler

- **Authentication Middleware** (`authentication`):  
  Verifies JWT token from cookies and ensures the user is logged in.

- **Authorization Middleware** (`authorization`):  
  Ensures the logged-in user can only access or modify their own tasks.

- **Error Handling Middleware** (`Customer Error Handing & Also using zod`):  
  Ensures handling error case.

## Password Security

- User passwords are hashed using **bcrypt** before storing in the database.
- Plain-text passwords are never stored.

## JWT & Cookies

- JWT token is generated on login and stored in **HTTP-only cookies** for security.
- Tokens are verified on protected routes to authorize requests.

