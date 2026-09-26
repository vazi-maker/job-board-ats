import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetail from "./pages/JobDetail";
import SeekerDashboard from "./pages/seeker/Dashboard";
import EmployerDashboard from "./pages/employer/Dashboard";
import PostJob from "./pages/employer/PostJob";
import Applicants from "./pages/employer/Applicants";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Job Seeker Protected Routes */}
            <Route
              path="/seeker/dashboard"
              element={
                <ProtectedRoute role="jobseeker">
                  <SeekerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Employer Protected Routes */}
            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute role="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/post-job"
              element={
                <ProtectedRoute role="employer">
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/applicants/:jobId"
              element={
                <ProtectedRoute role="employer">
                  <Applicants />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#1f2937",
              color: "#fff",
              fontSize: "14px",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
