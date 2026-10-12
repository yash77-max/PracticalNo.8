const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Student = require("./models/student");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MERN Backend is Running Successfully"
  });
});

// Get all students
app.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    next(error);
  }
});

// Add student
app.post("/api/students", async (req, res, next) => {
  try {
    const { name, email, age, course } = req.body;

    // Backend validation
    if (!name || !email || !age || !course) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check duplicate email
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    const student = await Student.create({
      name,
      email,
      age,
      course
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: student
    });
  } catch (error) {
    next(error);
  }
});

// Get student by ID
app.get("/api/students/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
      (error) => error.message
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID"
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value already exists"
    });
  }

  // General server error
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// Invalid route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
