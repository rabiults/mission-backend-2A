import express from 'express';
import authController from '../controllers/authController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/register', authController.register);
router.get('/verifikasi-email', authController.verifyEmail);
router.post('/login', authController.login);
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Profile berhasil diambil',
    user: req.user
  });
});
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout berhasil'
  });
});

export default router; 
