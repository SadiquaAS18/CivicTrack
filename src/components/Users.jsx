import { useState, useEffect } from "react";
import {
  Search,
  Users as UsersIcon,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";

import "./Users.css";

// Sample users
const initialUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "Citizen",
    joined: "01 Nov 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Kumar",
    email: "priya@gmail.com",
    role: "Citizen",
    joined: "02 Nov 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "Arjun Rao",
    email: "arjun@gmail.com",
    role: "Department Staff",
    joined: "03 Nov 2026",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@gmail.com",
    role: "Citizen",
    joined: "04 Nov 2026",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Kiran Kumar",
    email: "kiran@gmail.com",
    role: "Department Staff",
    joined: "05 Nov 2026",
    status: "Active",
  },
];

function Users() {
  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem("civicTrackUsers");
      return savedUsers ? JSON.parse(savedUsers) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Save users
  useEffect(() => {
    localStorage.setItem("civicTrackUsers", JSON.stringify(users));
  }, [users]);

  // Change user status
  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  // Search and filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || user.status === filter;

    return matchesSearch && matchesFilter;
  });

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  return (
    <div className="users-container">

      {/* PAGE HEADER */}
      <div className="users-header">
        <div>
          <h2>User Management</h2>
          <p>View and manage CivicTrack platform users.</p>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="users-stats">

        <div className="user-stat-card">
          <div className="user-stat-icon blue">
            <UsersIcon />
          </div>
          <div>
            <p>Total Users</p>
            <h2>{users.length}</h2>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon green">
            <UserCheck />
          </div>
          <div>
            <p>Active Users</p>
            <h2>{activeUsers}</h2>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon orange">
            <UserX />
          </div>
          <div>
            <p>Inactive Users</p>
            <h2>{inactiveUsers}</h2>
          </div>
        </div>

      </div>

      {/* USER TABLE */}
      <div className="users-table-panel">

        <div className="users-table-header">
          <h3>Registered Users</h3>

          <div className="users-controls">

            <div className="users-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Users</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

          </div>
        </div>

        <div className="users-table-wrapper">

          <table className="users-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => (
                <tr key={user.id}>

                  <td>
                    <div className="user-name-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>

                      <strong>{user.name}</strong>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className="user-role">
                      {user.role === "Department Staff" && (
                        <ShieldCheck size={14} />
                      )}
                      {user.role}
                    </span>
                  </td>

                  <td>{user.joined}</td>

                  <td>
                    <span
                      className={`user-status ${
                        user.status.toLowerCase()
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className={`user-action ${
                        user.status === "Active"
                          ? "deactivate"
                          : "activate"
                      }`}
                      onClick={() => toggleStatus(user.id)}
                    >
                      {user.status === "Active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {filteredUsers.length === 0 && (
            <p className="users-empty">
              No users found.
            </p>
          )}

        </div>

        <div className="users-footer">
          Showing {filteredUsers.length} of {users.length} users
        </div>

      </div>

    </div>
  );
}

export default Users;