import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { MongooseConnector } from '../connectors/mongoose';

// Define todo input validation schema with Zod
const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  dueDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

// Define update schema for partial updates
const todoUpdateSchema = todoSchema.partial();

// Define param schema for route parameters
const paramsSchema = z.object({
  id: z.string().min(1),
});

// Type for route handlers
type TodoHandler = (
  request: FastifyRequest<{
    Body?: any;
    Params?: any;
  }>,
  reply: FastifyReply
) => Promise<any>;

// Define route handlers
export const todoRoutes = async (fastify: FastifyInstance) => {
  const db = fastify.db as PrismaClient | MongooseConnector;

  // Get all todos
  const getAllTodos: TodoHandler = async (request, reply) => {
    try {
      const todos = await db.todo.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return todos;
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to get todos' });
    }
  };

  // Get todo by id
  const getTodoById: TodoHandler = async (request, reply) => {
    try {
      const { id } = paramsSchema.parse(request.params);
      
      const todo = await db.todo.findUnique({
        where: { id },
      });
      
      if (!todo) {
        return reply.status(404).send({ error: 'Todo not found' });
      }
      
      return todo;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors });
      }
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to get todo' });
    }
  };

  // Create todo
  const createTodo: TodoHandler = async (request, reply) => {
    try {
      const todoData = todoSchema.parse(request.body);
      
      const todo = await db.todo.create({
        data: todoData,
      });
      
      return reply.status(201).send(todo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors });
      }
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to create todo' });
    }
  };

  // Update todo
  const updateTodo: TodoHandler = async (request, reply) => {
    try {
      const { id } = paramsSchema.parse(request.params);
      const updates = todoUpdateSchema.parse(request.body);
      
      // Check if todo exists
      const existingTodo = await db.todo.findUnique({
        where: { id },
      });
      
      if (!existingTodo) {
        return reply.status(404).send({ error: 'Todo not found' });
      }
      
      // Update todo
      const updatedTodo = await db.todo.update({
        where: { id },
        data: updates,
      });
      
      return updatedTodo;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors });
      }
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to update todo' });
    }
  };

  // Delete todo
  const deleteTodo: TodoHandler = async (request, reply) => {
    try {
      const { id } = paramsSchema.parse(request.params);
      
      // Check if todo exists
      const existingTodo = await db.todo.findUnique({
        where: { id },
      });
      
      if (!existingTodo) {
        return reply.status(404).send({ error: 'Todo not found' });
      }
      
      // Delete todo
      await db.todo.delete({
        where: { id },
      });
      
      return reply.status(200).send({ message: 'Todo deleted successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors });
      }
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete todo' });
    }
  };

  // Register routes
  fastify.get('/todos', getAllTodos);
  fastify.get('/todos/:id', getTodoById);
  fastify.post('/todos', createTodo);
  fastify.put('/todos/:id', updateTodo);
  fastify.delete('/todos/:id', deleteTodo);
};