import React from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DropDownProfile = () => {
  const navigate = useNavigate();

  // Navigate to profile page when clicked
  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="relative">
      
      {/* PROFILE BUTTON */}
      <button
        onClick={handleProfileClick}
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
        {/* Profile Icon */}
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <User size={16} />
        </div>

        {/* User Information */}
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-gray-800">
            Dr. Admin
          </span>

          <span className="text-xs text-gray-500">
            Administrator
          </span>
        </div>
      </button>

    </div>
  );
};

export default DropDownProfile;