import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.get('/all', userController.getAllUsers);
router.put('/profile', userController.updateProfile);
router.delete('/profile', userController.deleteUser);

export default router;
