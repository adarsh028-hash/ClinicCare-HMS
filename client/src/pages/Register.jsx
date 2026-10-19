
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Register() {
  // ---------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // Form state
  // ---------------------------------------------------------
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "PATIENT",
  });

  // ---------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------
  // Error state
  // ---------------------------------------------------------
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // Success message
  // ---------------------------------------------------------
  const [success, setSuccess] = useState("");

  // ---------------------------------------------------------
  // Handle input changes
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form state
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Clear previous error
    if (error) {
      setError("");
    }

    // Clear success message
    if (success) {
      setSuccess("");
    }
  };

  // ---------------------------------------------------------
  // Handle registration
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    // Prevent normal form submission
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // -------------------------------------------------------
    // Clean email and name
    // -------------------------------------------------------
    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim();

    // -------------------------------------------------------
    // Basic validation
    // -------------------------------------------------------
    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    // -------------------------------------------------------
    // Password validation
    // -------------------------------------------------------
    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      // Start loading
      setLoading(true);

      // -----------------------------------------------------
      // Send registration request
      // -----------------------------------------------------
      await API.post("/auth/register", {
        name: cleanName,
        email: cleanEmail,
        password: form.password,
        role: form.role,
      });

      // Show success message
      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      // -----------------------------------------------------
      // Redirect to login
      // -----------------------------------------------------
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      // -----------------------------------------------------
      // Handle registration error
      // -----------------------------------------------------
      console.error(
        "Registration error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // JSX
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      {/* =====================================================
          REGISTRATION CARD
      ====================================================== */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">

        {/* =================================================
            TITLE
        ================================================== */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1 mb-6">
          Register for your ClinicCare account
        </p>

        {/* =================================================
            ERROR MESSAGE
        ================================================== */}
        {error && (

          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>

        )}

        {/* =================================================
            SUCCESS MESSAGE
        ================================================== */}
        {success && (

          <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded-lg mb-4 text-center">
            {success}
          </div>

        )}

        {/* =================================================
            REGISTRATION FORM
        ================================================== */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          {/* =================================================
              NAME
          ================================================== */}
          <div className="flex flex-col gap-1">

            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

          </div>

          {/* =================================================
              EMAIL
          ================================================== */}
          <div className="flex flex-col gap-1">

            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

          </div>

          {/* =================================================
              PASSWORD
          ================================================== */}
          <div className="flex flex-col gap-1">

            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <p className="text-xs text-gray-500">
              Password must be at least 6 characters.
            </p>

          </div>

          {/* =================================================
              ROLE
          ================================================== */}
          <div className="flex flex-col gap-1">

            <label
              htmlFor="role"
              className="text-sm font-medium text-gray-700"
            >
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >

              <option value="PATIENT">
                Patient
              </option>

              <option value="DOCTOR">
                Doctor
              </option>

              <option value="RECEPTIONIST">
                Receptionist
              </option>

            </select>

            <p className="text-xs text-gray-500">
              Admin accounts should normally be created
              by an administrator.
            </p>

          </div>

          {/* =================================================
              REGISTER BUTTON
          ================================================== */}
          <button
            type="submit"
            disabled={loading}
            className={`p-3 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* =================================================
            LOGIN LINK
        ================================================== */}
        <p className="text-sm text-gray-600 text-center mt-6">

          Already have an account?{" "}

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;
