import express from 'express';
import UserController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', UserController.loginUser);
router.post('/register', UserController.createUser);
router.get('/protected-route', authMiddleware, (req, res) => {
  // This route is now protected
  res.send('This is a protected route');
});

export default router;
