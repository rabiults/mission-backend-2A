import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../database/database.js';

class User {
  constructor() {
    this.initializeDatabase();
  }

  // Inisialisasi database dan tabel
  async initializeDatabase() {
    try {
      // Buat tabel users jika belum ada
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          user_id INT PRIMARY KEY AUTO_INCREMENT,
          full_name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          gender ENUM('male', 'female') NOT NULL,
          phone_number VARCHAR(15) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          verifikasi_token VARCHAR(255) NULL,
          email_verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      
      await query(createTableQuery);
      console.log('✅ Database dan tabel users siap digunakan');
      
      // Buat test user jika belum ada
      await this.createTestUser();
    } catch (error) {
      console.error('❌ Error initializing database:', error.message);
    }
  }

  // Buat test user untuk development
  async createTestUser() {
    try {
      const existingAdmin = await this.findByEmail('admin@test.com');
      if (!existingAdmin) {
        await this.insert({
          full_name: 'Admin User',
          email: 'admin@test.com',
          gender: 'male',
          phone_number: '081234567890',
          password: 'admin123'
        });
        console.log('✅ Test admin user created: admin@test.com / admin123');
      }
    } catch (error) {
      console.log('❌ Test user creation failed:', error.message);
    }
  }

  // Hash password sebelum menyimpan
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verifikasi password
  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Insert user baru (untuk register)
  async insert(userData) {
    try {
      // Validasi data sebelum insert
      if (!userData.full_name || !userData.email || !userData.password) {
        throw new Error('Missing required fields');
      }

      // Hash password sebelum menyimpan
      const hashedPassword = await this.hashPassword(userData.password);
      const verificationToken = userData.verifikasi_token || uuidv4();
      
      const insertQuery = `
        INSERT INTO users (full_name, email, gender, phone_number, password, verifikasi_token) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const result = await query(insertQuery, [
        userData.full_name.trim(),
        userData.email.toLowerCase().trim(),
        userData.gender.toLowerCase(),
        userData.phone_number.trim(),
        hashedPassword,
        verificationToken
      ]);

      console.log('✅ User berhasil disimpan ke database dengan ID:', result.insertId);
      
      return {
        user_id: result.insertId,
        full_name: userData.full_name.trim(),
        email: userData.email.toLowerCase().trim(),
        gender: userData.gender.toLowerCase(),
        phone_number: userData.phone_number.trim(),
        verifikasi_token: verificationToken,
        created_at: new Date(),
        updated_at: new Date()
      };
    } catch (error) {
      console.error('❌ Error inserting user:', error.message);
      throw new Error('Error creating user: ' + error.message);
    }
  }

  // Find user by verification token
  async findByVerificationToken(token) {
    try {
      const selectQuery = 'SELECT * FROM users WHERE verifikasi_token = ?';
      const result = await query(selectQuery, [token]);
      
      if (result.length > 0) {
        const { password, ...userWithoutPassword } = result[0];
        return userWithoutPassword;
      }
      return null;
    } catch (error) {
      console.error('Error finding user by verification token:', error.message);
      throw new Error('Database error');
    }
  }

  // Clear verification token (setelah verifikasi email)
  async clearVerificationToken(user_id) {
    try {
      const updateQuery = `
        UPDATE users 
        SET verifikasi_token = NULL, email_verified = TRUE, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?
      `;
      const result = await query(updateQuery, [user_id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error clearing verification token:', error.message);
      throw new Error('Database error');
    }
  }

  // Find user by email (untuk login)
  async findByEmail(email) {
    try {
      if (!email) return null;
      
      const selectQuery = 'SELECT * FROM users WHERE email = ?';
      const result = await query(selectQuery, [email.toLowerCase().trim()]);
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw new Error('Database error');
    }
  }

  // Find user by user_id
  async findByUserId(user_id) {
    try {
      if (!user_id) return null;
      
      const selectQuery = 'SELECT * FROM users WHERE user_id = ?';
      const result = await query(selectQuery, [user_id]);
      
      if (result.length > 0) {
        const { password, ...userWithoutPassword } = result[0];
        return userWithoutPassword;
      }
      return null;
    } catch (error) {
      console.error('Error finding user by ID:', error.message);
      throw new Error('Database error');
    }
  }

  // Find user by ID (alias untuk findByUserId)
  async findById(user_id) {
    return await this.findByUserId(user_id);
  }

  // Check if email already exists
  async emailExists(email) {
    try {
      if (!email) return false;
      
      const selectQuery = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
      const result = await query(selectQuery, [email.toLowerCase().trim()]);
      
      return result[0].count > 0;
    } catch (error) {
      console.error('Error checking email exists:', error.message);
      throw new Error('Database error');
    }
  }

  // Check if phone number already exists
  async phoneExists(phone_number) {
    try {
      if (!phone_number) return false;
      
      const selectQuery = 'SELECT COUNT(*) as count FROM users WHERE phone_number = ?';
      const result = await query(selectQuery, [phone_number.trim()]);
      
      return result[0].count > 0;
    } catch (error) {
      console.error('Error checking phone exists:', error.message);
      throw new Error('Database error');
    }
  }

  // Get all users (untuk debugging - jangan gunakan di production)
  async getAllUsers() {
    try {
      const selectQuery = `
        SELECT user_id, full_name, email, gender, phone_number, email_verified, created_at, updated_at 
        FROM users ORDER BY created_at DESC
      `;
      const result = await query(selectQuery);
      return result;
    } catch (error) {
      console.error('Error getting all users:', error.message);
      throw new Error('Database error');
    }
  }

  // Update user profile
  async updateUser(user_id, updateData) {
    try {
      // Check if user exists
      const existingUser = await this.findByUserId(user_id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Build update query dynamically
      const allowedFields = ['full_name', 'gender', 'phone_number'];
      const updateFields = [];
      const updateValues = [];

      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          updateValues.push(updateData[field]);
        }
      });

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      updateValues.push(user_id);
      
      const updateQuery = `
        UPDATE users 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?
      `;
      
      const result = await query(updateQuery, updateValues);
      
      if (result.affectedRows === 0) {
        throw new Error('User not found or no changes made');
      }
      
      // Return updated user
      const updatedUser = await this.findByUserId(user_id);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw new Error('Error updating user: ' + error.message);
    }
  }

  // Get user count (untuk statistik)
  async getUserCount() {
    try {
      const selectQuery = 'SELECT COUNT(*) as count FROM users';
      const result = await query(selectQuery);
      return result[0].count;
    } catch (error) {
      console.error('Error getting user count:', error.message);
      throw new Error('Database error');
    }
  }

  // Get verified users count
  async getVerifiedUserCount() {
    try {
      const selectQuery = 'SELECT COUNT(*) as count FROM users WHERE email_verified = TRUE';
      const result = await query(selectQuery);
      return result[0].count;
    } catch (error) {
      console.error('Error getting verified user count:', error.message);
      throw new Error('Database error');
    }
  }

  // Delete user (hard delete)
  async deleteUser(user_id) {
    try {
      const deleteQuery = 'DELETE FROM users WHERE user_id = ?';
      const result = await query(deleteQuery, [user_id]);
      
      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw new Error('Error deleting user: ' + error.message);
    }
  }

  // Test database connection
  async testConnection() {
    try {
      const result = await query('SELECT 1 as test');
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  // Get users with pagination
  async getUsersPaginated(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const selectQuery = `
        SELECT user_id, full_name, email, gender, phone_number, email_verified, created_at, updated_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;
      
      const countQuery = 'SELECT COUNT(*) as total FROM users';
      
      const [users, totalResult] = await Promise.all([
        query(selectQuery, [limit, offset]),
        query(countQuery)
      ]);
      
      return {
        users,
        pagination: {
          page,
          limit,
          total: totalResult[0].total,
          totalPages: Math.ceil(totalResult[0].total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting paginated users:', error.message);
      throw new Error('Database error');
    }
  }
}

export default new User();