import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

function Dashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStats(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* 🔷 Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Admin Dashboard
      </h2>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Doctors */}
        <Link to="/doctors">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
            <p className="text-gray-500 text-sm">DOCTORS</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {stats.total_doctors}
            </h3>
          </div>
        </Link>

        {/* Patients */}
        <Link to="/patients">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
            <p className="text-gray-500 text-sm">PATIENTS</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {stats.total_patients}
            </h3>
          </div>
        </Link>

        {/* Today Appointments */}
        <Link to="/appointments">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
            <p className="text-gray-500 text-sm">TODAY'S APPOINTMENTS</p>
            <h3 className="text-3xl font-bold text-orange-500 mt-2">
              {stats.today_appointments}
            </h3>
          </div>
        </Link>

        {/* Completed */}
        <Link to="/appointments">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
            <p className="text-gray-500 text-sm">COMPLETED</p>
            <h3 className="text-3xl font-bold text-purple-600 mt-2">
              {stats.completed_appointments}
            </h3>
          </div>
        </Link>

      </div>

      {/* 📌 Optional Section (Future Ready) */}
      <div className="mt-10 text-gray-500 text-sm">
        Tip: Click on any card to view detailed data →
      </div>

    </div>
  );
}

export default Dashboard;