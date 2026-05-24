import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Reusable redirect function
  const redirectUser = (role) => {
    if (role === "admin") {
      navigate("/dashboard", { replace: true });
    } else if (role === "doctor") {
      navigate("/doctor/dashboard", { replace: true });
    } else {
      navigate("/patient/dashboard", { replace: true });
    }
  };

  // Auto redirect if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (token && role) {
      redirectUser(role);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    //  Validation
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const role = res.data.user?.role?.toLowerCase();

      //  Token validation
      if (!token) {
        setError("Token missing from backend");
        return;
      }

      //  Role validation
      if (!role) {
        console.log("FULL RESPONSE:", res.data);
        setError("Role missing from backend");
        return;
      }

      //  Store data
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);

      // Optional user storage
      sessionStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      console.log("ROLE:", role);

      //  Success redirect
      redirectUser(role);

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);

      setError(
        err.response?.data?.message || "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          ClinicCare Login
        </h2>

        {/* ✅ Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* ✅ Email */}
          <div className="flex flex-col gap-1">

            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                border border-gray-300
                p-3 rounded-xl
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                transition
              "
            />

          </div>

          {/* ✅ Password */}
          <div className="flex flex-col gap-1">

            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                border border-gray-300
                p-3 rounded-xl
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                transition
              "
            />

          </div>

          {/* ✅ Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              p-3 rounded-xl font-semibold text-white transition
              ${loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;