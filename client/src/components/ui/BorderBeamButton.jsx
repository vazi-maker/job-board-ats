import { motion } from "framer-motion";

/**
 * BorderBeamButton (Uiverse.io inspired)
 * High-tech button with an animated gradient beam traveling around its perimeter.
 */
const BorderBeamButton = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center p-[2px] overflow-hidden rounded-xl font-medium transition-all group disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {/* Animated Rotating Conic Gradient Beam */}
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e0e7ff_0%,#6366f1_50%,#c084fc_100%)] opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Button Interior */}
      <span className="relative inline-flex items-center justify-center gap-2 w-full h-full px-5 py-2.5 rounded-[10px] bg-slate-900 text-white text-sm font-semibold transition-all group-hover:bg-slate-850">
        {children}
      </span>
    </motion.button>
  );
};

export default BorderBeamButton;
