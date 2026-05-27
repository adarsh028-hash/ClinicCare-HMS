import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
        "/profile",
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        setUser(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-md w-full">
        
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          My Profile
        </h2>

        <div className="space-y-3 text-gray-700">

          <p>
            <span className="font-semibold">User ID:</span> {user.id}
          </p>

          <p>
            <span className="font-semibold">Name:</span> {user.name}
          </p>

          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>

          <p>
            <span className="font-semibold">Role:</span> {user.role}
          </p>

        </div>

      </div>

    </div>
  );
};

export default Profile;