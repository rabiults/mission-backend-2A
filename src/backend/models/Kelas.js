import { query } from '../../database/database.js';

const Kelas = {
  findAll: async () => {
    try {
      const rows = await query(`
        SELECT 
          k.kelas_id,
          k.judul,
          k.deskripsi,
          k.harga,
          k.durasi,
          k.rating,
          k.created_at,
          k.updated_at,
          t.nama_tutor,
          t.bio as tutor_bio,
          t.avatar as tutor_avatar,
          kat.nama_kategori
        FROM kelas k
        LEFT JOIN tutor t ON k.tutor_id = t.tutor_id
        LEFT JOIN kategori kat ON k.kategori_id = kat.kategori_id
        ORDER BY k.created_at DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error in Kelas.findAll:', error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      if (!id) {
        throw new Error('ID is required');
      }

      const row = await query(`
        SELECT 
          k.kelas_id,
          k.judul,
          k.deskripsi,
          k.harga,
          k.durasi,
          k.rating,
          k.tutor_id,
          k.kategori_id,
          k.created_at,
          k.updated_at,
          t.nama_tutor,
          t.bio as tutor_bio,
          t.avatar as tutor_avatar,
          kat.nama_kategori
        FROM kelas k
        LEFT JOIN tutor t ON k.tutor_id = t.tutor_id
        LEFT JOIN kategori kat ON k.kategori_id = kat.kategori_id
        WHERE k.kelas_id = ?
      `, [id]);
      
      return row.length > 0 ? row[0] : null;
    } catch (error) {
      console.error('Error in Kelas.findById:', error);
      throw error;
    }
  },

  findByTitle: async (title) => {
    try {
      if (!title) {
        return null;
      }

      const row = await query(`
        SELECT kelas_id, judul
        FROM kelas 
        WHERE judul = ?
      `, [title]);
      
      return row.length > 0 ? row[0] : null;
    } catch (error) {
      console.error('Error in Kelas.findByTitle:', error);
      throw error;
    }
  },

  findByCategory: async (kategoriId) => {
    try {
      if (!kategoriId) {
        throw new Error('Category ID is required');
      }

      const rows = await query(`
        SELECT 
          k.kelas_id,
          k.judul,
          k.deskripsi,
          k.harga,
          k.durasi,
          k.rating,
          k.created_at,
          k.updated_at,
          t.nama_tutor,
          t.bio as tutor_bio,
          t.avatar as tutor_avatar,
          kat.nama_kategori
        FROM kelas k
        LEFT JOIN tutor t ON k.tutor_id = t.tutor_id
        LEFT JOIN kategori kat ON k.kategori_id = kat.kategori_id
        WHERE k.kategori_id = ?
        ORDER BY k.created_at DESC
      `, [kategoriId]);
      return rows;
    } catch (error) {
      console.error('Error in Kelas.findByCategory:', error);
      throw error;
    }
  },

  search: async (searchTerm) => {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return [];
      }

      const rows = await query(`
        SELECT 
          k.kelas_id,
          k.judul,
          k.deskripsi,
          k.harga,
          k.durasi,
          k.rating,
          k.created_at,
          k.updated_at,
          t.nama_tutor,
          t.bio as tutor_bio,
          t.avatar as tutor_avatar,
          kat.nama_kategori
        FROM kelas k
        LEFT JOIN tutor t ON k.tutor_id = t.tutor_id
        LEFT JOIN kategori kat ON k.kategori_id = kat.kategori_id
        WHERE k.judul LIKE ? OR k.deskripsi LIKE ? OR t.nama_tutor LIKE ?
        ORDER BY k.created_at DESC
      `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
      return rows;
    } catch (error) {
      console.error('Error in Kelas.search:', error);
      throw error;
    }
  },

  create: async (kelasData) => {
    try {
      if (!kelasData || typeof kelasData !== 'object') {
        throw new Error('Invalid kelas data');
      }

      const { judul, deskripsi, harga, durasi, tutor_id, kategori_id } = kelasData;
      if (!judul || !deskripsi || !harga || !durasi || !tutor_id || !kategori_id) {
        throw new Error('Missing required fields: judul, deskripsi, harga, durasi, tutor_id, kategori_id');
      }

      const result = await query(`
        INSERT INTO kelas (judul, deskripsi, harga, durasi, tutor_id, kategori_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [judul, deskripsi, harga, durasi, tutor_id, kategori_id]);

      if (!result.insertId) {
        throw new Error('Failed to create kelas');
      }

      const newKelas = await query(`
        SELECT 
          k.kelas_id,
          k.judul,
          k.deskripsi,
          k.harga,
          k.durasi,
          k.rating,
          k.tutor_id,
          k.kategori_id,
          k.created_at,
          k.updated_at,
          t.nama_tutor,
          t.bio as tutor_bio,
          t.avatar as tutor_avatar,
          kat.nama_kategori
        FROM kelas k
        LEFT JOIN tutor t ON k.tutor_id = t.tutor_id
        LEFT JOIN kategori kat ON k.kategori_id = kat.kategori_id
        WHERE k.kelas_id = ?
      `, [result.insertId]);

      return newKelas.length > 0 ? newKelas[0] : null;
    } catch (error) {
      console.error('Error in Kelas.create:', error);
      throw error;
    }
  },

  // Update kelas
  update: async (id, updateData) => {
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      
      if (!updateData || typeof updateData !== 'object') {
        throw new Error('Invalid update data');
      }

      const existingKelas = await Kelas.findById(id);
      if (!existingKelas) {
        throw new Error(`Kelas with ID ${id} not found`);
      }

      const fields = [];
      const values = [];
      
      if (updateData.judul !== undefined) {
        fields.push('judul = ?');
        values.push(updateData.judul);
      }
      if (updateData.deskripsi !== undefined) {
        fields.push('deskripsi = ?');
        values.push(updateData.deskripsi);
      }
      if (updateData.harga !== undefined) {
        fields.push('harga = ?');
        values.push(updateData.harga);
      }
      if (updateData.durasi !== undefined) {
        fields.push('durasi = ?');
        values.push(updateData.durasi);
      }
      if (updateData.tutor_id !== undefined) {
        fields.push('tutor_id = ?');
        values.push(updateData.tutor_id);
      }
      if (updateData.kategori_id !== undefined) {
        fields.push('kategori_id = ?');
        values.push(updateData.kategori_id);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      // Always update the updated_at timestamp
      fields.push('updated_at = NOW()');
      values.push(id); 

      const updateQuery = `
        UPDATE kelas 
        SET ${fields.join(', ')}
        WHERE kelas_id = ?
      `;

      const result = await query(updateQuery, values);
      
      if (result.affectedRows === 0) {
        throw new Error(`No kelas updated with ID ${id}`);
      }

      const updatedKelas = await query(`
        SELECT 
          k.kelas_id,
          k.judul,
          k.deskripsi,
          k.harga,
          k.durasi,
          k.rating,
          k.tutor_id,
          k.kategori_id,
          k.created_at,
          k.updated_at,
          t.nama_tutor,
          t.bio as tutor_bio,
          t.avatar as tutor_avatar,
          kat.nama_kategori
        FROM kelas k
        LEFT JOIN tutor t ON k.tutor_id = t.tutor_id
        LEFT JOIN kategori kat ON k.kategori_id = kat.kategori_id
        WHERE k.kelas_id = ?
      `, [id]);

      return updatedKelas.length > 0 ? updatedKelas[0] : null;
    } catch (error) {
      console.error('Error in Kelas.update:', error);
      throw error;
    }
  },

  // Delete kelas
  delete: async (id) => {
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      const kelasToDelete = await query(`
        SELECT 
          k.kelas_id,
          k.judul,
          k.deskripsi,
          k.harga,
          k.durasi,
          k.rating,
          k.created_at,
          k.updated_at,
          t.nama_tutor,
          kat.nama_kategori
        FROM kelas k
        LEFT JOIN tutor t ON k.tutor_id = t.tutor_id
        LEFT JOIN kategori kat ON k.kategori_id = kat.kategori_id
        WHERE k.kelas_id = ?
      `, [id]);

      if (!kelasToDelete || kelasToDelete.length === 0) {
        throw new Error(`Kelas with ID ${id} not found`);
      }

      const result = await query(`DELETE FROM kelas WHERE kelas_id = ?`, [id]);
      
      if (result.affectedRows === 0) {
        throw new Error(`No kelas deleted with ID ${id}`);
      }

      return kelasToDelete[0];
    } catch (error) {
      console.error('Error in Kelas.delete:', error);
      throw error;
    }
  },

  findByLevel: async (level) => {
    try {
      if (!level) {
        throw new Error('Level is required');
      }

      const rows = await query(`
        SELECT 
          k.kelas_id,
          k.judul,
          k.deskripsi,
          k.harga,
          k.durasi,
          k.rating,
          k.level,
          k.created_at,
          k.updated_at,
          t.nama_tutor,
          t.bio as tutor_bio,
          t.avatar as tutor_avatar,
          kat.nama_kategori
        FROM kelas k
        LEFT JOIN tutor t ON k.tutor_id = t.tutor_id
        LEFT JOIN kategori kat ON k.kategori_id = kat.kategori_id
        WHERE k.level = ?
        ORDER BY k.created_at DESC
      `, [level]);
      return rows;
    } catch (error) {
      console.error('Error in Kelas.findByLevel:', error);
      throw error;
    }
  },

  findByInstructor: async (tutorName) => {
    try {
      if (!tutorName || tutorName.trim() === '') {
        return [];
      }

      const rows = await query(`
        SELECT 
          k.kelas_id,
          k.judul,
          k.deskripsi,
          k.harga,
          k.durasi,
          k.rating,
          k.created_at,
          k.updated_at,
          t.nama_tutor,
          t.bio as tutor_bio,
          t.avatar as tutor_avatar,
          kat.nama_kategori
        FROM kelas k
        LEFT JOIN tutor t ON k.tutor_id = t.tutor_id
        LEFT JOIN kategori kat ON k.kategori_id = kat.kategori_id
        WHERE t.nama_tutor LIKE ?
        ORDER BY k.created_at DESC
      `, [`%${tutorName}%`]);
      return rows;
    } catch (error) {
      console.error('Error in Kelas.findByInstructor:', error);
      throw error;
    }
  },

  getAll: async () => {
    return await Kelas.findAll();
  },

  getById: async (id) => {
    return await Kelas.findById(id);
  },

  getByCategory: async (kategoriId) => {
    return await Kelas.findByCategory(kategoriId);
  }
};

export default Kelas;