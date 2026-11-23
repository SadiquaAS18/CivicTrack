import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ComplaintMap.css";

// Custom marker icon
const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Default map center: Mysore
const defaultPosition = [12.2958, 76.6394];

function ComplaintMap({ complaints }) {
  // Only complaints with selected coordinates
  const mappedComplaints = complaints.filter(
    (item) =>
      Array.isArray(item.coordinates) &&
      item.coordinates.length === 2
  );

  return (
    <div className="complaint-map-container">

      <div className="map-heading">
        <div>
          <h2>Complaint Locations</h2>
          <p>
            View reported public issues across different locations.
          </p>
        </div>

        <span className="map-count">
          {mappedComplaints.length} Locations
        </span>
      </div>

      <MapContainer
        center={defaultPosition}
        zoom={13}
        className="complaint-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mappedComplaints.map((item) => (
          <Marker
            key={item.id}
            position={item.coordinates}
            icon={markerIcon}
          >
            <Popup>
              <div className="map-popup">
                <strong>{item.title}</strong>

                <p>
                  Complaint ID: {item.id}
                </p>

                <p>
                  Category: {item.category}
                </p>

                <p>
                  Location: {item.location}
                </p>

                <p>
                  Status: {item.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {mappedComplaints.length === 0 && (
        <p className="no-map-data">
          No complaint locations available yet.
          Submit a complaint and select a location on the map.
        </p>
      )}

    </div>
  );
}

export default ComplaintMap;