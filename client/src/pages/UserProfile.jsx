import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    const requestPermission = () => {
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission !== "granted") {
            setTimeout(requestPermission, 15000); // Ask again every 15 seconds
          }
        });
      }
    };

    requestPermission();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 font-barlow">
      <div className="bg-dark-blue text-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
        <div className="flex flex-col items-center gap-2">
          <img
            src={user?.profileImage}
            alt="User"
            className="w-24 h-24 rounded-full object-cover border-2 border-white shadow"
          />
          <h2 className="text-2xl font-semibold">{user?.name}</h2>
          <p className="text-gray-400">@{user?.username}</p>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <p><span className="text-gray-400">Age:</span> {user?.age}</p>
          <p><span className="text-gray-400">Gender:</span> {user?.gender}</p>
          <p><span className="text-gray-400">Location:</span> {user?.location}</p>
          <p><span className="text-gray-400">Status:</span> {user?.status || 'Active'}</p>
        </div>

        <div className="pt-4">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
