import ConnectionStatusIndicator from "../components/ConnectionStatusIndicator";
import StatusCard from "../components/StatusCard";
import { useEspData } from "../hooks";
import { useState } from "react";
import WarningModal from "../components/WarningModal";
import DataSensorChart from "../components/DataSensorChart";

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

  return (
    <>
      <WarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        {modalContent.message}
      </WarningModal>

      <div className="grid grid-cols-1 gap-3 bg-gradient-to-b bg-[#45cad7] text-white min-h-screen mb-20 px-4">
        <div className="max-w-4xl mx-auto rounded-2xl p-3 sm:p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-[#e8fdff] p-1 rounded-lg overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-[#45cad7] shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <i className={tab.icon}></i>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto bg-[#e8fdff] min-h-screen rounded-2xl py-4 sm:py-7 px-3 sm:px-6 shadow-lg">
          {/* Header - Last Update */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
                <div className="bg-white h-32 sm:h-75 rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 order-2 lg:order-1"></div>
                {sensorData ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 order-1 lg:order-2">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 order-3 lg:order-3">
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
                  <p className="text-gray-500 text-sm sm:text-lg col-span-full">
                    {isEspOnline
                      ? "Menunggu data sensor pertama..."
                      : "ESP Offline atau tidak mengirim data..."}
                  </p>
                )}
              </div>

              {/* Detailed Data Cards */}
              {sensorData ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
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
                <p className="text-gray-500 text-sm sm:text-lg">
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
              {sensorData ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mt-6 sm:mt-8">
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
                <p className="text-gray-500 text-sm sm:text-lg">
                  {isEspOnline
                    ? "Menunggu data sensor pertama..."
                    : "ESP Offline atau tidak mengirim data..."}
                </p>
              )}
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
              {sensorData ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                        Analisis Kualitas Udara
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <p>• CO Level: Normal (&lt; 9 ppm)</p>
                        <p>• NO Level: Normal (&lt; 25 ppm)</p>
                        <p>• Benzena: Normal (&lt; 5 ppm)</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                        Trend Harian
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <p>• CO: Stabil</p>
                        <p>• NO: Menurun</p>
                        <p>• Amonia: Stabil</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                        Rekomendasi
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <p>• Ventilasi cukup baik</p>
                        <p>• Monitoring rutin</p>
                        <p>• Perawatan sensor</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm sm:text-lg">
                  {isEspOnline
                    ? "Menunggu data untuk analitik..."
                    : "ESP Offline atau tidak mengirim data..."}
                </p>
              )}
            </>
          )}

          {activeTab === "alert" && (
            <>
              {sensorData ? (
                <>
                  <div className="grid grid-cols-1 gap-2 sm:gap-4 mt-6 sm:mt-8 mb-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-red-800">
                        Alert Status
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm text-red-700">
                        <p>✓ Semua sensor dalam kondisi normal</p>
                        <p>✓ Tidak ada peringatan aktif</p>
                        <p>✓ Kualitas udara baik</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
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
                <p className="text-gray-500 text-sm sm:text-lg">
                  {isEspOnline
                    ? "Menunggu data untuk alert..."
                    : "ESP Offline atau tidak mengirim data..."}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Statistik;
