import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/tasks.js";

const router = express.Router();

// routes for creating  task and getting all the  tasks under the task.

router.route("/").post(createTask).get(getAllTasks);
// routes to delete or update particular sub task based on provided id parameter (req.prams.id)

router.route("/:id").delete(deleteTask).put(updateTask);
export default router;
