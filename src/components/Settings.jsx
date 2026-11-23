import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import "./Settings.css";

function Settings() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("civicTrackProfile");

    return saved
      ? JSON.parse(saved)
      : {
          name: "Administrator",
          email: "admin@civictrack.com",
          role: "System Administrator",
        };
  });

  const [notifications, setNotifications] = useState({
    newComplaints: true,
    statusUpdates: true,
    resolvedComplaints: true,
  });

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem(
      "civicTrackProfile",
      JSON.stringify(profile)
    );

    alert("Settings saved successfully!");
  };

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <h2>Settings</h2>
        <p>Manage your account and application preferences.</p>
      </div>

      <div className="settings-card">
        <div className="settings-title">
          <User />
          <div>
            <h3>Admin Profile</h3>
            <p>Manage administrator information.</p>
          </div>
        </div>

        <div className="settings-form">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
            />
          </label>

          <label>
            Role
            <input
              type="text"
              value={profile.role}
              disabled
            />
          </label>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-title">
          <Bell />
          <div>
            <h3>Notification Preferences</h3>
            <p>Choose which notifications you want to receive.</p>
          </div>
        </div>

        <div className="notification-options">
          <label>
            <span>New complaints</span>
            <input
              type="checkbox"
              name="newComplaints"
              checked={notifications.newComplaints}
              onChange={handleNotificationChange}
            />
          </label>

          <label>
            <span>Complaint status updates</span>
            <input
              type="checkbox"
              name="statusUpdates"
              checked={notifications.statusUpdates}
              onChange={handleNotificationChange}
            />
          </label>

          <label>
            <span>Resolved complaints</span>
            <input
              type="checkbox"
              name="resolvedComplaints"
              checked={notifications.resolvedComplaints}
              onChange={handleNotificationChange}
            />
          </label>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-title">
          <Shield />
          <div>
            <h3>System Information</h3>
            <p>Application details.</p>
          </div>
        </div>

        <div className="system-info">
          <p><strong>Application:</strong> CivicTrack</p>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Platform:</strong> Smart Public Issue Management</p>
        </div>
      </div>

      <button className="save-settings" onClick={handleSave}>
        <Save size={18} />
        Save Settings
      </button>
    </div>
  );
}

export default Settings;