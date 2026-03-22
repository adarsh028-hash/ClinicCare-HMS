import { useEffect, useState } from "react";
import API from "../api/axios";

function DoctorSchedule() {

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState("");

  const token = sessionStorage.getItem("token");

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors", headers);
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDoctorAppointments = async (id) => {
    try {
      const res = await API.get(`/appointments/doctor?id=${id}`, headers);
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* 🔷 Header */}
      <h2 className="text-2xl font-bold mb-6">
        Doctor Schedule
      </h2>

      {/* 👨‍⚕️ Doctor Selector */}
      <div className="bg-white p-4 rounded shadow mb-6 flex items-center gap-4">
        <label className="font-semibold">Select Doctor:</label>

        <select
          className="border p-2 rounded"
          value={doctorId}
          onChange={(e) => {
            setDoctorId(e.target.value);
            fetchDoctorAppointments(e.target.value);
          }}
        >
          <option value="">Choose Doctor</option>

          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 Table */}
      <table className="w-full bg-white rounded-lg overflow-hidden shadow">

        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-3 text-left">S.No</th>
            <th className="p-3 text-left">Appt ID</th>
            <th className="p-3 text-left">Patient</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {!doctorId ? (
            <tr>
              <td colSpan="6" className="text-center p-6 text-gray-500">
                Please select a doctor 👨‍⚕️
              </td>
            </tr>
          ) : appointments.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-6 text-gray-500">
                No appointments found 😕
              </td>
            </tr>
          ) : (
            appointments.map((a, index) => (
              <tr
                key={a.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* S.No */}
                <td className="p-3">{index + 1}</td>

                {/* Appointment ID */}
                <td className="p-3 text-blue-600 font-semibold">
                  A{a.id}
                </td>

                <td className="p-3">{a.patient_name}</td>

                <td className="p-3">
                  {new Date(a.appointment_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="p-3">{a.appointment_time}</td>

                {/* 🎯 Status Badge */}
                <td className="p-3 text-center">
                  {a.status === "SCHEDULED" && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      Scheduled
                    </span>
                  )}

                  {a.status === "COMPLETED" && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Completed
                    </span>
                  )}

                  {a.status === "CANCELLED" && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      Cancelled
                    </span>
                  )}
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}

export default DoctorSchedule;