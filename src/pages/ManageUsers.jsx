import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/manageUsers.css";

const ManageUsers = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "/users",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log(res.data);

      setUsers(
        Array.isArray(res.data)
          ? res.data
          : res.data.users || []
      );

    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to fetch users"
      );
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchUsers();
    }
  }, [user]);

  return (
    <div className="manage-users-container">

      <h2 className="manage-title">
        👥 Manage Users
      </h2>

      {users.length === 0 ? (

        <p className="no-users">
          No users found
        </p>

      ) : (

        <div className="user-grid">

          {users.map((u) => (

            <div
              key={u._id}
              className="user-card"
            >

              <h3>{u.name}</h3>

              <p>{u.email}</p>

              <span className="role-badge">
                {u.role}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default ManageUsers;