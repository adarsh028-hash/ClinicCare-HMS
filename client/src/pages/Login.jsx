
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  // ---------------------------------------------------------
  // State variables
  // ---------------------------------------------------------

  // Stores email entered by the user
  const [email, setEmail] = useState("");

  // Stores password entered by the user
  const [password, setPassword] = useState("");

  // Stores login error message
  const [error, setError] = useState("");

  // Controls loading state while logging in
  const [loading, setLoading] = useState(false);

  // React Router navigation function
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // Redirect user according to their role
  // ---------------------------------------------------------
  const redirectUser = (role) => {
    if (role === "admin") {
      navigate("/dashboard", {
        replace: true,
      });

      return;
    }

    if (role === "doctor") {
      navigate("/doctor/dashboard", {
        replace: true,
      });

      return;
    }

    if (role === "patient") {
      navigate("/patient/dashboard", {
        replace: true,
      });

      return;
    }

    // If role is not recognized
    setError("Invalid user role.");
  };

  // ---------------------------------------------------------
  // Auto redirect if user is already logged in
  // ---------------------------------------------------------
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    // If both token and role exist,
    // the user is already logged in.
    if (token && role) {
      redirectUser(role);
    }
  }, []);

  // ---------------------------------------------------------
  // Handle Login
  // ---------------------------------------------------------
  const handleLogin = async (e) => {
    // Prevent normal form submission
    e.preventDefault();

    // Clear previous error
    setError("");

    // Remove unnecessary spaces from email
    const cleanEmail = email.trim();

    // -------------------------------------------------------
    // Basic validation
    // -------------------------------------------------------
    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      // Start loading
      setLoading(true);

      // -----------------------------------------------------
      // Send login request to backend
      // -----------------------------------------------------
      const res = await API.post(
        "/auth/login",
        {
          email: cleanEmail,
          password: password,
        }
      );

      // -----------------------------------------------------
      // Get token from backend response
      // -----------------------------------------------------
      const token = res.data?.token;

      // -----------------------------------------------------
      // Get user role
      // Convert role to lowercase so that:
      //
      // "ADMIN"  -> "admin"
      // "Doctor" -> "doctor"
      // "PATIENT" -> "patient"
      // -----------------------------------------------------
      const role =
        res.data?.user?.role?.toLowerCase();

      // -----------------------------------------------------
      // Token validation
      // -----------------------------------------------------
      if (!token) {
        console.error(
          "Login response does not contain a token:",
          res.data
        );

        setError(
          "Login failed because the token was not received."
        );

        return;
      }

      // -----------------------------------------------------
      // Role validation
      // -----------------------------------------------------
      if (!role) {
        console.error(
          "Login response does not contain a user role:",
          res.data
        );

        setError(
          "Login failed because the user role was not received."
        );

        return;
      }

      // -----------------------------------------------------
      // Check whether role is valid
      // -----------------------------------------------------
      const validRoles = [
        "admin",
        "doctor",
        "patient",
      ];

      if (!validRoles.includes(role)) {
        console.error(
          "Unknown user role:",
          role
        );

        setError(
          "Invalid user role. Please contact the administrator."
        );

        return;
      }

      // -----------------------------------------------------
      // Store authentication information
      // -----------------------------------------------------

      // Store JWT token
      sessionStorage.setItem(
        "token",
        token
      );

      // Store user role
      sessionStorage.setItem(
        "role",
        role
      );

      // Store complete user object
      if (res.data.user) {
        sessionStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      }

      // -----------------------------------------------------
      // Redirect according to role
      // -----------------------------------------------------
      redirectUser(role);

    } catch (err) {
      // -----------------------------------------------------
      // Handle login error
      // -----------------------------------------------------
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">

      {/* =====================================================
          LOGIN CARD
      ====================================================== */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">

        {/* =================================================
            TITLE
        ================================================== */}
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          ClinicCare Login
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Login to access your account
        </p>

        {/* =================================================
            ERROR MESSAGE
        ================================================== */}
        {error && (

          <div className="mb-4 text-center text-sm font-medium text-red-600">
            {error}
          </div>

        )}

        {/* =================================================
            LOGIN FORM
        ================================================== */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >

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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                // Clear error when user starts typing
                if (error) {
                  setError("");
                }
              }}
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
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                // Clear error when user starts typing
                if (error) {
                  setError("");
                }
              }}
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

          </div>

          {/* =================================================
              LOGIN BUTTON
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
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
