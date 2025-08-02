import express from 'express';
import kelasController from '../controllers/kelasController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Search kelas - Legacy endpoint
router.get('/search', kelasController.searchKelas);

// Get filter options for frontend
router.get('/filters', kelasController.getFilterOptions);

// Get kelas statistics
router.get('/stats', kelasController.getKelasStats);

// Get kelas by category (support both ID and name)
router.get('/category/:category', kelasController.getKelasByCategory);

// Get kelas by level
router.get('/level/:level', kelasController.getKelasByLevel);

// Get kelas by instructor
router.get('/instructor/:instructorId', kelasController.getKelasByInstructor);

// Get all kelas 
router.get('/', kelasController.getAllKelas);

// Get specific kelas by ID
router.get('/:id', kelasController.getKelasById);

// Create new kelas
router.post('/', authenticateToken, kelasController.createKelas);

// Update kelas 
router.put('/:id', authenticateToken, kelasController.updateKelas);
router.patch('/:id', authenticateToken, kelasController.updateKelas);


router.delete('/:id', authenticateToken, kelasController.deleteKelas);


export default router;