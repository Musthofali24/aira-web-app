import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { db } from "../firebase/config";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

function Navbar() {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Real-time listener untuk notifikasi dari Firestore
  useEffect(() => {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      orderBy("timestamp", "desc"),
      limit(20) // Ambil lebih banyak untuk filtering client-side
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifData = [];
      const now = new Date();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const notifDate = data.timestamp?.toDate() || new Date(data.createdAt);
        const hoursDiff = (now - notifDate) / (1000 * 60 * 60);

        // Auto-dismiss notifikasi yang lebih dari 24 jam
        if (hoursDiff > 24 && !data.dismissed) {
          updateDoc(doc.ref, { dismissed: true, dismissedAt: new Date() });
          return; // Skip notifikasi yang auto-dismissed
        }

        // Hanya tampilkan notifikasi yang belum di-dismiss
        // Jika field dismissed tidak ada (notifikasi lama), anggap sebagai belum di-dismiss
        if (data.dismissed !== true) {
          notifData.push({
            id: doc.id,
            ref: doc.ref,
            ...data,
            // Format time ago
            timeAgo: formatTimeAgo(notifDate),
          });
        }
      });

      // Batasi hanya 10 notifikasi terbaru setelah filtering
      setNotifications(notifData.slice(0, 10));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function untuk dismiss notifikasi secara manual
  const dismissNotification = async (notifRef) => {
    try {
      console.log("Dismissing notification...", notifRef);
      await updateDoc(notifRef, {
        dismissed: true,
        dismissedAt: new Date(),
      });
      console.log("Notification dismissed successfully");
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  // Function untuk dismiss semua notifikasi
  const dismissAllNotifications = async () => {
    try {
      console.log("Dismissing all notifications...", notifications.length);
      const dismissPromises = notifications.map((notif) =>
        updateDoc(notif.ref, {
          dismissed: true,
          dismissedAt: new Date(),
        })
      );
      await Promise.all(dismissPromises);
      console.log("All notifications dismissed successfully");
    } catch (error) {
      console.error("Error dismissing all notifications:", error);
    }
  };

  // Function untuk format "time ago"
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} detik lalu`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  };

  // Function untuk mendapatkan icon berdasarkan tipe notifikasi
  const getNotificationIcon = (type, severity) => {
    switch (type) {
      case "Suhu Panas":
        return "ri-fire-line";
      case "Kelembapan Lembab":
        return "ri-drop-line";
      case "Kualitas Udara Buruk":
        return "ri-windy-line";
      default:
        return severity === "high"
          ? "ri-error-warning-line"
          : "ri-information-line";
    }
  };

  // Function untuk mendapatkan style berdasarkan severity
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "high":
        return "border-red-300 bg-red-50 text-red-700";
      case "medium":
        return "border-yellow-300 bg-yellow-50 text-yellow-700";
      case "low":
        return "border-blue-300 bg-blue-50 text-blue-700";
      default:
        return "border-gray-300 bg-gray-50 text-gray-700";
    }
  };

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
            {notifications.length > 0 && (
              <span className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>

          {/* Popup */}
          {showNotif && (
            <div
              ref={notifRef}
              className="absolute -right-15 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-lg z-50 px-4 py-3 max-h-96 overflow-y-auto space-y-3"
            >
              <div className="text-lg font-semibold flex items-center justify-between">
                <span>Notifikasi</span>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <>
                      <button
                        onClick={dismissAllNotifications}
                        className="text-sm text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-1"
                        title="Hapus Semua Notifikasi"
                      >
                        <i className="ri-delete-bin-7-line text-base"></i>
                      </button>
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
                        {notifications.length}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2f9ea8]"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="ri-notification-off-line text-2xl mb-2 block"></i>
                  <p className="text-sm">Belum ada notifikasi</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${getSeverityStyle(
                      notif.severity
                    )} shadow-sm relative group`}
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => dismissNotification(notif.ref)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110"
                      title="Tutup notifikasi"
                    >
                      <i className="ri-close-line text-sm text-gray-600 hover:text-red-600"></i>
                    </button>

                    <div className="flex items-start gap-3 pr-6">
                      <div className="pt-1">
                        <i
                          className={`${getNotificationIcon(
                            notif.type,
                            notif.severity
                          )} text-xl`}
                        ></i>
                      </div>
                      <div className="text-sm">
                        <h4 className="font-bold mb-1">{notif.type}</h4>
                        <p className="text-xs mb-1">{notif.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-gray-400">
                            {notif.timeAgo}
                          </p>
                          {notif.value && (
                            <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded">
                              {notif.value}
                              {notif.unit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
