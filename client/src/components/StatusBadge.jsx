import { CheckCircle2, Clock, Calendar, Gift, XCircle } from "lucide-react";

const statusConfig = {
  Applied: {
    color: "bg-blue-50 text-blue-700 border-blue-200/80",
    dot: "bg-blue-500",
    icon: Clock,
  },
  "Under Review": {
    color: "bg-amber-50 text-amber-700 border-amber-200/80",
    dot: "bg-amber-500",
    icon: Clock,
  },
  "Interview Scheduled": {
    color: "bg-purple-50 text-purple-700 border-purple-200/80",
    dot: "bg-purple-500",
    icon: Calendar,
  },
  Offer: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
    icon: Gift,
  },
  Rejected: {
    color: "bg-rose-50 text-rose-700 border-rose-200/80",
    dot: "bg-rose-500",
    icon: XCircle,
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    color: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
    icon: CheckCircle2,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shadow-xs transition-all ${config.color}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}
        />
      </span>
      <Icon className="w-3 h-3 opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
