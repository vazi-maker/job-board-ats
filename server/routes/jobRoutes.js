const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleCheck");

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Employer-only routes
router.get("/employer/my-jobs", protect, authorizeRoles("employer"), getMyJobs);
router.post("/", protect, authorizeRoles("employer"), createJob);
router.put("/:id", protect, authorizeRoles("employer"), updateJob);
router.delete("/:id", protect, authorizeRoles("employer"), deleteJob);

module.exports = router;
