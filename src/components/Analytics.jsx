import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Analytics.css";

function Analytics({ complaints = [] }) {
  const total = complaints.length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolutionRate =
    total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;

  const statusData = [
    { name: "Resolved", value: resolved },
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
  ];

  const colors = ["#16a34a", "#f59e0b", "#3b82f6"];

  const categoryCounts = {};

  complaints.forEach((complaint) => {
    const category = complaint.category || "Other";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts).map(
    ([name, count]) => ({
      name,
      complaints: count,
    })
  );

  return (
    <div className="analytics-page">
      <div className="analytics-heading">
        <h2>Analytics & Reports</h2>
        <p>Monitor public complaints and resolution performance.</p>
      </div>

      <div className="analytics-stats">
        <div className="analytics-card">
          <h3>Total Complaints</h3>
          <h2>{total}</h2>
        </div>

        <div className="analytics-card">
          <h3>Resolved</h3>
          <h2>{resolved}</h2>
        </div>

        <div className="analytics-card">
          <h3>Pending</h3>
          <h2>{pending}</h2>
        </div>

        <div className="analytics-card">
          <h3>Resolution Rate</h3>
          <h2>{resolutionRate}%</h2>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="analytics-chart-box">
          <h3>Complaints by Category</h3>

          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="complaints" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="analytics-empty">No complaint data available.</p>
          )}
        </div>

        <div className="analytics-chart-box">
          <h3>Complaint Status Distribution</h3>

          {total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={colors[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="analytics-empty">No complaint data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;