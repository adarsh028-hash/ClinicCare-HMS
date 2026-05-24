import { useEffect, useState } from "react";
import API from "../../api/axios";

function DoctorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await API.get("/doctor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading Doctor Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* 🔷 Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Doctor Dashboard
      </h2>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">MY PATIENTS</p>
          <h3 className="text-3xl font-bold text-blue-600 mt-2">
            {data.total_patients}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">TODAY APPOINTMENTS</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">
            {data.today_appointments}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">PENDING</p>
          <h3 className="text-3xl font-bold text-orange-500 mt-2">
            {data.pending_appointments}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">COMPLETED</p>
          <h3 className="text-3xl font-bold text-purple-600 mt-2">
            {data.completed_appointments}
          </h3>
        </div>

      </div>

      {/* 📅 Appointments Table */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Today's Appointments
        </h3>

        {data.appointments.length === 0 ? (
          <p className="text-gray-500">No appointments today</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Patient</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.appointments.map((appt) => (
                <tr key={appt.id} className="border-b">
                  <td className="py-2">{appt.patient_name}</td>
                  <td>{appt.time}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        appt.status === "pending"
                          ? "bg-orange-500"
                          : "bg-green-600"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default DoctorDashboard;