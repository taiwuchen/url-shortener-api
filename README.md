# URL Shortener API

A URL shortener built with TypeScript and Node.js. It uses a PostgreSQL database and focuses on the essential functionality of converting long URLs into shortened versions and redirecting users based on the generated short codes. This project also supports user authentication and provides admin-only analytics features.

## Features

- **User Authentication:**  
  Register and log in users using JWTs. See [src/routes/userRoutes.ts](src/routes/userRoutes.ts).

- **URL Shortening & Redirection:**  
  Shorten URLs for logged-in users and redirect using unique short codes. See [src/routes/urlRoutes.ts](src/routes/urlRoutes.ts).

- **Admin Analytics:**  
  View various analytics metrics
  Accessible via [src/routes/adminRoutes.ts](src/routes/adminRoutes.ts).

## Project File Overview

- **[package.json](package.json):** Project metadata, dependencies, and scripts.
- **[tsconfig.json](tsconfig.json):** TypeScript compiler configuration.
- **[src/app.ts](src/app.ts):** Application entry point.
- **[src/database.ts](src/database.ts):** PostgreSQL database connection and schema initialization.
- **[src/middleware/authMiddleware.ts](src/middleware/authMiddleware.ts):** JWT-based authentication middleware.
- **[src/routes/userRoutes.ts](src/routes/userRoutes.ts):** Endpoints for user registration and login.
- **[src/routes/urlRoutes.ts](src/routes/urlRoutes.ts):** Endpoints for URL shortening and redirection.
- **[src/routes/adminRoutes.ts](src/routes/adminRoutes.ts):** Endpoints for admin analytics.
- **[src/utils/urlUtils.ts](src/utils/urlUtils.ts):** Utility function to validate URLs.
- **[openapi.yaml](openapi.yaml):** OpenAPI Specification for API documentation.
- **[tests/](tests/):** Contains unit and integration tests.

## Setup and Installation

1. **Install Dependencies:**

   Run the following command in your terminal from the project root:
   ```sh
   npm install
   ```

2. **Configure Environment Variables:**

   Modify a .env file (or create a new one) with the following content:
    ```sh
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=url_shortener
    DB_USER=your_db_username
    DB_PASSWORD=your_db_password
    JWT_SECRET=your_super_secret_key_here
    ```

3. **Initialize the Database Schema:**

    The schema is automatically initialized when the application starts via **[database.ts](src/database.ts):**

## Running the Application

Start the application with:
```sh
npx ts-node src/app.ts
```

### API Documentation
The API is fully documented using OpenAPI.
Render **[openapi.yaml](openapi.yaml)** with a tool like Swagger UI or Redoc.

## Running Tests

Execute the tests using:
```sh
npm test
```



