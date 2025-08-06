import { useState, useEffect, useRef } from "react";
import { rtdb } from "../firebase/config";
import { ref, onValue, push, serverTimestamp } from "firebase/database";

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

// Pengaturan Notifikasi (dalam milidetik)
// 60000 = 1 menit
// 120000 = 2 menit
// 150000 = 2.5 menit
// 300000 = 5 menit
// 600000 = 10 menit
const NOTIFICATION_COOLDOWN = 10000;
const ESP_OFFLINE_THRESHOLD = 60000;

export const useEspData = (options = {}) => {
  const {
    includeRawData = false,
    onDataReceived = null,
    enableNotifications = false,
    triggerWarningModal = null,
    processedSensorData = false,
  } = options;

  const [isEspOnline, setIsEspOnline] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [formattedTimestamp, setFormattedTimestamp] = useState(" - ");
  const [sensorData, setSensorData] = useState(null);
  const [rawSensorData, setRawSensorData] = useState(null);

  // Refs untuk notification cooldown (hanya jika notifikasi diaktifkan)
  const lastTempNotificationTime = useRef(null);
  const lastHumidNotificationTime = useRef(null);
  const lastAqiNotificationTime = useRef(null);

  // Load notification times from localStorage on mount
  useEffect(() => {
    if (enableNotifications) {
      const tempTime = localStorage.getItem("lastTempNotification");
      const humidTime = localStorage.getItem("lastHumidNotification");
      const aqiTime = localStorage.getItem("lastAqiNotification");

      lastTempNotificationTime.current = tempTime ? parseInt(tempTime) : null;
      lastHumidNotificationTime.current = humidTime
        ? parseInt(humidTime)
        : null;
      lastAqiNotificationTime.current = aqiTime ? parseInt(aqiTime) : null;
    }
  }, [enableNotifications]);

  useEffect(() => {
    // 1. Listener untuk data sensor dari ESP
    const sensorRef = ref(rtdb, "sensor");
    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();

        if (raw.timestamp) {
          const timestampInMillis = raw.timestamp;
          setLastTimestamp(timestampInMillis);

          const dateOptions = {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          };
          setFormattedTimestamp(
            new Intl.DateTimeFormat("id-ID", dateOptions).format(
              new Date(timestampInMillis)
            )
          );
        }

        // Set raw sensor data jika diminta
        if (includeRawData) {
          setRawSensorData(raw);
        }

        // Set processed sensor data jika diminta
        if (processedSensorData) {
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
            amonia: {
              value: raw.airQuality * 0.5,
              unit: "ppm",
              status: getStatusStyles("gas", raw.airQuality * 0.5),
            },
            no: {
              value: raw.airQuality * 0.3,
              unit: "ppm",
              status: getStatusStyles("gas", raw.airQuality * 0.3),
            },
            co: {
              value: raw.airQuality * 0.25,
              unit: "ppm",
              status: getStatusStyles("gas", raw.airQuality * 0.25),
            },
            benzena: {
              value: raw.airQuality * 0.15,
              unit: "ppm",
              status: getStatusStyles("gas", raw.airQuality * 0.15),
            },
            alkohol: {
              value: raw.airQuality * 0.75,
              unit: "ppm",
              status: getStatusStyles("gas", raw.airQuality * 0.75),
            },
          });
        }

        // Logika Notifikasi (hanya jika diaktifkan)
        if (enableNotifications && triggerWarningModal) {
          const now = Date.now();
          const notificationRef = ref(rtdb, "notifications");

          // Temperature notification
          if (raw.temperature > 35) {
            if (
              lastTempNotificationTime.current === null ||
              now - lastTempNotificationTime.current > NOTIFICATION_COOLDOWN
            ) {
              const message = `Suhu terdeteksi terlalu PANAS: ${raw.temperature.toFixed(
                1
              )}°C.`;
              triggerWarningModal("Peringatan Suhu Kritis", message);
              push(notificationRef, {
                type: "Suhu Panas",
                message: message,
                value: raw.temperature,
                timestamp: serverTimestamp(),
              });
              lastTempNotificationTime.current = now;
              localStorage.setItem("lastTempNotification", now.toString());
            }
          } else {
            lastTempNotificationTime.current = null;
            localStorage.removeItem("lastTempNotification");
          }

          // Humidity notification
          if (raw.humidity > 80) {
            if (
              lastHumidNotificationTime.current === null ||
              now - lastHumidNotificationTime.current > NOTIFICATION_COOLDOWN
            ) {
              const message = `Kelembapan terdeteksi terlalu LEMBAB: ${raw.humidity.toFixed(
                0
              )}%.`;
              triggerWarningModal("Peringatan Kelembapan", message);
              push(notificationRef, {
                type: "Kelembapan Lembab",
                message: message,
                value: raw.humidity,
                timestamp: serverTimestamp(),
              });
              lastHumidNotificationTime.current = now;
              localStorage.setItem("lastHumidNotification", now.toString());
            }
          } else {
            lastHumidNotificationTime.current = null;
            localStorage.removeItem("lastHumidNotification");
          }

          // Air quality notification
          if (raw.airQuality > 700) {
            if (
              lastAqiNotificationTime.current === null ||
              now - lastAqiNotificationTime.current > NOTIFICATION_COOLDOWN
            ) {
              const message = `Kualitas udara terdeteksi BURUK: ${raw.airQuality} ppm.`;
              triggerWarningModal("Peringatan Kualitas Udara", message);
              push(notificationRef, {
                type: "Kualitas Udara Buruk",
                message: message,
                value: raw.airQuality,
                timestamp: serverTimestamp(),
              });
              lastAqiNotificationTime.current = now;
              localStorage.setItem("lastAqiNotification", now.toString());
            }
          } else {
            lastAqiNotificationTime.current = null;
            localStorage.removeItem("lastAqiNotification");
          }
        }

        // Callback untuk data yang diterima (opsional)
        if (onDataReceived) {
          onDataReceived(raw);
        }
      } else {
        setSensorData(null);
        setRawSensorData(null);
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
  }, [
    lastTimestamp,
    includeRawData,
    onDataReceived,
    enableNotifications,
    triggerWarningModal,
    processedSensorData,
  ]);

  return {
    isEspOnline,
    lastTimestamp,
    formattedTimestamp,
    sensorData, // processed data with styling
    rawSensorData, // raw data from firebase
  };
};
