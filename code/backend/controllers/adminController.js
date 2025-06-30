const bcrypt = require("bcryptjs");

// Admin reset user password
const adminResetPasswordController = async (req, res) => {
  const { userid } = req.params;
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).send({ success: false, message: "Password must be at least 6 characters." });
  }
  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const user = await userSchema.findByIdAndUpdate(userid, { password: hashed });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    res.status(200).send({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
// Get all enrolled courses (for admin dashboard)
const getAllEnrolledCoursesController = async (req, res) => {
  try {
    const enrolled = await enrolledCourseSchema.find().populate('userId', 'name email').populate('courseId', 'title');
    res.status(200).send({ success: true, data: enrolled });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Get all course payments (for admin dashboard)
const getAllPaymentsController = async (req, res) => {
  try {
    const payments = await coursePaymentSchema.find().populate('userId', 'name email').populate('courseId', 'title');
    res.status(200).send({ success: true, data: payments });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");
const ActivityLog = require('../schemas/activityLogModel');

const jwt = require("jsonwebtoken");
const adminLoginController = async (req, res) => {
  const { username, password } = req.body;
  // For demo: hardcoded admin credentials
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Issue JWT token
    const token = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_KEY, { expiresIn: "1d" });
    // Log admin login activity
    await ActivityLog.create({ action: 'login', role: 'Admin', email: username });
    return res.status(200).send({ success: true, token, message: "Admin login successful" });
  } else {
    return res.status(401).send({ success: false, message: "Invalid admin credentials" });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find();
    if (allUsers == null || !allUsers) {
      return res.status(401).send({ message: "No users found" });
    }
    res.status(200).send({ success: true, data: allUsers });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find();
    if (allCourses == null || !allCourses) {
      return res.status(401).send({ message: "No courses found" });
    }
    res.status(200).send({ success: true, data: allCourses });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

const deleteCourseController = async (req, res) => {
  const { courseid } = req.params; // Use the correct parameter name
  try {
    // Attempt to delete the course by its ID
    const course = await courseSchema.findByIdAndDelete({ _id: courseid });

    // Check if the course was found and deleted successfully
    if (course) {
      res
        .status(200)
        .send({ success: true, message: "Course deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Course not found" });
    }
  } catch (error) {
    console.error("Error in deleting course:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to delete course" });
  }
};

const deleteUserController = async (req, res) => {
  const { userid } = req.params; // Use the correct parameter name
  try {
    // Attempt to delete the user by its ID
    const user = await userSchema.findByIdAndDelete({ _id: userid });

    // Check if the user was found and deleted successfully
    if (user) {
      res
        .status(200)
        .send({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error in deleting user:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsersController,
  getAllCoursesController,
  deleteCourseController,
  deleteUserController,
  adminLoginController,
  getAllEnrolledCoursesController,
  getAllPaymentsController,
  adminResetPasswordController,
};
