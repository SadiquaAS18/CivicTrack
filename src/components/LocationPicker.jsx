import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LocationPicker.css";

// Default map location: Mysore
const defaultPosition = [12.2958, 76.6394];

// Custom map marker
const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Handles map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect([
        e.latlng.lat,
        e.latlng.lng,
      ]);
    },
  });

  return null;
}

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(defaultPosition);

  const handleMapClick = (newPosition) => {
    setPosition(newPosition);
    onLocationSelect(newPosition);
  };

  return (
    <div className="location-picker">

      <h3>Select Issue Location</h3>

      <p>
        Click anywhere on the map to mark where the
        public issue is located.
      </p>

      <MapContainer
        center={defaultPosition}
        zoom={13}
        className="issue-map"
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onLocationSelect={handleMapClick}
        />

        <Marker
          position={position}
          icon={markerIcon}
        />

      </MapContainer>

      <div className="coordinates">
        <strong>Selected Coordinates:</strong>

        <span>
          Latitude: {position[0].toFixed(6)}
        </span>

        <span>
          Longitude: {position[1].toFixed(6)}
        </span>
      </div>

    </div>
  );
}

export default LocationPicker;