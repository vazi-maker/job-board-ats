import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  Calendar,
  Gift,
  Search,
  Building2,
  MapPin,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get("/applications/my");
        setApplications(data.applications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Summary counts
  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: FileText,
      gradient: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      label: "Under Review",
      value: counts["Under Review"] || 0,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
    },
    {
      label: "Interviews",
      value: counts["Interview Scheduled"] || 0,
      icon: Calendar,
      gradient: "from-purple-600 to-violet-600",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      label: "Job Offers",
      value: counts["Offer"] || 0,
      icon: Gift,
      gradient: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Applications Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span>. Track the live ATS status of your job applications.
          </p>
        </div>

        <Link to="/" className="btn-primary text-xs !py-2 !px-4">
          <Search className="w-3.5 h-3.5" />
          Find More Jobs
        </Link>
      </div>

      {/* Animated Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 border border-slate-200/80 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl ${stat.bgLight} ${stat.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                <span className="text-xs text-slate-400 font-medium">active</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-600" />
          Application Progress Tracker
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="glass-card text-center py-16 text-slate-400 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 text-brand-500">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No applications submitted yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Start browsing through open tech roles and submit your resume.
            </p>
            <Link to="/" className="btn-primary inline-flex text-xs mt-4">
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border border-slate-200/80 hover:border-brand-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  {/* Job Overview */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                      {app.job?.company?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {app.job?.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {app.job?.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {app.job?.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    {app.job?._id && (
                      <Link
                        to={`/jobs/${app.job._id}`}
                        className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        title="View job post"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Status Timeline Stepper */}
                {app.statusHistory?.length > 1 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      Recruitment Progress Log
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {app.statusHistory.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 shrink-0">
                          <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <StatusBadge status={h.status} />
                            <p className="text-[10px] text-slate-400 mt-1">
                              {new Date(h.changedAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          {i < app.statusHistory.length - 1 && (
                            <span className="text-slate-300 font-bold">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;
