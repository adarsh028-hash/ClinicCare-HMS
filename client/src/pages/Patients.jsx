import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: ""
  });

  const token = sessionStorage.getItem("token");

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchPatients = useCallback(async () => {
    try {
      const res = await API.get("/patients", headers);
      setPatients(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // ➕ Add / ✏️ Update
  const handleSubmit = async (e) => {
    e.preventDefault();

  // Data Duclication 

  const isDuplicate = patients.some ((p)=> p.phone === form.phone && p.id !== form.id);
  
  
  if (isDuplicate) {

    return alert("patient number alrady exsists")
  };

    try {
      if (editingId) {
        await API.put(`/patients/${editingId}`, form, headers);
      } else {
        await API.post("/patients", form, headers);
      }

      setForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        address: ""
      });

      setEditingId(null);
      setShowForm(false); // ✅ close form after submit
      fetchPatients();

    } catch (err) {
      console.log(err);
    }
  };

  // ✏️ Edit
  const handleEdit = (patient) => {
    setForm(patient);
    setEditingId(patient.id);
    setShowForm(true); // ✅ open form when editing
  };

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;

    try {
      await API.delete(`/patients/${id}`, headers);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // 🔎 Search
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Patients</h2>

        {/* ➕ Toggle Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? "Close" : "Add Patient"}
        </button>
      </div>

      {/* ✅ Form (conditionally shown) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
        >
          <input
            className="border p-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Age"
            value={form.age}
            onChange={(e) =>
              setForm({ ...form, age: e.target.value })
            }
          />

          <select
            className="border p-2 rounded"
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            className="border p-2 rounded"
            maxlength = "10"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            className="border p-2 rounded col-span-2"
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <button
            type="submit"
            className="bg-blue-400 text-white p-2 rounded col-span-2 hover:bg-blue-500"
          >
            {editingId ? "Update Patient" : "Add Patient"}
          </button>
        </form>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search patient..."
        className="border p-2 rounded mb-4"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📋 Table */}
            <table className="w-full border bg-white rounded-lg overflow-hidden shadow">
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
              <td colSpan="8" className="text-center p-6 text-gray-500">
                No patients found 😕
              </td>
            </tr>
          ) : (
            filteredPatients.map((p, index) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* ✅ Serial Number */}
                <td className="p-3 font-medium">{index + 1}</td>

                {/* ✅ Patient ID */}
                <td className="p-3 text-blue-600 font-semibold">
                  P{p.id}
                </td>

                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.age}</td>
                <td className="p-3">{p.gender}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">{p.address}</td>

                {/* 🎯 Actions */}
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    // className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    // className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm"
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

export default Patients;