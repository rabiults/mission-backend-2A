import User from '../models/User.js'; 
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../helpers/mailer.js';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

class AuthController {
  async register(req, res) {
    try {
      const { full_name, email, gender, phone_number, password } = req.body;

      if (!full_name || !email || !gender || !phone_number || !password) {
        return res.status(400).json({
          success: false,
          message: 'Semua field harus diisi (full_name, email, gender, phone_number, password)'
        });
      }

      // Validasi panjang password
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password minimal 6 karakter'
        });
      }

      // Validasi gender
      if (!['male', 'female'].includes(gender.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Gender harus male atau female'
        });
      }

      // Validasi format email sederhana
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format email tidak valid'
        });
      }

      // Validasi nomor telepon (hanya angka, minimal 10 digit)
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(phone_number)) {
        return res.status(400).json({
          success: false,
          message: 'Nomor telepon harus berupa angka 10-15 digit'
        });
      }

      // Check if email already exists
      const emailExists = await User.emailExists(email);
      if (emailExists) {
        return res.status(409).json({ // 409 Conflict lebih sesuai
          success: false,
          message: 'Email sudah terdaftar'
        });
      }

      // Check if phone number already exists
      const phoneExists = await User.phoneExists(phone_number);
      if (phoneExists) {
        return res.status(409).json({ // 409 Conflict lebih sesuai
          success: false,
          message: 'Nomor telepon sudah digunakan'
        });
      }

      const verifikasi_token = uuidv4();
      const newUser = await User.insert({
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        gender: gender.toLowerCase(),
        phone_number: phone_number.trim(),
        password,
        verifikasi_token
      });
      
      try {
        await sendVerificationEmail(newUser.email, verifikasi_token);
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
      }
      
      res.status(201).json({
        success: true,
        message: 'User berhasil didaftarkan. Silakan cek email untuk verifikasi.',
        data: {
          user_id: newUser.user_id,
          full_name: newUser.full_name,
          email: newUser.email,
          gender: newUser.gender,
          phone_number: newUser.phone_number
        }
      });

    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Terjadi kesalahan sistem'
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token tidak ditemukan di query'
        });
      }

      const user = await User.findByVerificationToken(token);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token tidak valid atau sudah digunakan'
        });
      }

      await User.clearVerificationToken(user.user_id);

      res.status(200).json({
        success: true,
        message: 'Email berhasil diverifikasi. Silakan login.'
      });

    } catch (error) {
      console.error('Verifikasi email error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat verifikasi email'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan password harus diisi'
        });
      }

      const user = await User.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Email atau password salah'
        });
      }

      // Verifikasi password menggunakan bcrypt compare
      const isPasswordValid = await User.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Email atau password salah'
        });
      }

      const token = jwt.sign(
        { 
          userId: user.user_id, 
          email: user.email,
          full_name: user.full_name 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        token: token,
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          gender: user.gender,
          phone_number: user.phone_number
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Terjadi kesalahan sistem'
      });
    }
  }
}

export default new AuthController();