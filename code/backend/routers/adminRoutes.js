const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllCoursesController,
  deleteCourseController,
  deleteUserController,
} = require("../controllers/adminController");

const router = express.Router();

// Admin login route (no auth middleware)
const { adminLoginController } = require("../controllers/adminController");
router.post("/login", adminLoginController);


router.get("/getallusers", authMiddleware, getAllUsersController);
router.get("/enrolled-courses", authMiddleware, require("../controllers/adminController").getAllEnrolledCoursesController);
router.get("/payments", authMiddleware, require("../controllers/adminController").getAllPaymentsController);

router.get("/getallcourses", authMiddleware, getAllCoursesController);

router.delete('/deletecourse/:courseid', authMiddleware, deleteCourseController)

router.delete('/deleteuser/:cuserid', authMiddleware, deleteUserController)

// Admin reset user password
router.post('/reset-password/:userid', authMiddleware, require("../controllers/adminController").adminResetPasswordController)

module.exports = router;
