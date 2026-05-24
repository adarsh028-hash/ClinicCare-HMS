import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../../api/axios";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  // 🔐 Token
  const token = sessionStorage.getItem("token");

  // Memoized headers
  const headers = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  // Fetch Patients
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/patients", headers);

      setPatients(res.data);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // ✍️ Handle Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🧹 Reset Form
  const resetForm = () => {
    setForm({
      name: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
    });

    setEditingId(null);
  };

  // ➕ Add / ✏️ Update Patient
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Duplicate Phone Validation
    const isDuplicate = patients.some(
      (p) => p.phone === form.phone && p.id !== editingId
    );

    if (isDuplicate) {
      return alert("Patient phone number already exists");
    }

    try {
      if (editingId) {
        // ✏️ Update
        await API.put(`/patients/${editingId}`, form, headers);
        alert("Patient updated successfully");
      } else {
        // ➕ Add
        await API.post("/patients", form, headers);
        alert("Patient added successfully");
      }

      resetForm();
      setShowForm(false);

      fetchPatients();
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // ✏️ Edit Patient
  const handleEdit = (patient) => {
    setForm({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "",
      phone: patient.phone || "",
      address: patient.address || "",
    });

    setEditingId(patient.id);

    setShowForm(true);
  };

  // 🗑 Delete Patient
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/patients/${id}`, headers);

      setPatients((prev) => prev.filter((p) => p.id !== id));

      alert("Patient deleted successfully");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // 🔎 Search Filter
  const filteredPatients = patients.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.phone || "").includes(search)
  );

  return (
    <div className="min-h-screen p-6 bg-white mt-15">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Patients</h2>

        {/* Toggle Form Button */}
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            }

            setShowForm(!showForm);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {showForm ? "Close" : "Add Patient"}
        </button>
      </div>

      {/* ✅ Patient Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
        >
          {/* Name */}
          <input
            required
            type="text"
            name="name"
            className="border p-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          {/* Age */}
          <input
            required
            type="tel"
            min="0"
            name="age"
            className="border p-2 rounded"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />

          {/* Gender */}
          <select
            required
            name="gender"
            className="border p-2 rounded"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Phone */}
          <input
            required
            type="text"
            name="phone"
            maxLength="10"
            pattern="[0-9]{10}"
            className="border p-2 rounded"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          {/* Address */}
          <input
            required
            type="text"
            name="address"
            className="border p-2 rounded md:col-span-2"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded md:col-span-2 hover:bg-blue-600 transition"
          >
            {editingId ? "Update Patient" : "Add Patient"}
          </button>
        </form>
      )}

      {/* 🔎 Search */}
      <input
        type="text"
        placeholder="Search patient by name or phone..."
        className="border p-2 rounded mb-4 bg-gray-100 w-full md:w-80"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📋 Loading */}
      {loading ? (
        <div className="text-center text-lg font-medium mt-10">
          Loading patients...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">S.No</th>
                <th className="p-3 text-left">Patient ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-6 text-gray-500"
                  >
                    No patients found 😕
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p, index) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Serial Number */}
                    <td className="p-3 font-medium">{index + 1}</td>

                    {/* Patient ID */}
                    <td className="p-3 text-blue-600 font-semibold">
                      P{p.id}
                    </td>

                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.age}</td>
                    <td className="p-3">{p.gender}</td>
                    <td className="p-3">{p.phone}</td>
                    <td className="p-3">{p.address}</td>

                    {/* Actions */}
                    <td className="p-3 flex justify-center gap-3">
                      {/* Edit */}
                      <button
                        title="Edit Patient"
                        onClick={() => handleEdit(p)}
                        className="hover:scale-110 transition bg-yellow-500 text-white px-3 py-1 rounded"
                        
                      >
                         ✏️Edit
                      </button>

                      {/* Delete */}
                      <button
                        title="Delete Patient"
                        onClick={() => handleDelete(p.id)}
                        className="hover:scale-110 transition bg-red-500 text-white px-3 py-1 rounded"
                      >
                        🗑️Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Patients;