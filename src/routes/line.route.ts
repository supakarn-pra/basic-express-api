import { Router } from 'express';
import { LineController } from '../controllers/line.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const lineController = new LineController();

router.post('/webhook', lineController.webhook);
router.post('/send', authMiddleware, lineController.sendMessage);

export default router;
