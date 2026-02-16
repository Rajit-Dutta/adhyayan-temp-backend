import mongoose, { Schema } from "mongoose";

const studentFeedbackSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    feedback: { type: String },
    performanceRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    strengths: [{ type: String }],
    areasForImprovement: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const studentFeedbackModel =
  mongoose.models.StudentFeedback ||
  mongoose.model("StudentFeedback", studentFeedbackSchema);

export default studentFeedbackModel;
