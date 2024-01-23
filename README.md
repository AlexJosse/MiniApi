# MiniFigurine API

## Project Overview
The MiniFigurine API is a backend service built using Node.js, PostgreSQL, Redis, and TypeScript, integrated with Prisma for database operations. This API facilitates user registration, login, and ordering of miniature figurines. The system has a unique feature where orders are processed through a publish-subscribe mechanism using Redis. The MiniFactory, a subscriber in this setup, receives order updates, processes them, and communicates back with the API to update order statuses in the PostgreSQL database.

## Setup and start project
- **Docker necessary**: https://docs.docker.com/engine/install/
- **Build app:** Users can place orders for miniature figurines. The order processing is handled asynchronously through message passing with Redis.
```json
  docker-compose build --no-cache
```
- **Run the application**:
```json
  docker-compose up
```

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
- **Endpoint:** `/api/users/register` (POST)
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
- **Endpoint:** `/api/users/login` (POST)
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
### Orders creation
- **Endpoint:** `/api/orders/order` (POST)
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>",
    "Content-Type":"application/json"
  }
  ```
- **Body:**
  ```json
  {
    "mini": 10,
    "package": "MiNi Familly pack'"
  }
  ```
- **Response:**
  ```json
  {
    "id": 36,
    "mini": 40,
    "userid": 1,
    "price": 600,
    "package": "aucun",
    "status": "PENDING",
    "serialnumbers": [],
    "invoice": "{\"price\":600,\"discount\":\"MiNi Familly pack\"}",
    "createdat": "2024-01-23T16:23:50.469Z",
    "updatedat": "2024-01-23T16:23:50.469Z"
  }
  ```
### Get orders by UserId
- **Endpoint:** `/api/orders/user/:userId` (GET)
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>",
    "Content-Type":"application/json"
  }
  ```
- **Response:**
  ```json
  [
    {
        "id": 1,
        "mini": 3,
        "userid": 2,
        "price": 45,
        "package": "aucun",
        "discount": 0,
        "status": "DELIVERED",
        "serialnumbers": [
            "dae0b572-0168-4490-8978-d2d21d220e0a",
            "cd851afe-a4c9-478d-9ea7-8aaecdec2c4a",
            "00b1d1ed-7a7b-46ac-95b8-6bf09a2c3f40",
        ],
        "invoice": "{\"price\":45,\"discount\":\"aucun\"}",
        "createdat": "2024-01-22T18:00:35.967Z",
        "updatedat": "2024-01-22T18:00:35.967Z"
    }
   ]
  ```