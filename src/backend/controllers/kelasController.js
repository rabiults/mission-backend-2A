import kelasService from '../services/kelasService.js';
import Kelas from '../models/kelas.js';
import { query } from '../../database/database.js';

const kelasController = {

  getAllKelas: async (req, res) => {
    try {
      console.log('GET /api/kelas - Getting all kelas with filters');
      console.log('Query params:', req.query);
      
      const {
        // Filtering
        category,
        search,
        level,
        instructor,
        minPrice,
        maxPrice,
        minRating,
        
        // Sorting
        sortBy,
        sortOrder,
        
        // Pagination
        page = 1,
        limit = 10
      } = req.query;

      // Calculate offset for pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Prepare filters object
      const filters = {
        category,
        search,
        level,
        instructor,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        sortBy,
        sortOrder,
        limit: parseInt(limit),
        offset
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined || filters[key] === '') {
          delete filters[key];
        }
      });

      let kelas;
      let total;

      if (Object.keys(filters).length > 0) {
        kelas = await Kelas.findWithFilters(filters);
        total = await Kelas.getCountWithFilters(filters);
      } else {
        if (search) {
          kelas = await kelasService.searchKelas(search);
          total = kelas.length;
        } else if (category) {
          kelas = await kelasService.getKelasByCategory(category);
          total = kelas.length;
        } else if (level) {
          kelas = await kelasService.getKelasByLevel(level);
          total = kelas.length;
        } else if (instructor) {
          kelas = await kelasService.getKelasByInstructor(instructor);
          total = kelas.length;
        } else {
          kelas = await kelasService.getAllKelas();
          total = kelas.length;
        }
      }

      // Calculate pagination info
      const totalPages = Math.ceil(total / parseInt(limit));
      const currentPage = parseInt(page);

      res.status(200).json({
        success: true,
        message: 'Data kelas berhasil diambil',
        data: kelas,
        pagination: {
          current_page: currentPage,
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit),
          has_next: currentPage < totalPages,
          has_prev: currentPage > 1
        },
        filters: {
          applied: filters,
          available_sorts: ['created_at', 'updated_at', 'judul', 'harga', 'rating', 'durasi'],
          available_orders: ['ASC', 'DESC']
        }
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

      if (kelasData.level) {
        const validLevels = ['beginner', 'intermediate', 'advanced'];
        if (!validLevels.includes(kelasData.level.toLowerCase())) {
          return res.status(400).json({
            success: false,
            message: 'Level harus salah satu dari: beginner, intermediate, advanced'
          });
        }
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

      // Validate level if provided
      if (updateData.level) {
        const validLevels = ['beginner', 'intermediate', 'advanced'];
        if (!validLevels.includes(updateData.level.toLowerCase())) {
          return res.status(400).json({
            success: false,
            message: 'Level harus salah satu dari: beginner, intermediate, advanced'
          });
        }
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

  // GET /api/kelas/search?q=searchTerm - Legacy search endpoint
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
  },

  // GET /api/kelas/category/:category - Get kelas by category
  getKelasByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      console.log(`GET /api/kelas/category/${category} - Getting kelas by category`);
      
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Parameter kategori diperlukan'
        });
      }

      const kelas = await kelasService.getKelasByCategory(category);

      res.status(200).json({
        success: true,
        message: 'Data kelas berdasarkan kategori berhasil diambil',
        data: kelas,
        total: kelas.length
      });
    } catch (error) {
      console.error('Error in getKelasByCategory:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kelas berdasarkan kategori',
        error: error.message
      });
    }
  },

  // GET /api/kelas/level/:level - Get kelas by level
  getKelasByLevel: async (req, res) => {
    try {
      const { level } = req.params;
      console.log(`GET /api/kelas/level/${level} - Getting kelas by level`);
      
      if (!level) {
        return res.status(400).json({
          success: false,
          message: 'Parameter level diperlukan'
        });
      }

      const validLevels = ['beginner', 'intermediate', 'advanced'];
      if (!validLevels.includes(level.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Level harus salah satu dari: beginner, intermediate, advanced'
        });
      }

      const kelas = await kelasService.getKelasByLevel(level);

      res.status(200).json({
        success: true,
        message: 'Data kelas berdasarkan level berhasil diambil',
        data: kelas,
        total: kelas.length
      });
    } catch (error) {
      console.error('Error in getKelasByLevel:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kelas berdasarkan level',
        error: error.message
      });
    }
  },

  // GET /api/kelas/instructor/:instructorId - Get kelas by instructor
  getKelasByInstructor: async (req, res) => {
    try {
      const { instructorId } = req.params;
      console.log(`GET /api/kelas/instructor/${instructorId} - Getting kelas by instructor`);
      
      if (!instructorId || isNaN(instructorId)) {
        return res.status(400).json({
          success: false,
          message: 'ID instructor tidak valid'
        });
      }

      const kelas = await kelasService.getKelasByInstructor(instructorId);

      res.status(200).json({
        success: true,
        message: 'Data kelas berdasarkan instructor berhasil diambil',
        data: kelas,
        total: kelas.length
      });
    } catch (error) {
      console.error('Error in getKelasByInstructor:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kelas berdasarkan instructor',
        error: error.message
      });
    }
  },

  // GET /api/kelas/filters - Get available filter options
  getFilterOptions: async (req, res) => {
    try {
      console.log('GET /api/kelas/filters - Getting filter options');
      
      // Get unique categories
      const categories = await query(`
        SELECT DISTINCT kat.kategori_id, kat.nama_kategori 
        FROM kategori kat 
        INNER JOIN kelas k ON kat.kategori_id = k.kategori_id
        ORDER BY kat.nama_kategori
      `);

      // Get unique levels
      const levels = await query(`
        SELECT DISTINCT level 
        FROM kelas 
        WHERE level IS NOT NULL 
        ORDER BY level
      `);

      // Get unique instructors
      const instructors = await query(`
        SELECT DISTINCT t.tutor_id, t.nama_tutor 
        FROM tutor t 
        INNER JOIN kelas k ON t.tutor_id = k.tutor_id
        ORDER BY t.nama_tutor
      `);

      // Get price range
      const priceRange = await query(`
        SELECT MIN(harga) as min_price, MAX(harga) as max_price 
        FROM kelas
      `);

      // Get rating range
      const ratingRange = await query(`
        SELECT MIN(rating) as min_rating, MAX(rating) as max_rating 
        FROM kelas 
        WHERE rating IS NOT NULL
      `);

      res.status(200).json({
        success: true,
        message: 'Filter options berhasil diambil',
        data: {
          categories: categories || [],
          levels: levels?.map(l => l.level) || [],
          instructors: instructors || [],
          price_range: {
            min: priceRange[0]?.min_price || 0,
            max: priceRange[0]?.max_price || 0
          },
          rating_range: {
            min: ratingRange[0]?.min_rating || 0,
            max: ratingRange[0]?.max_rating || 5
          },
          sort_options: [
            { field: 'created_at', label: 'Tanggal Dibuat' },
            { field: 'updated_at', label: 'Tanggal Diupdate' },
            { field: 'judul', label: 'Judul' },
            { field: 'harga', label: 'Harga' },
            { field: 'rating', label: 'Rating' },
            { field: 'durasi', label: 'Durasi' }
          ],
          sort_orders: [
            { value: 'ASC', label: 'Ascending' },
            { value: 'DESC', label: 'Descending' }
          ]
        }
      });
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil filter options',
        error: error.message
      });
    }
  },

  getKelasStats: async (req, res) => {
    try {
      console.log('GET /api/kelas/stats - Getting kelas statistics');
      
      // Get total count
      const totalCount = await query(`SELECT COUNT(*) as total FROM kelas`);
      
      // Get count by category
      const categoryStats = await query(`
        SELECT kat.nama_kategori, COUNT(k.kelas_id) as jumlah
        FROM kategori kat
        LEFT JOIN kelas k ON kat.kategori_id = k.kategori_id
        GROUP BY kat.kategori_id, kat.nama_kategori
        ORDER BY jumlah DESC
      `);
      
      // Get count by level
      const levelStats = await query(`
        SELECT level, COUNT(*) as jumlah
        FROM kelas
        WHERE level IS NOT NULL
        GROUP BY level
        ORDER BY jumlah DESC
      `);
      
      // Get average rating
      const avgRating = await query(`
        SELECT AVG(rating) as rata_rata_rating
        FROM kelas
        WHERE rating IS NOT NULL
      `);
      
      // Get price statistics
      const priceStats = await query(`
        SELECT 
          MIN(harga) as harga_minimum,
          MAX(harga) as harga_maksimum,
          AVG(harga) as rata_rata_harga
        FROM kelas
      `);

      res.status(200).json({
        success: true,
        message: 'Statistik kelas berhasil diambil',
        data: {
          total_kelas: totalCount[0]?.total || 0,
          kategori_stats: categoryStats || [],
          level_stats: levelStats || [],
          rata_rata_rating: parseFloat(avgRating[0]?.rata_rata_rating || 0).toFixed(2),
          harga_stats: {
            minimum: priceStats[0]?.harga_minimum || 0,
            maksimum: priceStats[0]?.harga_maksimum || 0,
            rata_rata: parseFloat(priceStats[0]?.rata_rata_harga || 0).toFixed(2)
          }
        }
      });
    } catch (error) {
      console.error('Error in getKelasStats:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil statistik kelas',
        error: error.message
      });
    }
  }
};

export default kelasController;