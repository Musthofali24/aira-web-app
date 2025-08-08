import ConnectionStatusIndicator from "../components/ConnectionStatusIndicator";
import StatusCard from "../components/StatusCard";
import { useEspData } from "../hooks";
import { useState } from "react";
import WarningModal from "../components/WarningModal";
import DataSensorChart from "../components/DataSensorChart";
import { Gauge } from "@mui/x-charts/Gauge";

function Statistik() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [activeTab, setActiveTab] = useState("overview");

  const triggerWarningModal = (title, message) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  };

  const { sensorData, isEspOnline, formattedTimestamp } = useEspData({
    processedSensorData: true,
    enableNotifications: true,
    triggerWarningModal: triggerWarningModal,
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: "ri-dashboard-line" },
    { id: "tren", label: "Tren", icon: "ri-line-chart-line" },
    { id: "analitik", label: "Analitik", icon: "ri-bar-chart-line" },
    { id: "alert", label: "Alert", icon: "ri-notification-line" },
  ];

  // Data peringatan aktif (dummy data, bisa diganti dengan data real)
  const activeWarnings = [
    {
      id: 1,
      type: "VOC Tinggi Terdeteksi",
      level: "warning",
      value: "47 ppm",
      threshold: "batas 20 ppm",
      icon: "ri-error-warning-line",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
    },
    {
      id: 2,
      type: "Suhu Tinggi",
      level: "alert",
      value: "40.0°C",
      threshold: "",
      icon: "ri-temp-hot-line",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
    },
  ];

  // Data riwayat peringatan 24 jam
  const warningHistory = [
    {
      time: "08:45",
      type: "Kelembaban rendah",
      status: "resolved",
      timeAgo: "8 jam lalu",
    },
    {
      time: "02:20",
      type: "PM2.5 meningkat",
      status: "resolved",
      timeAgo: "14 jam lalu",
    },
  ];

  // Status sistem
  const systemStatus = [
    {
      name: "Sensor Aktif",
      count: "7/7",
      status: "online",
      icon: "ri-bar-chart-box-line",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
    },
    {
      name: "Notifikasi",
      count: "Aktif",
      status: "active",
      icon: "ri-notification-3-line",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
    {
      name: "Koneksi",
      count: "Stabil",
      status: "stable",
      icon: "ri-signal-wifi-line",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
    {
      name: "Database",
      count: "Normal",
      status: "normal",
      icon: "ri-database-2-line",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
      textColor: "text-orange-800",
    },
  ];

  return (
    <>
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          @media (max-width: 475px) {
            .xs\\:inline {
              display: inline !important;
            }
          }
        `}
      </style>

      <WarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        {modalContent.message}
      </WarningModal>

      <div className="grid grid-cols-1 gap-3 bg-gradient-to-b bg-[#45cad7] text-white min-h-screen mb-20 px-3 sm:px-4">
        <div className="w-full max-w-4xl mx-auto rounded-2xl p-2 sm:p-3 lg:p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-[#e8fdff] p-1 rounded-lg overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-[#45cad7] shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <i className={`${tab.icon} text-sm sm:text-base`}></i>
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full max-w-4xl mx-auto bg-[#e8fdff] min-h-screen rounded-2xl py-3 sm:py-4 lg:py-7 px-2 sm:px-3 lg:px-6 shadow-lg space-y-3 sm:space-y-4">
          {/* Header - Last Update */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 lg:mb-6 gap-2">
            <ConnectionStatusIndicator isConnected={isEspOnline} />
            <p className="font-semibold text-xs sm:text-sm text-black">
              Last Update :{" "}
              <span className="font-normal text-gray-600">
                {formattedTimestamp}
              </span>
            </p>
          </div>
          {activeTab === "overview" && (
            <>
              {/* Overview Content - tampilan yang sudah ada */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 order-2 lg:order-1 p-3 sm:p-4 lg:p-6">
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                      Air Quality Index
                    </h3>
                    <div className="flex justify-center">
                      <Gauge
                        width={140}
                        height={140}
                        value={sensorData?.gas?.value || 0}
                        valueMin={0}
                        valueMax={1000}
                        startAngle={-90}
                        endAngle={90}
                        sx={{
                          [`& .MuiGauge-valueText`]: {
                            fontSize: 22,
                            transform: "translate(0px, 0px)",
                            fill: "#374151",
                            fontWeight: "bold",
                          },
                          [`& .MuiGauge-valueArc`]: {
                            fill:
                              sensorData?.gas?.value > 150
                                ? "#ef4444"
                                : sensorData?.gas?.value > 100
                                ? "#f59e0b"
                                : "#10b981",
                          },
                          [`& .MuiGauge-referenceArc`]: {
                            fill: "#e5e7eb",
                          },
                        }}
                      />
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            (sensorData?.gas?.value || 0) > 150
                              ? "text-red-600"
                              : (sensorData?.gas?.value || 0) > 100
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {(sensorData?.gas?.value || 0) > 150
                            ? "Berbahaya"
                            : (sensorData?.gas?.value || 0) > 100
                            ? "Sedang"
                            : "Baik"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {sensorData ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3 order-1 lg:order-2">
                      <StatusCard
                        title="Temperature"
                        value={sensorData.temperature.value}
                        unit={sensorData.temperature.unit}
                        status={sensorData.temperature.status}
                        icon="ri-thermometer-line text-red-500 fas"
                        iconBg="bg-red-100"
                      />
                      <StatusCard
                        title="Humidity"
                        value={sensorData.humidity.value}
                        unit={sensorData.humidity.unit}
                        status={sensorData.humidity.status}
                        icon="ri-drop-fill text-blue-500 fas"
                        iconBg="bg-blue-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3 order-3 lg:order-3">
                      <StatusCard
                        title="AQI"
                        value={sensorData.gas.value}
                        unit={sensorData.gas.unit}
                        status={sensorData.gas.status}
                        icon="ri-windy-line text-green-500 fas"
                        iconBg="bg-green-100"
                      />
                      <StatusCard
                        title="VOC"
                        value={sensorData.gas.value}
                        unit={sensorData.gas.unit}
                        status={sensorData.gas.status}
                        icon="ri-windy-line text-orange-500 fas"
                        iconBg="bg-orange-100"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-xs sm:text-sm lg:text-lg col-span-full text-center">
                    {isEspOnline
                      ? "Menunggu data sensor pertama..."
                      : "ESP Offline atau tidak mengirim data..."}
                  </p>
                )}
              </div>
              {/* Detailed Data Cards */}
              {sensorData ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
                    <StatusCard
                      title="Amonia"
                      value={sensorData.amonia?.value || 0}
                      unit="ppm"
                      status={{
                        text: "Normal",
                        textColor: "text-green-800",
                        bgColor: "bg-green-100",
                      }}
                      detailedData={true}
                    />
                    <StatusCard
                      title="NO"
                      value={sensorData.no?.value || 0}
                      unit="ppm"
                      status={{
                        text: "Normal",
                        textColor: "text-green-800",
                        bgColor: "bg-green-100",
                      }}
                      detailedData={true}
                    />
                    <StatusCard
                      title="CO"
                      value={sensorData.co?.value || 0}
                      unit="ppm"
                      status={{
                        text: "Normal",
                        textColor: "text-green-800",
                        bgColor: "bg-green-100",
                      }}
                      detailedData={true}
                    />
                    <StatusCard
                      title="Benzena"
                      value={sensorData.benzena?.value || 0}
                      unit="ppm"
                      status={{
                        text: "Normal",
                        textColor: "text-green-800",
                        bgColor: "bg-green-100",
                      }}
                      detailedData={true}
                    />
                    <StatusCard
                      title="Alkohol"
                      value={sensorData.alkohol?.value || 0}
                      unit="ppm"
                      status={{
                        text: "Normal",
                        textColor: "text-green-800",
                        bgColor: "bg-green-100",
                      }}
                      detailedData={true}
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-xs sm:text-sm lg:text-lg text-center">
                  {isEspOnline
                    ? "Menunggu data sensor pertama..."
                    : "ESP Offline atau tidak mengirim data..."}
                </p>
              )}
              <div className="w-full overflow-x-auto">
                <DataSensorChart data={sensorData} />
              </div>
            </>
          )}

          {activeTab === "tren" && (
            <>
              <div className="w-full overflow-x-auto mb-4">
                <DataSensorChart data={sensorData} />
              </div>
              <div className="w-full overflow-x-auto mb-6">
                <DataSensorChart data={sensorData} />
              </div>
            </>
          )}

          {activeTab === "analitik" && (
            <>
              <div className="w-full overflow-x-auto mb-4">
                <DataSensorChart data={sensorData} />
              </div>
              <div className="w-full overflow-x-auto mb-6">
                <DataSensorChart data={sensorData} />
              </div>
            </>
          )}

          {activeTab === "alert" && (
            <>
              {/* Peringatan Aktif */}
              <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <h1 className="text-black font-semibold text-base sm:text-lg">
                    Peringatan Aktif
                  </h1>
                  {activeWarnings.length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {activeWarnings.length}
                    </span>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {activeWarnings.length > 0 ? (
                    activeWarnings.map((warning) => (
                      <div
                        key={warning.id}
                        className={`${warning.bgColor} ${warning.borderColor} border rounded-lg p-3 sm:p-4 flex items-center justify-between`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <i
                            className={`${warning.icon} text-lg sm:text-xl ${warning.iconColor}`}
                          ></i>
                          <div>
                            <p
                              className={`font-semibold text-xs sm:text-sm ${warning.textColor}`}
                            >
                              {warning.type}
                            </p>
                            <p className="text-xs text-gray-600">
                              Nilai {warning.value} {warning.threshold}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                              warning.level === "alert"
                                ? "bg-red-400"
                                : "bg-yellow-400"
                            } animate-pulse`}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
                      <i className="ri-checkbox-circle-line text-2xl sm:text-3xl text-green-600"></i>
                      <p className="text-green-800 font-medium mt-2 text-sm sm:text-base">
                        Tidak ada peringatan aktif
                      </p>
                      <p className="text-green-600 text-xs sm:text-sm">
                        Semua sensor dalam kondisi normal
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Riwayat Peringatan */}
              <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 p-3 sm:p-4 lg:p-6">
                <h1 className="text-black font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                  Riwayat Peringatan (24 Jam Terakhir)
                </h1>

                <div className="space-y-2 sm:space-y-3">
                  {warningHistory.length > 0 ? (
                    warningHistory.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-800">
                              {item.time}
                            </p>
                            <p className="text-xs text-gray-600">{item.type}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.timeAgo}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      Tidak ada riwayat peringatan
                    </p>
                  )}
                </div>
              </div>
              {/* Status Sistem Peringatan */}
              <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 p-3 sm:p-4 lg:p-6">
                <h1 className="text-black font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                  Status Sistem Peringatan
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  {systemStatus.map((system, index) => (
                    <div
                      key={index}
                      className={`${system.bgColor} ${system.borderColor} border rounded-lg p-2 sm:p-3 lg:p-4 text-center transition-all hover:shadow-md`}
                    >
                      <i
                        className={`${system.icon} text-xl sm:text-2xl ${system.iconColor}`}
                      ></i>
                      <p
                        className={`text-xs sm:text-sm font-semibold ${system.textColor} mt-1 sm:mt-2`}
                      >
                        {system.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {system.count}
                      </p>
                      <div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mx-auto mt-1 sm:mt-2 ${
                          system.status === "online" ||
                          system.status === "active" ||
                          system.status === "stable" ||
                          system.status === "normal"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Statistik;
