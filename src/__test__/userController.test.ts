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

    it('should failed to create a new user and return 400 status [usname missing]', async () => {
      const req = httpMocks.createRequest({
        body: {
          email: 'test@example.com',
          address: '123 Test St',
          password: 'Password@123',
        },
      });
      const res = httpMocks.createResponse();

      await UserController.createUser(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should failed to create a new user and return 400 status [email missing]', async () => {
      const req = httpMocks.createRequest({
        body: {
          username: 'tEdsdsdsm',
          address: '123 Test St',
          password: 'Password@123',
        },
      });
      const res = httpMocks.createResponse();

      await UserController.createUser(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should failed to create a new user and return 400 status [address missing]', async () => {
      const req = httpMocks.createRequest({
        body: {
          username: 'tEdsdsdsm',
          email: '1est@example.comt',
          password: 'Password@123',
        },
      });
      const res = httpMocks.createResponse();

      await UserController.createUser(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should failed to create a new user and return 400 status [password missing]', async () => {
      const req = httpMocks.createRequest({
        body: {
          username: 'tEdsdsdsm',
          email: '1est@example.comt',
          address: 'rue de la',
        },
      });
      const res = httpMocks.createResponse();

      await UserController.createUser(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should failed to create a new user and return 400 status [password format wrong (minimum 8 characters with symbols)]', async () => {
      const req = httpMocks.createRequest({
        body: {
          username: 'tEdsdsdsm',
          email: '1est@example.comt',
          address: 'rue de la',
          password: 'test',
        },
      });
      const res = httpMocks.createResponse();

      await UserController.createUser(req, res);
      expect(res.statusCode).toBe(400);
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
