import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
// import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import DoctorSchedule from "./pages/DoctorSchedule";


import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

  <Routes>

    {/* Login page WITHOUT layout */}
    <Route path="/" element={<Login />} />

    {/* Pages WITH sidebar layout */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/patients"
      element={
        <ProtectedRoute>
          <Layout>
            <Patients />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/doctors"
      element={
        <ProtectedRoute>
          <Layout>
            <Doctors />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/appointments"
      element={
        <ProtectedRoute>
          <Layout>
            <Appointments />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/doctor-schedule"
      element={
        <ProtectedRoute>
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