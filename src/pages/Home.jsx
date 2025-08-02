import ConnectionStatusIndicator from "../components/ConnectionStatusIndicator";
import StatusCard from "../components/StatusCard";
import DataSensorChart from "../components/DataSensorChart";
import { useState } from "react";
import WarningModal from "../components/WarningModal";
import { useEspData } from "../hooks";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const triggerWarningModal = (title, message) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  };

  const { sensorData, isEspOnline, formattedTimestamp } = useEspData({
    processedSensorData: true,
    enableNotifications: true,
    triggerWarningModal: triggerWarningModal,
  });

  return (
    <>
      <WarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        {modalContent.message}
      </WarningModal>

      <div className="bg-[#45cad7] text-white min-h-screen mb-20 py-5">
        <div className="max-w-4xl mx-auto bg-[#e8fdff] text-black min-h-screen rounded-2xl px-6 shadow-lg py-7">
          <div className="flex justify-between items-center mb-6">
            <ConnectionStatusIndicator isConnected={isEspOnline} />
            <p className="font-semibold text-sm text-black">
              Last Update :{" "}
              <span className="font-normal text-gray-600">
                {formattedTimestamp}
              </span>
            </p>
          </div>

          {sensorData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <StatusCard
                  title="AQI"
                  value={sensorData.gas.value}
                  unit={sensorData.gas.unit}
                  status={sensorData.gas.status}
                  icon="ri-windy-line text-green-500 fas"
                  iconBg="bg-green-100"
                />
              </div>

              <DataSensorChart data={sensorData} />
            </>
          ) : (
            <p className="text-gray-500 text-lg">
              {isEspOnline
                ? "Menunggu data sensor pertama..."
                : "ESP Offline atau tidak mengirim data..."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
