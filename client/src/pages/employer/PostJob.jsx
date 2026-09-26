import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Plus,
  X,
  ArrowLeft,
  Sparkles,
  FileCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const JOB_TYPES = ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"];

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [reqInput, setReqInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "Full-Time",
    salary: { min: "", max: "" },
    skills: [],
    requirements: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "salaryMin" || name === "salaryMax") {
      setForm((p) => ({
        ...p,
        salary: { ...p.salary, [name === "salaryMin" ? "min" : "max"]: value },
      }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm((p) => ({ ...p, skills: [...p.skills, skill] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) =>
    setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));

  const addRequirement = () => {
    const req = reqInput.trim();
    if (req) {
      setForm((p) => ({ ...p, requirements: [...p.requirements, req] }));
      setReqInput("");
    }
  };

  const removeRequirement = (index) =>
    setForm((p) => ({
      ...p,
      requirements: p.requirements.filter((_, i) => i !== index),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location) {
      return toast.error("Please fill in all mandatory fields");
    }
    setLoading(true);
    try {
      await api.post("/jobs", {
        ...form,
        salary: {
          min: Number(form.salary.min) || 0,
          max: Number(form.salary.max) || 0,
        },
      });
      toast.success("Job opening published successfully! 🎉");
      navigate("/employer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/employer/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 border border-slate-200/90 shadow-2xl shadow-indigo-500/5"
      >
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Recruiter Listing Studio
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create a New Job Listing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publishing on behalf of <strong className="text-slate-800">{user?.company}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Senior Frontend Engineer, Full Stack Developer..."
              className="input-field"
            />
          </div>

          {/* Type & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Job Type *
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input-field"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Work Location *
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Bengaluru, IN or Remote"
                className="input-field"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Min Salary (₹/yr)
              </label>
              <input
                type="number"
                name="salaryMin"
                value={form.salary.min}
                onChange={handleChange}
                placeholder="e.g. 800000"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Max Salary (₹/yr)
              </label>
              <input
                type="number"
                name="salaryMax"
                value={form.salary.max}
                onChange={handleChange}
                placeholder="e.g. 1500000"
                className="input-field"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Role Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Outline mission, key deliverables, and team dynamics..."
              className="input-field resize-none"
            />
          </div>

          {/* Requirements builder */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Requirements & Qualifications
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                placeholder="Type a requirement and press Add (or Enter)..."
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="btn-secondary !px-4 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {form.requirements.length > 0 && (
              <div className="space-y-2">
                {form.requirements.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium"
                  >
                    <span>✓ {req}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(i)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills builder */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Key Skills & Tech Stack
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="e.g. React, TypeScript, Node.js..."
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-secondary !px-4 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-3 py-1 rounded-lg"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-brand-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/employer/dashboard")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? "Publishing Opening..." : "Publish Job Opening"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostJob;
