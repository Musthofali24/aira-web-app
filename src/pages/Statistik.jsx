import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { ref, onValue } from "firebase/database";  
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from "recharts";

function Statistik() {
  const [sensorData, setSensorData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("24h");

  // Air quality parameters with thresholds
  const airQualityParams = {
    pm25: {
        name: "PM2.5",
        unit: "µg/m³",
        good: 12,       // WHO: <12 µg/m³ (24h avg)
        moderate: 35,   // EPA: 35 µg/m³ (24h avg)
        poor: Infinity,
        color: "#10b981",
        warningColor: "#f59e0b",
        dangerColor: "#ef4444"
    },
    voc: {
        name: "VOC",
        unit: "ppb",
        good: 250,      // Indoor safe limit (EPA)
        moderate: 500,  // Mulai berisiko
        poor: Infinity,
        color: "#f97316",
        warningColor: "#f59e0b",
        dangerColor: "#ef4444"
    },
    nh3: {
        name: "Amonia (NH₃)",
        unit: "ppm",
        good: 5,        // OSHA PEL: 25 ppm (8h), tapi good <5 ppm
        moderate: 25,   // Batas aman jangka pendek
        poor: Infinity,
        color: "#3b82f6",
        warningColor: "#f59e0b",
        dangerColor: "#ef4444"
    },
    nox: {
        name: "NOx",
        unit: "ppb",    // Diubah ke ppb (lebih umum untuk udara)
        good: 50,       // WHO: <40 ppb (1h avg)
        moderate: 100,  // Level waspada
        poor: Infinity,
        color: "#6b7280",
        warningColor: "#f59e0b",
        dangerColor: "#ef4444"
    },
    co2: {
        name: "CO₂",
        unit: "ppm",
        good: 600,      // Indoor ideal: <600 ppm
        moderate: 1000, // Mulai tidak segar
        poor: Infinity,
        color: "#10b981",
        warningColor: "#f59e0b",
        dangerColor: "#ef4444"
    },
    benzene: {
        name: "Benzena",
        unit: "ppb",    // Diubah ke ppb (karena sangat beracun)
        good: 5,        // NIOSH REL: 0.1 ppm (100 ppb), good <5 ppb
        moderate: 50,   // Bahaya jangka panjang
        poor: Infinity,
        color: "#8b5cf6",
        warningColor: "#f59e0b",
        dangerColor: "#ef4444"
    },
    alcohol: {
        name: "Alkohol",
        unit: "ppm",
        good: 10,       // Batas aman industri
        moderate: 100,  // Mulai berisiko
        poor: Infinity,
        color: "#ec4899",
        warningColor: "#f59e0b",
        dangerColor: "#ef4444"
    }
};

  useEffect(() => {
    // Real-time sensor data
    const sensorRef = ref(db, "sensor");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
        setSensorData(raw);
      }
    });

    // Historical data (mock data for demonstration)
    const generateMockHistoricalData = () => {
      const data = [];
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          timestamp: time.getTime(),
          temperature: 20 + Math.random() * 15,
          humidity: 40 + Math.random() * 40,
          pm25: 10 + Math.random() * 30,
          voc: 150 + Math.random() * 300,
          nh3: 5 + Math.random() * 20,
          nox: 0.2 + Math.random() * 1.8,
          co2: 400 + Math.random() * 800,
          benzene: 0.05 + Math.random() * 0.5,
          alcohol: 5 + Math.random() * 30
        });
      }
      setHistoricalData(data);
    };

    generateMockHistoricalData();

    return () => unsubscribe();
  }, []);

  const getStatusColor = (value, param) => {
    if (value <= param.good) return param.color;
    if (value <= param.moderate) return param.warningColor;
    return param.dangerColor;
  };

  const getStatusText = (value, param) => {
    if (value <= param.good) return "Baik";
    if (value <= param.moderate) return "Sedang";
    return "Buruk";
  };

  const calculateAQI = () => {
    if (!sensorData) return 0;
    
    // Simplified AQI calculation based on available parameters
    const pm25Value = sensorData.pm25 || 15;
    const vocValue = sensorData.voc || 200;
    const co2Value = sensorData.co2 || 600;
    
    const pm25AQI = Math.min(100, (pm25Value / 35) * 100);
    const vocAQI = Math.min(100, (vocValue / 400) * 100);
    const co2AQI = Math.min(100, (co2Value / 1000) * 100);
    
    return Math.round((pm25AQI + vocAQI + co2AQI) / 3);
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "#10b981";
    if (aqi <= 75) return "#f59e0b";
    return "#ef4444";
  };

  const StatCard = ({ title, value, unit, status, icon, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <i className={`${icon} text-xl`}></i>
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
            <i className={`ri-arrow-${trend > 0 ? 'up' : 'down'}-line mr-1`}></i>
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
        status === 'Baik' ? 'bg-green-100 text-green-700' :
        status === 'Sedang' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {status}
      </div>
    </div>
  );

  const AQIGauge = ({ aqi }) => {
    const data = [
      { name: 'AQI', value: aqi, fill: getAQIColor(aqi) },
      { name: 'Remaining', value: 100 - aqi, fill: '#f3f4f6' }
    ];

    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Indeks Kualitas Udara (AQI)
        </h3>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                startAngle={180}
                endAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: getAQIColor(aqi) }}>
                {aqi}
              </div>
              <div className="text-sm text-gray-600">AQI</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4 text-xs mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Baik (0-50)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span>Sedang (51-75)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Buruk (76-100)</span>
          </div>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-700">{`Waktu: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toFixed(1)} ${entry.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!sensorData) {
    return (
      <div className="bg-gradient-to-b from-[#45cad7] to-[#2d9bb5] text-white min-h-screen py-5 mb-20">
        <div className="max-w-7xl mx-auto bg-[#e8fdff] min-h-screen rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#45cad7] mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data statistik...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const aqi = calculateAQI();
  const mockCurrentData = {
    temperature: sensorData.temperature || 25,       // Nilai default jika tidak ada data
    humidity: sensorData.humidity || 60,             // Nilai default jika tidak ada data
    pm25: 12,                                        // MQ135 tidak bisa mengukur PM2.5
    voc: sensorData.airQuality * 1.2 || 180,         // VOC umumnya lebih tinggi dari baseline
    nh3: sensorData.airQuality / 20 || 8,           // NH3 lebih sensitif di MQ135
    nox: sensorData.airQuality / 5 || 0.3,          // NOx sensitivity medium
    co2: sensorData.airQuality * 5 || 350,         // CO2 biasanya nilai terbesar
    benzene: sensorData.airQuality / 100 || 0.08,    // Benzene konsentrasi kecil
    alcohol: sensorData.airQuality / 50 || 7         // Alcohol sensitivity medium
  };

  return (
    <div className="bg-gradient-to-b from-[#45cad7] to-[#2d9bb5] text-white min-h-screen py-5 mb-20">
      <div className="max-w-7xl mx-auto bg-[#e8fdff] min-h-screen rounded-2xl p-6 shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Statistik Kualitas Udara
          </h1>
          <p className="text-gray-600">
            Analisis mendalam data sensor lingkungan real-time
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 bg-white rounded-xl p-2 shadow-sm">
          {[
            { id: "overview", label: "📈 Overview", icon: "ri-dashboard-line" },
            { id: "trends", label: "📊 Tren", icon: "ri-line-chart-line" },
            { id: "analysis", label: "🔍 Analisis", icon: "ri-search-line" },
            { id: "alerts", label: "⚠️ Peringatan", icon: "ri-alarm-warning-line" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#45cad7] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* AQI and Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AQIGauge aqi={aqi} />
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                  title="Suhu"
                  value={mockCurrentData.temperature.toFixed(1)}
                  unit="°C"
                  status={mockCurrentData.temperature > 35 ? "Buruk" : mockCurrentData.temperature < 20 ? "Sedang" : "Baik"}
                  icon="ri-thermometer-line"
                  color="bg-red-100 text-red-600"
                  trend={2.3}
                />
                <StatCard
                  title="Kelembaban"
                  value={mockCurrentData.humidity.toFixed(1)}
                  unit="%"
                  status={mockCurrentData.humidity > 80 ? "Buruk" : mockCurrentData.humidity < 30 ? "Sedang" : "Baik"}
                  icon="ri-drop-line"
                  color="bg-blue-100 text-blue-600"
                  trend={-1.2}
                />
                <StatCard
                  title="PM2.5"
                  value={mockCurrentData.pm25.toFixed(1)}
                  unit="µg/m³"
                  status={getStatusText(mockCurrentData.pm25, airQualityParams.pm25)}
                  icon="ri-haze-2-line"
                  color="bg-green-100 text-green-600"
                  trend={-0.8}
                />
                <StatCard
                  title="VOC"
                  value={mockCurrentData.voc.toFixed(0)}
                  unit="ppb"
                  status={getStatusText(mockCurrentData.voc, airQualityParams.voc)}
                  icon="ri-windy-line"
                  color="bg-orange-100 text-orange-600"
                  trend={1.5}
                />
              </div>
            </div>

            {/* Additional Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(airQualityParams).slice(2).map(([key, param]) => (
                <StatCard
                  key={key}
                  title={param.name}
                  value={mockCurrentData[key].toFixed(key === 'nox' || key === 'benzene' ? 2 : 1)}
                  unit={param.unit}
                  status={getStatusText(mockCurrentData[key], param)}
                  icon={
                    key === 'nh3' ? 'ri-flask-line' :
                    key === 'nox' ? 'ri-smoke-line' :
                    key === 'co2' ? 'ri-leaf-line' :
                    key === 'benzene' ? 'ri-oil-line' :
                    'ri-beer-line'
                  }
                  color={`bg-${key === 'nh3' ? 'blue' : key === 'nox' ? 'gray' : key === 'co2' ? 'green' : key === 'benzene' ? 'purple' : 'pink'}-100 text-${key === 'nh3' ? 'blue' : key === 'nox' ? 'gray' : key === 'co2' ? 'green' : key === 'benzene' ? 'purple' : 'pink'}-600`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === "trends" && (
          <div className="space-y-8">
            {/* Time Range Selector */}
            <div className="flex justify-center space-x-2 mb-6">
              {["1h", "6h", "24h", "7d"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === range
                      ? "bg-[#45cad7] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Temperature & Humidity Chart */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tren Suhu & Kelembaban
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    name="Suhu (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    name="Kelembaban (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Air Quality Parameters Chart */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tren Kualitas Udara
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pm25"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="PM2.5 (µg/m³)"
                  />
                  <Area
                    type="monotone"
                    dataKey="voc"
                    stackId="2"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.6}
                    name="VOC (ppm)"
                  />
                  <Area
                    type="monotone"
                    dataKey="co2"
                    stackId="3"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                    name="CO₂ (ppm)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === "analysis" && (
          <div className="space-y-8">
            {/* Parameter Comparison */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Perbandingan Parameter vs Batas Aman
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={[
                    { name: "PM2.5", current: mockCurrentData.pm25, safe: 15, moderate: 35 },
                    { name: "VOC", current: mockCurrentData.voc, safe: 200, moderate: 400 },
                    { name: "NH₃", current: mockCurrentData.nh3, safe: 10, moderate: 25 },
                    { name: "NOx", current: mockCurrentData.nox, safe: 0.5, moderate: 2 },
                    { name: "CO₂", current: mockCurrentData.co2, safe: 600, moderate: 1000 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#45cad7" name="Nilai Saat Ini" />
                  <Bar dataKey="safe" fill="#10b981" name="Batas Aman" />
                  <Bar dataKey="moderate" fill="#f59e0b" name="Batas Waspada" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Health Impact Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Dampak Kesehatan
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-green-700">
                      PM2.5 dalam batas aman - Risiko rendah penyakit pernapasan
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-yellow-700">
                      VOC sedikit tinggi - Perhatikan ventilasi
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-blue-700">
                      Parameter lain dalam kondisi baik
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Rekomendasi Tindakan
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                    <span className="text-sm text-gray-700">
                      Ventilasi udara berjalan baik
                    </span>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-information-line text-blue-500 mr-2 mt-1"></i>
                    <span className="text-sm text-gray-700">
                      Monitor terus parameter VOC
                    </span>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-plant-line text-green-500 mr-2 mt-1"></i>
                    <span className="text-sm text-gray-700">
                      Pertimbangkan tanaman pembersih udara
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <div className="space-y-6">
            {/* Active Alerts */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Peringatan Aktif
              </h3>
              <div className="space-y-3">
                {mockCurrentData.voc > 200 && (
                  <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <i className="ri-alarm-warning-line text-yellow-600 text-xl mr-3"></i>
                    <div>
                      <p className="font-medium text-yellow-800">VOC Tinggi Terdeteksi</p>
                      <p className="text-sm text-yellow-600">
                        Nilai VOC: {mockCurrentData.voc.toFixed(0)} ppm (Batas: 200 ppm)
                      </p>
                    </div>
                  </div>
                )}
                {mockCurrentData.temperature > 30 && (
                  <div className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <i className="ri-fire-line text-orange-600 text-xl mr-3"></i>
                    <div>
                      <p className="font-medium text-orange-800">Suhu Tinggi</p>
                      <p className="text-sm text-orange-600">
                        Suhu: {mockCurrentData.temperature.toFixed(1)}°C
                      </p>
                    </div>
                  </div>
                )}
                {aqi > 75 && (
                  <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <i className="ri-error-warning-line text-red-600 text-xl mr-3"></i>
                    <div>
                      <p className="font-medium text-red-800">Kualitas Udara Buruk</p>
                      <p className="text-sm text-red-600">AQI: {aqi}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alert History */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Riwayat Peringatan (24 Jam Terakhir)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-time-line text-gray-500 mr-2"></i>
                    <span className="text-sm text-gray-700">08:45 - Kelembaban rendah</span>
                  </div>
                  <span className="text-xs text-gray-500">8 jam lalu</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-time-line text-gray-500 mr-2"></i>
                    <span className="text-sm text-gray-700">02:20 - PM2.5 meningkat</span>
                  </div>
                  <span className="text-xs text-gray-500">14 jam lalu</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Status Sistem Peringatan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <i className="ri-shield-check-line text-2xl text-green-600 mb-2"></i>
                  <h4 className="font-medium text-green-800">Sensor Aktif</h4>
                  <p className="text-sm text-green-600">7/7 Online</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <i className="ri-notification-3-line text-2xl text-blue-600 mb-2"></i>
                  <h4 className="font-medium text-blue-800">Notifikasi</h4>
                  <p className="text-sm text-blue-600">Aktif</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <i className="ri-cloud-line text-2xl text-purple-600 mb-2"></i>
                  <h4 className="font-medium text-purple-800">Koneksi</h4>
                  <p className="text-sm text-purple-600">Stabil</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <i className="ri-database-2-line text-2xl text-orange-600 mb-2"></i>
                  <h4 className="font-medium text-orange-800">Database</h4>
                  <p className="text-sm text-orange-600">Normal</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#45cad7]">
                {historicalData.length}
              </div>
              <div className="text-sm text-gray-600">Data Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#45cad7]">
                99.2%
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#45cad7]">
                {aqi < 50 ? "Baik" : aqi < 75 ? "Sedang" : "Buruk"}
              </div>
              <div className="text-sm text-gray-600">Status Udara</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#45cad7]">
                {Object.values(mockCurrentData).filter((value, index) => {
                  const params = Object.values(airQualityParams);
                  if (index < 2) return true; // temperature and humidity
                  const param = params[index - 2];
                  return param && value <= param.good;
                }).length}
              </div>
              <div className="text-sm text-gray-600">Parameter Normal</div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <i className="ri-refresh-line mr-1"></i>
          Terakhir diperbarui: {new Date().toLocaleString('id-ID')}
        </div>
      </div>
    </div>
  );
}

export default Statistik; // <-- Added this missing export