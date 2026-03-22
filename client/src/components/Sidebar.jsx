import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  // 🔹 Active link highlight
  const linkStyle = (path) =>
    `p-2 rounded transition ${
      location.pathname === path
        ? "bg-white text-blue-500 font-semibold"
        : "hover:bg-white hover:text-blue-400"
    }`;

  return (
    <div className="w-60 h-screen bg-blue-500 text-white fixed flex flex-col justify-between">

      {/* Top Section */}
      <div className="p-6">

        <h2 className="text-3xl font-bold mb-8 tracking-wide">
          ClinicCare
        </h2>

        <nav className="flex flex-col gap-3 text-sm">

          <Link to="/dashboard" className={linkStyle("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/patients" className={linkStyle("/patients")}>
            Patients
          </Link>

          <Link to="/doctors" className={linkStyle("/doctors")}>
            Doctors
          </Link>

          <Link to="/appointments" className={linkStyle("/appointments")}>
            Appointments
          </Link>

          <Link to="/doctor-schedule" className={linkStyle("/doctor-schedule")}>
            Doctor Schedule
          </Link>

        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-blue-400">

        <button
          onClick={handleLogout}
          className="w-full bg-blue-400 hover:bg-white hover:text-red-500 p-2 rounded transition font-medium"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Sidebar;