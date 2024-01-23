import { UserController } from '../controllers/user.controller';
import httpMocks from 'node-mocks-http';
import  UserModel  from '../models/user.model';
import * as bcrypt from 'bcrypt';

// Mock the 'compare' function of bcrypt
jest.mock('bcrypt', () => {
  return {
    ...jest.requireActual('bcrypt'),
    compare: jest.fn(),
  };
});

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

/*jest.mock('../models/user.model', () => ({
  ...jest.requireActual('../models/user.model'),
  createUser: jest.fn().mockResolvedValue({
    username:'testUser',
    email:'test@example.com',
    password: 'TestTest123@',
    address:'123 Test St',
  }),
}));*/

beforeAll(() => {
  UserModel.findUserByUsername = jest.fn();
});

describe('UserController', () => {
  describe('createUser', () => {
    it('should create a new user and return 201 status', async () => {
      UserModel.createUser = jest.fn().mockResolvedValue({
        username:'testUser',
        email:'test@example.com',
        password: 'TestTest123@',
        address:'123 Test St',
      });
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

  describe('loginUser', () => {
    it('should return a token if the password matches', async () => {

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (UserModel.findUserByUsername as jest.Mock).mockResolvedValueOnce({
        id: 1,
        username: 'testUser',
        password: 'TestTest123@',
        email:'test@example.com',
        address:'123 Test St',
      });
      const req = httpMocks.createRequest({
        body: {
          username: 'testUser',
          password: 'TestTest123@',
        },
      });
      const res = httpMocks.createResponse();

      await UserController.loginUser(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('should return 400 if the password does not match and message', async () => {
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

      const data = res._getJSONData();
      expect(res.statusCode).toBe(400);
      expect(data).toHaveProperty('message', 'Invalid username or password.');
    });
  }); 
});
