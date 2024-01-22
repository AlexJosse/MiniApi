import jwt from 'jsonwebtoken';

const secret:string = process.env.SECRET_KEY!;

export const generateToken = (userId: number | undefined): string => {
  return jwt.sign({ userId }, secret, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, secret);
};
