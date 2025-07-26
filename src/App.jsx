import { useEffect, useState } from "react";
import { db } from "./firebase/config";
import { ref, onValue } from "firebase/database";
import GaugeComponent from "react-gauge-component";

function App() {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(new Date());

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sensorRef = ref(db, "sensor");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const getStatusLabel = (type, value) => {
    if (type === "temperature") {
      if (value < 30) return { text: "Dingin ❄️", color: "text-blue-400" };
      if (value < 60) return { text: "Normal 🌤️", color: "text-yellow-400" };
      return { text: "Panas 🔥", color: "text-red-500" };
    }
    if (type === "humidity") {
      if (value < 30) return { text: "Kering 🌵", color: "text-red-400" };
      if (value < 70) return { text: "Lembab 😌", color: "text-yellow-400" };
      return { text: "Basah 💧", color: "text-green-400" };
    }
    if (type === "airQuality") {
      if (value < 300) return { text: "Baik 🌱", color: "text-green-400" };
      if (value < 600) return { text: "Sedang 🌥️", color: "text-yellow-400" };
      return { text: "Buruk ☠️", color: "text-red-500" };
    }
    return { text: "Tidak diketahui", color: "text-white" };
  };

  const renderStatusCard = (title, value, unit, status) => (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">
        {value} {unit}
      </p>
      <p className={`mt-1 font-semibold ${status.color}`}>{status.text}</p>
    </div>
  );

  // Format jam & tanggal
  const formatDateTime = (date) => {
    return `${date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })} – ${date.toLocaleTimeString("id-ID")}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 font-sans bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
        Monitoring Sensor AIRA 💧
      </h1>

      {/* Status & waktu */}
      <div className="text-center mt-2 mb-8">
        <p
          className={`font-semibold ${
            data ? "text-green-400" : "text-red-400"
          }`}
        >
          {data ? "✅ Connected" : "❌ Disconnected"}
        </p>
        <p className="text-sm text-gray-400 mt-1">📅 {formatDateTime(time)}</p>
      </div>

      {data ? (
        <>
          {/* Row: Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto mb-5">
            {renderStatusCard(
              "Status Suhu",
              data.temperature,
              "°C",
              getStatusLabel("temperature", data.temperature)
            )}
            {renderStatusCard(
              "Status Kelembaban",
              data.humidity,
              "%",
              getStatusLabel("humidity", data.humidity)
            )}
            {renderStatusCard(
              "Status Udara",
              data.airQuality,
              "",
              getStatusLabel("airQuality", data.airQuality)
            )}
          </div>

          {/* Row: Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto mb-10">
            {/* Suhu */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Suhu</h2>
              <GaugeComponent
                value={data.temperature}
                minValue={0}
                maxValue={100}
                arc={{
                  subArcs: [
                    { limit: 30, color: "#5BE12C" },
                    { limit: 60, color: "#F5CD19" },
                    { limit: 100, color: "#EA4228" },
                  ],
                }}
                pointer={{ type: "arrow", elastic: true }}
                labels={{
                  valueLabel: {
                    formatTextValue: (value) => `${value} °C`,
                  },
                }}
              />
            </div>

            {/* Kelembaban */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Kelembaban</h2>
              <GaugeComponent
                value={data.humidity}
                minValue={0}
                maxValue={100}
                arc={{
                  subArcs: [
                    { limit: 30, color: "#EA4228" },
                    { limit: 70, color: "#F5CD19" },
                    { limit: 100, color: "#5BE12C" },
                  ],
                }}
                pointer={{ type: "needle", color: "#fff" }}
                labels={{
                  valueLabel: {
                    formatTextValue: (value) => `${value} %`,
                  },
                }}
              />
            </div>

            {/* Kualitas Udara */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Kualitas Udara</h2>
              <GaugeComponent
                value={data.airQuality}
                minValue={0}
                maxValue={1000}
                arc={{
                  subArcs: [
                    { limit: 300, color: "#5BE12C" },
                    { limit: 600, color: "#F5CD19" },
                    { limit: 1000, color: "#EA4228" },
                  ],
                }}
                pointer={{ type: "needle", color: "#fff" }}
                labels={{
                  valueLabel: {
                    formatTextValue: (value) => `${value}`,
                  },
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <p className="text-red-400 text-center mt-10">
          📭 Tidak ada data tersedia...
        </p>
      )}
    </div>
  );
}

export default App;
