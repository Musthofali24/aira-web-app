import { onValueWritten } from "firebase-functions/v2/database";
import { onSchedule } from "firebase-functions/v2/scheduler";
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

export const cleanupOldSensorData = onSchedule(
  { schedule: "every day 03:00", region: "asia-southeast1" },
  async () => {
    const daysToKeep = 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    logger.info(
      `Membersihkan data sensor yang lebih lama dari ${cutoffDate.toISOString()}`
    );

    const oldDataQuery = firestore
      .collection("SensorDataHistory")
      .where("timestamp", "<", cutoffDate);

    try {
      const snapshot = await oldDataQuery.get();

      if (snapshot.empty) {
        logger.info("Tidak ada data yang perlu dihapus.");
        return null;
      }

      const batch = firestore.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      logger.info(`Berhasil menghapus ${snapshot.size} dokumen lama.`);
      return null;
    } catch (error) {
      logger.error("Gagal membersihkan data lama", error);
      return null;
    }
  }
);
