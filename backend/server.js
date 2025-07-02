import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",  // frontend origin (NO "*")
  credentials: true                 // allow cookies / auth headers
}));

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
