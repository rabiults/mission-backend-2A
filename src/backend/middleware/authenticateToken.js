import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {

    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }
  
  // Ganti 'your-secret-key' menjadi 'your-secret-key-here'
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;