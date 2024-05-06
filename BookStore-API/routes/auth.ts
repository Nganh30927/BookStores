import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', authController.login);
/** Phải nằm trước id */
router.get('/profile', authMiddleware.checkToken, authController.getProfile);

/** Phải nằm trước id */
router.get('/refresh-token', authMiddleware.checkToken, authController.freshToken);


export default router;