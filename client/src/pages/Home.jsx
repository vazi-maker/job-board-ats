import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  SlidersHorizontal,
  X,
  TrendingUp,
  CheckCircle,
  Users,
} from "lucide-react";

const JOB_TYPES = ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (type) params.type = type;
      if (location) params.location = location;

      const { data } = await api.get("/jobs", { params });
      setJobs(data.jobs);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, type, location, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearch("");
    setType("");
    setLocation("");
    setPage(1);
  };

  return (
    <div className="relative overflow-hidden min-h-screen pb-20">
      {/* Decorative Floating Glowing Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] overflow-hidden -z-10 pointer-events-none opacity-40">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-brand-400/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-violet-400/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -top-20 right-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold mb-4 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" />
            Modern Applicant Tracking & Career Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]"
          >
            Discover Your Next <br />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Career Breakthrough
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            Connect directly with verified tech companies, track your job applications in real time, and streamline your recruitment pipeline.
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 sm:gap-8 mt-6 text-xs sm:text-sm font-medium text-slate-500"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Verified Employers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              <span>{total}+ Open Positions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-violet-500" />
              <span>Live ATS Tracking</span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-3 sm:p-4 mb-8 max-w-4xl mx-auto border border-slate-200/90 shadow-2xl shadow-indigo-500/5"
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3 items-stretch md:items-center"
          >
            {/* Keyword Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            {/* Location Input */}
            <div className="relative md:w-56">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="City or Remote..."
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-primary flex-1 md:flex-initial text-sm !py-2.5 !px-6"
              >
                Search Jobs
              </button>

              {(search || type || location) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-secondary !p-2.5 text-slate-500 hover:text-slate-800"
                  title="Clear all filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Job Type Pills */}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Filter:
            </span>
            <button
              onClick={() => {
                setType("");
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                type === ""
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Types
            </button>
            {JOB_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t === type ? "" : t);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                  type === t
                    ? "bg-brand-600 text-white shadow-xs shadow-brand-500/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {type || location || search ? "Filtered Positions" : "Latest Opportunities"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {jobs.length} of {total} available positions
            </p>
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/3" />
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-20" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-20 px-4 max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-3xl bg-brand-50 flex items-center justify-center mx-auto mb-4 text-brand-600 shadow-inner">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No open positions found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn't find any positions matching your search criteria.
            </p>
            <button onClick={clearFilters} className="btn-secondary text-xs mt-5">
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {jobs.map((job) => (
              <motion.div key={job._id} variants={itemVariants}>
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary !py-2 !px-3 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  page === i + 1
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/25"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary !py-2 !px-3 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
