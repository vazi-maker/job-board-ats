import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  IndianRupee,
  Building2,
  Calendar,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  Send,
  X,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);
      } catch {
        toast.error("Job not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  // Check if seeker already applied
  useEffect(() => {
    const checkApplication = async () => {
      if (user?.role !== "jobseeker") return;
      try {
        const { data } = await api.get("/applications/my");
        const applied = data.applications.some((app) => app.job?._id === id);
        setAlreadyApplied(applied);
      } catch {
        // Ignore silently
      }
    };
    checkApplication();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile) return toast.error("Please attach your resume (PDF)");
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("coverLetter", coverLetter);
      await api.post(`/applications/${id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Application submitted successfully! 🎉");
      setShowModal(false);
      setAlreadyApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="glass-card p-8 space-y-4">
          <div className="h-10 bg-slate-200 rounded-lg w-2/3" />
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-20 bg-slate-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all opportunities
      </Link>

      {/* Main Job Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50 relative overflow-hidden"
      >
        {/* Accent top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600" />

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-brand-500/20 shrink-0">
              {job.company?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-slate-600 text-sm font-medium">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{job.company}</span>
              </div>

              {/* Tag row */}
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <StatusBadge status={job.type} />
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                {job.salary?.max > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    {job.salary.min ? `₹${job.salary.min.toLocaleString()} - ` : "Up to "}
                    ₹{job.salary.max.toLocaleString()} / year
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Apply CTA in header */}
          <div className="shrink-0 w-full sm:w-auto">
            {user?.role === "jobseeker" && (
              alreadyApplied ? (
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Application Submitted
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(true)}
                  className="btn-primary w-full sm:w-auto !py-3 !px-6 text-sm"
                >
                  <Send className="w-4 h-4" />
                  Apply Now
                </motion.button>
              )
            )}

            {!user && (
              <Link to="/login" className="btn-primary text-sm w-full block text-center">
                Sign in to Apply
              </Link>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="py-6 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-500" />
              About The Role
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Requirements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {job.requirements.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Required */}
          {job.skills?.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                Skills & Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-brand-50/80 text-brand-700 text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-brand-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modern Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-100"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Apply for {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-5 pt-4">
                {/* Resume Upload Drop Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Resume Document (PDF) *
                  </label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-brand-500 bg-slate-50/50 hover:bg-brand-50/20 cursor-pointer transition-all">
                    {resumeFile ? (
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                        <FileCheck className="w-6 h-6" />
                        <span>{resumeFile.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <UploadCloud className="w-8 h-8 text-brand-500 mb-2" />
                        <span className="text-sm font-semibold text-slate-700">
                          Click to browse and upload resume
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          PDF only, max file size 5MB
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      required
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Cover Note (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly pitch why you are the ideal match for this position..."
                    className="input-field resize-none text-sm"
                    maxLength={1000}
                  />
                  <span className="text-xs text-slate-400 block text-right mt-1">
                    {coverLetter.length}/1000
                  </span>
                </div>

                {/* Modal Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary flex-1 text-sm"
                  >
                    {applying ? "Submitting..." : "Send Application"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetail;
