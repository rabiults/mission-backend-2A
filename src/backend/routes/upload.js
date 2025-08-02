import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import upload from '../../config/multer.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/files', (req, res) => {
  try {
    const possiblePaths = [
      path.join(process.cwd(), 'upload')   
    ];
    
    let uploadDir = null;
    for (const dirPath of possiblePaths) {
      if (fs.existsSync(dirPath)) {
        uploadDir = dirPath;
        break;
      }
    }
    
    if (!uploadDir) {
      return res.json({
        success: true,
        message: 'Upload folder tidak ditemukan atau kosong',
        data: [],
        debug: {
          tried_paths: possiblePaths,
          current_dir: __dirname
        }
      });
    }

    const files = fs.readdirSync(uploadDir)
      .filter(file => {
        const filePath = path.join(uploadDir, file);
        return fs.statSync(filePath).isFile();
      })
      .map(filename => {
        const filePath = path.join(uploadDir, filename);
        const stats = fs.statSync(filePath);
        
        return {
          filename,
          size: stats.size,
          uploadedAt: stats.birthtime,
          url: `http://localhost:3001/uploads/${filename}`
        };
      });

    res.json({
      success: true,
      message: `Ditemukan ${files.length} file`,
      data: files,
      upload_dir: uploadDir
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil list file',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get('/info/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const uploadDir = path.join(process.cwd(), 'upload');
    const filePath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan',
        filename,
        looked_in: uploadDir
      });
    }

    const stats = fs.statSync(filePath);
    
    res.json({
      success: true,
      message: 'Info file ditemukan',
      data: {
        filename,
        size: stats.size,
        uploadedAt: stats.birthtime,
        url: `http://localhost:3001/uploads/${filename}`,
        path: filePath
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil info file',
      error: error.message
    });
  }
});

router.post('/single', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tidak ada file yang diupload' 
      });
    }

    res.json({
      success: true,
      message: 'File berhasil diupload',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        url: `http://localhost:3001/uploads/${req.file.filename}` 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error saat upload file',
      error: error.message 
    });
  }
});

router.post('/multiple', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tidak ada file yang diupload' 
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size,
      url: `http://localhost:3001/uploads/${file.filename}` 
    }));

    res.json({
      success: true,
      message: `${req.files.length} file berhasil diupload`,
      data: uploadedFiles
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error saat upload file',
      error: error.message 
    });
  }
});

export default router;