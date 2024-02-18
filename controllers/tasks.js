import Task from "../models/Task.js";
import SubTask from "../models/SubTask.js";

// get all tasks. || GET
const getAllTasks = async (req, res) => {
  try {
    const createdBy = req.user.user_id;
    const tasks = await Task.find({ createdBy });
    res.status(200).json({ message: "All Tasks", tasks, count: tasks.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// create Task controller || POST
const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const createdBy = req.user.user_id;
    // console.log(req.user);
    // console.log(createdBy);
    // Set initial priority to the default value
    let priority = 0;

    // Calculate the difference in days between the due date and today
    const today = new Date();
    const dueDate = new Date(due_date);
    const timeDifference = dueDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    // console.log(daysDifference);
    // Set priority based on the days difference

    if (daysDifference >= 0 && daysDifference <= 1) {
      priority = 0;
    } else if (daysDifference >= 1 && daysDifference <= 2) {
      priority = 1;
    } else if (daysDifference >= 3 && daysDifference <= 4) {
      priority = 2;
    } else {
      priority = 3;
    }

    const newTask = new Task({
      title,
      description,
      due_date,
      priority,
      status: "TODO",
      createdBy,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update task || Put
const updateTask = async (req, res) => {
  try {
    const { due_date, status } = req.body;
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.due_date = due_date || task.due_date;
    task.status = status || task.status;

    await task.save();
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// delete task controller || DELETE
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const task_id = task._id;
    // delete sub tasks when task is deleted.
    const subTasks = await SubTask.find({ task_id });
    subTasks.forEach(async (sTask) => {
      sTask.deleted_at = new Date();
      await sTask.save();
    });

    task.deleted_at = new Date();
    await task.save();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export { getAllTasks, createTask, updateTask, deleteTask };
