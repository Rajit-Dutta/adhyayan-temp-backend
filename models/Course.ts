import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  subject: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  teachers: [{ type: Schema.Types.ObjectId, ref: "Teacher" }],
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  questionBank: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  assignments: [{ type: Schema.Types.ObjectId, ref: "Assignment" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const courseModel =
  mongoose.models.Course || mongoose.model("Course", courseSchema);
  
export default courseModel;
