import Task from '../models/Task.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res, next) => {
  try {
    const { search, priority, status } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const tasks = await Task.find(query);

    // Specified Feature: High Priority tasks must appear before Normal Priority tasks
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    tasks.sort((a, b) => {
      const weightA = priorityWeights[a.priority?.toLowerCase()] || 2;
      const weightB = priorityWeights[b.priority?.toLowerCase()] || 2;
      if (weightB !== weightA) {
        return weightB - weightA; // High (3) appears before Medium (2) and Low (1)
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Task title is required');
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      status: status || 'todo',
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    let task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (title !== undefined) {
      if (!title.trim()) {
        res.status(400);
        throw new Error('Task title cannot be empty');
      }
      task.title = title.trim();
    }
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (drag and drop)
// @route   PATCH /api/tasks/:id/status
// @access  Public
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['todo', 'in_progress', 'completed'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Allowed: todo, in_progress, completed');
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
