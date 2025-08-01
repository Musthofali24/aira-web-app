import ConnectionStatusIndicator from "../components/ConnectionStatusIndicator";
import StatusCard from "../components/StatusCard";
import DataSensorChart from "../components/DataSensorChart";
import { rtdb } from "../firebase/config";
import { ref, onValue, push, serverTimestamp } from "firebase/database";
import { useEffect, useState, useRef } from "react";
import WarningModal from "../components/WarningModal";

const getStatusStyles = (type, value) => {
  let statusText = "";
  let styles = { text: "", textColor: "", bgColor: "" };

  if (type === "temperature") {
    if (value > 35) statusText = "Panas";
    else if (value < 20) statusText = "Dingin";
    else statusText = "Normal";
  } else if (type === "humidity") {
    if (value > 80) statusText = "Lembab";
    else if (value < 30) statusText = "Kering";
    else statusText = "Cukup";
  } else if (type === "gas") {
    if (value > 700) statusText = "Buruk";
    else if (value > 400) statusText = "Sedang";
    else statusText = "Baik";
  }

  switch (statusText) {
    case "Panas":
    case "Buruk":
    case "Lembab":
      styles = {
        text: statusText,
        textColor: "text-red-800",
        bgColor: "bg-red-100",
      };
      break;
    case "Dingin":
    case "Kering":
      styles = {
        text: statusText,
        textColor: "text-blue-800",
        bgColor: "bg-blue-100",
      };
      break;
    case "Sedang":
      styles = {
        text: statusText,
        textColor: "text-yellow-800",
        bgColor: "bg-yellow-100",
      };
      break;
    case "Normal":
    case "Cukup":
    case "Baik":
      styles = {
        text: statusText,
        textColor: "text-green-800",
        bgColor: "bg-green-100",
      };
      break;
    default:
      styles = {
        text: statusText,
        textColor: "text-gray-800",
        bgColor: "bg-gray-100",
      };
  }
  return styles;
};

const NOTIFICATION_COOLDOWN = 150000;
const ESP_OFFLINE_THRESHOLD = 60000;

function Home() {
  const [sensorData, setSensorData] = useState(null);
  const [isEspOnline, setIsEspOnline] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [formattedTimestamp, setFormattedTimestamp] = useState(" - ");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const lastTempNotificationTime = useRef(null);
  const lastHumidNotificationTime = useRef(null);
  const lastAqiNotificationTime = useRef(null);

  const triggerWarningModal = (title, message) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  };

  useEffect(() => {
    // 1. Listener untuk data sensor dari ESP
    const sensorRef = ref(rtdb, "sensor");
    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();

        if (raw.timestamp) {
          const timestampInMillis = raw.timestamp;
          setLastTimestamp(timestampInMillis);

          const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          };
          setFormattedTimestamp(
            new Intl.DateTimeFormat("id-ID", options).format(
              new Date(timestampInMillis)
            )
          );
        }

        // Update data sensor untuk ditampilkan di kartu
        setSensorData({
          temperature: {
            value: raw.temperature,
            unit: "°C",
            status: getStatusStyles("temperature", raw.temperature),
          },
          humidity: {
            value: raw.humidity,
            unit: "%",
            status: getStatusStyles("humidity", raw.humidity),
          },
          gas: {
            value: raw.airQuality,
            unit: "ppm",
            status: getStatusStyles("gas", raw.airQuality),
          },
        });

        // Logika Notifikasi dengan Cooldown
        const now = Date.now();
        const notificationRef = ref(rtdb, "notifications");

        if (raw.temperature > 35) {
          if (
            lastTempNotificationTime.current === null ||
            now - lastTempNotificationTime.current > NOTIFICATION_COOLDOWN
          ) {
            const message = `Suhu terdeteksi terlalu PANAS: ${raw.temperature.toFixed(
              1
            )}°C.`;
            triggerWarningModal("Peringatan Suhu Kritis", message);
            // BARU: Kirim log ke RTDB
            push(notificationRef, {
              type: "Suhu Panas",
              message: message,
              value: raw.temperature,
              timestamp: serverTimestamp(),
            });
            lastTempNotificationTime.current = now;
          }
        } else {
          lastTempNotificationTime.current = null;
        }

        if (raw.humidity > 80) {
          if (
            lastHumidNotificationTime.current === null ||
            now - lastHumidNotificationTime.current > NOTIFICATION_COOLDOWN
          ) {
            const message = `Kelembapan terdeteksi terlalu LEMBAB: ${raw.humidity.toFixed(
              0
            )}%.`;
            triggerWarningModal("Peringatan Kelembapan", message);
            // BARU: Kirim log ke RTDB
            push(notificationRef, {
              type: "Kelembapan Lembab",
              message: message,
              value: raw.humidity,
              timestamp: serverTimestamp(),
            });
            lastHumidNotificationTime.current = now;
          }
        } else {
          lastHumidNotificationTime.current = null;
        }

        if (raw.airQuality > 700) {
          if (
            lastAqiNotificationTime.current === null ||
            now - lastAqiNotificationTime.current > NOTIFICATION_COOLDOWN
          ) {
            const message = `Kualitas udara terdeteksi BURUK: ${raw.airQuality} ppm.`;
            triggerWarningModal("Peringatan Kualitas Udara", message);
            // BARU: Kirim log ke RTDB
            push(notificationRef, {
              type: "Kualitas Udara Buruk",
              message: message,
              value: raw.airQuality,
              timestamp: serverTimestamp(),
            });
            lastAqiNotificationTime.current = now;
          }
        } else {
          lastAqiNotificationTime.current = null;
        }
      } else {
        setSensorData(null);
        setIsEspOnline(false);
      }
    });

    // 2. Interval untuk memeriksa status online ESP
    const statusCheckerInterval = setInterval(() => {
      if (lastTimestamp) {
        setIsEspOnline(Date.now() - lastTimestamp < ESP_OFFLINE_THRESHOLD);
      } else {
        setIsEspOnline(false);
      }
    }, 5000); // Periksa setiap 5 detik

    // Cleanup function: hentikan semua listener & interval saat komponen dibongkar
    return () => {
      unsubscribeSensor();
      clearInterval(statusCheckerInterval);
    };
  }, [lastTimestamp]);

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
        <div className="max-w-4xl mx-auto bg-white text-black min-h-screen rounded-2xl px-6 shadow-lg py-7">
          <div className="flex justify-between items-center mb-6">
            <ConnectionStatusIndicator isConnected={isEspOnline} />
            <p className="font-semibold text-sm text-black">
              Last Update :{" "}
              <span className="font-normal text-gray-600">
                {formattedTimestamp}
              </span>
            </p>
          </div>

          {/* <div className="my-6 p-4 border border-dashed rounded-lg flex items-center gap-4">
            <p className="font-semibold text-sm text-gray-700">
              Uji Modal Peringatan:
            </p>
            <button
              onClick={() =>
                triggerWarningModal(
                  "Uji Peringatan Suhu",
                  "Ini adalah contoh pesan jika suhu terdeteksi terlalu panas."
                )
              }
              className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Tes Modal Suhu
            </button>
            <button
              onClick={() =>
                triggerWarningModal(
                  "Uji Peringatan Kelembapan",
                  "Ini adalah contoh pesan jika kelembapan terdeteksi terlalu tinggi."
                )
              }
              className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Tes Modal Kelembapan
            </button>
            <button
              onClick={() =>
                triggerWarningModal(
                  "Uji Peringatan Kualitas Udara",
                  "Ini adalah contoh pesan jika kualitas udara terdeteksi buruk."
                )
              }
              className="px-3 py-1 text-xs font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-800"
            >
              Tes Modal AQI
            </button>
          </div> */}

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
