import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    subject: {type:Schema.Types.ObjectId, ref: "Course", required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "Student", required: true }],
    assignedBy: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    totalMarks: { type: Number, required: true },
    questionPaperLink: { type: String, required: true },
    isSubmissionInClass: { type: Boolean, default: false },
    isSubmissionOpen: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const assignmentModel =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export default assignmentModel;
