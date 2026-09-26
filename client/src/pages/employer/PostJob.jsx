import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
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
      return toast.error("Please fill all required fields");
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
      toast.success("Job posted successfully! 🎉");
      navigate("/employer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-500 text-sm mt-1">
          Posting as <strong>{user?.company}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Senior React Developer"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Mumbai or Remote"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Salary (₹/year)
              </label>
              <input
                type="number"
                name="salaryMin"
                value={form.salary.min}
                onChange={handleChange}
                placeholder="e.g. 600000"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Salary (₹/year)
              </label>
              <input
                type="number"
                name="salaryMax"
                value={form.salary.max}
                onChange={handleChange}
                placeholder="e.g. 1200000"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Job Description</h2>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Describe the role, responsibilities, and what a typical day looks like..."
            className="input-field resize-none"
          />
        </div>

        {/* Requirements */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Requirements</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={reqInput}
              onChange={(e) => setReqInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              placeholder="e.g. 3+ years of React experience"
              className="input-field flex-1"
            />
            <button type="button" onClick={addRequirement} className="btn-secondary px-4">
              Add
            </button>
          </div>
          {form.requirements.length > 0 && (
            <ul className="space-y-2">
              {form.requirements.map((req, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-gray-700">✓ {req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(i)}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Skills */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Required Skills</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="e.g. React, Node.js..."
              className="input-field flex-1"
            />
            <button type="button" onClick={addSkill} className="btn-secondary px-4">
              Add
            </button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 bg-brand-50 text-brand-700 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-500 text-brand-400"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/employer/dashboard")}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
