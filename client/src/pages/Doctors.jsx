import { useEffect, useState } from "react";
import API from "../api/axios";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    specialization: ""
  });

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

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ➕ Add / ✏️ Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/doctors/${editingId}`, form, headers);
        setEditingId(null);
      } else {
        await API.post("/doctors", form, headers);
      }

      setForm({ name: "", specialization: "" });
      setShowForm(false);
      fetchDoctors();

    } catch (err) {
      console.log(err);
    }
  };

  // ✏️ Edit
  const handleEdit = (doctor) => {
    setForm({
      name: doctor.name,
      specialization: doctor.specialization
    });
    setEditingId(doctor.id);
    setShowForm(true);
  };

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;

    try {
      await API.delete(`/doctors/${id}`, headers);
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">

      {/* 🔷 Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Doctors</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? "Close" : "Add Doctor"}
        </button>
      </div>

      {/* 📝 Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
        >
          <input
            className="border p-2 rounded"
            placeholder="Doctor Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) =>
              setForm({ ...form, specialization: e.target.value })
            }
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded col-span-2 hover:bg-blue-600"
          >
            {editingId ? "Update Doctor" : "Add Doctor"}
          </button>
        </form>
      )}

      {/* 📋 Table */}
      <table className="w-full border bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-3 text-left">S.No</th>
            <th className="p-3 text-left">Doctor ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Specialization</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-6 text-gray-500">
                No doctors found 😕
              </td>
            </tr>
          ) : (
            doctors.map((d, index) => (
              <tr
                key={d.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* S.No */}
                <td className="p-3 font-medium">{index + 1}</td>

                {/* Doctor ID */}
                <td className="p-3 text-blue-600 font-semibold">
                  D{d.id}
                </td>

                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.specialization}</td>

                {/* Actions */}
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Doctors;