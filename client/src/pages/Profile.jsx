import { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = () => {
  // ---------------------------------------------------------
  // State variables
  // ---------------------------------------------------------

  // Stores profile information received from backend
  const [user, setUser] = useState(null);

  // Controls loading state
  const [loading, setLoading] = useState(true);

  // Stores error message if profile cannot be loaded
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // Get authentication token
  // ---------------------------------------------------------
  const token = sessionStorage.getItem("token");

  // ---------------------------------------------------------
  // Format user role
  // ---------------------------------------------------------
  const formatRole = (role) => {
    if (!role) {
      return "User";
    }

    // Convert:
    // ADMIN -> Admin
    // DOCTOR -> Doctor
    // PATIENT -> Patient
    return (
      role.charAt(0).toUpperCase() +
      role.slice(1).toLowerCase()
    );
  };

  // ---------------------------------------------------------
  // Get user's first letter
  // Used for the profile avatar
  // ---------------------------------------------------------
  const getInitial = (name) => {
    if (!name) {
      return "U";
    }

    return name.charAt(0).toUpperCase();
  };

  // ---------------------------------------------------------
  // Fetch profile
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      // Clear old error
      setError("");

      // -----------------------------------------------------
      // Check whether token exists
      // -----------------------------------------------------
      if (!token) {
        setLoading(false);
        setError(
          "You are not logged in. Please login first."
        );
        return;
      }

      try {
        setLoading(true);

        // ---------------------------------------------------
        // Request profile from backend
        // ---------------------------------------------------
        const res = await API.get(
          "/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Store profile data
        setUser(res.data);
      } catch (err) {
        console.error(
          "Error fetching profile:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Unable to load your profile. Please try again."
        );
      } finally {
        // Stop loading whether request succeeds or fails
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // ---------------------------------------------------------
  // Loading screen
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 font-medium">
            Loading profile...
          </p>

        </div>

      </div>
    );
  }

  // ---------------------------------------------------------
  // Error screen
  // ---------------------------------------------------------
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">

          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            !
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Unable to Load Profile
          </h2>

          <p className="text-red-500 text-sm">
            {error}
          </p>

        </div>

      </div>
    );
  }

  // ---------------------------------------------------------
  // If no user data exists
  // ---------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

          <p className="text-gray-500">
            No profile information found.
          </p>

        </div>

      </div>
    );
  }

  // ---------------------------------------------------------
  // JSX
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-16">

      {/* =====================================================
          PROFILE CONTAINER
      ====================================================== */}
      <div className="max-w-3xl mx-auto">

        {/* =================================================
            PAGE TITLE
        ================================================== */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            My Profile
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            View your account information.
          </p>

        </div>

        {/* =================================================
            PROFILE CARD
        ================================================== */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* =================================================
              PROFILE HEADER
          ================================================== */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-8">

            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">

              {/* Profile Avatar */}
              <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg">

                {getInitial(user.name)}

              </div>

              {/* Name and Role */}
              <div className="text-center sm:text-left">

                <h1 className="text-2xl font-bold">
                  {user.name || "User"}
                </h1>

                <p className="text-blue-100 mt-1">
                  {user.email || "No email available"}
                </p>

                {/* Role Badge */}
                <span className="inline-block mt-3 bg-white/20 px-4 py-1 rounded-full text-sm font-medium">
                  {formatRole(user.role)}
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              PROFILE INFORMATION
          ================================================== */}
          <div className="p-6">

            <h3 className="text-lg font-bold text-gray-800 mb-5">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* User ID */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">

                <p className="text-xs text-gray-500 mb-1">
                  User ID
                </p>

                <p className="font-semibold text-gray-800">
                  {user.id ?? "-"}
                </p>

              </div>

              {/* Name */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">

                <p className="text-xs text-gray-500 mb-1">
                  Full Name
                </p>

                <p className="font-semibold text-gray-800">
                  {user.name || "-"}
                </p>

              </div>

              {/* Email */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">

                <p className="text-xs text-gray-500 mb-1">
                  Email Address
                </p>

                <p className="font-semibold text-gray-800 break-all">
                  {user.email || "-"}
                </p>

              </div>

              {/* Role */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">

                <p className="text-xs text-gray-500 mb-1">
                  Account Role
                </p>

                <p className="font-semibold text-gray-800">
                  {formatRole(user.role)}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              ACCOUNT STATUS
          ================================================== */}
          <div className="px-6 pb-6">

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">

              <div className="w-3 h-3 bg-green-500 rounded-full"></div>

              <div>

                <p className="font-semibold text-green-700">
                  Account Active
                </p>

                <p className="text-sm text-green-600">
                  Your account is currently active.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;

