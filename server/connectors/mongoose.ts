import mongoose, { Schema, Document } from 'mongoose';
import { Priority } from '../../client/types';

// Define interfaces
interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date | null;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Todo schema
const TodoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, default: null },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },
  },
  { timestamps: true }
);

// Create a class to handle MongoDB operations with a similar API to Prisma
export class MongooseConnector {
  private Todo: mongoose.Model<ITodo>;
  private isConnected: boolean = false;

  constructor() {
    // Initialize the model
    this.Todo = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);
    this.connect();
  }

  // Connect to MongoDB
  private async connect() {
    if (this.isConnected) return;

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';
      await mongoose.connect(mongoUri);
      this.isConnected = true;
      console.log('Connected to MongoDB via Mongoose');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  // Define a todo property with methods similar to Prisma's API
  todo = {
    // Find all todos
    findMany: async (options?: { orderBy?: Record<string, 'asc' | 'desc'> }) => {
      try {
        let query = this.Todo.find();
        
        // Apply ordering
        if (options?.orderBy) {
          const orderField = Object.keys(options.orderBy)[0];
          const orderDirection = options.orderBy[orderField] === 'desc' ? -1 : 1;
          query = query.sort({ [orderField]: orderDirection });
        }
        
        const todos = await query.exec();
        
        // Convert Mongoose documents to plain objects
        return todos.map(todo => {
          const plainTodo = todo.toObject();
          return {
            ...plainTodo,
            id: (plainTodo._id as string).toString(),
          };
        });
      } catch (error) {
        console.error('Error in findMany:', error);
        throw error;
      }
    },

    // Find a todo by ID
    findUnique: async ({ where }: { where: { id: string } }) => {
      try {
        const todo = await this.Todo.findById(where.id).exec();
        
        if (!todo) return null;
        
        const plainTodo = todo.toObject();
        return {
          ...plainTodo,
          id: (plainTodo._id as string).toString(),
        };
      } catch (error) {
        console.error('Error in findUnique:', error);
        throw error;
      }
    },

    // Create a new todo
    create: async ({ data }: { data: Omit<ITodo, 'id' | 'createdAt' | 'updatedAt'> }) => {
      try {
        const todo = new this.Todo(data);
        await todo.save();
        
        const plainTodo = todo.toObject();
        return {
          ...plainTodo,
          id: (plainTodo._id as string).toString(),
        };
      } catch (error) {
        console.error('Error in create:', error);
        throw error;
      }
    },

    // Update a todo
    update: async ({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<Omit<ITodo, 'id' | 'createdAt' | 'updatedAt'>>;
    }) => {
      try {
        const todo = await this.Todo.findByIdAndUpdate(
          where.id,
          { $set: data },
          { new: true, runValidators: true }
        ).exec();
        
        if (!todo) {
          throw new Error('Todo not found');
        }
        
        const plainTodo = todo.toObject();
        return {
          ...plainTodo,
          id: (plainTodo._id as string).toString(),
        };
      } catch (error) {
        console.error('Error in update:', error);
        throw error;
      }
    },

    // Delete a todo
    delete: async ({ where }: { where: { id: string } }) => {
      try {
        const todo = await this.Todo.findByIdAndDelete(where.id).exec();
        
        if (!todo) {
          throw new Error('Todo not found');
        }
        
        const plainTodo = todo.toObject();
        return {
          ...plainTodo,
          id: (plainTodo._id as string).toString(),
        };
      } catch (error) {
        console.error('Error in delete:', error);
        throw error;
      }
    },
  };
}