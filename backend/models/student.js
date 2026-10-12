    const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must contain at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
      ]
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Age must be at least 18"],
      max: [60, "Age cannot exceed 60"]
    },

    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", studentSchema);
