import { useEffect, useState } from "react";
import API from "../../api/axios";

function Doctors() {
  // ---------------------------------------------------------
  // Initial form values
  // This is the default/empty form used when adding a doctor.
  // ---------------------------------------------------------
  const initialForm = {
    name: "",
    dob: "",
    specialization: "",
    phone: "",
    address: "",
    email: "",
    gender: "",
    qualification: "",
    experience_years: "",
    consultation_fee: "",
    joining_date: "",
    status: "Active",
  };

  // ---------------------------------------------------------
  // State variables
  // ---------------------------------------------------------

  // Stores all doctors received from the backend
  const [doctors, setDoctors] = useState([]);

  // Stores the ID of the doctor currently being edited
  // null means we are adding a new doctor
  const [editingId, setEditingId] = useState(null);

  // Controls whether the Add/Edit form is visible
  const [showForm, setShowForm] = useState(false);

  // Stores the search text
  const [search, setSearch] = useState("");

  // Controls loading state while fetching doctors
  const [loading, setLoading] = useState(false);

  // Stores form data
  const [form, setForm] = useState(initialForm);

  // Stores the doctor selected for viewing
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Controls whether the View modal is visible
  const [showViewModal, setShowViewModal] = useState(false);

  // ---------------------------------------------------------
  // Get token from sessionStorage
  // ---------------------------------------------------------
  const token = sessionStorage.getItem("token");

  // Axios headers used for authenticated API requests
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ---------------------------------------------------------
  // Fetch all doctors
  // ---------------------------------------------------------
  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await API.get("/doctors", headers);

      // Make sure doctors is always an array
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching doctors:", err);

      alert(
        err.response?.data?.message ||
          "Failed to fetch doctors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Fetch doctors when component loads
  // ---------------------------------------------------------
  useEffect(() => {
    fetchDoctors();
  }, []);

  // ---------------------------------------------------------
  // Handle form input changes
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number should contain digits only
    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");

      // Do not allow more than 10 digits
      if (onlyNumbers.length <= 10) {
        setForm((prevForm) => ({
          ...prevForm,
          [name]: onlyNumbers,
        }));
      }

      return;
    }

    // Normal input handling
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------
  // Reset form
  // ---------------------------------------------------------
  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  // ---------------------------------------------------------
  // Open Add Doctor form
  // ---------------------------------------------------------
  const handleAddDoctor = () => {
    resetForm();
    setShowForm(true);
  };

  // ---------------------------------------------------------
  // Close form
  // ---------------------------------------------------------
  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  // ---------------------------------------------------------
  // Add / Update Doctor
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------------------------------
    // Phone validation
    // -------------------------------------------------------
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // -------------------------------------------------------
    // Date of birth validation
    // -------------------------------------------------------
    if (form.dob) {
      const dobDate = new Date(form.dob);
      const today = new Date();

      // Remove time part
      today.setHours(0, 0, 0, 0);

      if (dobDate > today) {
        alert("Date of birth cannot be in the future.");
        return;
      }
    }

    // -------------------------------------------------------
    // Experience validation
    // -------------------------------------------------------
    if (
      form.experience_years !== "" &&
      Number(form.experience_years) < 0
    ) {
      alert("Experience cannot be negative.");
      return;
    }

    // -------------------------------------------------------
    // Consultation fee validation
    // -------------------------------------------------------
    if (
      form.consultation_fee !== "" &&
      Number(form.consultation_fee) < 0
    ) {
      alert("Consultation fee cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      // -----------------------------------------------------
      // UPDATE EXISTING DOCTOR
      // -----------------------------------------------------
      if (editingId !== null) {
        const res = await API.put(
          `/doctors/${editingId}`,
          form,
          headers
        );

        // Update doctor in local state
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.id === editingId
              ? {
                  ...doctor,
                  ...form,
                  ...res.data,
                }
              : doctor
          )
        );

        alert("Doctor updated successfully.");
      }

      // -----------------------------------------------------
      // ADD NEW DOCTOR
      // -----------------------------------------------------
      else {
        const res = await API.post("/doctors", form, headers);

        // Add new doctor to the existing list
        setDoctors((prevDoctors) => [
          ...prevDoctors,
          res.data,
        ]);

        alert("Doctor added successfully.");
      }

      // Reset form after successful operation
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving doctor:", err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while saving the doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // View Doctor
  // ---------------------------------------------------------
  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
  };

  // ---------------------------------------------------------
  // Edit Doctor
  // ---------------------------------------------------------
  const handleEdit = (doctor) => {
    setForm({
      name: doctor.name ?? "",
      dob: doctor.dob ? doctor.dob.split("T")[0] : "",
      specialization: doctor.specialization ?? "",
      phone: doctor.phone ?? "",
      address: doctor.address ?? "",
      email: doctor.email ?? "",
      gender: doctor.gender ?? "",
      qualification: doctor.qualification ?? "",
      experience_years: doctor.experience_years ?? "",
      consultation_fee: doctor.consultation_fee ?? "",
      joining_date: doctor.joining_date
        ? doctor.joining_date.split("T")[0]
        : "",
      status: doctor.status ?? "Active",
    });

    setEditingId(doctor.id);

    // Close view modal if it is open
    setShowViewModal(false);

    // Open edit form
    setShowForm(true);
  };

  // ---------------------------------------------------------
  // Delete Doctor
  // ---------------------------------------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      await API.delete(`/doctors/${id}`, headers);

      // Remove deleted doctor from local state
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.id !== id)
      );

      // If deleted doctor was being viewed, close modal
      if (selectedDoctor?.id === id) {
        setSelectedDoctor(null);
        setShowViewModal(false);
      }

      alert("Doctor deleted successfully.");
    } catch (err) {
      console.error("Error deleting doctor:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Search doctors
  // ---------------------------------------------------------
  const filteredDoctors = doctors.filter((doctor) => {
    const doctorName = doctor.name ?? "";
    const doctorCode = doctor.doctor_code ?? "";
    const specialization = doctor.specialization ?? "";

    const searchText = search.toLowerCase().trim();

    return (
      doctorName.toLowerCase().includes(searchText) ||
      doctorCode.toLowerCase().includes(searchText) ||
      specialization.toLowerCase().includes(searchText)
    );
  });

  // ---------------------------------------------------------
  // Calculate Age
  // ---------------------------------------------------------
  const calculateAge = (dob) => {
    if (!dob) {
      return "";
    }

    const birthDate = new Date(dob);
    const today = new Date();

    let age =
      today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // ---------------------------------------------------------
  // Return JSX
  // ---------------------------------------------------------
  return (
    <div className="p-6 mt-16 bg-white min-h-screen">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Doctors
        </h2>

        <button
          type="button"
          onClick={
            showForm
              ? handleCloseForm
              : handleAddDoctor
          }
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {showForm ? "Close" : "Add Doctor"}
        </button>

      </div>

      {/* =====================================================
          ADD / EDIT FORM
      ====================================================== */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-xl shadow border mb-6"
        >

          {/* Form title */}
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-gray-800">
              {editingId !== null
                ? "Edit Doctor"
                : "Add New Doctor"}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Fill in the doctor information below.
            </p>
          </div>

          {/* =================================================
              FORM FIELDS
          ================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Doctor Name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Doctor Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                required
                placeholder="Enter doctor name"
                value={form.name}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="dob"
                className="text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>

              <input
                id="dob"
                type="date"
                name="dob"
                required
                value={form.dob}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Specialization */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="specialization"
                className="text-sm font-medium text-gray-700"
              >
                Specialization
              </label>

              <input
                id="specialization"
                type="text"
                name="specialization"
                required
                placeholder="Example: Cardiologist"
                value={form.specialization}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>

              <input
                id="phone"
                type="text"
                name="phone"
                required
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter 10 digit phone number"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Email */}
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
                placeholder="doctor@example.com"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="gender"
                className="text-sm font-medium text-gray-700"
              >
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                required
                value={form.gender}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Qualification */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="qualification"
                className="text-sm font-medium text-gray-700"
              >
                Qualification
              </label>

              <input
                id="qualification"
                type="text"
                name="qualification"
                required
                placeholder="Example: MBBS, MD"
                value={form.qualification}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="experience_years"
                className="text-sm font-medium text-gray-700"
              >
                Experience (Years)
              </label>

              <input
                id="experience_years"
                type="number"
                name="experience_years"
                required
                min="0"
                step="1"
                placeholder="Example: 5"
                value={form.experience_years}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Consultation Fee */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="consultation_fee"
                className="text-sm font-medium text-gray-700"
              >
                Consultation Fee
              </label>

              <input
                id="consultation_fee"
                type="number"
                name="consultation_fee"
                min="0"
                step="0.01"
                placeholder="Example: 500"
                value={form.consultation_fee}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Joining Date */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="joining_date"
                className="text-sm font-medium text-gray-700"
              >
                Joining Date
              </label>

              <input
                id="joining_date"
                type="date"
                name="joining_date"
                value={form.joining_date}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Doctor Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                required
                rows="4"
                placeholder="Enter doctor address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
              />
            </div>

          </div>

          {/* =================================================
              FORM BUTTONS
          ================================================== */}
          <div className="flex justify-end gap-3 mt-5">

            <button
              type="button"
              onClick={handleCloseForm}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : editingId !== null
                ? "Update Doctor"
                : "Add Doctor"}
            </button>

          </div>

        </form>
      )}

      {/* =====================================================
          SEARCH
      ====================================================== */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, doctor code or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-96"
        />
      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}
      {loading && doctors.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          Loading doctors...
        </p>
      ) : (
        /* ===================================================
           RESPONSIVE TABLE
        ==================================================== */
        <div className="overflow-x-auto">

          <table className="w-full border bg-white rounded-lg shadow overflow-hidden">

            {/* Table Header */}
            <thead className="bg-gray-200 text-gray-700">

              <tr>

                <th className="p-3 text-left">
                  S.No
                </th>

                <th className="p-3 text-left">
                  Doctor Code
                </th>

                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Specialization
                </th>

                <th className="p-3 text-left">
                  Contact No
                </th>

                <th className="p-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            {/* Table Body */}
            <tbody>

              {filteredDoctors.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-6 text-gray-500"
                  >
                    No doctors found
                  </td>

                </tr>

              ) : (

                filteredDoctors.map((doctor, index) => (

                  <tr
                    key={doctor.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* S.No */}
                    <td className="p-3 font-medium">
                      {index + 1}
                    </td>

                    {/* Doctor Code */}
                    <td className="p-3 text-blue-600 font-semibold">
                      {doctor.doctor_code || "N/A"}
                    </td>

                    {/* Name */}
                    <td className="p-3">
                      {doctor.name || "N/A"}
                    </td>

                    {/* Specialization */}
                    <td className="p-3">
                      {doctor.specialization || "N/A"}
                    </td>

                    {/* Phone */}
                    <td className="p-3">
                      {doctor.phone || "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="p-3">

                      <div className="flex justify-center gap-2 flex-wrap">

                        {/* View */}
                        <button
                          type="button"
                          onClick={() =>
                            handleView(doctor)
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          👁 View
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(doctor)
                          }
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          ✏ Edit
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(doctor.id)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>
      )}

      {/* =====================================================
          VIEW DOCTOR MODAL
      ====================================================== */}
      {showViewModal && selectedDoctor && (

        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowViewModal(false)}
        >

          {/* Modal */}
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* =================================================
                MODAL HEADER
            ================================================== */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-8 rounded-t-2xl relative">

              {/* Close button */}
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedDoctor(null);
                }}
                className="absolute right-5 top-5 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 hover:scale-110 transition-all duration-200"
                aria-label="Close modal"
              >
                <span className="text-lg leading-none">
                  ✕
                </span>
              </button>

              {/* Doctor heading */}
              <div className="flex items-center gap-4">

                {/* Doctor initial */}
                <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold shadow-md">

                  {selectedDoctor.name
                    ?.charAt(0)
                    .toUpperCase() || "D"}

                </div>

                <div>

                  <h2 className="text-2xl font-bold">
                    Dr. {selectedDoctor.name || "Unknown"}
                  </h2>

                  <p className="text-blue-100">
                    Doctor ID:{" "}
                    {selectedDoctor.doctor_code || "N/A"}
                  </p>

                  {/* Status */}
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      selectedDoctor.status === "Active"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {selectedDoctor.status || "Active"}
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                MODAL BODY
            ================================================== */}
            <div className="p-6">

              {/* =================================================
                  PROFESSIONAL INFORMATION
              ================================================== */}
              <div className="mb-8">

                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  👨‍⚕️ Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Full Name */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Full Name
                    </p>

                    <p className="font-semibold">
                      Dr. {selectedDoctor.name || "-"}
                    </p>

                  </div>

                  {/* Specialization */}
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Specialization
                    </p>

                    <p className="font-bold text-blue-600 text-lg">
                      {selectedDoctor.specialization || "-"}
                    </p>

                  </div>

                  {/* Gender */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Gender
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.gender || "-"}
                    </p>

                  </div>

                  {/* Age */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Age
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.dob
                        ? `${calculateAge(
                            selectedDoctor.dob
                          )} Years`
                        : "-"}
                    </p>

                  </div>

                  {/* Qualification */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Qualification
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.qualification || "-"}
                    </p>

                  </div>

                  {/* Experience */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Experience
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.experience_years ??
                        "-"}{" "}
                      {selectedDoctor.experience_years !==
                      null
                        ? "Years"
                        : ""}
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  CONTACT INFORMATION
              ================================================== */}
              <div className="mb-8">

                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📞 Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Phone */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Phone Number
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.phone || "-"}
                    </p>

                  </div>

                  {/* Email */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Email Address
                    </p>

                    <p className="font-semibold break-all">
                      {selectedDoctor.email || "-"}
                    </p>

                  </div>

                  {/* Address */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl md:col-span-2">

                    <p className="text-xs text-gray-500">
                      Address
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.address || "-"}
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  CONSULTATION DETAILS
              ================================================== */}
              <div className="mb-8">

                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  💰 Consultation Details
                </h3>

                <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                  <p className="text-xs text-gray-500">
                    Consultation Fee
                  </p>

                  <p className="text-3xl font-bold text-green-600">
                    ₹
                    {selectedDoctor.consultation_fee ??
                      "0"}
                  </p>

                </div>

              </div>

              {/* =================================================
                  SYSTEM INFORMATION
              ================================================== */}
              <div>

                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🏥 System Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Doctor Code */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Doctor Code
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.doctor_code || "-"}
                    </p>

                  </div>

                  {/* Joining Date */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Joining Date
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.joining_date
                        ? new Date(
                            selectedDoctor.joining_date
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </p>

                  </div>

                  {/* Date of Birth */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Date of Birth
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.dob
                        ? new Date(
                            selectedDoctor.dob
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </p>

                  </div>

                  {/* Status */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <p className="font-semibold">
                      {selectedDoctor.status || "Active"}
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  MODAL FOOTER
              ================================================== */}
              <div className="mt-8 flex justify-end gap-3">

                {/* Close */}
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedDoctor(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Close
                </button>

                {/* Edit */}
                <button
                  type="button"
                  title="Edit Doctor"
                  onClick={() =>
                    handleEdit(selectedDoctor)
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
                >
                  ✏ Edit Doctor
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Doctors;