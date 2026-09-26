import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">JB</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">JobBoard</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-brand-600 transition-colors">
            Browse Jobs
          </Link>

          {user ? (
            <>
              {user.role === "employer" && (
                <>
                  <Link
                    to="/employer/dashboard"
                    className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    My Jobs
                  </Link>
                  <Link
                    to="/employer/post-job"
                    className="btn-primary text-sm"
                  >
                    + Post Job
                  </Link>
                </>
              )}
              {user.role === "jobseeker" && (
                <Link
                  to="/seeker/dashboard"
                  className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
                >
                  My Applications
                </Link>
              )}

              {/* User info + Logout */}
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
