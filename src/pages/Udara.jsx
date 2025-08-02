import ConnectionStatusIndicator from "../components/ConnectionStatusIndicator";
import { useEspData } from "../hooks";
import { useState } from "react";
import WarningModal from "../components/WarningModal";

function Udara() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const triggerWarningModal = (title, message) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  };

  const { isEspOnline, formattedTimestamp } = useEspData({
    processedSensorData: true,
    enableNotifications: true,
    triggerWarningModal: triggerWarningModal,
  });

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
    },
    {
      name: "Notifikasi",
      count: "Aktif",
      status: "active",
      icon: "ri-notification-3-line",
    },
    {
      name: "Koneksi",
      count: "Stabil",
      status: "stable",
      icon: "ri-signal-wifi-line",
    },
    {
      name: "Database",
      count: "Normal",
      status: "normal",
      icon: "ri-database-2-line",
    },
  ];

  return (
    <>
      <WarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        {modalContent.message}
      </WarningModal>

      <div className=" text-white min-h-screen py-5 mb-20">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-4xl mx-auto bg-[#e8fdff] min-h-screen rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
            <ConnectionStatusIndicator isConnected={isEspOnline} />
            <p className="font-semibold text-xs sm:text-sm text-black">
              Last Update :{" "}
              <span className="font-normal text-gray-600">
                {formattedTimestamp}
              </span>
            </p>
          </div>

          {/* Peringatan Aktif */}
          <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-black font-semibold text-lg">
                Peringatan Aktif
              </h1>
              {activeWarnings.length > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {activeWarnings.length}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {activeWarnings.length > 0 ? (
                activeWarnings.map((warning) => (
                  <div
                    key={warning.id}
                    className={`${warning.bgColor} ${warning.borderColor} border rounded-lg p-4 flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <i
                        className={`${warning.icon} text-xl ${warning.iconColor}`}
                      ></i>
                      <div>
                        <p
                          className={`font-semibold text-sm ${warning.textColor}`}
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
                        className={`w-3 h-3 rounded-full ${
                          warning.level === "alert"
                            ? "bg-red-400"
                            : "bg-yellow-400"
                        } animate-pulse`}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <i className="ri-checkbox-circle-line text-3xl text-green-600"></i>
                  <p className="text-green-800 font-medium mt-2">
                    Tidak ada peringatan aktif
                  </p>
                  <p className="text-green-600 text-sm">
                    Semua sensor dalam kondisi normal
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Riwayat Peringatan */}
          <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 p-4 sm:p-6">
            <h1 className="text-black font-semibold text-lg mb-4">
              Riwayat Peringatan (24 Jam Terakhir)
            </h1>

            <div className="space-y-3">
              {warningHistory.length > 0 ? (
                warningHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
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
                <p className="text-gray-500 text-center py-4">
                  Tidak ada riwayat peringatan
                </p>
              )}
            </div>
          </div>

          {/* Status Sistem Peringatan */}
          <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 p-4 sm:p-6">
            <h1 className="text-black font-semibold text-lg mb-4">
              Status Sistem Peringatan
            </h1>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {systemStatus.map((system, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center"
                >
                  <i className={`${system.icon} text-2xl text-gray-600`}></i>
                  <p className="text-sm font-semibold text-gray-800 mt-2">
                    {system.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{system.count}</p>
                  <div
                    className={`w-2 h-2 rounded-full mx-auto mt-2 ${
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
        </div>
      </div>
    </>
  );
}

export default Udara;
