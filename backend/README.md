# Douba Backend

This is the backend for Douba, a file storage and sharing application. It is built with Node.js, Express, and Sequelize.

## Project Structure

```
backend/
├── auth/
│   ├── auth.middleware.js
│   └── auth.routes.js
├── models/
│   ├── file.js
│   ├── index.js
│   └── user.js
├── routes/
│   ├── file.routes.js
│   └── user.routes.js
├── .env
├── .env.example
├── API_DOCUMENTATION.md
├── index.js
├── insert-sample-data.sql
├── package.json
├── package-lock.json
├── setup-database.sql
└── swagger.config.js
```

### Key Files and Directories

* `auth/`: Contains authentication-related code.
  * `auth.middleware.js`: Middleware for verifying JWT tokens.
  * `auth.routes.js`: Routes for user registration and login.
* `models/`: Defines the database schemas.
  * `file.js`: Sequelize model for files.
  * `user.js`: Sequelize model for users.
  * `index.js`: Initializes and configures Sequelize.
* `routes/`: Defines the API routes.
  * `file.routes.js`: Routes for file-related operations (upload, download, delete, etc.).
  * `user.routes.js`: Routes for user-related operations.
* `index.js`: The main entry point of the application.
* `setup-database.sql`: SQL script for setting up the database.
* `insert-sample-data.sql`: SQL script for inserting sample data into the database.
* `.env`: Environment variables for the application.
* `API_DOCUMENTATION.md`: Detailed API documentation.
* `swagger.config.js`: Configuration file for Swagger API documentation.

## Functionality

The backend offers the following functionality:

* **User Authentication:**
  * Register new users.
  * Log in existing users.
  * JWT-based authentication for protected routes.
* **File Management:**
  * Upload files.
  * Download files.
  * Delete files.
  * Get a list of all files.
  * Update file visibility (public/private).
* **User Management:**
  * Get the profile of the currently authenticated user.

## API Endpoints

The API endpoints are documented in detail in the `API_DOCUMENTATION.md` file. You can also view the API documentation using Swagger at the `/api-docs` endpoint.

### Authentication

* `POST /api/auth/register`: Register a new user.
* `POST /api/auth/login`: Log in a user.

### Users

* `GET /me`: Get the current user's profile.

### Files

* `GET /`: Get all files.
* `PUT /files/{id}/visibility`: Update a file's visibility.
* `DELETE /files/{id}`: Delete a file.

## How to Run the Project

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Set up the database:**
    * Create a MySQL database.
    * Run the `setup-database.sql` script to create the necessary tables.
    * Run the `insert-sample-data.sql` script to insert sample data.
3. **Configure environment variables:**
    * Create a `.env` file by copying the `.env.example` file.
    * Update the `.env` file with your database credentials and a JWT secret.
4. **Start the server:**

    ```bash
    node index.js
    ```

The server will start on the port specified in the `.env` file (default is 3001).
