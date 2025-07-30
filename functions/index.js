import { onValueWritten } from "firebase-functions/v2/database";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";

// Inisialisasi Firebase Admin SDK
admin.initializeApp();
const firestore = admin.firestore();

export const saveSensorDataToFirestore = onValueWritten(
  { region: "asia-southeast1", ref: "/sensor" },
  async (event) => {
    const newData = event.data.after.val();

    // Jika data dihapus dari RTDB, hentikan fungsi.
    if (!newData) {
      logger.info("Data dihapus, tidak ada yang disimpan.");
      return null;
    }

    logger.info("Data baru diterima dari RTDB:", newData);

    try {
      const dataToSave = {
        airQuality: newData.airQuality,
        humidity: newData.humidity,
        temperature: newData.temperature,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      const writeResult = await firestore
        .collection("SensorDataHistory")
        .add(dataToSave);
      logger.info(
        `Data berhasil disimpan ke Firestore dengan ID: ${writeResult.id}`
      );
      return null;
    } catch (error) {
      logger.error("Gagal menyimpan data ke Firestore", error);
      return null;
    }
  }
);
