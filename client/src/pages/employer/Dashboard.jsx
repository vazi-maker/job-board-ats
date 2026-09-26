import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get("/jobs/employer/my-jobs");
      setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleActive = async (jobId, currentStatus) => {
    try {
      await api.put(`/jobs/${jobId}`, { isActive: !currentStatus });
      setJobs((prev) =>
        prev.map((j) =>
          j._id === jobId ? { ...j, isActive: !currentStatus } : j
        )
      );
      toast.success(`Job ${!currentStatus ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update job status");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success("Job deleted successfully");
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const activeCount = jobs.filter((j) => j.isActive).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Job Listings</h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeCount} active · {jobs.length - activeCount} inactive
          </p>
        </div>
        <Link to="/employer/post-job" className="btn-primary">
          + Post New Job
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/5" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium text-gray-600">No jobs posted yet</p>
          <Link to="/employer/post-job" className="btn-primary inline-block mt-4">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        job.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.isActive ? "● Active" : "○ Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {job.type} · {job.location}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Posted {new Date(job.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <Link
                    to={`/employer/applicants/${job._id}`}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    👥 View Applicants
                  </Link>
                  <button
                    onClick={() => handleToggleActive(job._id, job.isActive)}
                    className={`text-xs py-1.5 px-3 rounded-lg font-medium border transition-colors ${
                      job.isActive
                        ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {job.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-xs py-1.5 px-3 rounded-lg font-medium border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
