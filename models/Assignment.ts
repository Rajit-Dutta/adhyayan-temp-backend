import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "Batch", required: true }],
    assignedBy: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    totalMarks: { type: String, required: true },
    questionPaperLink: { type: String, required: true },
    isSubmissionInClass: { type: Boolean, default: false },
    isSubmissionOpen: { type: Boolean, default: true },
    submitCount: { type: Number, default: 0 },
    checkCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const assignmentModel =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export default assignmentModel;
