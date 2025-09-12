import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: { url: String, localPath: String },
      default: {
        url: ``,
        localPath: `https://placehold.co/200x200`,
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "🔴 Password is required!"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// hashing pre-hook()
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next; // only execute when password is being modified.
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
