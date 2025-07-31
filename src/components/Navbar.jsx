import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, onValue } from "firebase/database";

function Navbar() {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentAirQuality, setCurrentAirQuality] = useState(0);

  const notifRef = useRef(null);
  const audioRef = useRef(null);
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;

  // Threshold sesuai Arduino
  const VOC_LOW = 240;
  const VOC_MID = 250;

  // Firebase realtime data listener
  useEffect(() => {
    const sensorRef = ref(db, "sensor");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const airQualityValue = rawData.airQuality;
        
        // Update current air quality
        setCurrentAirQuality(airQualityValue);
        
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let newNotification = null;

        if (airQualityValue <= VOC_LOW) {
          // Udara Baik - LED Hijau, Kipas Mati
          newNotification = {
            id: Date.now(),
            title: "Kualitas Udara Baik",
            message: `ADC: ${airQualityValue} - Udara dalam kondisi baik. Kipas dimatikan untuk menghemat energi.`,
            icon: "ri-checkbox-circle-line",
            type: "success",
            time: `${timeString}`,
            airQuality: airQualityValue,
            fanStatus: "OFF",
            ledColor: "Hijau",
            temperature: rawData.temperature,
            humidity: rawData.humidity
          };
        } else if (airQualityValue > VOC_LOW && airQualityValue <= VOC_MID) {
          // Udara Sedang - LED Kuning, Kipas Nyala
          newNotification = {
            id: Date.now(),
            title: "Kualitas Udara Sedang",
            message: `ADC: ${airQualityValue} - Kualitas udara menurun. Kipas dinyalakan untuk sirkulasi udara.`,
            icon: "ri-error-warning-line",
            type: "warning",
            time: `${timeString}`,
            airQuality: airQualityValue,
            fanStatus: "ON",
            ledColor: "Kuning",
            temperature: rawData.temperature,
            humidity: rawData.humidity
          };
        } else {
          // Udara Buruk - LED Merah, Kipas Nyala
          newNotification = {
            id: Date.now(),
            title: "⚠️ KUALITAS UDARA BURUK!",
            message: `ADC: ${airQualityValue} - Kualitas udara berbahaya! Kipas dinyalakan. Segera tinggalkan area atau gunakan masker.`,
            icon: "ri-alarm-warning-line",
            type: "danger",
            time: `${timeString}`,
            airQuality: airQualityValue,
            fanStatus: "ON",
            ledColor: "Merah",
            temperature: rawData.temperature,
            humidity: rawData.humidity
          };
        }

        if (newNotification) {
          setNotifications(prev => {
            // Cek apakah notifikasi serupa sudah ada dalam 30 detik terakhir
            const recentSimilar = prev.find(notif => 
              notif.type === newNotification.type && 
              (Date.now() - notif.id) < 30000
            );
            
            if (!recentSimilar) {
              return [newNotification, ...prev.slice(0, 9)]; // Keep only 10 notifications
            }
            return prev;
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);



  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }

    function handleScroll() {
      setShowNotif(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const typeStyle = {
    danger: "border-red-300 bg-red-50 text-red-700",
    warning: "border-yellow-300 bg-yellow-50 text-yellow-700",
    success: "border-green-300 bg-green-50 text-green-700",
    info: "border-blue-300 bg-blue-50 text-blue-700",
  };

  const getCurrentStatus = () => {
    if (currentAirQuality <= VOC_LOW) return "success";
    if (currentAirQuality <= VOC_MID) return "warning";
    return "danger";
  };

  const hasActiveAlerts = notifications.some(notif => notif.type === "danger" || notif.type === "warning");

  return (
    <div className="max-w-4xl mx-auto flex justify-between items-center mb-5 relative px-5">
      <div className="flex items-center gap-4">
        <div className="bg-[#2f9ea8] py-2 px-3 rounded-lg">
          <i className="ri-leaf-line ri-lg"></i>
        </div>
        <div>
          <h1 className="font-semibold text-xl tracking-widest">AIRA</h1>
          <p className="text-base text-gray-200">
            Smart Air Quality Monitoring
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Status Indicator */}
        <div className={`py-2 px-3 rounded-lg text-white text-sm font-medium ${
          getCurrentStatus() === 'success' ? 'bg-green-500' :
          getCurrentStatus() === 'warning' ? 'bg-yellow-500' :
          'bg-red-500'
        }`}>
          ADC: {currentAirQuality}
        </div>

        {/* Notifikasi */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className={`py-2 px-3 rounded-lg relative cursor-pointer transition-colors ${
              hasActiveAlerts ? 'bg-red-500 animate-pulse' : 'bg-[#2f9ea8]'
            }`}
          >
            <i className="ri-notification-3-line ri-lg"></i>
            {notifications.length > 0 && (
              <span className={`absolute -top-1 -right-1 w-5 h-5 ${
                hasActiveAlerts ? 'bg-yellow-400' : 'bg-red-500'
              } text-white text-xs rounded-full flex items-center justify-center font-bold`}>
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {/* Popup */}
          {showNotif && (
            <div
              ref={notifRef}
              className="absolute -right-15 mt-2 w-96 bg-white text-gray-800 rounded-xl shadow-lg z-50 px-4 py-3 max-h-96 overflow-y-auto space-y-3"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <div className="text-lg font-semibold">Notifikasi Sensor</div>
                <div className="text-sm text-gray-500">Live Monitor</div>
              </div>
              
              {notifications.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <i className="ri-notification-off-line text-2xl mb-2"></i>
                  <p>Belum ada notifikasi</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${
                      typeStyle[notif.type]
                    } shadow-sm`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <i className={`${notif.icon} text-xl`}></i>
                      </div>
                      <div className="text-sm flex-1">
                        <h4 className="font-bold mb-1">{notif.title}</h4>
                        <p className="text-xs mb-2">{notif.message}</p>
                        {notif.temperature && notif.humidity && (
                          <div className="text-[10px] text-gray-600 mb-1">
                            🌡️ {notif.temperature.toFixed(1)}°C | 💧 {notif.humidity.toFixed(1)}%
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[10px] text-gray-500">
                          <span>LED: {notif.ledColor} | Kipas: {notif.fanStatus}</span>
                          <span>{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              <div className="text-center pt-2 border-t">
                <div className="text-xs text-gray-400">
                  {/* Threshold: Baik ≤{VOC_LOW} | Sedang ≤{VOC_MID} | Buruk >{VOC_MID} ADC */}
                </div>
                <div className="text-[10px] text-gray-300 mt-1">
                  🔴 Data realtime dari Firebase
                </div>
              </div>
            </div>
          )}
        </div>

        <NavLink
          to="/settings"
          className={`py-2 px-3 rounded-lg transition-colors ${
            isActive("/settings")
              ? "bg-white text-[#2f9ea8]"
              : "bg-[#2f9ea8] text-white hover:bg-[#45cad7]"
          }`}
        >
          <i className="ri-settings-3-line ri-lg"></i>
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;