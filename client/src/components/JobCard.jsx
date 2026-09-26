import { Link } from "react-router-dom";
import SpotlightCard from "./ui/SpotlightCard";
import {
  MapPin,
  IndianRupee,
  ArrowRight,
  Building2,
  Clock,
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
  const gradientIndex = (job.company?.charCodeAt(0) || 0) % companyGradients.length;
  const gradientClass = companyGradients[gradientIndex];

  return (
    <SpotlightCard
      tilt={true}
      spotlightColor="rgba(99, 102, 241, 0.22)"
      className="p-6 h-full flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 group-hover:scale-105 transition-transform`}
          >
            {job.company?.charAt(0).toUpperCase() || "C"}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              to={`/jobs/${job._id}`}
              className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-base line-clamp-1 block"
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

          <span className="text-xs font-medium text-slate-600 bg-slate-100/90 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {job.location}
          </span>

          {job.salary?.max > 0 && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg flex items-center gap-0.5">
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
                className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200/60"
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
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {new Date(job.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          })}
        </span>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all"
        >
          View Role
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </SpotlightCard>
  );
};

export default JobCard;
