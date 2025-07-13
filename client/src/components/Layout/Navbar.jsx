import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { Bell, LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import API from "../../utils/api"; // Make sure you have this to fetch unread count


const Navbar = () => {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // 🔹 Fetch initial unread count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await API.get("/chat/unread-count");
        const total = res.data.reduce((acc, item) => acc + item.count, 0);
        setUnreadCount(total);
      } catch (err) {
        console.error("Failed to fetch unread count");
      }
    };

    if (user) {
      fetchUnread();
    }
  }, [user]);

  // 🔹 Setup socket listener
  useEffect(() => {
    if (!user) return;

    socket.emit("join", user._id);

    // 🔔 Handle incoming message notification
    
    return () => {
      socket.off("new_notification");
    };
  }, [user]);

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-zinc-900 shadow-sm sticky top-0 z-50">
      {/* App logo and name */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-7 h-7 text-white" />
        {/* <img src="/logo.png" alt="logo" className="w-8 h-8" /> */}
        <h1 className="text-xl font-bold text-white">ChatSphere</h1>
      </div>

      {/* Notification and logout */}
      <div className="flex items-center gap-4">
       
        <button onClick={logout}>
          <LogOut className="w-6 h-6 text-red-600 hover:text-red-800" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
