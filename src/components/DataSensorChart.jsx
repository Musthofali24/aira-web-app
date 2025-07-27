import { LineChart } from "@mui/x-charts/LineChart";

function DataSensorChart() {
  // Contoh data dummy, kamu bisa ganti dengan data real dari Firebase
  const timestamps = ["09:00", "10:00", "11:00", "12:00", "13:00"];
  const suhu = [28, 29, 30, 29, 28];
  const kelembaban = [60, 62, 67, 70, 68];
  const gas = [190, 200, 210, 220, 215];

  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-3 text-gray-800">
        Grafik Data Sensor
      </h2>
      <LineChart
        height={300}
        xAxis={[{ scaleType: "point", data: timestamps }]}
        series={[
          { data: suhu, label: "Suhu (°C)", color: "#f87171" },
          { data: kelembaban, label: "Kelembaban (%)", color: "#60a5fa" },
          { data: gas, label: "Gas (ppm)", color: "#4ade80" },
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
