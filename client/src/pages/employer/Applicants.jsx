import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Download,
  Mail,
  Calendar,
  FileText,
  Building2,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  "Applied",
  "Under Review",
  "Interview Scheduled",
  "Offer",
  "Rejected",
];

const Applicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const [appsRes, jobRes] = await Promise.all([
          api.get(`/applications/job/${jobId}`),
          api.get(`/jobs/${jobId}`),
        ]);
        setApplications(appsRes.data.applications);
        setJobTitle(jobRes.data.job.title);
      } catch (err) {
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const { data } = await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
      });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: data.application.status } : app
        )
      );
      toast.success(`Candidate status moved to "${newStatus}"`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadResume = async (appId, applicantName) => {
    try {
      toast.loading("Preparing PDF download...", { id: `download-${appId}` });
      const response = await api.get(`/applications/${appId}/resume`, {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanName = (applicantName || "applicant").replace(/\s+/g, "_");
      link.setAttribute("download", `Resume-${cleanName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Resume downloaded!", { id: `download-${appId}` });
    } catch (err) {
      toast.error("Failed to download resume", { id: `download-${appId}` });
    }
  };

  // Count by status
  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/employer/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Applicants for: <span className="text-brand-600">{jobTitle}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review candidate resumes, trigger recruitment status transitions, and send automated email updates.
        </p>
      </div>

      {/* Summary Chips */}
      {applications.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mb-8">
          {STATUS_OPTIONS.map((s) => (
            <div
              key={s}
              className={`glass-panel px-3.5 py-1.5 flex items-center gap-2 text-xs font-semibold ${
                counts[s] ? "border-slate-300" : "opacity-50"
              }`}
            >
              <StatusBadge status={s} />
              <span className="text-slate-800 font-bold ml-1">{counts[s] || 0}</span>
            </div>
          ))}
        </div>
      )}

      {/* Applicants List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card text-center py-20 text-slate-400 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 flex items-center justify-center mx-auto mb-4 text-brand-600">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No applicants yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Candidates applying to this job listing will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border border-slate-200/80 hover:border-brand-500/40"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                {/* Candidate Info */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-bold text-lg flex items-center justify-center shadow-md">
                    {app.applicant?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {app.applicant?.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {app.applicant?.email}
                      </span>
                      <span>•</span>
                      <span>
                        Applied{" "}
                        {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <StatusBadge status={app.status} />
              </div>

              {/* Cover Letter */}
              {app.coverLetter && (
                <div className="my-4 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Candidate Note
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {app.coverLetter}
                  </p>
                </div>
              )}

              {/* Action Controls */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                {/* Update Dropdown */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>ATS Stage:</span>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    disabled={updatingId === app._id}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {updatingId === app._id && (
                    <span className="text-[10px] text-brand-600 animate-pulse">
                      Updating...
                    </span>
                  )}
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownloadResume(app._id, app.applicant?.name)}
                  className="btn-secondary text-xs !py-2 !px-4"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Download PDF Resume
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;
