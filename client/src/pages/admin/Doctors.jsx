import { useEffect, useState } from "react";
import API from "../../api/axios";

function Doctors() {

  const initialForm ={
    name: "",
    specialization: "",
    phone:"",
    address:""
  };

  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm)


  const token = sessionStorage.getItem("token");

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchDoctors = async () => {
    try {

      setLoading(true);
      const res = await API.get("/doctors", headers);
      setDoctors(res.data);

    } catch (err) {
      console.log(err);
      alert("Failed to fetch doctors");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  // ➕ Add / ✏️ Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/doctors/${editingId}`, form, headers);

        setDoctors(
          doctors.map((doctor) =>
            doctor.id === editingId
              ? { ...doctor, ...form }
              : doctor
          )
        );
        setEditingId(null);
        
      } else {
        const res = await API.post("/doctors", form, headers);
        setDoctors([...doctors, res.data])
      }

      setForm(initialForm);
      setShowForm(false);

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  // ✏️ Edit
  const handleEdit = (doctor) => {
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      phone:doctor.phone,
      address:doctor.address
    });
    setEditingId(doctor.id);
    setShowForm(true);
  };

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (!window.confirm( "Are you sure you want to delete this doctor?")) return;

    try {
      await API.delete(`/doctors/${id}`, headers);
      setDoctors(prevDoctors =>
        prevDoctors.filter(doctor => doctor.id !== id)
      );
    } catch (err) {
      console.log(err);
       alert("Failed to delete doctor");
    }
  };

  //  Search
  const filteredDoctors = doctors.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 mt-16 bg-white min-h-screen">

      {/* 🔷 Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Doctors</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {showForm ? "Close" : "Add Doctor"}
        </button>
      </div>

      {/* 📝 Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
        >
          <input
            type="text"
            name="name"
            required
            placeholder="Doctor Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="specialization"
            required
            placeholder="Specialization"
            value={form.specialization}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="phone"
            required
            placeholder="Contact Number"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="address"
            required
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded col-span-1 md:col-span-2 hover:bg-blue-600 transition"
          >
            {editingId ? "Update Doctor" : "Add Doctor"}
          </button>
        </form>
      )}

       <input
            type="text"
            placeholder="Search Doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded mb-4 bg-gray-100 w-full md:w-80"
        />

{/* ✅ Loading */}
      {loading ? (
        <p className="text-center text-gray-500">
          Loading doctors...
        </p>
      ) : (

        /* ✅ Responsive Table */
        <div className="overflow-x-auto">

          <table className="w-full border bg-white rounded-lg overflow-hidden shadow">

            {/* Table Header */}
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">S.No</th>
                <th className="p-3 text-left">Doctor ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Specialization</th>
                <th className="p-3 text-left">Contact No</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>

              {filteredDoctors.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
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

                    {/* Doctor ID */}
                    <td className="p-3 text-blue-600 font-semibold">
                      D{doctor.id}
                    </td>

                    {/* Name */}
                    <td className="p-3">
                      {doctor.name}
                    </td>

                    {/* Specialization */}
                    <td className="p-3">
                      {doctor.specialization}
                    </td>

                    {/* Phone */}
                    <td className="p-3">
                      {doctor.phone}
                    </td>

                    {/* Address */}
                    <td className="p-3">
                      {doctor.address}
                    </td>

                    {/* Actions */}
                    <td className="p-3 flex justify-center gap-3">

                      {/* Edit */}
                      <button
                        aria-label="Edit Doctor"
                        onClick={() => handleEdit(doctor)}
                        className="hover:scale-110 transition bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        ✏️Edit
                      </button>

                      {/* Delete */}
                      <button
                        aria-label="Delete Doctor"
                        onClick={() => handleDelete(doctor.id)}
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

export default Doctors;