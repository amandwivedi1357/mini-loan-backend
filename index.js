import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();


// const allowedOrigins = ['http://localhost:5173', 'https://loan-app-front.vercel.app'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       console.error(`CORS blocked for origin: ${origin}`);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, 
// };


const corsOptions = {
  origin: ['https://loan-app-front.vercel.app','https://loan-app-black.vercel.app'], // Your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // If cookies or authentication headers are needed
};
app.use(cors(corsOptions)); 
app.use(helmet());
app.use(express.json());
app.use(apiLimiter);

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the mini loan app API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
