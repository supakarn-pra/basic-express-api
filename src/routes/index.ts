import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import lineRoutes from './line.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/line', lineRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
