import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Pastikan path ini benar
import { LineChart } from "@mui/x-charts/LineChart";
import { CircularProgress, Typography } from "@mui/material"; // Komponen UI untuk loading

function DataSensorChart() {
  // 1. Siapkan state untuk data chart dan status loading
  const [chartData, setChartData] = useState({
    timestamps: [],
    suhu: [],
    kelembaban: [],
    gas: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // 2. Gunakan useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    // Query tetap sama
    const q = query(
      collection(db, "SensorDataHistory"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    // 3. Gunakan onSnapshot untuk llistener data real-time
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        // Logika di dalam sini akan berjalan setiap kali ada data baru
        const timestampsData = [],
          suhuData = [],
          kelembabanData = [],
          gasData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          timestampsData.unshift(data.timestamp.toDate());
          suhuData.unshift(data.temperature || 0);
          kelembabanData.unshift(data.humidity || 0);
          gasData.unshift(data.airQuality || 0);
        });

        setChartData({
          timestamps: timestampsData,
          suhu: suhuData,
          kelembaban: kelembabanData,
          gas: gasData,
        });

        setIsLoading(false);
      },
      (error) => {
        // BARU: Penanganan error untuk listener
        console.error("Error listening to chart data:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Tampilkan indikator loading saat data diambil
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow p-4 mt-6 flex justify-center items-center h-[402px]">
        <CircularProgress />
        <Typography ml={2}>Memuat data grafik...</Typography>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-3 text-gray-800">
        Grafik Data Sensor
      </h2>
      <LineChart
        height={300}
        xAxis={[
          {
            data: chartData.timestamps,
            scaleType: "time",
            valueFormatter: (date) => date.toLocaleTimeString("id-ID"),
          },
        ]}
        // 6. Gunakan data dari state untuk setiap garis series
        series={[
          { data: chartData.suhu, label: "Suhu (°C)", color: "#f87171" },
          {
            data: chartData.kelembaban,
            label: "Kelembaban (%)",
            color: "#60a5fa",
          },
          { data: chartData.gas, label: "Gas (ppm)", color: "#4ade80" },
        ]}
        grid={{ vertical: true, horizontal: true }}
        sx={{
          ".MuiLineElement-root": { strokeWidth: 2 },
          ".MuiChartsLegend-mark": { borderRadius: 2 },
        }}
      />
    </div>
  );
}

export default DataSensorChart;
