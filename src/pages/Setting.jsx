import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    notifications: {
      enabled: true,
      cooldownMinutes: 2.5,
      temperatureThreshold: 35,
      humidityThreshold: 80,
      airQualityThreshold: 700,
      soundEnabled: true,
      vibrationEnabled: true,
    },
    display: {
      theme: "light",
      autoTheme: false,
      language: "id",
      animations: true,
      compactMode: false,
    },
    sensor: {
      updateInterval: 5,
      autoRefresh: true,
      showRawData: false,
      precision: 1,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeSection, setActiveSection] = useState("notifications");

  // User ID untuk settings (bisa diganti dengan auth user ID nantinya)
  const USER_ID = "default_user";

  const loadSettings = useCallback(async () => {
    try {
      const settingsRef = doc(db, "userSettings", USER_ID);
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        const loadedSettings = settingsSnap.data();
        setSettings((prevSettings) => ({
          ...prevSettings,
          ...loadedSettings,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading settings:", error);
      setLoading(false);
    }
  }, []);

  // Load settings dari Firestore
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Save settings ke Firestore dengan modal konfirmasi
  const saveSettings = useCallback(async () => {
    try {
      setSaving(true);
      const settingsRef = doc(db, "userSettings", USER_ID);
      await setDoc(settingsRef, {
        ...settings,
        lastUpdated: new Date(),
        version: "1.0",
      });

      setSaving(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaving(false);
    }
  }, [settings]);

  // Handle modal close dan redirect ke home
  const handleModalClose = useCallback(() => {
    setShowSuccessModal(false);
    setTimeout(() => {
      navigate("/");
    }, 300);
  }, [navigate]);

  // Auto redirect setelah 3 detik
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        handleModalClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, handleModalClose]);

  // Update specific setting
  const updateSetting = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  // Notification cooldown options
  const cooldownOptions = [
    { value: 0.5, label: "30 detik" },
    { value: 1, label: "1 menit" },
    { value: 2, label: "2 menit" },
    { value: 2.5, label: "2.5 menit" },
    { value: 5, label: "5 menit" },
    { value: 10, label: "10 menit" },
    { value: 15, label: "15 menit" },
    { value: 30, label: "30 menit" },
  ];

  // Theme options
  const themeOptions = [
    { value: "light", label: "Light Mode", icon: "ri-sun-line" },
    { value: "dark", label: "Dark Mode", icon: "ri-moon-line" },
    { value: "night", label: "Night Mode", icon: "ri-moon-clear-line" },
  ];

  // Language options
  const languageOptions = [
    { value: "id", label: "Bahasa Indonesia" },
    { value: "en", label: "English" },
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#45cad7] to-[#3bb4c1] text-white min-h-screen py-3 sm:py-5 px-3 sm:px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#e8fdff] min-h-screen rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#45cad7] mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">
                Memuat pengaturan...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="bg-gradient-to-b from-[#45cad7] to-[#3bb4c1] text-white min-h-screen py-3 sm:py-4 px-3 sm:px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center py-4 sm:py-6 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Pengaturan</h1>
            <p className="text-sm sm:text-base opacity-90 mt-2">
              Kelola preferensi aplikasi Anda
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-[#e8fdff] p-1 rounded-lg overflow-x-auto scrollbar-hide mb-4 sm:mb-6">
              {[
                {
                  key: "notifications",
                  label: "Notifikasi",
                  icon: "ri-notification-3-line",
                },
                { key: "display", label: "Tampilan", icon: "ri-palette-line" },
                { key: "sensor", label: "Sensor", icon: "ri-sensor-line" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveSection(tab.key)}
                  className={`flex-1 min-w-fit flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 ${
                    activeSection === tab.key
                      ? "bg-white text-[#45cad7] shadow-sm"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <i className={`${tab.icon} text-sm sm:text-base`}></i>
                  <span className="hidden xs:inline sm:inline">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-[#e8fdff] rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg">
              {/* Settings Content */}
              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm min-h-[400px]">
                {/* Notifications Settings */}
                {activeSection === "notifications" && (
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                      <i className="ri-notification-3-line text-[#45cad7] text-base sm:text-lg"></i>
                      Pengaturan Notifikasi
                    </h2>

                    {/* Enable Notifications */}
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 pr-3">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                          Aktifkan Notifikasi
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Terima peringatan kondisi sensor
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.enabled}
                          onChange={(e) =>
                            updateSetting(
                              "notifications",
                              "enabled",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#45cad7]"></div>
                      </label>
                    </div>

                    {/* Notification Cooldown */}
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                        Interval Notifikasi
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        Jeda waktu antar notifikasi yang sama
                      </p>
                      <select
                        value={settings.notifications.cooldownMinutes}
                        onChange={(e) =>
                          updateSetting(
                            "notifications",
                            "cooldownMinutes",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full p-2 sm:p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#45cad7] focus:border-transparent text-gray-800 bg-white"
                      >
                        {cooldownOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Threshold Settings */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Ambang Batas Peringatan
                      </h3>

                      {/* Temperature */}
                      <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          🌡️ Suhu Maksimal (°C)
                        </label>
                        <input
                          type="number"
                          min="25"
                          max="50"
                          value={settings.notifications.temperatureThreshold}
                          onChange={(e) =>
                            updateSetting(
                              "notifications",
                              "temperatureThreshold",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#45cad7] text-gray-800 bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Notifikasi jika suhu melebihi{" "}
                          {settings.notifications.temperatureThreshold}°C
                        </p>
                      </div>

                      {/* Humidity */}
                      <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          💧 Kelembapan Maksimal (%)
                        </label>
                        <input
                          type="number"
                          min="60"
                          max="100"
                          value={settings.notifications.humidityThreshold}
                          onChange={(e) =>
                            updateSetting(
                              "notifications",
                              "humidityThreshold",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#45cad7] text-gray-800 bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Notifikasi jika kelembapan melebihi{" "}
                          {settings.notifications.humidityThreshold}%
                        </p>
                      </div>

                      {/* Air Quality */}
                      <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          🌪️ Kualitas Udara Maksimal (ppm)
                        </label>
                        <input
                          type="number"
                          min="500"
                          max="1000"
                          value={settings.notifications.airQualityThreshold}
                          onChange={(e) =>
                            updateSetting(
                              "notifications",
                              "airQualityThreshold",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#45cad7] text-gray-800 bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Notifikasi jika kualitas udara melebihi{" "}
                          {settings.notifications.airQualityThreshold} ppm
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display Settings */}
                {activeSection === "display" && (
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                      <i className="ri-palette-line text-[#45cad7] text-base sm:text-lg"></i>
                      Pengaturan Tampilan
                    </h2>

                    {/* Theme Selection */}
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                        Mode Tema
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        {themeOptions.map((theme) => (
                          <label
                            key={theme.value}
                            className={`flex items-center gap-2 sm:gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              settings.display.theme === theme.value
                                ? "border-[#45cad7] bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="theme"
                              value={theme.value}
                              checked={settings.display.theme === theme.value}
                              onChange={(e) =>
                                updateSetting(
                                  "display",
                                  "theme",
                                  e.target.value
                                )
                              }
                              className="sr-only"
                            />
                            <i
                              className={`${theme.icon} text-lg sm:text-xl text-gray-600`}
                            ></i>
                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                              {theme.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                        Bahasa
                      </h3>
                      <select
                        value={settings.display.language}
                        onChange={(e) =>
                          updateSetting("display", "language", e.target.value)
                        }
                        className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#45cad7] text-gray-800 bg-white"
                      >
                        {languageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Toggle Options */}
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        {
                          key: "animations",
                          label: "Animasi",
                          desc: "Aktifkan animasi dan transisi",
                        },
                        {
                          key: "compactMode",
                          label: "Mode Kompak",
                          desc: "Tampilan yang lebih padat",
                        },
                        {
                          key: "autoTheme",
                          label: "Tema Otomatis",
                          desc: "Sesuaikan dengan waktu sistem",
                        },
                      ].map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 pr-3">
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                              {option.label}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {option.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.display[option.key]}
                              onChange={(e) =>
                                updateSetting(
                                  "display",
                                  option.key,
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#45cad7]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sensor Settings */}
                {activeSection === "sensor" && (
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                      <i className="ri-sensor-line text-[#45cad7] text-base sm:text-lg"></i>
                      Pengaturan Sensor
                    </h2>

                    {/* Update Interval */}
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                        Interval Update (detik)
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        Seberapa sering data sensor diperbarui
                      </p>
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={settings.sensor.updateInterval}
                        onChange={(e) =>
                          updateSetting(
                            "sensor",
                            "updateInterval",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1s</span>
                        <span className="font-semibold">
                          {settings.sensor.updateInterval}s
                        </span>
                        <span>60s</span>
                      </div>
                    </div>

                    {/* Data Precision */}
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                        Presisi Data (desimal)
                      </h3>
                      <select
                        value={settings.sensor.precision}
                        onChange={(e) =>
                          updateSetting(
                            "sensor",
                            "precision",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#45cad7] text-gray-800 bg-white"
                      >
                        <option value={0}>Tanpa desimal (25)</option>
                        <option value={1}>1 desimal (25.5)</option>
                        <option value={2}>2 desimal (25.52)</option>
                      </select>
                    </div>

                    {/* Toggle Options */}
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        {
                          key: "autoRefresh",
                          label: "Auto Refresh",
                          desc: "Perbarui data secara otomatis",
                        },
                        {
                          key: "showRawData",
                          label: "Tampilkan Data Mentah",
                          desc: "Tampilkan nilai sensor asli",
                        },
                      ].map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 pr-3">
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                              {option.label}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {option.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.sensor[option.key]}
                              onChange={(e) =>
                                updateSetting(
                                  "sensor",
                                  option.key,
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#45cad7]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="mt-4 sm:mt-6 flex justify-center">
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 text-sm sm:text-base ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#45cad7] hover:bg-[#3bb4c1] hover:shadow-lg active:scale-95"
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line text-sm sm:text-base"></i>
                      Simpan Pengaturan
                    </>
                  )}
                </button>
              </div>

              {/* Info Footer */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Terakhir Memperbarui Pengaturan:{" "}
                  {new Date().toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-transparent flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            {/* Success Icon */}
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-green-100 rounded-full">
              <i className="ri-check-line text-xl sm:text-2xl text-green-600"></i>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center mb-2">
              Pengaturan Berhasil Disimpan!
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
              Semua perubahan pengaturan telah tersimpan dengan aman. Anda akan
              dialihkan ke halaman utama.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-[#45cad7] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3bb4c1] transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <i className="ri-home-line"></i>
                Ke Home
              </button>
            </div>

            {/* Auto redirect info */}
            <p className="text-xs text-gray-400 text-center mt-3">
              Otomatis dialihkan dalam 3 detik...
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
