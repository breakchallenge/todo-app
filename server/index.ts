import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { todoRoutes } from './routes/todo.routes';
import { PrismaClient } from '@prisma/client';
import { MongooseConnector } from './connectors/mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Determine if we're using Mongoose or Prisma
const useMongoose = process.env.USE_MONGOOSE === 'true';

const server: FastifyInstance = Fastify({
  logger: true,
});

// Register CORS to allow requests from the frontend
server.register(cors, {
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Ensure PUT is included
});

// Create database connection
let db: PrismaClient | MongooseConnector;

if (useMongoose) {
  console.log('Using Mongoose for database connection');
  db = new MongooseConnector();
} else {
  console.log('Using Prisma for database connection');
  db = new PrismaClient();
}

// Add database to fastify instance
server.decorate('db', db);

// Add type augmentation for Fastify
declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient | MongooseConnector;
  }
}

// Register routes
server.register(todoRoutes, { prefix: '/api' });

// Health check route
server.get('/health', async () => {
  return { status: 'ok' };
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();