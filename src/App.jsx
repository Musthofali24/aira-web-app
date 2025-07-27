import "remixicon/fonts/remixicon.css";
import StatusCard from "./components/StatusCard";
import DataSensorChart from "./components/DataSensorChart";
import Navbar from "./components/Navbar";
import FloatingNavbar from "./components/FloatingNavbar";

function App() {
  const sensorData = {
    temperature: {
      value: 29,
      unit: "°C",
      status: { text: "Normal", color: "text-green-600" },
    },
    humidity: {
      value: 67,
      unit: "%",
      status: { text: "Tinggi", color: "text-yellow-600" },
    },
    gas: {
      value: 210,
      unit: "ppm",
      status: { text: "Buruk", color: "text-red-600" },
    },
  };

  return (
    <div className="bg-gradient-to-b bg-[#45cad7] text-white min-h-screen py-5">
      {/* Navbar */}
      <Navbar />
      {/* End of Navbar */}
      <div className="max-w-4xl mx-auto bg-[#e8fdff] min-h-screen rounded-2xl p-6 shadow-lg">
        {/* Tambah Card Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            title="Suhu"
            value={sensorData.temperature.value}
            unit={sensorData.temperature.unit}
            status={sensorData.temperature.status}
            icon="ri-thermometer-line"
            iconBg="bg-red-100 text-red-500"
          />
          <StatusCard
            title="Kelembaban"
            value={sensorData.humidity.value}
            unit={sensorData.humidity.unit}
            status={sensorData.humidity.status}
            icon="ri-drop-fill"
            iconBg="bg-blue-100 text-blue-500"
          />
          <StatusCard
            title="Kualitas Udara"
            value={sensorData.gas.value}
            unit={sensorData.gas.unit}
            status={sensorData.gas.status}
            icon="ri-windy-line"
            iconBg="bg-green-100 text-green-500"
          />
        </div>

        <DataSensorChart />
      </div>

      {/* Floating Bottom Navigation */}
      <FloatingNavbar />
      {/* End of Floating Bottom Navigation */}
    </div>
  );
}

export default App;
