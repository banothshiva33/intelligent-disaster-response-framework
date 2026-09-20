import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import { sendSuccess } from './utils/apiResponse';
import { getDatabaseStatus } from './config/db';
import authRoutes from './routes/auth.routes';
import incidentRoutes from './routes/incident.routes';
import evidenceRoutes from './routes/evidence.routes';
import verificationRoutes from './routes/verification.routes';
import volunteerRoutes from './routes/volunteer.routes';
import allocationRoutes from './routes/allocation.routes';
import assignmentRoutes from './routes/assignment.routes';
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes';
import aiRoutes from './routes/ai.routes';
import seedRoutes from './routes/seed.routes';

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  sendSuccess(res, 200, 'RAAVA backend is running', {
    database: getDatabaseStatus()
  });
});

app.get('/api', (_req, res) => {
  sendSuccess(res, 200, 'RAAVA API ready', {
    name: 'RAAVA Intelligent Disaster Response Framework',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/allocation', allocationRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/seed', seedRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
