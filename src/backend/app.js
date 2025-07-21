import express from 'express';
import cors from 'cors';
import { testConnection } from '../database/database.js';
import kelasRoutes from './routes/kelasRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
await testConnection();

// Routes
app.use('/api/kelas', kelasRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Video Belajar API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});