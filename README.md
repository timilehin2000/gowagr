# Money Transfer System API

Welcome to the **Money Transfer System API**! This API allows users to register, authenticate, and initiate transfers seamlessly. It is designed for efficient money transfer, providing a robust and secure backend service.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- Secure authentication using JWT
- Initiate and manage money transfers
- Increment user balances
- Fetch user details and transfer history

## Technologies

- **Node.js**: JavaScript runtime for building server-side applications
- **NestJS**: Progressive Node.js framework for building efficient and scalable server-side applications
- **Express**: Web framework for Node.js
- **TypeScript**: Typed superset of JavaScript
- **PostgreSQL**: Relational database management system
- **Swagger UI**: API documentation
- **Postman**: API testing interface

## Prerequisites

- Node.js (>= 14.x)
- PostgreSQL (>= 12.x)
- npm or Yarn

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/timilehin2000/gowagr.git
   cd money-transfer-system-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up your PostgreSQL database**:
   - Create a new database and user for your application.
   - Update the database connection details in the `.env` file.

## Configuration

Create a `.env` file in the root directory of the project and configure the following environment variables:

```env
DB_HOST=your_postgres_host
DB_PORT=your_postgres_port
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=database_name
JWT_SECRET=your_jwt_secret
```

Replace `username`, `password`, `database_name`, `host`, `port`, and `your_jwt_secret` with your actual database credentials and a secure JWT secret.

## Running the Application

To start the application, run the following command:

```bash
npm run start:dev
```

The application will be available at `http://localhost:3001`.

## API Documentation

The API documentation is available in both Swagger and Postman formats:

### Swagger

Swagger documentation can be accessed upon running the code at:

`http://localhost:3001/api-docs`

## Testing

To run the tests for the application, use the following command:

```bash
npm run test
```

## Contributing

Contributions are welcome! If you would like to contribute to this project, please fork the repository and create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.
