import StatusCard from "../components/StatusCard";
import DataSensorChart from "../components/DataSensorChart";
import { db } from "../firebase/config";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

function Home() {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const sensorRef = ref(db, "sensor");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
        const converted = {
          temperature: {
            value: raw.temperature,
            unit: "°C",
            status:
              raw.temperature > 35
                ? "Panas"
                : raw.temperature < 20
                ? "Dingin"
                : "Normal",
          },
          humidity: {
            value: raw.humidity,
            unit: "%",
            status:
              raw.humidity > 80
                ? "Lembab"
                : raw.humidity < 30
                ? "Kering"
                : "Cukup",
          },
          gas: {
            value: raw.airQuality,
            unit: "ppm",
            status:
              raw.airQuality > 700
                ? "Buruk"
                : raw.airQuality > 400
                ? "Sedang"
                : "Baik",
          },
        };

        setSensorData(converted);
      } else {
        setSensorData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#45cad7] to-[#0c9aa6] text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-white text-black min-h-screen rounded-2xl px-6 shadow-lg py-10">
        <h1 className="text-2xl font-bold mb-6">🔥 Data Sensor Realtime</h1>

        {sensorData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

            <DataSensorChart data={sensorData} />
          </>
        ) : (
          <p className="text-red-500">📭 Tidak ada data tersedia...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
