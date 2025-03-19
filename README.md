# Todo Application

A full-stack Todo application built with Next.js, Fastify, and MongoDB.

## Features

- Create, read, update, and delete todo items
- Mark todos as complete/incomplete
- Set priority levels for todos
- Add due dates to todos
- Filter by status (all, active, completed)

## Tech Stack

- **Frontend**: Next.js with React and Tailwind CSS
- **Backend**: Fastify API server
- **Database**: MongoDB
- **ORM Options**: 
  - Prisma (with MongoDB replica set)
  - Mongoose (simpler setup)

## Prerequisites

- Node.js (v16+)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Getting Started

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a data directory for MongoDB:
   ```bash
   mkdir -p data/db
   ```

4. Create a `.env` file in the project root:
   ```
   # For Mongoose approach (recommended for simplicity)
   USE_MONGOOSE=true
   MONGODB_URI=mongodb://localhost:27017/todo-app
   PORT=8080
   
   # OR for Prisma approach (requires MongoDB replica set)
   # DATABASE_URL="mongodb://localhost:27017/todo-app?replicaSet=rs0"
   # PORT=8080
   ```

### Running the Application

#### Using Mongoose (recommended for simplicity)

1. Start MongoDB in one terminal:
   ```bash
   mongod --dbpath data/db
   ```

2. Start the backend server in another terminal:
   ```bash
   npm run dev:server
   ```

3. Start the frontend in a third terminal:
   ```bash
   npm run dev:client
   ```

4. Access the application at [http://localhost:3000](http://localhost:3000)

#### Using Prisma (requires MongoDB replica set)

1. Start MongoDB with replica set in one terminal:
   ```bash
   mongod --replSet rs0 --dbpath data/db
   ```

2. Initialize the replica set (one-time setup) in another terminal:
   ```bash
   mongosh --eval "rs.initiate()"
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Start the backend server:
   ```bash
   npm run dev:server
   ```

5. Start the frontend:
   ```bash
   npm run dev:client
   ```

## Project Structure

```
todo-app/
├── client/             # Next.js frontend
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   ├── styles/         # CSS styles
│   └── types/          # TypeScript type definitions
├── server/             # Fastify backend
│   ├── connectors/     # Database connectors (Prisma/Mongoose)
│   ├── routes/         # API routes
│   └── index.ts        # Server entry point
├── prisma/             # Prisma schema and migrations
├── data/db/            # MongoDB data (gitignored)
├── .env                # Environment variables (gitignored)
└── README.md           # This file
```

## API Endpoints

| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | /api/todos     | Get all todos         |
| GET    | /api/todos/:id | Get a specific todo   |
| POST   | /api/todos     | Create a todo         |
| PUT    | /api/todos/:id | Update a todo         |
| DELETE | /api/todos/:id | Delete a todo         |

## Development Notes

### Switching Between Database Connectors

The application supports both Prisma and Mongoose connectors for MongoDB. Prisma provides more type safety but requires a MongoDB replica set, while Mongoose offers a simpler setup.

To switch between them, modify the `USE_MONGOOSE` environment variable in your `.env` file:

- For Mongoose: `USE_MONGOOSE=true`
- For Prisma: `USE_MONGOOSE=false` or omit the variable

### Troubleshooting

- If you see MongoDB lock file errors, ensure all MongoDB processes are terminated and delete the lock file (`data/db/mongod.lock`).
- For CORS issues, check that the backend server is running and configured to accept requests from the frontend.
- If Prisma initialization fails, ensure your MongoDB is running with replica set enabled.

## License

MIT
