import Kelas from '../models/kelas.js';

const kelasService = {
  // Get all kelas
  getAllKelas: async () => {
    try {
      return await Kelas.findAll();
    } catch (error) {
      console.error('Error in getAllKelas service:', error);
      throw new Error('Gagal mengambil semua data kelas');
    }
  },

  // Get kelas by ID
  getKelasById: async (id) => {
    try {
      const kelas = await Kelas.findById(id);
      if (!kelas) {
        throw new Error(`Kelas with ID ${id} not found`);
      }
      return kelas;
    } catch (error) {
      console.error('Error in getKelasById service:', error);
      throw error;
    }
  },

  // Search kelas
  searchKelas: async (searchTerm) => {
    try {
      return await Kelas.search(searchTerm);
    } catch (error) {
      console.error('Error in searchKelas service:', error);
      throw new Error('Gagal mencari kelas');
    }
  },

  // Get kelas by category
  getKelasByCategory: async (categoryId) => {
    try {
      return await Kelas.findByCategory(categoryId);
    } catch (error) {
      console.error('Error in getKelasByCategory service:', error);
      throw new Error('Gagal mengambil kelas berdasarkan kategori');
    }
  },

  // Create new kelas
  createKelas: async (kelasData) => {
    try {
      // Validasi apakah kelas dengan judul yang sama sudah ada
      const existingKelas = await Kelas.findByTitle(kelasData.judul);
      if (existingKelas) {
        throw new Error('Kelas dengan judul tersebut sudah ada');
      }

      // Validasi required fields untuk database
      const requiredFields = ['judul', 'deskripsi', 'harga', 'tutor_id', 'kategori_id'];
      const missingFields = requiredFields.filter(field => !kelasData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Field berikut harus diisi: ${missingFields.join(', ')}`);
      }

      return await Kelas.create(kelasData);
    } catch (error) {
      console.error('Error in createKelas service:', error);
      throw error;
    }
  },

  // Update kelas
  updateKelas: async (id, updateData) => {
    try {
      // Pastikan kelas exists
      const existingKelas = await Kelas.findById(id);
      if (!existingKelas) {
        throw new Error(`Kelas with ID ${id} not found`);
      }

      // Jika mengupdate judul, pastikan tidak conflict dengan kelas lain
      if (updateData.judul) {
        const kelasWithSameTitle = await Kelas.findByTitle(updateData.judul);
        if (kelasWithSameTitle && kelasWithSameTitle.kelas_id != id) {
          throw new Error('Kelas dengan judul tersebut sudah ada');
        }
      }

      return await Kelas.update(id, updateData);
    } catch (error) {
      console.error('Error in updateKelas service:', error);
      throw error;
    }
  },

  // Delete kelas
  deleteKelas: async (id) => {
    try {
      // Pastikan kelas exists
      const existingKelas = await Kelas.findById(id);
      if (!existingKelas) {
        throw new Error(`Kelas with ID ${id} not found`);
      }

      return await Kelas.delete(id);
    } catch (error) {
      console.error('Error in deleteKelas service:', error);
      throw error;
    }
  },

  // Additional methods
  getKelasByLevel: async (level) => {
    try {
      return await Kelas.findByLevel(level);
    } catch (error) {
      console.error('Error in getKelasByLevel service:', error);
      throw new Error('Gagal mengambil kelas berdasarkan level');
    }
  },

  getKelasByInstructor: async (instructorName) => {
    try {
      return await Kelas.findByInstructor(instructorName);
    } catch (error) {
      console.error('Error in getKelasByInstructor service:', error);
      throw new Error('Gagal mengambil kelas berdasarkan instructor');
    }
  }
};

export default kelasService;