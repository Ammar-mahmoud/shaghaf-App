const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: [true, "user name must"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "phone must"],
      unique: [true, "phone must be unique"],
    },
    password: {
      type: String,
      required: [true, "password must"],
      minlength: [6, "password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "worker", "manager"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verificationExpires: Date,
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
