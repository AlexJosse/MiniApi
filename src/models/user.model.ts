import prisma from '../utils/prismaClient';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';


const saltRounds: number = 10;

/**
 * Model for handling database operations related to users.
 */

class UserModel {
  /**
   * Creates a new user in the database.
   * 
   * @param {IUser} userData - The user data to be saved, including unhashed password.
   * @returns {Promise<IUser>} A promise that resolves to the newly created user.
   * 
   * This method hashes the user's password before saving the user to the database.
   */

  static async createUser(userData: IUser): Promise<IUser> {
    const hashedPassword: string = await bcrypt.hash(userData.password, saltRounds);

    const newUser = await prisma.users.create({
      data: {
        username: userData.username,
        email: userData.email,
        address: userData.address,
        password: hashedPassword, // Store the hashed password
      },
    });
    return newUser;
  }

  /**
   * Finds a user by their username.
   * 
   * @param {string} username - The username of the user to find.
   * @returns {Promise<IUser | null>} A promise that resolves to the user if found, or null if not found.
   * 
   * This method queries the database for a user with the given username.
   */
  static async findUserByUsername(username: string): Promise<IUser | null> {
    try {
      // Use Prisma Client to query the user by username
      const user = await prisma.users.findUnique({
        where: {
          username: username,
        },
      });
      // Return the user if found, or null if not found
      return user || null;
    } catch (error) {
      // Handle any errors, e.g., database query errors
      throw error;
    }
  }
}

export default UserModel;
