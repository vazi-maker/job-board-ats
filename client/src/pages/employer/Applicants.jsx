import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
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
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadResume = (appId, applicantName) => {
    window.open(`/api/applications/${appId}/resume`, "_blank");
  };

  // Count by status
  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Link
          to="/employer/dashboard"
          className="text-sm text-gray-500 hover:text-brand-600 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{jobTitle}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {applications.length} total applicant{applications.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Status Summary */}
      {applications.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_OPTIONS.filter((s) => counts[s]).map((s) => (
            <div
              key={s}
              className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs"
            >
              <StatusBadge status={s} />
              <span className="font-medium text-gray-700 ml-1">
                {counts[s]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Applicants Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse flex gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">👥</p>
          <p className="text-lg font-medium text-gray-600">No applicants yet</p>
          <p className="text-sm mt-1">Share your job listing to get more applicants!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-gray-600 font-semibold text-lg">
                    {app.applicant?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Applicant Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {app.applicant?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.applicant?.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Cover Letter Preview */}
                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1">Cover Letter</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {/* Status Updater */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500 font-medium">
                        Update Status:
                      </label>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app._id, e.target.value)
                        }
                        disabled={updatingId === app._id}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {updatingId === app._id && (
                        <span className="text-xs text-gray-400">Saving...</span>
                      )}
                    </div>

                    {/* Download Resume */}
                    <button
                      onClick={() =>
                        handleDownloadResume(app._id, app.applicant?.name)
                      }
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      📄 Download Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;
