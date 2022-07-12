import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import linkRoutes from './routes/links.js';
import fileRoutes from './routes/files.js';

// Crear el servidor
const app = express();

// Variables de entorno
dotenv.config();

// Conectar la base de datos
connectDB();

// Habilitar CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true
};

app.use(cors(corsOptions));

// Puerto de la app
const port = process.env.PORT || 4000;

// Habilitar req.body
app.use(express.json());

// Habilitar carpeta publica
app.use(express.static('uploads'));

// Rutas de la app
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/files', fileRoutes);

// Iniciar la app
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});