import { useState, useEffect } from "react";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

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
    { label: "Total Applied", value: applications.length, color: "bg-blue-50 text-blue-700" },
    { label: "Under Review", value: counts["Under Review"] || 0, color: "bg-yellow-50 text-yellow-700" },
    { label: "Interviews", value: counts["Interview Scheduled"] || 0, color: "bg-purple-50 text-purple-700" },
    { label: "Offers", value: counts["Offer"] || 0, color: "bg-green-50 text-green-700" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track the status of all your job applications, {user?.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse flex gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📄</p>
          <p className="text-lg font-medium text-gray-600">No applications yet</p>
          <p className="text-sm mt-1">
            <a href="/" className="text-brand-600 hover:underline">Browse jobs</a> and start applying!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card">
              <div className="flex items-start justify-between gap-4">
                {/* Company Avatar */}
                <div className="w-12 h-12 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                  <span className="text-brand-600 font-bold text-lg">
                    {app.job?.company?.charAt(0)}
                  </span>
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{app.job?.title}</p>
                  <p className="text-sm text-gray-500">{app.job?.company}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400">
                      📍 {app.job?.location}
                    </span>
                    <span className="text-xs text-gray-400">
                      Applied {new Date(app.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  <StatusBadge status={app.status} />
                </div>
              </div>

              {/* Status Timeline */}
              {app.statusHistory?.length > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Activity Timeline
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {app.statusHistory.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 shrink-0">
                        <div className="text-center">
                          <StatusBadge status={h.status} />
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(h.changedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                        {i < app.statusHistory.length - 1 && (
                          <span className="text-gray-300 text-lg">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter Preview */}
              {app.coverLetter && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-1">Cover Letter</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
