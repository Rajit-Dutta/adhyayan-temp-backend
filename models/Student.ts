import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "please use a valid email address"],
    },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    standard: { type: String, required: true },
    coursesEnrolled: { type: Number },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "please use a valid phone number"],
    },
    remarks: { type: String },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    batch: { type: Schema.Types.ObjectId, ref: "Batch" },
    forgotPasswordToken: { type: String },
    forgotPasswordExpiry: { type: Date },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
    rememberMeToken: { type: String },
    rememberMeExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

const studentModel =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default studentModel;
