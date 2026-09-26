const Application = require("../models/Application");
const Job = require("../models/Job");
const path = require("path");
const { sendEmail, statusUpdateEmailHtml } = require("../utils/sendEmail");

// @desc    Apply for a job (with resume upload)
// @route   POST /api/applications/:jobId/apply
// @access  Private (Job Seeker only)
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // Validate job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found or no longer active" });
    }

    // Check for duplicate application
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "You have already applied to this job" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload your resume (PDF)" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl: req.file.path,
      coverLetter: coverLetter || "",
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications for the logged-in job seeker
// @route   GET /api/applications/my
// @access  Private (Job Seeker only)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location type")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applicants for a specific job (employer view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    // Only the job owner can see applicants
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these applicants",
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email bio")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (employer)
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = [
      "Applied",
      "Under Review",
      "Interview Scheduled",
      "Offer",
      "Rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id)
      .populate("job", "title company postedBy")
      .populate("applicant", "name email");

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // Verify employer owns this job
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    application.status = status;
    application.statusHistory.push({ status, changedAt: new Date(), note: note || "" });
    await application.save();

    // Send email notification to applicant
    await sendEmail(
      application.applicant.email,
      `Application Update: ${application.job.title} at ${application.job.company}`,
      statusUpdateEmailHtml(
        application.applicant.name,
        application.job.title,
        application.job.company,
        status
      )
    );

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download applicant resume
// @route   GET /api/applications/:id/resume
// @access  Private (Employer only)
const downloadResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "job",
      "postedBy"
    );

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const resumePath = path.resolve(application.resumeUrl);
    res.download(resumePath, (err) => {
      if (err) {
        res
          .status(500)
          .json({ success: false, message: "Error downloading resume" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  downloadResume,
};
