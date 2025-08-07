import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

// Default settings
const defaultSettings = {
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
};

export const useSettings = (userId = "default_user") => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const settingsRef = doc(db, "userSettings", userId);

    // Set up real-time listener for settings
    const unsubscribe = onSnapshot(
      settingsRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setSettings({
            ...defaultSettings,
            ...data,
          });
        } else {
          // Create default settings if they don't exist
          initializeSettings(userId);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error("Error listening to settings:", err);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Initialize settings with defaults
  const initializeSettings = async (userId) => {
    try {
      const settingsRef = doc(db, "userSettings", userId);
      await setDoc(settingsRef, {
        ...defaultSettings,
        createdAt: new Date(),
        lastUpdated: new Date(),
        version: "1.0",
      });
    } catch (err) {
      setError(err);
      console.error("Error initializing settings:", err);
    }
  };

  // Update specific setting
  const updateSetting = async (category, key, value) => {
    try {
      const settingsRef = doc(db, "userSettings", userId);
      const updatedSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value,
        },
        lastUpdated: new Date(),
      };

      await setDoc(settingsRef, updatedSettings);
    } catch (err) {
      setError(err);
      console.error("Error updating setting:", err);
    }
  };

  // Get notification cooldown in milliseconds
  const getNotificationCooldown = () => {
    return settings.notifications.cooldownMinutes * 60 * 1000;
  };

  // Check if notifications are enabled for specific type
  const isNotificationEnabled = (type) => {
    return (
      settings.notifications.enabled &&
      settings.notifications[`${type}Enabled`] !== false
    );
  };

  // Get theme-related CSS classes
  const getThemeClasses = () => {
    const { theme, compactMode } = settings.display;
    let classes = "";

    if (theme === "dark") {
      classes += "dark bg-gray-900 text-white ";
    } else if (theme === "night") {
      classes += "night bg-gray-800 text-gray-100 ";
    }

    if (compactMode) {
      classes += "compact ";
    }

    return classes.trim();
  };

  // Get sensor precision formatting
  const formatSensorValue = (value) => {
    const precision = settings.sensor.precision;
    return Number(value).toFixed(precision);
  };

  return {
    settings,
    loading,
    error,
    updateSetting,
    getNotificationCooldown,
    isNotificationEnabled,
    getThemeClasses,
    formatSensorValue,
  };
};

export default useSettings;
