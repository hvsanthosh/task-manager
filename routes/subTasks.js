import express from "express";
import {
  createSubTask,
  deleteSubTask,
  getAllSubTasks,
  updateSubTask,
} from "../controllers/subTasks.js";

const router = express.Router();

// routes for creating sub task and getting all the sub tasks under the task.
router.route("/").post(createSubTask).get(getAllSubTasks);
// routes to delete or update particular sub task based on provided id parameter (req.prams.id)
router.route("/:id").delete(deleteSubTask).put(updateSubTask);
export default router;
