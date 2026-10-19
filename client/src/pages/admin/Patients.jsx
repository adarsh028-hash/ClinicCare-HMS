import { useEffect, useState } from "react";
import API from "../../api/axios";

function Patients() {
  // ---------------------------------------------------------
  // Initial form values
  // These are the default values used when adding a patient.
  // ---------------------------------------------------------
  const initialForm = {
    name: "",
    dob: "",
    gender: "",
    phone: "",
    emergency_contact: "",
    blood_group: "",
    email: "",
    address: "",
  };

  // ---------------------------------------------------------
  // State variables
  // ---------------------------------------------------------

  // Stores all patients received from the backend
  const [patients, setPatients] = useState([]);

  // Stores the ID of the patient currently being edited
  // null means we are adding a new patient
  const [editingId, setEditingId] = useState(null);

  // Controls whether Add/Edit form is visible
  const [showForm, setShowForm] = useState(false);

  // Stores search text
  const [search, setSearch] = useState("");

  // Controls loading state
  const [loading, setLoading] = useState(false);

  // Controls submitting state separately from fetching
  const [submitting, setSubmitting] = useState(false);

  // Stores patient selected for viewing
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Controls whether View modal is visible
  const [showViewModal, setShowViewModal] = useState(false);

  // Stores all form values
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
  // Fetch all patients
  // ---------------------------------------------------------
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const res = await API.get("/patients", headers);

      // Make sure patients is always an array
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching patients:", err);

      alert(
        err.response?.data?.message ||
          "Failed to fetch patients. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Fetch patients when component loads
  // ---------------------------------------------------------
  useEffect(() => {
    fetchPatients();
  }, []);

  // ---------------------------------------------------------
  // Handle form input changes
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone numbers should contain digits only
    if (
      name === "phone" ||
      name === "emergency_contact"
    ) {
      const onlyNumbers = value.replace(/\D/g, "");

      // Maximum 10 digits
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
  // Open Add Patient form
  // ---------------------------------------------------------
  const handleAddPatient = () => {
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
  // Add / Update Patient
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------------------------------
    // Phone number validation
    // -------------------------------------------------------
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // -------------------------------------------------------
    // Emergency contact validation
    // Only validate if a value has been entered.
    // -------------------------------------------------------
    if (
      form.emergency_contact &&
      !/^\d{10}$/.test(form.emergency_contact)
    ) {
      alert(
        "Emergency contact must be exactly 10 digits."
      );
      return;
    }

    // -------------------------------------------------------
    // Date of birth validation
    // -------------------------------------------------------
    if (form.dob) {
      const dobDate = new Date(form.dob);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (dobDate > today) {
        alert("Date of birth cannot be in the future.");
        return;
      }
    }

    // -------------------------------------------------------
    // Check duplicate phone number
    // -------------------------------------------------------
    const isDuplicate = patients.some(
      (patient) =>
        patient.phone === form.phone &&
        patient.id !== editingId
    );

    if (isDuplicate) {
      alert("A patient with this phone number already exists.");
      return;
    }

    try {
      setSubmitting(true);

      // -----------------------------------------------------
      // UPDATE EXISTING PATIENT
      // -----------------------------------------------------
      if (editingId !== null) {
        const res = await API.put(
          `/patients/${editingId}`,
          form,
          headers
        );

        // Update patient in local state
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === editingId
              ? {
                  ...patient,
                  ...form,
                  ...res.data,
                }
              : patient
          )
        );

        alert("Patient updated successfully.");
      }

      // -----------------------------------------------------
      // ADD NEW PATIENT
      // -----------------------------------------------------
      else {
        const res = await API.post(
          "/patients",
          form,
          headers
        );

        // Add new patient to local state
        setPatients((prevPatients) => [
          ...prevPatients,
          res.data,
        ]);

        alert("Patient added successfully.");
      }

      // Reset form
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving patient:", err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while saving the patient."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // View Patient
  // ---------------------------------------------------------
  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  // ---------------------------------------------------------
  // Edit Patient
  // ---------------------------------------------------------
  const handleEdit = (patient) => {
    setForm({
      name: patient.name ?? "",
      dob: patient.dob
        ? patient.dob.split("T")[0]
        : "",
      gender: patient.gender ?? "",
      phone: patient.phone ?? "",
      emergency_contact:
        patient.emergency_contact ?? "",
      blood_group: patient.blood_group ?? "",
      email: patient.email ?? "",
      address: patient.address ?? "",
    });

    setEditingId(patient.id);

    // Close view modal
    setShowViewModal(false);

    // Open edit form
    setShowForm(true);
  };

  // ---------------------------------------------------------
  // Delete Patient
  // ---------------------------------------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      await API.delete(`/patients/${id}`, headers);

      // Remove patient from local state
      setPatients((prevPatients) =>
        prevPatients.filter(
          (patient) => patient.id !== id
        )
      );

      // Close modal if deleted patient was being viewed
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
        setShowViewModal(false);
      }

      alert("Patient deleted successfully.");
    } catch (err) {
      console.error("Error deleting patient:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete patient."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Search patients
  // Search by:
  // 1. Patient name
  // 2. Patient code
  // 3. Phone number
  // ---------------------------------------------------------
  const filteredPatients = patients.filter((patient) => {
    const patientName = patient.name ?? "";
    const patientCode = patient.patient_code ?? "";
    const patientPhone = patient.phone ?? "";

    const searchText = search.toLowerCase().trim();

    return (
      patientName.toLowerCase().includes(searchText) ||
      patientCode.toLowerCase().includes(searchText) ||
      patientPhone.includes(searchText)
    );
  });

  // ---------------------------------------------------------
  // Calculate age
  // ---------------------------------------------------------
  const calculateAge = (dob) => {
    if (!dob) {
      return "";
    }

    const birthDate = new Date(dob);
    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

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
  // JSX
  // ---------------------------------------------------------
  return (
    <div className="p-6 mt-16 bg-white min-h-screen">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Patients
        </h2>

        <button
          type="button"
          onClick={
            showForm
              ? handleCloseForm
              : handleAddPatient
          }
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {showForm ? "Close" : "Add Patient"}
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
                ? "Edit Patient"
                : "Add New Patient"}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Fill in the patient information below.
            </p>

          </div>

          {/* =================================================
              FORM FIELDS
          ================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Patient Name */}
            <div className="flex flex-col gap-1">

              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Patient Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                required
                placeholder="Enter patient name"
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
                max={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                value={form.dob}
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

            {/* Phone Number */}
            <div className="flex flex-col gap-1">

              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
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

            {/* Emergency Contact */}
            <div className="flex flex-col gap-1">

              <label
                htmlFor="emergency_contact"
                className="text-sm font-medium text-gray-700"
              >
                Emergency Contact
              </label>

              <input
                id="emergency_contact"
                type="text"
                name="emergency_contact"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter emergency contact"
                value={form.emergency_contact}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />

            </div>

            {/* Blood Group */}
            <div className="flex flex-col gap-1">

              <label
                htmlFor="blood_group"
                className="text-sm font-medium text-gray-700"
              >
                Blood Group
              </label>

              <select
                id="blood_group"
                name="blood_group"
                value={form.blood_group}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >

                <option value="">
                  Select Blood Group
                </option>

                <option value="A+">
                  A+
                </option>

                <option value="A-">
                  A-
                </option>

                <option value="B+">
                  B+
                </option>

                <option value="B-">
                  B-
                </option>

                <option value="AB+">
                  AB+
                </option>

                <option value="AB-">
                  AB-
                </option>

                <option value="O+">
                  O+
                </option>

                <option value="O-">
                  O-
                </option>

              </select>

            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">

              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="patient@example.com"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />

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
                placeholder="Enter patient address"
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
              disabled={submitting}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Saving..."
                : editingId !== null
                ? "Update Patient"
                : "Add Patient"}
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
          placeholder="Search by name, patient code or phone..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border border-gray-300 p-3 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-96"
        />

      </div>

      {/* =====================================================
          LOADING / TABLE
      ====================================================== */}
      {loading && patients.length === 0 ? (

        <p className="text-center text-gray-500 py-8">
          Loading patients...
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
                  Patient Code
                </th>

                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Gender
                </th>

                <th className="p-3 text-left">
                  Phone
                </th>

                <th className="p-3 text-left">
                  Registered On
                </th>

                <th className="p-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            {/* Table Body */}
            <tbody>

              {filteredPatients.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center p-6 text-gray-500"
                  >
                    No patients found
                  </td>

                </tr>

              ) : (

                filteredPatients.map(
                  (patient, index) => (

                    <tr
                      key={patient.id}
                      className="border-t hover:bg-gray-50 transition"
                    >

                      {/* S.No */}
                      <td className="p-3 font-medium">
                        {index + 1}
                      </td>

                      {/* Patient Code */}
                      <td className="p-3 text-blue-600 font-semibold">
                        {patient.patient_code ||
                          "N/A"}
                      </td>

                      {/* Name */}
                      <td className="p-3">
                        {patient.name || "N/A"}
                      </td>

                      {/* Gender */}
                      <td className="p-3">
                        {patient.gender || "N/A"}
                      </td>

                      {/* Phone */}
                      <td className="p-3">
                        {patient.phone || "N/A"}
                      </td>

                      {/* Registered On */}
                      <td className="p-3">
                        {patient.created_at
                          ? new Date(
                              patient.created_at
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                      {/* Actions */}
                      <td className="p-3">

                        <div className="flex justify-center gap-2 flex-wrap">

                          {/* View */}
                          <button
                            type="button"
                            title="View Patient"
                            onClick={() =>
                              handleView(patient)
                            }
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                          >
                            👁 View
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            title="Edit Patient"
                            onClick={() =>
                              handleEdit(patient)
                            }
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                          >
                            ✏ Edit
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            title="Delete Patient"
                            onClick={() =>
                              handleDelete(
                                patient.id
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

      {/* =====================================================
          VIEW PATIENT MODAL
      ====================================================== */}
      {showViewModal && selectedPatient && (

        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowViewModal(false);
            setSelectedPatient(null);
          }}
        >

          {/* Modal */}
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
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
                  setSelectedPatient(null);
                }}
                className="absolute right-5 top-5 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 hover:scale-110 transition-all duration-200 shadow-sm"
                aria-label="Close modal"
              >
                <span className="text-lg leading-none">
                  ✕
                </span>
              </button>

              {/* Patient heading */}
              <div className="flex items-center gap-4">

                {/* Patient initial */}
                <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold shadow-md">

                  {selectedPatient.name
                    ?.charAt(0)
                    .toUpperCase() || "P"}

                </div>

                <div>

                  <h2 className="text-2xl font-bold">
                    {selectedPatient.name ||
                      "Unknown Patient"}
                  </h2>

                  <p className="text-blue-100">
                    Patient ID:{" "}
                    {selectedPatient.patient_code ||
                      "N/A"}
                  </p>

                  <span className="inline-block mt-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Active Patient
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                MODAL BODY
            ================================================== */}
            <div className="p-6">

              {/* =================================================
                  PERSONAL INFORMATION
              ================================================== */}
              <div className="mb-8">

                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  👤 Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Full Name */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Full Name
                    </p>

                    <p className="font-semibold">
                      {selectedPatient.name ||
                        "-"}
                    </p>

                  </div>

                  {/* Gender */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Gender
                    </p>

                    <p className="font-semibold">
                      {selectedPatient.gender ||
                        "-"}
                    </p>

                  </div>

                  {/* Date of Birth */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Date of Birth
                    </p>

                    <p className="font-semibold">
                      {selectedPatient.dob
                        ? new Date(
                            selectedPatient.dob
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </p>

                  </div>

                  {/* Age */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Age
                    </p>

                    <p className="font-semibold">
                      {selectedPatient.dob
                        ? `${calculateAge(
                            selectedPatient.dob
                          )} Years`
                        : "-"}
                    </p>

                  </div>

                  {/* Blood Group */}
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Blood Group
                    </p>

                    <p className="font-bold text-red-600 text-lg">
                      {selectedPatient.blood_group ||
                        "-"}
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
                      {selectedPatient.phone ||
                        "-"}
                    </p>

                  </div>

                  {/* Email */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Email Address
                    </p>

                    <p className="font-semibold break-all">
                      {selectedPatient.email ||
                        "-"}
                    </p>

                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Emergency Contact
                    </p>

                    <p className="font-semibold">
                      {selectedPatient.emergency_contact ||
                        "-"}
                    </p>

                  </div>

                  {/* Address */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl md:col-span-2">

                    <p className="text-xs text-gray-500">
                      Address
                    </p>

                    <p className="font-semibold">
                      {selectedPatient.address ||
                        "-"}
                    </p>

                  </div>

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

                  {/* Patient Code */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Patient Code
                    </p>

                    <p className="font-semibold">
                      {selectedPatient.patient_code ||
                        "-"}
                    </p>

                  </div>

                  {/* Registration Date */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl">

                    <p className="text-xs text-gray-500">
                      Registration Date
                    </p>

                    <p className="font-semibold">
                      {selectedPatient.created_at
                        ? new Date(
                            selectedPatient.created_at
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </p>

                  </div>

                  {/* Last Updated */}
                  <div className="bg-white border shadow-sm hover:shadow-md transition p-4 rounded-xl md:col-span-2">

                    <p className="text-xs text-gray-500">
                      Last Updated
                    </p>

                    <p className="font-semibold">
                      {selectedPatient.updated_at
                        ? new Date(
                            selectedPatient.updated_at
                          ).toLocaleString(
                            "en-IN",
                            {
                              timeZone:
                                "Asia/Kolkata",
                            }
                          )
                        : "-"}
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
                    setSelectedPatient(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Close
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(selectedPatient)
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
                >
                  ✏ Edit Patient
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Patients;

