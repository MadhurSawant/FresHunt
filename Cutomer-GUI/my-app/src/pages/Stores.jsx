import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"; // ✅ added useMap
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FreshHuntNavbar from "../components/FreshHuntNavbar";
import storesData from "../data/storesData.json";
import "./Stores.css";
import { useEffect } from "react";

// 📍 Custom store marker
const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -28],
});

// ✅ City centers (lat/lng)
const cityCenters = {
  Bengaluru: [12.9716, 77.5946],
  Mumbai: [19.076, 72.8777],
  Delhi: [28.7041, 77.1025],
  Pune: [18.5204, 73.8567],
  Dombivli: [19.2177, 73.0900],
  Thane: [19.2183, 72.9781]
};

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom()); // re-center map when center changes
  }, [center, map]);

  return null;
}

function Stores() {
  const [city, setCity] = useState("Bengaluru");
  const filteredStores = storesData.filter((s) => s.city === city);

  return (
    <>
      <FreshHuntNavbar />
      <div className="stores-page container-fluid">
        <div className="stores-banner text-center py-2">
          🎉 Enjoy <span className="text-success">₹100 OFF</span> on your first FreshHunt store purchase!
        </div>

        <div className="stores-content row">
          {/* LEFT: Store List */}
          <div className="col-md-5 stores-list">
            <h5>Select your city</h5>
            <div className="d-flex align-items-center mb-3">
              <select
                className="form-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {Object.keys(cityCenters).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button className="btn btn-link ms-2 text-danger">
                📍 Use current location
              </button>
            </div>

            <p>{filteredStores.length} Stores in this city</p>
            {filteredStores.map((store) => (
              <div key={store.id} className="store-card p-3 mb-3 shadow-sm rounded">
                <h6>{store.name}</h6>
                <p className="text-muted small">{store.address}</p>
                <p>
                  ⭐ {store.rating} ({store.reviews}+ reviews) | <span className="text-success">Open Now</span>
                </p>
                <a
                  href={store.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success btn-sm"
                >
                  Directions
                </a>
              </div>
            ))}
          </div>

          {/* RIGHT: Map */}
          <div className="col-md-7 d-flex justify-content-center align-items-center">
                                <MapContainer
                      center={cityCenters[city]} // initial center
                      zoom={12}
                      style={{ height: "500px", width: "600px", borderRadius: "12px", border: "2px solid #ddd" }}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                      />

                      {/* ✅ Recenter map dynamically */}
                      <RecenterMap center={cityCenters[city]} />

                      {filteredStores.map((store) => (
                        <Marker key={store.id} position={[store.lat, store.lng]} icon={storeIcon}>
                          <Popup>
                            <strong>{store.name}</strong><br />
                            {store.address}<br />
                            ⭐ {store.rating} ({store.reviews} reviews)<br />
                            <a href={store.directions} target="_blank" rel="noopener noreferrer">Get Directions</a>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>

          </div>
        </div>
      </div>
    </>
  );
}

export default Stores;
