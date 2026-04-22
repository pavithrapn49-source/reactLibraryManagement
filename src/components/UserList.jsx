import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api/auth";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users (admin only)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  if (!users || users.length === 0) {
    return <p className="text-gray-500">No users found 📭</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">👥 User List</h2>
      <ul className="space-y-3">
        {users.map((u) => (
          <motion.li
            key={u._id}
            className="border rounded-md p-3 flex justify-between items-center shadow-sm hover:shadow-md transition"
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="text-xs text-blue-600">Role: {u.role}</p>
            </div>
            <button
              onClick={() => handleDelete(u._id)}
              className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
