import kelasService from '../services/kelasService.js';

const kelasController = {
  // GET /api/kelas - Get all kelas
  getAllKelas: async (req, res) => {
    try {
      console.log('GET /api/kelas - Getting all kelas');
      const { category, search, level, instructor } = req.query;
      
      let kelas;
      if (search) {
        kelas = await kelasService.searchKelas(search);
      } else if (category) {
        kelas = await kelasService.getKelasByCategory(category);
      } else if (level) {
        kelas = await kelasService.getKelasByLevel(level);
      } else if (instructor) {
        kelas = await kelasService.getKelasByInstructor(instructor);
      } else {
        kelas = await kelasService.getAllKelas();
      }

      res.status(200).json({
        success: true,
        message: 'Data kelas berhasil diambil',
        data: kelas,
        total: kelas.length
      });
    } catch (error) {
      console.error('Error in getAllKelas:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kelas',
        error: error.message
      });
    }
  },

  // GET /api/kelas/:id - Get kelas by ID
  getKelasById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`GET /api/kelas/${id} - Getting kelas by ID`);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID kelas tidak valid'
        });
      }

      const kelas = await kelasService.getKelasById(id);

      res.status(200).json({
        success: true,
        message: 'Data kelas berhasil diambil',
        data: kelas
      });
    } catch (error) {
      console.error('Error in getKelasById:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Kelas tidak ditemukan'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kelas',
        error: error.message
      });
    }
  },

  // POST /api/kelas - Create new kelas
  createKelas: async (req, res) => {
    try {
      console.log('POST /api/kelas - Creating new kelas');
      console.log('Request body:', req.body);
      
      const kelasData = req.body;
      const requiredFields = ['judul', 'deskripsi', 'harga', 'tutor_id', 'kategori_id'];
      const missingFields = requiredFields.filter(field => !kelasData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Field berikut harus diisi: ${missingFields.join(', ')}`
        });
      }

      if (isNaN(kelasData.harga) || kelasData.harga <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Harga harus berupa angka positif'
        });
      }

      if (isNaN(kelasData.tutor_id) || isNaN(kelasData.kategori_id)) {
        return res.status(400).json({
          success: false,
          message: 'tutor_id dan kategori_id harus berupa angka'
        });
      }

      const newKelas = await kelasService.createKelas(kelasData);

      res.status(201).json({
        success: true,
        message: 'Kelas berhasil dibuat',
        data: newKelas
      });
    } catch (error) {
      console.error('Error in createKelas:', error);
      
      if (error.message.includes('already exists') || error.message.includes('sudah ada')) {
        return res.status(409).json({
          success: false,
          message: 'Kelas dengan judul tersebut sudah ada'
        });
      }

      if (error.message.includes('harus diisi')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Gagal membuat kelas baru',
        error: error.message
      });
    }
  },

  // PUT/PATCH /api/kelas/:id - Update kelas
  updateKelas: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log(`${req.method} /api/kelas/${id} - Updating kelas`);
      console.log('Update data:', updateData);

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID kelas tidak valid'
        });
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Data yang akan diupdate tidak boleh kosong'
        });
      }

      if (updateData.harga !== undefined) {
        if (isNaN(updateData.harga) || updateData.harga <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Harga harus berupa angka positif'
          });
        }
      }

      if (updateData.tutor_id !== undefined && isNaN(updateData.tutor_id)) {
        return res.status(400).json({
          success: false,
          message: 'tutor_id harus berupa angka'
        });
      }

      if (updateData.kategori_id !== undefined && isNaN(updateData.kategori_id)) {
        return res.status(400).json({
          success: false,
          message: 'kategori_id harus berupa angka'
        });
      }

      const updatedKelas = await kelasService.updateKelas(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Data kelas berhasil diperbarui',
        data: updatedKelas
      });
    } catch (error) {
      console.error('Error in updateKelas:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Kelas tidak ditemukan'
        });
      }

      if (error.message.includes('sudah ada')) {
        return res.status(409).json({
          success: false,
          message: 'Kelas dengan judul tersebut sudah ada'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Gagal memperbarui data kelas',
        error: error.message
      });
    }
  },

  // DELETE /api/kelas/:id - Delete kelas
  deleteKelas: async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log(`DELETE /api/kelas/${id} - Deleting kelas`);

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID kelas tidak valid'
        });
      }
      
      const deletedKelas = await kelasService.deleteKelas(id);

      res.status(200).json({
        success: true,
        message: 'Kelas berhasil dihapus',
        data: deletedKelas
      });
    } catch (error) {
      console.error('Error in deleteKelas:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Kelas tidak ditemukan'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Gagal menghapus kelas',
        error: error.message
      });
    }
  },

  // GET /api/kelas/search?q=searchTerm
  searchKelas: async (req, res) => {
    try {
      const { q } = req.query;
      console.log(`GET /api/kelas/search?q=${q} - Searching kelas`);
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Parameter pencarian (q) diperlukan'
        });
      }

      const kelas = await kelasService.searchKelas(q);

      res.status(200).json({
        success: true,
        message: 'Pencarian kelas berhasil',
        data: kelas,
        total: kelas.length
      });
    } catch (error) {
      console.error('Error in searchKelas:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mencari kelas',
        error: error.message
      });
    }
  }
};

export default kelasController;