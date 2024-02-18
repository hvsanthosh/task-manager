import mongoose from "mongoose";
// sub task model where deleted_at field will have null intitialy but after soft deleting the record the deleted_at will contain date at the time of deletion.
const SubTaskSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  status: Number,

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

export default mongoose.model("SubTask", SubTaskSchema);
