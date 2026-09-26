const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume is required"],
    },
    coverLetter: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Interview Scheduled",
        "Offer",
        "Rejected",
      ],
      default: "Applied",
    },
    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate applications to the same job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Auto-add initial status to history on creation
applicationSchema.pre("save", function (next) {
  if (this.isNew) {
    this.statusHistory.push({ status: "Applied", changedAt: new Date() });
  }
  next();
});

module.exports = mongoose.model("Application", applicationSchema);
