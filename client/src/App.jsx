import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
// import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import Patients from "./pages/admin/Patients";
import Doctors from "./pages/admin/Doctors";
import Appointments from "./pages/admin/Appointments";
import DoctorSchedule from "./pages/admin/DoctorSchedule";
import Profile from "./pages/Profile.jsx";

import DoctorDashboard from "./pages/doctor/DoctorDashbord.jsx";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

  <Routes>

    {/* Login page WITHOUT layout */}
    <Route path="/" element={<Login />} />
    <Route path="/profile" element={<Profile />} />

    {/* Pages WITH sidebar layout */}

    <Route
      path="/doctor/dashboard"
      element={
        <ProtectedRoute allowedRoles={["doctor"]}>
          <Layout>
            <DoctorDashboard />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/patients"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Layout>
            <Patients />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/doctors"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Layout>
            <Doctors />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/appointments"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Layout>
            <Appointments />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/doctor-schedule"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Layout>
            <DoctorSchedule />
          </Layout>
        </ProtectedRoute>
      }
    />

  </Routes>

</BrowserRouter>
  );
}

export default App;