import mongoose, { Schema } from "mongoose";

const batchSchema = new Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    standard: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student", required: true }],
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    status:{ type: String, enum: ["Active", "Inactive"], default: "active" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const batchModel =
  mongoose.models.Batch || mongoose.model("Batch", batchSchema);
export default batchModel;
