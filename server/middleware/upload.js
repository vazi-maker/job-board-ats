const multer = require("multer");
const path = require("path");

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // e.g. resume-1234567890-john.pdf
    const uniqueSuffix = Date.now() + "-" + req.user.name.replace(/\s+/g, "-");
    cb(null, "resume-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed for resumes"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

module.exports = upload;
