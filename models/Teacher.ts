import mongoose, { Schema } from "mongoose";

const TeacherSchema = new Schema(
  {
    fullName: { type: String, required: true },
    subject: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: { type: String, required: true },
    phoneNumber: {
      type: Number,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    classesToTeach: [{ type: [String], required: true }],
    isVerified: { type: Boolean, default: false },
    forgotPasswordToken: { type: String },
    forgotPasswordExpiry: { type: Date },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

const teacherModel =
  mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
export default teacherModel;
