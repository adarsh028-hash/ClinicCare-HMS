import React from "react";
import { Bell } from "lucide-react";
import DropDownProfile from "./DropDownProfile";

const Header = () => {
  return (
    <header className="
      fixed top-0 left-64 right-0 h-16
      bg-white/90 backdrop-blur-md
      border-b border-gray-200
      flex justify-between items-center
      px-6 z-40"
    >
      
      <div className="flex items-center gap-6">
        <h1 className="text-black font-semibold text-lg">
          Admin Panel
        </h1>
        
      </div>

      <div className="flex items-center gap-5">
        
        <div className="
        relative p-2 rounded-full
        hover:bg-gray-100
        transition cursor-pointer"
        >
          <Bell className="w-5 h-5 text-gray-700" />

          <span className="
            absolute top-1 right-1
            w-2 h-2
            bg-red-500 rounded-full"
          ></span>
        </div>

        {/* <div className="w-px h-6 bg-white/40"></div> */}

        <div >
          <span>
            <DropDownProfile />
          </span>
        </div>

      </div>

    </header>
  );
};

export default Header;

// className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-md transition"