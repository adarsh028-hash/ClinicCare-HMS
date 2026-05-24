import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "./Sidebar.jsx";

const DropDownProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // 👉 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-3 
          bg-white
          px-4 py-2
          rounded-xl
          border border-gray-200
          shadow-sm
          hover:shadow-md
          hover:bg-gray-50
          transition-all duration-200
          cursor-pointer
        "
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <User size={16} />
        </div>

        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-gray-800">
            Dr. Admin
          </span>
          <span className="text-xs text-gray-500">
            Administrator
          </span>
        </div>
      </button>

      {/* DROPDOWN */}
      <div
       className={`
          absolute top-14 right-0
          w-52
          bg-white
          border border-gray-200
          rounded-2xl
          shadow-xl
          py-2
          z-50
          transform transition-all duration-200
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }
        `}
      >
        <ul className="text-sm text-gray-700">
          
          <li
            onClick={() => {
              navigate("/profile");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-blue-100 cursor-pointer"
          >
            <User size={16} /> Profile
          </li>

          <li className="flex items-center gap-2 px-4 py-2 hover:bg-blue-100 cursor-pointer">
            <Settings size={16} /> Settings
          </li>
          <div className="border-t border-gray-300 my-1"></div>

          <li 
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
          onClick={() => handleLogout(navigate)}
          >
            <LogOut size={16} /> Logout
          </li>

        </ul>
      </div>

    </div>
  );
};

export default DropDownProfile;

// "flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"