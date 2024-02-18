import SubTask from "../models/SubTask.js";
import Task from "../models/Task.js";

// controller to get all tasks  || GET
// task_id and token is passed to get all the subtasks present.
const getAllSubTasks = async (req, res) => {
  try {
    const { task_id } = req.query;
    if (task_id) {
      const subtasks = await SubTask.find({ task_id });
      res.status(200).json(subtasks);
    } else {
      res.status(400).json({ message: "Task ID is required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// controller to create sub task || POST method.
// input task_id and token
const createSubTask = async (req, res) => {
  try {
    // req.body.task_id = req.query.task_id;

    // const subTask = await SubTask.create(req.body);
    const { task_id } = req.body;
    const newSubTask = new SubTask({
      task_id,
      status: 0,
    });
    await newSubTask.save();
    // upate status in task
    const task = await Task.findById(task_id);
    task.status = "TODO";
    await task.save();

    res.status(201).json({ message: "SubTask created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// controller to update || PUT method
const updateSubTask = async (req, res) => {
  try {
    const { status } = req.body;
    const subtaskId = req.params.id;

    const subtask = await SubTask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "SubTask not found" });
    }
    subtask.status = status;
    const task_id = subtask.task_id;
    await subtask.save();

    const subtasks = await SubTask.find({ task_id });

    let count = 0;
    subtasks.forEach(async (subTask) => {
      if (subTask.status == 1) {
        count = count + 1;
      }
    });

    const task = await Task.findById(task_id);
    if (count == subtasks.length) {
      task.status = "DONE";
    } else if (count > 0) {
      task.status = "IN PROGRESS";
    } else {
      task.status = "TODO";
    }
    await task.save();

    // upate status of parent TASK based on SUB TASK

    // if(status==0){
    //   const task=await Task.findById(task_id)

    // }
    res.status(200).json({ message: "SubTask updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// controller to delete || DELETE method
const deleteSubTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const subTask = await SubTask.findById(taskId);

    if (!subTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    subTask.deleted_at = new Date();
    const task_id = subTask.task_id;

    await subTask.save();

    // Task status update based on subtask status's
    const subtasks = await SubTask.find({ task_id });

    // count actual records after soft delete
    let totalSubTasksIgnoringSoftDelete = 0;
    // count stack status status to set task status
    let subTaskStatus = 0;
    subtasks.forEach(async (subTask) => {
      if (subTask.deleted_at == null) {
        totalSubTasksIgnoringSoftDelete += 1;
        if (subTask.status == 1) {
          subTaskStatus += 1;
        }
      }
    });

    const task = await Task.findById(task_id);
    if (totalSubTasksIgnoringSoftDelete == subTaskStatus) {
      task.status = "DONE";
    } else if (subTaskStatus > 0) {
      task.status = "IN PROGRESS";
    } else {
      task.status = "TODO";
    }
    await task.save();

    res
      .status(200)
      .json({ message: "Sub Task deleted successfully and update Task" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export { getAllSubTasks, createSubTask, updateSubTask, deleteSubTask };
