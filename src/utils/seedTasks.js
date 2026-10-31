import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task.js';
import connectDB from '../config/db.js';

dotenv.config();

const sampleTasks = [
  {
    title: 'Research Competitor Kanban Features',
    description: 'Review Jira, Trello, and Linear for essential productivity features.',
    priority: 'low',
    status: 'todo',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    title: 'Implement Dark / Light Theme Toggle',
    description: 'Create Tailwind dark mode classes and integrate with theme context.',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Design Drag & Drop Interactions',
    description: 'Configure @dnd-kit sensors, collision algorithms, and card drag overlay.',
    priority: 'high',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Write REST API Endpoints',
    description: 'Create GET, POST, PUT, PATCH, and DELETE routes for task management.',
    priority: 'high',
    status: 'completed',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Setup Database Connection & Mongoose Schemas',
    description: 'Connect Express server to MongoDB Atlas and configure schema indexes.',
    priority: 'medium',
    status: 'completed',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const seedData = async () => {
  try {
    await connectDB();
    await Task.deleteMany({});
    console.log('🧹 Existing tasks cleared.');

    const created = await Task.insertMany(sampleTasks);
    console.log(`🌱 Successfully seeded ${created.length} sample tasks!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
