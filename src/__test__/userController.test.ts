import { UserController } from '../controllers/user.controller';
import httpMocks from 'node-mocks-http';

import bcrypt from 'bcryptjs';

// Mock the entire 'bcrypt' module
jest.mock('bcrypt');

/*jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    users: {
      findUnique: jest.fn().mockResolvedValue(''),
      create: jest.fn().mockResolvedValue({
        username:'alexandare',
        email:'alexandrejossaefr@gmail.com',
        password: 'TestTest123@',
        address:'14 bis allée saint hubert',
      }),
    },
  })),
}));*/

jest.mock('../models/user.model', () => ({
  findUserByUsername: jest.fn().mockResolvedValue({
    username: 'testUser',
    password: 'hashedPassword',
    email: 'test@example.com',
    address: '123 Test St',
  }),
  createUser: jest.fn().mockResolvedValue({
    username:'alexandare',
    email:'alexandrejossaefr@gmail.com',
    password: 'TestTest123@',
    address:'14 bis allée saint hubert',
  }),
}));


describe('UserController', () => {
  describe('createUser', () => {
    it('should create a new user and return 201 status', async () => {
      const req = httpMocks.createRequest({
        body: {
          username: 'testUser',
          email: 'test@example.com',
          address: '123 Test St',
          password: 'Password@123',
        },
      });
      const res = httpMocks.createResponse();

      await UserController.createUser(req, res);
      expect(res.statusCode).toBe(201);
    });
  });

  /* describe('loginUser', () => {
    it('should return a token if the password matches', async () => {
      // Mock the behavior of bcrypt.compare
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      // Setup your request and response objects
      const req = httpMocks.createRequest({
        body: {
          username: 'testUser',
          password: 'Password@123',
        },
      });
      const res = httpMocks.createResponse();

      await UserController.loginUser(req, res);

      // Perform your assertions
      expect(res.statusCode).toBe(200); // Adjust based on your actual success status code
      // Check if a token is returned, etc.
    });

    it('should return 400 if the password does not match', async () => {
      // Mock the behavior of bcrypt.compare
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      // Setup your request and response objects
      const req = httpMocks.createRequest({
        body: {
          username: 'testUser',
          password: 'WrongPassword',
        },
      });
      const res = httpMocks.createResponse();

      await UserController.loginUser(req, res);

      // Perform your assertions
      expect(res.statusCode).toBe(400); // Or whatever your failure status code is
      // Additional assertions
    });
  });*/
  
});
