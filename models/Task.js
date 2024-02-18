import mongoose from "mongoose";

// sub task model where deleted_at field will have null initially but after soft deleting the record the deleted_at will contain date at the time of deletion.
// Task status and priority will be updated and added based on cron job based on the scheduled time.

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide title"],
  },
  description: {
    type: String,
    required: [true, "Please provide description"],
  },
  due_date: {
    type: Date,
    required: [true, "Please provide due date"],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "please provide user"],
  },
  status: String,
  priority: Number,
  // created_at: { type: Date, default: moment().tz(IST) },
  // updated_at: { type: Date, default: moment().tz(IST) },
  // deleted_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});
// Middleware to update updated_at before saving
// TaskSchema.pre("save", function (next) {
//   this.updated_at = moment().tz(IST);
//   this.created_at = moment().tz(IST);
//   next();
// });
// Set the IST time zone
// const IST = 'Asia/Kolkata';

// // Middleware to convert due_date to IST before saving
// TaskSchema.pre('save', function (next) {
//   if (this.due_date) {
//     this.due_date = moment(this.due_date).tz(IST);
//   }
//   next();
// });

export default mongoose.model("Task", TaskSchema);
