import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from '../database/database.js';
import kelasRoutes from './routes/kelasRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/upload.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../upload')));

await testConnection();

// Routes
app.use('/api/kelas', kelasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes); 

app.get('/', (req, res) => {
  res.json({ message: 'Video Belajar API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});