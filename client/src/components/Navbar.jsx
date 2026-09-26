import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  PlusCircle,
  FileText,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  Layers,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Glow */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/30 text-white"
          >
            <Briefcase className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 text-lg tracking-tight flex items-center gap-1">
              JobBoard
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-600 border border-brand-200/60">
                ATS
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive("/")
                ? "text-brand-600 bg-brand-50/80 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Browse Jobs
          </Link>

          {user?.role === "employer" && (
            <Link
              to="/employer/dashboard"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive("/employer/dashboard")
                  ? "text-brand-600 bg-brand-50/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <Layers className="w-4 h-4 text-brand-500" />
              Manage Jobs
            </Link>
          )}

          {user?.role === "jobseeker" && (
            <Link
              to="/seeker/dashboard"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive("/seeker/dashboard")
                  ? "text-brand-600 bg-brand-50/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <FileText className="w-4 h-4 text-brand-500" />
              My Applications
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "employer" && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/employer/post-job"
                    className="btn-primary text-sm !py-2 !px-4"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Job
                  </Link>
                </motion.div>
              )}

              {/* User Pill */}
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs leading-tight">
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-slate-400 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm !py-2">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm !py-2">
                <Sparkles className="w-4 h-4" />
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Browse Jobs
            </Link>

            {user?.role === "employer" && (
              <>
                <Link
                  to="/employer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Manage Jobs
                </Link>
                <Link
                  to="/employer/post-job"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Post a Job
                </Link>
              </>
            )}

            {user?.role === "jobseeker" && (
              <Link
                to="/seeker/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Applications
              </Link>
            )}

            {user ? (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="btn-secondary !text-rose-600 text-xs py-1.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary text-center text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
