import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "./context/AuthContext";

// Public Pages
import Home from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

// Admin
import AdminLogin from "./components/admin/adminLogin";
import AdminPanel from "./components/admin/AdminDashboard";
import AddMoney from "./components/admin/AddMoney";
import AdminProtected from "./routes/adminProtectedRoutes";
import AdminLayout from "./components/Layout/AdminLayout";
import UserList from "./components/admin/UserList";

// User Pages
import UserHome from "./pages/UserHome";
import SearchUser from "./pages/SearchUser";
import ChatList from "./pages/ChatList";
import UserProfile from "./pages/UserProfile";
import ChatRoom from "./pages/ChatRoom";
import PrivateRoute from "./routes/protectedRoutes";
import UserLayout from "./components/Layout/userLayout";

const App = () => {
  const { user } = useAuth();

  return (
    <>
      {/* ✅ ToastContainer must be placed once in the root app */}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/profile" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/profile" replace /> : <RegisterPage />}
        />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }
        >
          <Route path="dashboard" element={<AdminPanel />} />
          <Route path="add-money" element={<AddMoney />} />
          <Route path="users" element={<UserList />} />
        </Route>

        {/* User Protected Routes */}
        <Route
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<UserHome />} />
          <Route path="/search" element={<SearchUser />} />
          <Route path="/chats" element={<ChatList />} />
          <Route path="/chats/:userId" element={<ChatRoom />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
