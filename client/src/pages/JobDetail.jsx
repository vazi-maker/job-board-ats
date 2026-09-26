import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
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
        const applied = data.applications.some((app) => app.job._id === id);
        setAlreadyApplied(applied);
      } catch {
        // Ignore error silently
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
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-8" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card mb-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
            <span className="text-brand-600 font-bold text-2xl">
              {job.company?.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.company}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <StatusBadge status={job.type} />
              <span className="text-sm text-gray-500">📍 {job.location}</span>
              {job.salary?.max > 0 && (
                <span className="text-sm text-gray-500">
                  💰 ₹{job.salary.min.toLocaleString()} – ₹{job.salary.max.toLocaleString()} / year
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        {user?.role === "jobseeker" && (
          <div className="mb-6">
            {alreadyApplied ? (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium border border-green-200">
                ✅ You have already applied to this job
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary px-6 py-2.5"
              >
                Apply Now
              </button>
            )}
          </div>
        )}

        {!user && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700">
            <a href="/login" className="font-medium underline">Sign in</a> to apply for this job.
          </div>
        )}

        {/* Job Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Job Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {job.requirements?.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Requirements</h2>
              <ul className="space-y-1.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-brand-500 mt-0.5">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.skills?.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Apply for {job.title}
              </h2>
              <p className="text-sm text-gray-500">{job.company}</p>
            </div>
            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume (PDF only, max 5MB) *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  required
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-600 file:font-medium hover:file:bg-brand-100 cursor-pointer border border-gray-200 rounded-lg p-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter (optional)
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit..."
                  className="input-field resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {coverLetter.length}/1000
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="btn-primary flex-1"
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
