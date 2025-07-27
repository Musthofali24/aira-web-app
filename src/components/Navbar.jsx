import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;

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

  const notifications = [
    {
      id: 1,
      title: "Kualitas Udara Buruk",
      message: "PM2.5 tinggi (45 µg/m³). Aktifkan air purifier segera!",
      icon: "ri-error-warning-line",
      type: "danger",
      time: "2 menit lalu",
    },
    {
      id: 2,
      title: "CO2 Tinggi Terdeteksi",
      message:
        "Level CO2 mencapai 850 ppm. Buka ventilasi untuk sirkulasi udara.",
      icon: "ri-windy-line",
      type: "warning",
      time: "5 menit lalu",
    },
    {
      id: 3,
      title: "Kualitas Udara Sangat Baik",
      message:
        "Semua parameter udara dalam kondisi optimal untuk kesehatan tanaman.",
      icon: "ri-checkbox-circle-line",
      type: "success",
      time: "10 menit lalu",
    },
    {
      id: 4,
      title: "Oksigen Level Optimal",
      message: "Kadar oksigen 20.8% - Sangat baik untuk fotosintesis tanaman.",
      icon: "ri-leaf-line",
      type: "info",
      time: "12 menit lalu",
    },
  ];

  const typeStyle = {
    danger: "border-red-300 bg-red-50 text-red-700",
    warning: "border-yellow-300 bg-yellow-50 text-yellow-700",
    success: "border-green-300 bg-green-50 text-green-700",
    info: "border-blue-300 bg-blue-50 text-blue-700",
  };

  return (
    <div className="max-w-4xl mx-auto flex justify-between items-center mb-5 relative">
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
        {/* <a href="#" className="bg-[#2f9ea8] py-2 px-3 rounded-lg">
          <i className="ri-moon-line ri-lg"></i>
        </a> */}

        {/* Notifikasi */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="bg-[#2f9ea8] py-2 px-3 rounded-lg relative cursor-pointer"
          >
            <i className="ri-notification-3-line ri-lg"></i>
            <span className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Popup */}
          {showNotif && (
            <div
              ref={notifRef}
              className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-lg z-50 px-4 py-3 max-h-96 overflow-y-auto space-y-3"
            >
              <div className="text-lg font-semibold">Notifikasi</div>
              {notifications.map((notif) => (
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
                    <div className="text-sm">
                      <h4 className="font-bold mb-1">{notif.title}</h4>
                      <p className="text-xs mb-1">{notif.message}</p>
                      <p className="text-[11px] text-gray-400">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
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
