import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';


import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import chatRoutes from './routes/chat.routes.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  'https://chatsphereapp.vercel.app',
  'http://localhost:5173',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
import socketHandler from './socket.js';
socketHandler(io);

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('MongoDB connected');
  server.listen(5000, () => console.log('Server running on port 5000'));
});
