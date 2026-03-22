import { useEffect, useState } from "react";
import API from "../api/axios";

function Appointments() {

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: ""
  });

  const token = sessionStorage.getItem("token");

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments", headers);
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients", headers);
      setPatients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors", headers);
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchByDate = async (date) => {
    try {
      const res = await API.get(`/appointments/by-date?date=${date}`, headers);
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/appointments", form, headers);

      setForm({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: ""
      });

      setShowForm(false);
      fetchAppointments();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* 🔷 Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Appointments</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? "Close" : "Book Appointment"}
        </button>
      </div>

      {/* 📝 Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 bg-white p-5 rounded-lg shadow mb-6"
        >
          <select
            className="border p-2 rounded"
            value={form.patient_id}
            onChange={(e) =>
              setForm({ ...form, patient_id: e.target.value })
            }
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={form.doctor_id}
            onChange={(e) =>
              setForm({ ...form, doctor_id: e.target.value })
            }
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={form.appointment_date}
            onChange={(e) =>
              setForm({ ...form, appointment_date: e.target.value })
            }
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={form.appointment_time}
            onChange={(e) =>
              setForm({ ...form, appointment_time: e.target.value })
            }
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded col-span-2 hover:bg-blue-600"
          >
            Confirm Booking
          </button>
        </form>
      )}

      {/* 📅 Filter */}
      <div className="bg-white p-4 rounded shadow mb-6 flex items-center gap-4">
        <span className="font-semibold">Filter by Date:</span>

        <input
          type="date"
          className="border p-2 rounded"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            fetchByDate(e.target.value);
          }}
        />

        <button
          onClick={fetchAppointments}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      {/* 📋 Table */}
      <table className="w-full bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-3 text-left">S.No</th>
            <th className="p-3 text-left">Appt ID</th>
            <th className="p-3 text-left">Patient</th>
            <th className="p-3 text-left">Doctor</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-6 text-gray-500">
                No appointments found 😕
              </td>
            </tr>
          ) : (
            appointments.map((a, index) => (
              <tr
                key={a.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{index + 1}</td>

                <td className="p-3 text-blue-600 font-semibold">
                  A{a.id}
                </td>

                <td className="p-3">{a.patient_name}</td>
                <td className="p-3">{a.doctor_name}</td>

                <td className="p-3">
                  {a.appointment_date.split("T")[0]}
                </td>

                <td className="p-3">{a.appointment_time}</td>

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

export default Appointments;