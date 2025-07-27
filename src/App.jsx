import "remixicon/fonts/remixicon.css";
import StatusCard from "./components/StatusCard";

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
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-5">
        <div className="flex items-center gap-4">
          <div className="bg-[#2f9ea8] py-2 px-3 rounded-lg">
            <i class="ri-leaf-line ri-lg"></i>
          </div>
          <div className="">
            <h1 className="font-semibold text-xl tracking-widest">AIRA</h1>
            <p className="text-base text-gray-200">Smart Plant Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="bg-[#2f9ea8] py-2 px-3 rounded-lg">
            <i class="ri-moon-line ri-lg"></i>
          </a>
          <a href="#" className="bg-[#2f9ea8] py-2 px-3 rounded-lg">
            <i class="ri-settings-3-line ri-lg"></i>
          </a>
        </div>
      </div>
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
            icon="ri-drop-line"
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
      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-transparent backdrop-blur-lg text-gray-700 rounded-full shadow-2xl border border-[#45cad7] px-5 py-2 flex justify-between items-center gap-3 z-50">
        <a
          href="#"
          className="flex flex-col items-center space-y-1.5 hover:bg-[#45cad7] hover:text-white p-4 rounded-full transition-colors duration-200
          "
        >
          <i className="ri-home-5-line ri-xl"></i>
          <p className="text-xs">Monitoring</p>
        </a>
        <a
          href="#"
          className="flex flex-col items-center space-y-1.5 hover:bg-[#45cad7] hover:text-white p-4 rounded-full transition-colors duration-200
          "
        >
          <i className="ri-home-5-line ri-xl"></i>
          <p className="text-xs">Monitoring</p>
        </a>
        <a
          href="#"
          className="flex flex-col items-center space-y-1.5 hover:bg-[#45cad7] hover:text-white p-4 rounded-full transition-colors duration-200
          "
        >
          <i className="ri-home-5-line ri-xl"></i>
          <p className="text-xs">Monitoring</p>
        </a>
      </div>
    </div>
  );
}

export default App;
