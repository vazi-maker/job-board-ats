import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  MapPin,
  Building2,
  Briefcase,
} from "lucide-react";
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
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to permanently delete this job listing?")) return;
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Employer Management Console
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Recruiting for <strong className="text-slate-800">{user?.company}</strong> •{" "}
            <span className="text-emerald-600 font-semibold">{activeCount} Active</span> listings
          </p>
        </div>

        <Link to="/employer/post-job" className="btn-primary text-sm !py-2.5 !px-5">
          <PlusCircle className="w-4 h-4" />
          Create New Job
        </Link>
      </div>

      {/* Listings List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card text-center py-20 text-slate-400 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 flex items-center justify-center mx-auto mb-4 text-brand-600 shadow-inner">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No jobs posted yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Publish your first open position to start receiving candidate applications.
          </p>
          <Link to="/employer/post-job" className="btn-primary inline-flex text-xs mt-5">
            Post Your First Role
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border border-slate-200/80 hover:border-brand-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      job.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        job.isActive ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {job.isActive ? "Active Listing" : "Paused"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                  <span className="font-medium text-slate-700">{job.type}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span>
                    Posted{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <Link
                  to={`/employer/applicants/${job._id}`}
                  className="btn-primary text-xs !py-2 !px-3.5 !from-slate-900 !to-slate-800 hover:!from-slate-800 shadow-none"
                >
                  <Users className="w-3.5 h-3.5 text-brand-300" />
                  View Applicants
                </Link>

                <button
                  onClick={() => handleToggleActive(job._id, job.isActive)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                    job.isActive
                      ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {job.isActive ? "Pause" : "Activate"}
                </button>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
