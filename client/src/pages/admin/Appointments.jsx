import { useEffect, useState } from "react";
import API from "../../api/axios";

function Appointments() {
  // ---------------------------------------------------------
  // Initial form values
  // ---------------------------------------------------------
  const initialForm = {
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
  };

  // ---------------------------------------------------------
  // State variables
  // ---------------------------------------------------------

  // Stores all appointments
  const [appointments, setAppointments] = useState([]);

  // Stores all patients for dropdown
  const [patients, setPatients] = useState([]);

  // Stores all doctors for dropdown
  const [doctors, setDoctors] = useState([]);

  // Stores selected date for filtering
  const [selectedDate, setSelectedDate] = useState("");

  // Controls appointment form visibility
  const [showForm, setShowForm] = useState(false);

  // Controls loading state
  const [loading, setLoading] = useState(false);

  // Controls booking state
  const [submitting, setSubmitting] = useState(false);

  // Stores appointment form data
  const [form, setForm] = useState(initialForm);

  // ---------------------------------------------------------
  // Get authentication token
  // ---------------------------------------------------------
  const token = sessionStorage.getItem("token");

  // ---------------------------------------------------------
  // Axios headers
  // ---------------------------------------------------------
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ---------------------------------------------------------
  // Fetch all appointments
  // ---------------------------------------------------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/appointments",
        headers
      );

      setAppointments(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching appointments:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to fetch appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Fetch all patients
  // ---------------------------------------------------------
  const fetchPatients = async () => {
    try {
      const res = await API.get(
        "/patients",
        headers
      );

      setPatients(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching patients:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to fetch patients."
      );
    }
  };

  // ---------------------------------------------------------
  // Fetch all doctors
  // ---------------------------------------------------------
  const fetchDoctors = async () => {
    try {
      const res = await API.get(
        "/doctors",
        headers
      );

      setDoctors(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching doctors:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to fetch doctors."
      );
    }
  };

  // ---------------------------------------------------------
  // Fetch appointments by date
  // ---------------------------------------------------------
  const fetchByDate = async (date) => {
    // If no date is selected,
    // show all appointments.
    if (!date) {
      fetchAppointments();
      return;
    }

    try {
      setLoading(true);

      const res = await API.get(
        `/appointments/by-date?date=${date}`,
        headers
      );

      setAppointments(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Error filtering appointments:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to filter appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Fetch initial data
  // ---------------------------------------------------------
  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  // ---------------------------------------------------------
  // Handle form changes
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------
  // Reset appointment form
  // ---------------------------------------------------------
  const resetForm = () => {
    setForm(initialForm);
  };

  // ---------------------------------------------------------
  // Open booking form
  // ---------------------------------------------------------
  const handleBookAppointment = () => {
    resetForm();
    setShowForm(true);
  };

  // ---------------------------------------------------------
  // Close booking form
  // ---------------------------------------------------------
  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  // ---------------------------------------------------------
  // Get today's date
  // ---------------------------------------------------------
  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ---------------------------------------------------------
  // Book Appointment
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check patient
    if (!form.patient_id) {
      alert("Please select a patient.");
      return;
    }

    // Check doctor
    if (!form.doctor_id) {
      alert("Please select a doctor.");
      return;
    }

    // Check date
    if (!form.appointment_date) {
      alert("Please select an appointment date.");
      return;
    }

    // Check time
    if (!form.appointment_time) {
      alert("Please select an appointment time.");
      return;
    }

    // Prevent past appointments
    if (
      form.appointment_date < getTodayDate()
    ) {
      alert(
        "Appointment date cannot be in the past."
      );
      return;
    }

    try {
      setSubmitting(true);

      await API.post(
        "/appointments",
        form,
        headers
      );

      alert("Appointment booked successfully.");

      resetForm();
      setShowForm(false);

      // Refresh appointment list
      await fetchAppointments();
    } catch (err) {
      console.error(
        "Error booking appointment:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Something went wrong while booking the appointment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // Delete Appointment
  // ---------------------------------------------------------
  const handleDelete = async (id) => {
    // Ask user for confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      // Delete appointment from backend
      await API.delete(
        `/appointments/${id}`,
        headers
      );

      // Remove appointment from local state
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) =>
            appointment.id !== id
        )
      );

      alert(
        "Appointment deleted successfully."
      );
    } catch (err) {
      console.error(
        "Error deleting appointment:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Handle date filter
  // ---------------------------------------------------------
  const handleDateFilter = (e) => {
    const date = e.target.value;

    setSelectedDate(date);

    fetchByDate(date);
  };

  // ---------------------------------------------------------
  // Reset date filter
  // ---------------------------------------------------------
  const handleResetFilter = () => {
    setSelectedDate("");

    fetchAppointments();
  };

  // ---------------------------------------------------------
  // Format date
  // ---------------------------------------------------------
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString("en-IN");
  };

  // ---------------------------------------------------------
  // Format time
  // ---------------------------------------------------------
  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    const [hours, minutes] = time
      .split(":")
      .map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return time;
    }

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // ---------------------------------------------------------
  // Status badge
  // ---------------------------------------------------------
  const getStatusBadge = (status) => {
    switch (status) {

      // Scheduled
      case "SCHEDULED":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            Scheduled
          </span>
        );

      // Completed
      case "COMPLETED":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            Completed
          </span>
        );

      // Cancelled
      case "CANCELLED":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
            Cancelled
          </span>
        );

      // Unknown status
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {status || "Unknown"}
          </span>
        );
    }
  };

  // ---------------------------------------------------------
  // JSX
  // ---------------------------------------------------------
  return (
    <div className="p-6 mt-16 bg-white min-h-screen">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Appointments
        </h2>

        <button
          type="button"
          onClick={
            showForm
              ? handleCloseForm
              : handleBookAppointment
          }
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {showForm
            ? "Close"
            : "Book Appointment"}
        </button>

      </div>

      {/* =====================================================
          BOOK APPOINTMENT FORM
      ====================================================== */}
      {showForm && (

        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-xl shadow border mb-6"
        >

          {/* Form heading */}
          <div className="mb-5">

            <h3 className="text-xl font-semibold text-gray-800">
              Book New Appointment
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Select a patient, doctor, date and
              time to book an appointment.
            </p>

          </div>

          {/* =================================================
              FORM FIELDS
          ================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Patient */}
            <div className="flex flex-col gap-1">

              <label
                htmlFor="patient_id"
                className="text-sm font-medium text-gray-700"
              >
                Patient
              </label>

              <select
                id="patient_id"
                name="patient_id"
                required
                value={form.patient_id}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >

                <option value="">
                  Select Patient
                </option>

                {patients.map((patient) => (

                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.name ||
                      "Unknown Patient"}

                    {patient.patient_code
                      ? ` (${patient.patient_code})`
                      : ""}
                  </option>

                ))}

              </select>

            </div>

            {/* Doctor */}
            <div className="flex flex-col gap-1">

              <label
                htmlFor="doctor_id"
                className="text-sm font-medium text-gray-700"
              >
                Doctor
              </label>

              <select
                id="doctor_id"
                name="doctor_id"
                required
                value={form.doctor_id}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >

                <option value="">
                  Select Doctor
                </option>

                {doctors.map((doctor) => (

                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    Dr.{" "}
                    {doctor.name ||
                      "Unknown Doctor"}

                    {doctor.specialization
                      ? ` - ${doctor.specialization}`
                      : ""}
                  </option>

                ))}

              </select>

            </div>

            {/* Appointment Date */}
            <div className="flex flex-col gap-1">

              <label
                htmlFor="appointment_date"
                className="text-sm font-medium text-gray-700"
              >
                Appointment Date
              </label>

              <input
                id="appointment_date"
                type="date"
                name="appointment_date"
                required
                min={getTodayDate()}
                value={form.appointment_date}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />

            </div>

            {/* Appointment Time */}
            <div className="flex flex-col gap-1">

              <label
                htmlFor="appointment_time"
                className="text-sm font-medium text-gray-700"
              >
                Appointment Time
              </label>

              <input
                id="appointment_time"
                type="time"
                name="appointment_time"
                required
                value={form.appointment_time}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />

            </div>

          </div>

          {/* =================================================
              FORM BUTTONS
          ================================================== */}
          <div className="flex justify-end gap-3 mt-5">

            {/* Cancel */}
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            {/* Confirm */}
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Booking..."
                : "Confirm Booking"}
            </button>

          </div>

        </form>

      )}

      {/* =====================================================
          DATE FILTER
      ====================================================== */}
      <div className="bg-white p-5 rounded-xl shadow border mb-6">

        <div className="flex flex-col md:flex-row md:items-end gap-4">

          {/* Date */}
          <div className="flex flex-col gap-1">

            <label
              htmlFor="selectedDate"
              className="text-sm font-medium text-gray-700"
            >
              Filter by Date
            </label>

            <input
              id="selectedDate"
              type="date"
              value={selectedDate}
              onChange={handleDateFilter}
              className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />

          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={handleResetFilter}
            className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>

        </div>

      </div>

      {/* =====================================================
          APPOINTMENT TABLE
      ====================================================== */}
      {loading ? (

        <p className="text-center text-gray-500 py-8">
          Loading appointments...
        </p>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full border bg-white rounded-lg shadow overflow-hidden">

            {/* Table Header */}
            <thead className="bg-gray-200 text-gray-700">

              <tr>

                <th className="p-3 text-left">
                  S.No
                </th>

                <th className="p-3 text-left">
                  Appt ID
                </th>

                <th className="p-3 text-left">
                  Patient
                </th>

                <th className="p-3 text-left">
                  Doctor
                </th>

                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Time
                </th>

                <th className="p-3 text-center">
                  Status
                </th>

                <th className="p-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            {/* Table Body */}
            <tbody>

              {appointments.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center p-6 text-gray-500"
                  >
                    No appointments found 😕
                  </td>

                </tr>

              ) : (

                appointments.map(
                  (appointment, index) => (

                    <tr
                      key={appointment.id}
                      className="border-t hover:bg-gray-50 transition"
                    >

                      {/* S.No */}
                      <td className="p-3 font-medium">
                        {index + 1}
                      </td>

                      {/* Appointment ID */}
                      <td className="p-3 text-blue-600 font-semibold">
                        A{appointment.id}
                      </td>

                      {/* Patient */}
                      <td className="p-3">
                        {appointment.patient_name ||
                          "N/A"}
                      </td>

                      {/* Doctor */}
                      <td className="p-3">
                        {appointment.doctor_name
                          ? `Dr. ${appointment.doctor_name}`
                          : "N/A"}
                      </td>

                      {/* Date */}
                      <td className="p-3">
                        {formatDate(
                          appointment.appointment_date
                        )}
                      </td>

                      {/* Time */}
                      <td className="p-3">
                        {formatTime(
                          appointment.appointment_time
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3 text-center">
                        {getStatusBadge(
                          appointment.status
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3">

                        <div className="flex justify-center">

                          {/* Delete */}
                          <button
                            type="button"
                            title="Delete Appointment"
                            onClick={() =>
                              handleDelete(
                                appointment.id
                              )
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          >
                            🗑 Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Appointments;

