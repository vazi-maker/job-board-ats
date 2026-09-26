const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  downloadResume,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleCheck");
const upload = require("../middleware/upload");

// Job Seeker routes
router.post(
  "/:jobId/apply",
  protect,
  authorizeRoles("jobseeker"),
  upload.single("resume"),
  applyForJob
);
router.get("/my", protect, authorizeRoles("jobseeker"), getMyApplications);

// Employer routes
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("employer"),
  getApplicantsForJob
);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("employer"),
  updateApplicationStatus
);
router.get("/:id/resume", protect, authorizeRoles("employer"), downloadResume);

module.exports = router;
