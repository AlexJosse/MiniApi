// TypeScript has a built-in type named Request which is part of its DOM library definitions and is colliding with the Request type from Express. need to cast Request and Response so
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import bcrypt from 'bcrypt';
import { userSchema, loginSchema } from './joi-schemas/user.schema';
import UserModel from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { IUser, UserWithoutPassword } from '../interfaces/user.interface';

/**
 * Controller for user-related operations.
 */
export class UserController {
  /**
   * Creates a new user.
   * 
   * @param {ExpressRequest} req - The express request object containing the user data.
   * @param {ExpressResponse} res - The express response object.
   * 
   * The method expects the request body to have a username, email, password, and address.
   * It performs password complexity validation and creates a new user in the database.
   * The created user's data is returned without the password.
   */
  static async createUser(req: ExpressRequest, res: ExpressResponse) {
    try {
      const validation = userSchema.validate(req.body);
      if (validation.error) {
        return res.status(400).json({ message: validation.error.details[0].message });
      }
      const { username, email, password, address } = req.body;

      const user = await UserModel.createUser({
        username,
        email,
        address,
        password,
      });

      const { password: unused, ...userWithoutPassword } = user;
      const usertoReturn: UserWithoutPassword = userWithoutPassword;
      res.status(201).json(usertoReturn);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Logs in a user.
   * 
   * @param {ExpressRequest} req - The express request object containing the login credentials.
   * @param {ExpressResponse} res - The express response object.
   * 
   * The method expects the request body to have a username and password.
   * It verifies the user's credentials and, if successful, returns a JWT token.
   * If the credentials are invalid, an error response is sent.
   */
  static async loginUser(req: ExpressRequest, res: ExpressResponse) {
    try {
      const validation = loginSchema.validate(req.body);
      if (validation.error) {
        return res.status(400).json({ message: validation.error.details[0].message });
      }
      const { username, password } = req.body;

      // Find the user by username
      const user: IUser | null = await UserModel.findUserByUsername(username);

      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password.' });
      }

      // Verify the password
      const passwordMatch: boolean = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid username or password.' });
      }

      const { id } = user;
      // Generate a JWT token for the user
      const token: string = generateToken(id);

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default UserController;
