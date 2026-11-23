import { useState } from "react";
import { Upload, MapPin, Send } from "lucide-react";
import "./ReportIssue.css";
import LocationPicker from "./LocationPicker";

function ReportIssue({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    coordinates: null,
  });

  const [image, setImage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Handle complaint submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.coordinates) {
      alert("Please select the issue location on the map.");
      return;
    }

    onSubmit({
      ...form,
      image,
      date: new Date().toLocaleDateString("en-IN"),
      status: "Pending",
    });

    // Reset form after submission
    setForm({
      title: "",
      category: "",
      location: "",
      description: "",
      coordinates: null,
    });

    setImage(null);
    e.target.reset();
  };

  return (
    <div className="report-container">
      <div className="report-heading">
        <h2>Report a Public Issue</h2>
        <p>
          Help us improve your community by reporting public problems.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="report-form">

        {/* Issue Title */}
        <div className="form-group">
          <label>Issue Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Enter issue title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Issue Category */}
        <div className="form-group">
          <label>Issue Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option>Road Damage</option>
            <option>Water Supply</option>
            <option>Electricity</option>
            <option>Garbage Collection</option>
            <option>Drainage</option>
            <option>Streetlights</option>
            <option>Other</option>
          </select>
        </div>

        {/* Issue Location */}
        <div className="form-group">
          <label>
            <MapPin size={16} /> Issue Location *
          </label>
          <input
            type="text"
            name="location"
            placeholder="Enter area or address"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            placeholder="Describe the issue in detail..."
            rows="5"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Location Picker */}
        <LocationPicker
          onLocationSelect={(coordinates) => {
            setForm((prev) => ({
              ...prev,
              coordinates,
            }));
          }}
        />

        {/* Image Upload */}
        <div className="form-group">
          <label>
            <Upload size={16} /> Upload Supporting Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {image && (
            <div className="image-preview">
              <p>Image Preview:</p>
              <img src={image} alt="Issue preview" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          <Send size={17} />
          Submit Complaint
        </button>

      </form>
    </div>
  );
}

export default ReportIssue;
