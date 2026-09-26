const statusConfig = {
  Applied: { color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  "Under Review": { color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  "Interview Scheduled": { color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  Offer: { color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  Rejected: { color: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    color: "bg-gray-100 text-gray-700",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
