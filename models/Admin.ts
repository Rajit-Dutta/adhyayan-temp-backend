import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    fullName: {type: String, required: true},
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    isVerified: { type: Boolean, default: false },
    forgotPasswordToken: { type: String },
    forgotPasswordExpiry: { type: Date },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
    rememberMeToken: { type: String },
    rememberMeExpiry: { type: Date },
  },
  { timestamps: true }
);

const adminModel =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default adminModel;
