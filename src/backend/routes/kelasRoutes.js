import express from 'express';
import kelasController from '../controllers/kelasController.js';

const router = express.Router();
router.get('/search', kelasController.searchKelas);

// CRUD routes
router.get('/', kelasController.getAllKelas);
router.post('/', kelasController.createKelas);
router.get('/:id', kelasController.getKelasById);
router.put('/:id', kelasController.updateKelas);
router.delete('/:id', kelasController.deleteKelas);

export default router;