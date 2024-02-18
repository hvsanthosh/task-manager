import cron from "node-cron";
import Task from "../models/Task.js";
import User from "../models/User.js";

// Cron Job for changing priority based on due date
const cronJobForPRiorityUpdateInTask = () => {
  // console.log("cron logic...");
  // cron job is scheduled to run every minute "* * * * *"
  
  cron.schedule("* * * * *", async () => {
    console.log("Cron updating priority based on due_date...");

    try {
      // Get all tasks
      // day zero
      const today = new Date();
      // day 1
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      // day 2
      const dayTwo = new Date();
      dayTwo.setDate(dayTwo.getDate() + 2);
      // day 3
      const dayThree = new Date();
      dayThree.setDate(dayThree.getDate() + 3);
      // day 4
      const dayFour = new Date();
      dayFour.setDate(dayFour.getDate() + 4);
      // day 5
      const dayFive = new Date();
      dayFive.setDate(dayFive.getDate() + 5);

      // get all tasks from collection
      const allTasks = await Task.find();
      // go trough all tasks and find its due_date and update priority accordingly
      allTasks.forEach(async (task) => {
        if (task.due_date >= today && task.due_date < tomorrow) {
          task.priority = 0;
          await task.save();
        } else if (task.due_date >= tomorrow && task.due_date < dayTwo) {
          task.priority = 1;

          await task.save();
        } else if (task.due_date >= dayTwo && task.due_date < dayThree) {
          task.priority = 2;

          await task.save();
        } else if (task.due_date >= dayFive) {
          task.priority = 3;

          await task.save();
        }
      });

      // get all users
      const allUsers = await User.find();

      // update priority for each user based on tasks
      // assigning priority based on the tasks priority. min value.
      allUsers.forEach(async (user) => {
        // get tasks of user
        const userTasks = await Task.find({ createdBy: user._id });

        const taskPriorities = userTasks.map((task) => task.priority);
        const minPriority = Math.min(...taskPriorities);
        user.priority = minPriority;
        // console.log(`${user.name} has priority ${user.priority}`);
        await user.save();
      });

      console.log("Priority updated successfully");
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  });
 
};

export { cronJobForPRiorityUpdateInTask };
