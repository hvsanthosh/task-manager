import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./db/connect.js";
// routes importing
import authRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";
import subTasksRouter from "./routes/subTasks.js";
import authenticateUser from "./middleware/authentication.js";
// cron logic
import { cronJobForPRiorityUpdateInTask } from "./utils/cronJobForPriorityUpdate.js";
import { twilioCallCronLogic } from "./utils/twilioUtils.js";
// configuring .env
dotenv.config();

// creating instance of express
const app = express();

// middleware
// morgan to log requests coming on console
app.use(morgan("combined"));

app.use(express.json());

// auth
app.use("/api/v1/auth", authRouter);
// Task
app.use("/api/v1/tasks", authenticateUser, tasksRouter);
// subtask
app.use("/api/v1/subtask", authenticateUser, subTasksRouter);

const port = process.env.PORT || 9000;

// calling DB and cron job to run every minute.
connectDB();
cronJobForPRiorityUpdateInTask();
twilioCallCronLogic();

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
