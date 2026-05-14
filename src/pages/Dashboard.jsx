import { Outlet, Navigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div key={user?._id} className="flex min-h-screen bg-gray-50">
      <SideBar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;