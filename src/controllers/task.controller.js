import { jsonResponse } from "../lib/json.response.js";
import Task from "../models/tasks.model.js";


class TaskController {

  async create(req, res) {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json(
        jsonResponse(400, {
          message: 'The title is required',
          success: false
        })
      )
    }

    try {
      const newTask = new Task({
        title,
        user: req.user._id
      });

      const task = await newTask.save();

      res.status(201).json(
        jsonResponse(201,
          {
            message: 'User created successfully',
            success: true,
            task: {
              ...task._doc,
              user: undefined
            },
          }
        )
      )
    } catch (err) {
      res.status(500).json(
        jsonResponse(500,
          {
            message: err.response,
            success: false
          }
        )
      )
    }
  }


  async getAllTasks(req, res) {

    try {
      const tasks = await Task.find({ user: req.user._id });
      res.status(200).json(
        jsonResponse(200,
          {
            message: 'User Tasks',
            success: true,
            tasks,
          }
        )
      )
    } catch (err) {
      res.status(500).json(
        jsonResponse(500,
          {
            message: err.response,
            success: false
          }
        )
      )
    }
  }

  async getTask(req, res) {
    const userId = req.user._id;
    const { id } = req.params;

    try {
      const task = await Task.findOne({ _id: id, user: userId });
      if (!task) {
        return res.status(404).json(
          jsonResponse(404, {
            message: 'Task not found',
            success: false
          })
        )
      }
      res.status(200).json(
        jsonResponse(200,
          {
            message: 'Task founded successfully',
            success: true,
            task,
          }
        )
      )
    } catch (err) {
      res.status(500).json(
        jsonResponse(500,
          {
            message: err.response,
            success: false
          }
        )
      )
    }
  }

  // update
  async update(req, res) {
    const { title } = req.body;
    const { id } = req.params;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json(
        jsonResponse(404, {
          message: 'Task not found',
          success: false
        })
      )
    }

    try {
      task.title = title || task.title;
      const newTask = await task.save();
      res.status(200).json(
        jsonResponse(200,
          {
            message: 'Task updated successfully',
            success: true,
            task: {
              ...newTask._doc,
              user: undefined
            },
          }
        )
      )
    } catch (err) {
      res.status(500).json(
        jsonResponse(500,
          {
            message: err.response,
            success: false
          }
        )
      )
    }
  }

  // completed
  async completed(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json(
        jsonResponse(404, {
          message: 'Task not found',
          success: false
        })
      )
    }
    try {
      task.completed = true;
      const updatedTask = await task.save();
      res.status(200).json(
        jsonResponse(200,
          {
            message: 'Task completed successfully',
            success: true,
            task: {
              ...updatedTask._doc,
              user: undefined
            },
          }
        )
      )
    } catch (err) {
      res.status(500).json(
        jsonResponse(500,
          {
            message: err.response,
            success: false
          }
        )
      )
    }
  }

  // unscompleted
  async uncompleted(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json(
        jsonResponse(404, {
          message: 'Task not found',
          success: false
        })
      )
    }
    try {
      task.completed = false;
      const updatedTask = await task.save();
      res.status(200).json(
        jsonResponse(200,
          {
            message: 'Task uncompleted successfully',
            success: true,
            task: {
              ...updatedTask._doc,
              user: undefined
            },
          }
        )
      )
    } catch (err) {
      res.status(500).json(
        jsonResponse(500,
          {
            message: err.response,
            success: false
          }
        )
      )
    }
  }

  // delete
  async delete(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json(
        jsonResponse(404, {
          message: 'Task not found',
          success: false
        })
      )
    }
    try {
      const taskDeleted = await Task.findOneAndDelete({ _id: id });
      res.status(200).json(
        jsonResponse(200,
          {
            message: 'Task deleted successfully',
            success: true,
            task: {
              ...taskDeleted._doc,
              user: undefined
            },
          }
        )
      )
    } catch (err) {
      res.status(500).json(
        jsonResponse(500,
          {
            message: err.response,
            success: false
          }
        )
      )
    }
  }

}

export default TaskController;