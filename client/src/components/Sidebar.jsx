import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, User, Calendar, Clock,LogOut} from "lucide-react";
import logo from "../assets/public/clinic_Logo.png";

  export const handleLogout = (navigate) => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const linkStyle = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
        : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
    }`;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed top-0 left-0 flex flex-col justify-between px-4 py-6 z-50 ">
      
      {/* Top */}
      <div>
         {/* Logo */}
        <div className="flex items-center mb-10 ">

          <div className="flex items-center justify-center ">
            <img
              src={logo}
              alt="ClinicCare Logo"
              className="w-14 h-14 object-contain hover:scale-105
              transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col justify-center ">
            <h2 className=" text-xl text-xl font-bold text-gray-800 tracking-wide leading-none">
              ClinicCare
            </h2>

            <p className="text-xs text-gray-500 mt-1  tracking-wide">
              Hospital Management
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-sm">          
          
          <Link to="/dashboard" className={linkStyle("/dashboard")}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link to="/patients" className={linkStyle("/patients")}>
            <Users size={18} /> Patients
          </Link>

          <Link to="/doctors" className={linkStyle("/doctors")}>
            <User size={18} /> Doctors
          </Link>

          <Link to="/appointments" className={linkStyle("/appointments")}>
            <Calendar size={18} /> Appointments
          </Link>

          <Link to="/doctor-schedule" className={linkStyle("/doctor-schedule")}>
            <Clock size={18} /> Doctor Schedule
          </Link>


        </nav>
      </div>

      {/* Bottom */}
      <div>
        <button
          onClick={() => handleLogout(navigate)}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-red-600 hover:shadow-md"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;