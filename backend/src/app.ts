import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import authRoutes from './routes/auth.routes';
import leadsRoutes from './routes/leads.routes';
import { notFoundMiddleware } from './middleware/notFoundMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: ENV.JSON_BODY_LIMIT }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
