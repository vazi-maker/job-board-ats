import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  ArrowRight,
  Sparkles,
  Building2,
} from "lucide-react";

const typeStyles = {
  "Full-Time": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Part-Time": "bg-amber-50 text-amber-700 border-amber-200/80",
  Remote: "bg-blue-50 text-blue-700 border-blue-200/80",
  Internship: "bg-purple-50 text-purple-700 border-purple-200/80",
  Contract: "bg-orange-50 text-orange-700 border-orange-200/80",
};

const companyGradients = [
  "from-blue-600 to-indigo-600",
  "from-violet-600 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-cyan-500 to-blue-600",
];

const JobCard = ({ job }) => {
  // Deterministic gradient selection based on company name
  const gradientIndex = (job.company?.charCodeAt(0) || 0) % companyGradients.length;
  const gradientClass = companyGradients[gradientIndex];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative glass-card p-6 border border-slate-200/80 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/10 flex flex-col justify-between"
    >
      {/* Top subtle highlight bar */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent group-hover:via-brand-500 transition-all opacity-0 group-hover:opacity-100" />

      <div>
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0`}
          >
            {job.company?.charAt(0).toUpperCase() || "C"}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              to={`/jobs/${job._id}`}
              className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-base line-clamp-1 flex items-center gap-1.5"
            >
              {job.title}
            </Link>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {job.company}
            </p>
          </div>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
              typeStyles[job.type] || "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            {job.type}
          </span>

          <span className="text-xs font-medium text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {job.location}
          </span>

          {job.salary?.max > 0 && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50/90 border border-emerald-200/60 px-2.5 py-1 rounded-lg flex items-center gap-0.5">
              <IndianRupee className="w-3 h-3 text-emerald-600" />
              {job.salary.min ? `${(job.salary.min / 100000).toFixed(1)}L - ` : ""}
              {(job.salary.max / 100000).toFixed(1)}L / yr
            </span>
          )}
        </div>

        {/* Skills Pills */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200/50"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-xs text-slate-400 px-1 py-0.5">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100/90 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Posted{" "}
          {new Date(job.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          })}
        </span>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 group/link"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
