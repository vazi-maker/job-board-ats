import { Link } from "react-router-dom";

const typeColors = {
  "Full-Time": "bg-green-100 text-green-700",
  "Part-Time": "bg-yellow-100 text-yellow-700",
  Remote: "bg-blue-100 text-blue-700",
  Internship: "bg-purple-100 text-purple-700",
  Contract: "bg-orange-100 text-orange-700",
};

const JobCard = ({ job }) => {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* Company Avatar */}
        <div className="w-12 h-12 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
          <span className="text-brand-600 font-bold text-lg">
            {job.company?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/jobs/${job._id}`}
            className="font-semibold text-gray-900 hover:text-brand-600 transition-colors text-base leading-tight line-clamp-1"
          >
            {job.title}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Job Type Badge */}
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                typeColors[job.type] || "bg-gray-100 text-gray-600"
              }`}
            >
              {job.type}
            </span>

            {/* Location */}
            <span className="text-xs text-gray-500 flex items-center gap-1">
              📍 {job.location}
            </span>

            {/* Salary */}
            {job.salary?.max > 0 && (
              <span className="text-xs text-gray-500">
                💰 ₹{job.salary.min.toLocaleString()} – ₹{job.salary.max.toLocaleString()}
              </span>
            )}
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {job.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="text-xs text-gray-400">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="text-xs text-gray-400 whitespace-nowrap shrink-0">
          {new Date(job.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link to={`/jobs/${job._id}`} className="btn-primary text-sm">
          View Job →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
