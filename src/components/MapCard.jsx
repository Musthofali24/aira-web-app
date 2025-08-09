import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix untuk default marker icons di Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapCard() {
  const [airQualityData, setAirQualityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Key OpenWeatherMap
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Koordinat multiple cities di Asia Tenggara dan beberapa kota besar dunia
  const cities = useMemo(
    () => [
      // Indonesia
      { name: "Jakarta", lat: -6.2088, lon: 106.8456, country: "Indonesia" },
      { name: "Surabaya", lat: -7.2575, lon: 112.7521, country: "Indonesia" },
      { name: "Bandung", lat: -6.9175, lon: 107.6191, country: "Indonesia" },
      { name: "Medan", lat: 3.5952, lon: 98.6722, country: "Indonesia" },
      { name: "Yogyakarta", lat: -7.7956, lon: 110.3695, country: "Indonesia" },
      { name: "Denpasar", lat: -8.65, lon: 115.2167, country: "Indonesia" },

      // Asia Tenggara
      { name: "Singapore", lat: 1.3521, lon: 103.8198, country: "Singapore" },
      { name: "Kuala Lumpur", lat: 3.139, lon: 101.6869, country: "Malaysia" },
      { name: "Bangkok", lat: 13.7563, lon: 100.5018, country: "Thailand" },
      { name: "Manila", lat: 14.5995, lon: 120.9842, country: "Philippines" },
      {
        name: "Ho Chi Minh City",
        lat: 10.8231,
        lon: 106.6297,
        country: "Vietnam",
      },
      { name: "Hanoi", lat: 21.0285, lon: 105.8542, country: "Vietnam" },

      // Asia
      { name: "Tokyo", lat: 35.6762, lon: 139.6503, country: "Japan" },
      { name: "Seoul", lat: 37.5665, lon: 126.978, country: "South Korea" },
      { name: "Beijing", lat: 39.9042, lon: 116.4074, country: "China" },
      { name: "Shanghai", lat: 31.2304, lon: 121.4737, country: "China" },
      { name: "Mumbai", lat: 19.076, lon: 72.8777, country: "India" },
      { name: "Delhi", lat: 28.7041, lon: 77.1025, country: "India" },

      // Global
      { name: "London", lat: 51.5074, lon: -0.1278, country: "UK" },
      { name: "Paris", lat: 48.8566, lon: 2.3522, country: "France" },
      { name: "New York", lat: 40.7128, lon: -74.006, country: "USA" },
      { name: "Los Angeles", lat: 34.0522, lon: -118.2437, country: "USA" },
      { name: "Sydney", lat: -33.8688, lon: 151.2093, country: "Australia" },
      { name: "Dubai", lat: 25.2048, lon: 55.2708, country: "UAE" },
    ],
    []
  );

  // Center map untuk view global yang lebih baik
  const mapCenter = useMemo(() => [20, 100], []);

  const fetchAllCitiesAirQuality = useCallback(async () => {
    try {
      setLoading(true);
      const promises = cities.map(async (city) => {
        try {
          const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`
          );
          return {
            ...city,
            airQuality: response.data.list[0],
            error: null,
          };
        } catch (err) {
          console.error(`Error fetching data for ${city.name}:`, err);
          return {
            ...city,
            airQuality: null,
            error: err.message,
          };
        }
      });

      const results = await Promise.all(promises);
      setAirQualityData(results);
    } catch (err) {
      setError("Failed to fetch air quality data for cities");
      console.error("Air Quality API Error:", err);
    } finally {
      setLoading(false);
    }
  }, [cities, API_KEY]);

  useEffect(() => {
    fetchAllCitiesAirQuality();
  }, [fetchAllCitiesAirQuality]);

  const getAQIStatus = (aqi) => {
    switch (aqi) {
      case 1:
        return { label: "Baik", color: "#10B981", bgColor: "#D1FAE5" };
      case 2:
        return { label: "Cukup", color: "#F59E0B", bgColor: "#FEF3C7" };
      case 3:
        return { label: "Sedang", color: "#F97316", bgColor: "#FFEDD5" };
      case 4:
        return { label: "Buruk", color: "#EF4444", bgColor: "#FEE2E2" };
      case 5:
        return { label: "Sangat Buruk", color: "#8B5CF6", bgColor: "#F3E8FF" };
      default:
        return { label: "Unknown", color: "#6B7280", bgColor: "#F9FAFB" };
    }
  };

  // Custom component untuk menampilkan AQI number pada peta
  const AQIMarker = ({ position, aqi, cityName, airQualityData, country }) => {
    const aqiStatus = getAQIStatus(aqi);

    // Create custom DivIcon with AQI number
    const customIcon = L.divIcon({
      html: `<div style="
        background-color: ${aqiStatus.color};
        border: 3px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${aqi || "?"}</div>`,
      className: "custom-aqi-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });

    // Helper function untuk format nilai komponen
    const formatComponent = (value, unit = "μg/m³") => {
      return value ? `${value.toFixed(2)} ${unit}` : "N/A";
    };

    return (
      <Marker position={position} icon={customIcon}>
        <Popup maxWidth={300}>
          <div className="p-3">
            <h4 className="font-bold text-gray-800 mb-1 text-base">
              {cityName}
            </h4>
            <p className="text-sm text-gray-500 mb-3">{country}</p>

            {/* AQI Status */}
            <div
              className="mb-4 p-3 rounded-lg"
              style={{ backgroundColor: aqiStatus.bgColor }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Air Quality Index
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: aqiStatus.color }}
                >
                  {aqi}
                </span>
              </div>
              <div className="text-sm mt-1" style={{ color: aqiStatus.color }}>
                {aqiStatus.label}
              </div>
            </div>

            {/* Detailed Components */}
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-700 text-sm border-b pb-1">
                Komponen Polusi Udara
              </h5>

              {/* Primary Pollutants */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-xs text-gray-600">PM2.5</div>
                  <div className="font-bold text-red-700 text-sm">
                    {formatComponent(airQualityData?.components?.pm2_5)}
                  </div>
                  <div className="text-xs text-gray-500">Partikel Halus</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="text-xs text-gray-600">PM10</div>
                  <div className="font-bold text-purple-700 text-sm">
                    {formatComponent(airQualityData?.components?.pm10)}
                  </div>
                  <div className="text-xs text-gray-500">Partikel Kasar</div>
                </div>
              </div>

              {/* Gas Pollutants */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-orange-50 p-2 rounded">
                  <div className="text-xs text-gray-600">CO</div>
                  <div className="font-bold text-orange-700 text-sm">
                    {formatComponent(airQualityData?.components?.co)}
                  </div>
                  <div className="text-xs text-gray-500">Karbon Monoksida</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-xs text-gray-600">NO₂</div>
                  <div className="font-bold text-blue-700 text-sm">
                    {formatComponent(airQualityData?.components?.no2)}
                  </div>
                  <div className="text-xs text-gray-500">Nitrogen Dioksida</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-xs text-gray-600">O₃</div>
                  <div className="font-bold text-green-700 text-sm">
                    {formatComponent(airQualityData?.components?.o3)}
                  </div>
                  <div className="text-xs text-gray-500">Ozon</div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <div className="text-xs text-gray-600">SO₂</div>
                  <div className="font-bold text-yellow-700 text-sm">
                    {formatComponent(airQualityData?.components?.so2)}
                  </div>
                  <div className="text-xs text-gray-500">Sulfur Dioksida</div>
                </div>
              </div>

              {/* Additional Components */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-indigo-50 p-2 rounded">
                  <div className="text-xs text-gray-600">NO</div>
                  <div className="font-bold text-indigo-700 text-sm">
                    {formatComponent(airQualityData?.components?.no)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Nitrogen Monoksida
                  </div>
                </div>
                <div className="bg-teal-50 p-2 rounded">
                  <div className="text-xs text-gray-600">NH₃</div>
                  <div className="font-bold text-teal-700 text-sm">
                    {formatComponent(airQualityData?.components?.nh3)}
                  </div>
                  <div className="text-xs text-gray-500">Amonia</div>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="mt-3 pt-2 border-t text-xs text-gray-400">
              Data:{" "}
              {new Date(airQualityData?.dt * 1000).toLocaleString("id-ID")}
            </div>
          </div>
        </Popup>
      </Marker>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-24">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#45cad7]"></div>
          <span className="ml-2 text-gray-600">Loading map data...</span>
        </div>
      </div>
    );
  }

  if (error && airQualityData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="ri-map-pin-line text-[#45cad7] mr-2"></i>
          Global Air Quality Map
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            <i className="ri-error-warning-line mr-2"></i>
            {error}
          </p>
          <p className="text-sm text-red-500 mt-2">
            Please check your API key or internet connection.
          </p>
        </div>
      </div>
    );
  }

  // Calculate average AQI for summary
  const validAQIData = airQualityData.filter(
    (city) => city.airQuality && !city.error
  );
  const averageAQI =
    validAQIData.length > 0
      ? Math.round(
          validAQIData.reduce(
            (sum, city) => sum + city.airQuality.main.aqi,
            0
          ) / validAQIData.length
        )
      : 0;
  const averageStatus = getAQIStatus(averageAQI);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <style>
        {`
          .leaflet-popup-pane {
            z-index: 400 !important;
          }
          .leaflet-popup {
            z-index: 400 !important;
          }
          .custom-aqi-marker {
            z-index: 300 !important;
          }
        `}
      </style>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <i className="ri-map-pin-line text-[#45cad7] mr-2"></i>
        Global Air Quality Map
      </h3>

      {/* Summary Stats */}
      {validAQIData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: averageStatus.bgColor }}
          >
            <div className="text-sm text-gray-600">Average AQI</div>
            <div
              className="font-semibold"
              style={{ color: averageStatus.color }}
            >
              {averageStatus.label}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50">
            <div className="text-sm text-gray-600">Cities Monitored</div>
            <div className="font-semibold text-blue-600">
              {validAQIData.length}/{airQualityData.length}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-50">
            <div className="text-sm text-gray-600">Good Quality</div>
            <div className="font-semibold text-green-600">
              {
                validAQIData.filter((city) => city.airQuality.main.aqi <= 2)
                  .length
              }{" "}
              cities
            </div>
          </div>
          <div className="p-3 rounded-lg bg-red-50">
            <div className="text-sm text-gray-600">Poor Quality</div>
            <div className="font-semibold text-red-600">
              {
                validAQIData.filter((city) => city.airQuality.main.aqi >= 4)
                  .length
              }{" "}
              cities
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="h-80 rounded-lg overflow-hidden border border-gray-200 relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Render AQI markers for each city */}
          {airQualityData.map((city, index) =>
            city.airQuality && !city.error ? (
              <AQIMarker
                key={index}
                position={[city.lat, city.lon]}
                aqi={city.airQuality.main.aqi}
                cityName={city.name}
                airQualityData={city.airQuality}
                country={city.country}
              />
            ) : null
          )}
        </MapContainer>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#45cad7]"></div>
            <span className="ml-2 text-gray-600">
              Loading air quality data...
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#10B981" }}
          ></div>
          <span className="text-gray-600">Baik (1-2)</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#F59E0B" }}
          ></div>
          <span className="text-gray-600">Sedang (3)</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#EF4444" }}
          ></div>
          <span className="text-gray-600">Buruk (4-5)</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
        <span>
          <i className="ri-information-line mr-1"></i>
          Real-time data from OpenWeatherMap API
        </span>
        <span>
          Last updated:{" "}
          {new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default MapCard;
