import Kelas from '../models/kelas.js';

const kelasService = {
  // Get all kelas with optional basic filtering
  getAllKelas: async () => {
    try {
      return await Kelas.findAll();
    } catch (error) {
      console.error('Error in getAllKelas service:', error);
      throw new Error('Gagal mengambil semua data kelas');
    }
  },

  // Get kelas with advanced filtering, sorting, and pagination
  getKelasWithFilters: async (filters) => {
    try {
      return await Kelas.findWithFilters(filters);
    } catch (error) {
      console.error('Error in getKelasWithFilters service:', error);
      throw new Error('Gagal mengambil data kelas dengan filter');
    }
  },

  // Get count of kelas with filters for pagination
  getKelasCountWithFilters: async (filters) => {
    try {
      return await Kelas.getCountWithFilters(filters);
    } catch (error) {
      console.error('Error in getKelasCountWithFilters service:', error);
      throw new Error('Gagal menghitung jumlah kelas dengan filter');
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

  // Search kelas by term
  searchKelas: async (searchTerm) => {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Search term tidak boleh kosong');
      }
      return await Kelas.search(searchTerm);
    } catch (error) {
      console.error('Error in searchKelas service:', error);
      throw new Error('Gagal mencari kelas');
    }
  },

  // Get kelas by category
  getKelasByCategory: async (categoryId) => {
    try {
      // Support both category ID and category name
      if (isNaN(categoryId)) {
        // If it's a string, treat as category name
        return await Kelas.findByCategoryName(categoryId);
      } else {
        // If it's a number, treat as category ID
        return await Kelas.findByCategory(parseInt(categoryId));
      }
    } catch (error) {
      console.error('Error in getKelasByCategory service:', error);
      throw new Error('Gagal mengambil kelas berdasarkan kategori');
    }
  },

  // Get kelas by level
  getKelasByLevel: async (level) => {
    try {
      // Validate level
      const validLevels = ['beginner', 'intermediate', 'advanced'];
      if (!validLevels.includes(level.toLowerCase())) {
        throw new Error('Level harus salah satu dari: beginner, intermediate, advanced');
      }
      
      return await Kelas.findByLevel(level.toLowerCase());
    } catch (error) {
      console.error('Error in getKelasByLevel service:', error);
      throw error;
    }
  },

  // Get kelas by instructor
  getKelasByInstructor: async (instructorData) => {
    try {
      // Support both instructor ID and instructor name
      if (isNaN(instructorData)) {
        // If it's a string, treat as instructor name
        return await Kelas.findByInstructorName(instructorData);
      } else {
        // If it's a number, treat as instructor ID
        return await Kelas.findByInstructor(parseInt(instructorData));
      }
    } catch (error) {
      console.error('Error in getKelasByInstructor service:', error);
      throw new Error('Gagal mengambil kelas berdasarkan instructor');
    }
  },

  // Get kelas by price range
  getKelasByPriceRange: async (minPrice, maxPrice) => {
    try {
      if (minPrice !== undefined && isNaN(minPrice)) {
        throw new Error('Harga minimum harus berupa angka');
      }
      if (maxPrice !== undefined && isNaN(maxPrice)) {
        throw new Error('Harga maksimum harus berupa angka');
      }
      if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        throw new Error('Harga minimum tidak boleh lebih besar dari harga maksimum');
      }

      return await Kelas.findByPriceRange(
        minPrice ? parseFloat(minPrice) : undefined,
        maxPrice ? parseFloat(maxPrice) : undefined
      );
    } catch (error) {
      console.error('Error in getKelasByPriceRange service:', error);
      throw error;
    }
  },

  // Get kelas by rating range
  getKelasByRating: async (minRating) => {
    try {
      if (minRating !== undefined && (isNaN(minRating) || minRating < 0 || minRating > 5)) {
        throw new Error('Rating minimum harus berupa angka antara 0-5');
      }

      return await Kelas.findByRating(minRating ? parseFloat(minRating) : undefined);
    } catch (error) {
      console.error('Error in getKelasByRating service:', error);
      throw new Error('Gagal mengambil kelas berdasarkan rating');
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

      // Validasi tipe data
      if (isNaN(kelasData.harga) || kelasData.harga <= 0) {
        throw new Error('Harga harus berupa angka positif');
      }

      if (isNaN(kelasData.tutor_id)) {
        throw new Error('tutor_id harus berupa angka');
      }

      if (isNaN(kelasData.kategori_id)) {
        throw new Error('kategori_id harus berupa angka');
      }

      // Validasi level jika ada
      if (kelasData.level) {
        const validLevels = ['beginner', 'intermediate', 'advanced'];
        if (!validLevels.includes(kelasData.level.toLowerCase())) {
          throw new Error('Level harus salah satu dari: beginner, intermediate, advanced');
        }
        kelasData.level = kelasData.level.toLowerCase();
      }

      // Validasi rating jika ada
      if (kelasData.rating !== undefined) {
        if (isNaN(kelasData.rating) || kelasData.rating < 0 || kelasData.rating > 5) {
          throw new Error('Rating harus berupa angka antara 0-5');
        }
      }

      // Validasi durasi jika ada
      if (kelasData.durasi !== undefined && isNaN(kelasData.durasi)) {
        throw new Error('Durasi harus berupa angka');
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

      // Validasi tipe data jika diupdate
      if (updateData.harga !== undefined) {
        if (isNaN(updateData.harga) || updateData.harga <= 0) {
          throw new Error('Harga harus berupa angka positif');
        }
      }

      if (updateData.tutor_id !== undefined && isNaN(updateData.tutor_id)) {
        throw new Error('tutor_id harus berupa angka');
      }

      if (updateData.kategori_id !== undefined && isNaN(updateData.kategori_id)) {
        throw new Error('kategori_id harus berupa angka');
      }

      // Validasi level jika diupdate
      if (updateData.level) {
        const validLevels = ['beginner', 'intermediate', 'advanced'];
        if (!validLevels.includes(updateData.level.toLowerCase())) {
          throw new Error('Level harus salah satu dari: beginner, intermediate, advanced');
        }
        updateData.level = updateData.level.toLowerCase();
      }

      // Validasi rating jika diupdate
      if (updateData.rating !== undefined) {
        if (isNaN(updateData.rating) || updateData.rating < 0 || updateData.rating > 5) {
          throw new Error('Rating harus berupa angka antara 0-5');
        }
      }

      // Validasi durasi jika diupdate
      if (updateData.durasi !== undefined && isNaN(updateData.durasi)) {
        throw new Error('Durasi harus berupa angka');
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

  // Get popular kelas (highest rated or most enrolled)
  getPopularKelas: async (limit = 10) => {
    try {
      return await Kelas.findPopular(parseInt(limit));
    } catch (error) {
      console.error('Error in getPopularKelas service:', error);
      throw new Error('Gagal mengambil kelas populer');
    }
  },

  // Get newest kelas
  getNewestKelas: async (limit = 10) => {
    try {
      return await Kelas.findNewest(parseInt(limit));
    } catch (error) {
      console.error('Error in getNewestKelas service:', error);
      throw new Error('Gagal mengambil kelas terbaru');
    }
  },

  // Get kelas statistics
  getKelasStats: async () => {
    try {
      return await Kelas.getStatistics();
    } catch (error) {
      console.error('Error in getKelasStats service:', error);
      throw new Error('Gagal mengambil statistik kelas');
    }
  },

  // Get filter options for frontend
  getFilterOptions: async () => {
    try {
      return await Kelas.getFilterOptions();
    } catch (error) {
      console.error('Error in getFilterOptions service:', error);
      throw new Error('Gagal mengambil opsi filter');
    }
  },

  // Bulk operations
  bulkCreateKelas: async (kelasArray) => {
    try {
      if (!Array.isArray(kelasArray) || kelasArray.length === 0) {
        throw new Error('Data kelas harus berupa array dan tidak boleh kosong');
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < kelasArray.length; i++) {
        try {
          const result = await kelasService.createKelas(kelasArray[i]);
          results.push(result);
        } catch (error) {
          errors.push({
            index: i,
            data: kelasArray[i],
            error: error.message
          });
        }
      }

      return {
        success: results,
        errors: errors,
        total_processed: kelasArray.length,
        successful: results.length,
        failed: errors.length
      };
    } catch (error) {
      console.error('Error in bulkCreateKelas service:', error);
      throw error;
    }
  },

  // Soft delete kelas (if you want to keep data but mark as deleted)
  softDeleteKelas: async (id) => {
    try {
      const existingKelas = await Kelas.findById(id);
      if (!existingKelas) {
        throw new Error(`Kelas with ID ${id} not found`);
      }

      return await Kelas.softDelete(id);
    } catch (error) {
      console.error('Error in softDeleteKelas service:', error);
      throw error;
    }
  },

  // Restore soft deleted kelas
  restoreKelas: async (id) => {
    try {
      return await Kelas.restore(id);
    } catch (error) {
      console.error('Error in restoreKelas service:', error);
      throw new Error('Gagal mengembalikan kelas');
    }
  },

  // Validate kelas data
  validateKelasData: (kelasData, isUpdate = false) => {
    const errors = [];

    if (!isUpdate) {
      // Required fields for creation
      const requiredFields = ['judul', 'deskripsi', 'harga', 'tutor_id', 'kategori_id'];
      const missingFields = requiredFields.filter(field => !kelasData[field]);
      
      if (missingFields.length > 0) {
        errors.push(`Field berikut harus diisi: ${missingFields.join(', ')}`);
      }
    }

    // Validate data types and values
    if (kelasData.harga !== undefined) {
      if (isNaN(kelasData.harga) || kelasData.harga <= 0) {
        errors.push('Harga harus berupa angka positif');
      }
    }

    if (kelasData.tutor_id !== undefined && isNaN(kelasData.tutor_id)) {
      errors.push('tutor_id harus berupa angka');
    }

    if (kelasData.kategori_id !== undefined && isNaN(kelasData.kategori_id)) {
      errors.push('kategori_id harus berupa angka');
    }

    if (kelasData.level) {
      const validLevels = ['beginner', 'intermediate', 'advanced'];
      if (!validLevels.includes(kelasData.level.toLowerCase())) {
        errors.push('Level harus salah satu dari: beginner, intermediate, advanced');
      }
    }

    if (kelasData.rating !== undefined) {
      if (isNaN(kelasData.rating) || kelasData.rating < 0 || kelasData.rating > 5) {
        errors.push('Rating harus berupa angka antara 0-5');
      }
    }

    if (kelasData.durasi !== undefined && isNaN(kelasData.durasi)) {
      errors.push('Durasi harus berupa angka');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
};

export default kelasService;