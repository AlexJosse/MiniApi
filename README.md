# MiniFigurine API

## Project Overview
The MiniFigurine API is a backend service built using Node.js, PostgreSQL, Redis, and TypeScript, integrated with Prisma for database operations. This API facilitates user registration, login, and ordering of miniature figurines. The system has a unique feature where orders are processed through a publish-subscribe mechanism using Redis. The MiniFactory, a subscriber in this setup, receives order updates, processes them, and communicates back with the API to update order statuses in the PostgreSQL database.

## Key Features
- **User Registration and Authentication:** Secure user registration and login functionality.
- **Order Processing:** Users can place orders for miniature figurines. The order processing is handled asynchronously through message passing with Redis.
- **Dynamic Pricing:** Special pricing rules apply, such as discounts on bulk orders and special packages.
- **Real-time Order Status Updates:** The system uses a publish-subscribe model to provide real-time updates on order processing.

## Project Structure
- `./miniFactory`: Subscriber for processing orders.
- `./prisma`: Prisma models for the PostgreSQL database.
- `./src/__test__/`: Unit tests (integration tests in progress).
- `./src/controllers/`: Controllers for handling user and order operations.
- `./src/controllers/joi-schemas`: Validation schemas for enhanced security and error handling.
- `./src/interfaces/`: Interfaces representing Orders and Users.
- `./middleware/authMiddleware.ts`: Middleware to protect routes using JWT tokens.
- `./models/`: Models for User and Order, utilizing Prisma for database interactions.
- `./routes/`: API routes (endpoints).
- `./utils/`: Utility scripts including database initialization and JWT token generation.
- `./Dockerfile` and `./docker-compose.yml`: Containerization configuration.

## API Endpoints

### User Registration
- **Endpoint:** `/register` (POST)
- **Body:**
  ```json
  {
    "username": "alexandre",
    "email": "alexandrejossefr@gmail.com",
    "password": "TestTest123@",
    "address": "14 bis allée saint hubert"
  }
- **Response:**
  ```json
  {
    "id": 1,
    "username": "alexandre",
    "email": "alexandrejossefr@gmail.com",
    "password": "passwordHashed",
    "address": "14 bis allée saint hubert"
  }
  ```
### User Login
- **Endpoint:** `/login` (POST)
- **Body:**
  ```json
  {
    "username": "alexandre",
    "password": "TestTest123@"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNjAyNjAyMiwiZXhwIjoxNzA2MDI5NjIyfQ.sXUh024InxcgTSoWf-XyHaLoDWXWNzLthFG1uyMuLTs",
  }
  ```