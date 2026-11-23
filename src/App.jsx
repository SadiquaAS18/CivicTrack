import { useState, useEffect } from "react";

import ReportIssue from "./components/ReportIssue";
import ComplaintMap from "./components/ComplaintMap";
import UsersManagement from "./components/Users";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import Login from "./components/Login";

import {
  LayoutDashboard,
  FileText,
  MapPin,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  Bell,
  Search,
  Plus,
  Menu,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  LogOut,
  Trash2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "./App.css";

const initialComplaints = [
  {
    id: "CT001",
    title: "Garbage accumulation",
    category: "Garbage Collection",
    location: "Vijayanagar",
    date: "09 Nov 2026",
    status: "Pending",
  },
  {
    id: "CT002",
    title: "Damaged road",
    category: "Road Maintenance",
    location: "Hebbal",
    date: "08 Nov 2026",
    status: "In Progress",
  },
  {
    id: "CT003",
    title: "Streetlight not working",
    category: "Electricity",
    location: "Kuvempunagar",
    date: "08 Nov 2026",
    status: "Resolved",
  },
  {
    id: "CT004",
    title: "Water leakage",
    category: "Water Supply",
    location: "Jayalakshmipuram",
    date: "07 Nov 2026",
    status: "Pending",
  },
];

const chartData = [
  { month: "Jun", complaints: 35 },
  { month: "Jul", complaints: 48 },
  { month: "Aug", complaints: 42 },
  { month: "Sep", complaints: 65 },
  { month: "Oct", complaints: 58 },
  { month: "Nov", complaints: 72 },
];

function App() {
  // LOGIN STATE
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("civicTrackUser")
      );
    } catch {
      return null;
    }
  });

  // NAVIGATION
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isAdmin = currentUser?.role === "Admin";

  // LOGIN HANDLER
  const handleLogin = (user) => {
    sessionStorage.setItem(
      "civicTrackUser",
      JSON.stringify(user)
    );

    setCurrentUser(user);
    setActivePage("Dashboard");
  };

  // LOGOUT HANDLER
  const handleLogout = () => {
    sessionStorage.removeItem("civicTrackUser");

    setCurrentUser(null);
    setActivePage("Dashboard");
    setMenuOpen(false);
  };

  // NOTIFICATIONS
  const [notifications, setNotifications] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("civicTrackNotifications")
        ) || []
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "civicTrackNotifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  // COMPLAINTS
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "civicTrackComplaints"
      );

      return saved
        ? JSON.parse(saved)
        : initialComplaints;
    } catch {
      return initialComplaints;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "civicTrackComplaints",
      JSON.stringify(complaints)
    );
  }, [complaints]);

  // ADD NOTIFICATION
  const addNotification = (message) => {
    const newNotification = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      date: new Date().toLocaleString(),
      read: false,
    };

    setNotifications((prev) => [
      newNotification,
      ...prev,
    ]);
  };

  // ADD COMPLAINT
  const handleAddComplaint = (newComplaint) => {
    const complaint = {
      ...newComplaint,
      id: `CT${String(Date.now()).slice(-6)}`,
    };

    setComplaints((prev) => [
      complaint,
      ...prev,
    ]);

    addNotification(
      `New complaint reported: ${complaint.title}`
    );

    setActivePage("Complaints");
  };

  // UPDATE COMPLAINT STATUS
  const handleStatusChange = (id, newStatus) => {
    if (!isAdmin) return;

    const complaint = complaints.find(
      (item) => item.id === id
    );

    if (!complaint || complaint.status === newStatus) {
      return;
    }

    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus }
          : item
      )
    );

    addNotification(
      `Complaint ${id} status changed to ${newStatus}`
    );
  };

  // DELETE COMPLAINT
  const handleDeleteComplaint = (id) => {
    if (!isAdmin) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (confirmDelete) {
      setComplaints((prev) =>
        prev.filter((item) => item.id !== id)
      );
    }
  };

  // NOTIFICATION CLICK
  const handleNotificationClick = (notificationId) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId
          ? { ...item, read: true }
          : item
      )
    );

    setActivePage("Complaints");
    setNotificationOpen(false);
  };

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  // ROLE-BASED NAVIGATION
  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Complaints", icon: FileText },
    { name: "Report an Issue", icon: Plus },
    { name: "Locations", icon: MapPin },

    ...(isAdmin
      ? [
          { name: "Users", icon: Users },
          { name: "Analytics", icon: BarChart3 },
          { name: "Settings", icon: SettingsIcon },
        ]
      : []),
  ];

  // SEARCH
  const filteredComplaints = complaints.filter((item) =>
    `${item.id} ${item.title} ${item.category} ${item.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // STATISTICS
  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const resolutionRate =
    totalComplaints === 0
      ? 0
      : Math.round(
          (resolvedComplaints / totalComplaints) * 100
        );

  // SHOW LOGIN PAGE
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>

        <div className="brand">
          <div className="brand-icon">
            <MapPin size={25} />
          </div>

          <div>
            <h2>CivicTrack</h2>
            <span>Smart City Portal</span>
          </div>
        </div>

        <p className="menu-heading">MAIN MENU</p>

        <nav>
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={
                  activePage === item.name
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => {
                  setActivePage(item.name);
                  setMenuOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* PROFILE */}
        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">
              {isAdmin ? "AD" : "CT"}
            </div>

            <div>
              <strong>{currentUser.name}</strong>
              <small>{currentUser.role}</small>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu />
          </button>

          <div>
            <h2>{activePage}</h2>
            <p>
              Welcome back, {currentUser.name}!
            </p>
          </div>

          <div className="topbar-actions">

            {/* SEARCH */}
            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* NOTIFICATIONS */}
            <div className="notification-wrapper">

              <button
                className="notification"
                onClick={() =>
                  setNotificationOpen(!notificationOpen)
                }
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="notification-dot"></span>
                )}
              </button>

              {notificationOpen && (
                <div className="notification-dropdown">

                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <span>{unreadCount} unread</span>
                  </div>

                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((item) => (
                      <div
                        className="notification-item"
                        key={item.id}
                        onClick={() =>
                          handleNotificationClick(item.id)
                        }
                        style={{
                          cursor: "pointer",
                          background: item.read
                            ? "white"
                            : "#f0f6ff",
                        }}
                      >
                        <div className="notification-icon">
                          <Bell size={16} />
                        </div>

                        <div>
                          <strong>{item.message}</strong>
                          <p>{item.date}</p>

                          {!item.read && (
                            <small style={{ color: "#3977e8" }}>
                              New
                            </small>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">
                      No notifications available.
                    </p>
                  )}

                </div>
              )}

            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="dashboard-content">

          {/* REPORT ISSUE */}
          {activePage === "Report an Issue" && (
            <ReportIssue onSubmit={handleAddComplaint} />
          )}

          {/* COMPLAINTS */}
          {activePage === "Complaints" && (
            <div className="dashboard-section">

              <div className="section-header">
                <h2>All Complaints</h2>

                <span>
                  {filteredComplaints.length} complaints found
                </span>
              </div>

              <div className="table-container">

                <table>
                  <thead>
                    <tr>
                      <th>Complaint ID</th>
                      <th>Issue</th>
                      <th>Category</th>
                      <th>Location Coordinates</th>
                      <th>Image</th>
                      <th>Date</th>
                      <th>Status</th>
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredComplaints.map((item) => (
                      <tr key={item.id}>

                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.category}</td>

                        <td>
                          {item.location}

                          {item.coordinates && (
                            <small className="coordinate-text">
                              {item.coordinates[0].toFixed(4)},
                              {item.coordinates[1].toFixed(4)}
                            </small>
                          )}
                        </td>

                        <td>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt="Complaint"
                              className="complaint-thumbnail"
                            />
                          ) : (
                            "No image"
                          )}
                        </td>

                        <td>{item.date}</td>

                        <td>
                          {isAdmin ? (
                            <select
                              className="status-select"
                              value={item.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  item.id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="Pending">
                                Pending
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Resolved">
                                Resolved
                              </option>
                            </select>
                          ) : (
                            <span
                              className={`status ${item.status
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {item.status}
                            </span>
                          )}
                        </td>

                        {isAdmin && (
                          <td>
                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDeleteComplaint(item.id)
                              }
                              title="Delete complaint"
                            >
                              <Trash2 size={17} />
                              Delete
                            </button>
                          </td>
                        )}

                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredComplaints.length === 0 && (
                  <p className="empty-message">
                    No matching complaints found.
                  </p>
                )}

              </div>
            </div>
          )}

          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <>

              <div className="welcome-section">

                <div>
                  <h1>City Dashboard</h1>
                  <p>
                    Monitor and manage public issues efficiently.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() =>
                    setActivePage("Report an Issue")
                  }
                >
                  <Plus size={18} />
                  Report New Issue
                </button>

              </div>

              {/* STATISTICS */}
              <div className="stats-grid">

                <StatCard
                  title="Total Complaints"
                  value={totalComplaints}
                  change="Total reported"
                  icon={<FileText />}
                  color="blue"
                />

                <StatCard
                  title="Pending Issues"
                  value={pendingComplaints}
                  change="Awaiting action"
                  icon={<Clock />}
                  color="orange"
                />

                <StatCard
                  title="In Progress"
                  value={inProgressComplaints}
                  change="Currently processing"
                  icon={<AlertCircle />}
                  color="purple"
                />

                <StatCard
                  title="Resolved Issues"
                  value={resolvedComplaints}
                  change="Successfully resolved"
                  icon={<CheckCircle />}
                  color="green"
                />

              </div>

              {/* CHARTS */}
              <div className="dashboard-grid">

                <div className="panel chart-panel">

                  <div className="panel-heading">
                    <div>
                      <h3>Complaint Overview</h3>
                      <p>Sample monthly complaint statistics</p>
                    </div>

                    <span className="chart-label">2026</span>
                  </div>

                  <div className="chart-container">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart data={chartData}>

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />

                        <Bar
                          dataKey="complaints"
                          fill="#3977e8"
                          radius={[6, 6, 0, 0]}
                        />

                      </BarChart>
                    </ResponsiveContainer>

                  </div>
                </div>

                {/* RESOLUTION SUMMARY */}
                <div className="panel resolution-panel">

                  <h3>Resolution Summary</h3>
                  <p>Overall complaint resolution</p>

                  <div
                    className="progress-circle"
                    style={{
                      background: `conic-gradient(#21b573 ${
                        resolutionRate * 3.6
                      }deg, #edf0f5 0deg)`,
                    }}
                  >
                    <div>
                      <strong>{resolutionRate}%</strong>
                      <small>Resolved</small>
                    </div>
                  </div>

                  <div className="resolution-info">
                    <span>
                      <i className="dot green-dot"></i>
                      Resolved
                    </span>
                    <strong>{resolvedComplaints}</strong>
                  </div>

                  <div className="resolution-info">
                    <span>
                      <i className="dot orange-dot"></i>
                      Pending
                    </span>
                    <strong>{pendingComplaints}</strong>
                  </div>

                  <div className="resolution-info">
                    <span>
                      <i className="dot purple-dot"></i>
                      In Progress
                    </span>
                    <strong>{inProgressComplaints}</strong>
                  </div>

                </div>

              </div>

              {/* RECENT COMPLAINTS */}
              <div className="panel complaints-panel">

                <div className="panel-heading">
                  <div>
                    <h3>Recent Complaints</h3>
                    <p>
                      Latest public issues reported by citizens
                    </p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() =>
                      setActivePage("Complaints")
                    }
                  >
                    View All
                  </button>
                </div>

                <div className="table-wrapper">

                  <table>
                    <thead>
                      <tr>
                        <th>Complaint ID</th>
                        <th>Issue</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredComplaints.slice(0, 5).map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>

                          <td className="issue-name">
                            {item.title}
                          </td>

                          <td>{item.category}</td>
                          <td>{item.location}</td>
                          <td>{item.date}</td>

                          <td>
                            <span
                              className={`status ${item.status
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredComplaints.length === 0 && (
                    <p className="empty-message">
                      No matching complaints found.
                    </p>
                  )}

                </div>
              </div>

              <footer>
                © 2026 CivicTrack. Smart solutions for better communities.
              </footer>

            </>
          )}

          {/* LOCATIONS */}
          {activePage === "Locations" && (
            <ComplaintMap complaints={complaints} />
          )}

          {/* USERS - ADMIN ONLY */}
          {activePage === "Users" && isAdmin && (
            <UsersManagement />
          )}

          {/* ANALYTICS - ADMIN ONLY */}
          {activePage === "Analytics" && isAdmin && (
            <Analytics complaints={complaints} />
          )}

          {/* SETTINGS - ADMIN ONLY */}
          {activePage === "Settings" && isAdmin && (
            <Settings />
          )}

        </section>
      </main>
    </div>
  );
}

// STATISTICS CARD
function StatCard({ title, value, change, icon, color }) {
  return (
    <div className="stat-card">

      <div className={`stat-icon ${color}`}>
        {icon}
      </div>

      <p>{title}</p>

      <div className="stat-bottom">
        <h2>{value}</h2>

        <span>
          <TrendingUp size={14} /> {change}
        </span>
      </div>

    </div>
  );
}

export default App;