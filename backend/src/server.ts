import { connectDB } from './config/database';
import { ENV } from './config/env';
import app from './app';

const start = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(ENV.PORT, () => {
    console.log(`Server running on http://localhost:${ENV.PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    shutdown();
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    shutdown();
  });
};

start();

