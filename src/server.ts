import 'reflect-metadata'; // Required for sequelize-typescript
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import sequelize from './lib/database';
import { corsMiddleware } from './middlewares/cors.middleware';
import { responseMiddleware } from './middlewares/response.middleware';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT);
if (!PORT) {
  throw new Error('PORT is not set');
}
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

// Initialize database connection
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('[Database] DB connected successfully');
    if (process.env.SYNC_DB !== 'false') {
      await sequelize.sync({ alter: true });
      console.log('[Database] Models synchronized');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

async function startServer() {
  await initializeDatabase();
  app.use('/api', routes);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('[Server] Failed to start server:', error);
  process.exit(1);
});


export default app;
