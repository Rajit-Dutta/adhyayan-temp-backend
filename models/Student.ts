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
    parentName: { type: String, required: true },
    parentPhone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "please use a valid phone number"],
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
    subjects: { type: String },
    batch: [{ type: Schema.Types.ObjectId, ref: "Batch" }],
    address: { type: String, required: true },
    DOB: { type: Date, required: true },
    bloodGroup: { type: String, required: true },
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
