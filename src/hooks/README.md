# ESP Data Hook

Folder ini berisi custom hook universal untuk mengelola data dari ESP dan status koneksi.

## useEspData

Hook universal yang bisa digunakan untuk semua kebutuhan terkait data ESP. Hook ini sangat fleksibel dan bisa dikonfigurasi sesuai kebutuhan komponen.

### Basic Usage

```jsx
import { useEspData } from "../hooks";

function MyComponent() {
  const { isEspOnline, formattedTimestamp } = useEspData();

  return (
    <div>
      <p>Status: {isEspOnline ? "Online" : "Offline"}</p>
      <p>Last Update: {formattedTimestamp}</p>
    </div>
  );
}
```

### Advanced Usage dengan Options

```jsx
// Untuk halaman Statistik (basic usage)
const { isEspOnline, formattedTimestamp } = useEspData();

// Untuk mendapatkan raw data sensor
const { isEspOnline, formattedTimestamp, rawSensorData } = useEspData({
  includeRawData: true,
});

// Untuk halaman Home (dengan notifikasi dan data processed)
const { sensorData, isEspOnline, formattedTimestamp } = useEspData({
  processedSensorData: true,
  enableNotifications: true,
  triggerWarningModal: triggerWarningModal,
});

// Dengan custom callback
const { isEspOnline } = useEspData({
  onDataReceived: (data) => {
    console.log("Data received:", data);
    // Custom logic disini
  },
});
```

### Options Parameters

| Parameter             | Type     | Default | Description                                                  |
| --------------------- | -------- | ------- | ------------------------------------------------------------ |
| `includeRawData`      | boolean  | `false` | Mengembalikan raw data dari Firebase                         |
| `processedSensorData` | boolean  | `false` | Mengembalikan data sensor yang sudah diproses dengan styling |
| `enableNotifications` | boolean  | `false` | Mengaktifkan sistem notifikasi otomatis                      |
| `triggerWarningModal` | function | `null`  | Callback function untuk menampilkan modal peringatan         |
| `onDataReceived`      | function | `null`  | Callback yang dipanggil setiap kali data diterima            |

### Return Values

| Property             | Type           | Description                                                                              |
| -------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| `isEspOnline`        | boolean        | Status koneksi ESP (online/offline)                                                      |
| `lastTimestamp`      | number         | Timestamp terakhir dalam milliseconds                                                    |
| `formattedTimestamp` | string         | Timestamp yang sudah diformat dalam bahasa Indonesia                                     |
| `sensorData`         | object \| null | Data sensor yang sudah diproses dengan status styling (jika `processedSensorData: true`) |
| `rawSensorData`      | object \| null | Raw data sensor dari Firebase (jika `includeRawData: true`)                              |

### Notification Logic

Ketika `enableNotifications: true` dan `triggerWarningModal` disediakan, hook akan otomatis:

1. **Suhu > 35°C**: Memicu peringatan suhu kritis
2. **Kelembaban > 80%**: Memicu peringatan kelembaban tinggi
3. **Kualitas Udara > 700 ppm**: Memicu peringatan kualitas udara buruk
4. **Cooldown 150 detik**: Mencegah spam notifikasi
5. **Log ke Firebase**: Menyimpan semua notifikasi ke RTDB

### Contoh Penggunaan di Berbagai Komponen

#### 1. Halaman Statistik (Basic)

```jsx
function Statistik() {
  const { isEspOnline, formattedTimestamp } = useEspData();

  return (
    <div>
      <ConnectionStatusIndicator isConnected={isEspOnline} />
      <p>Last Update: {formattedTimestamp}</p>
    </div>
  );
}
```

#### 2. Halaman Home (Full Features)

```jsx
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

      <ConnectionStatusIndicator isConnected={isEspOnline} />
      <p>Last Update: {formattedTimestamp}</p>

      {sensorData && (
        <div>
          <StatusCard
            title="Temperature"
            value={sensorData.temperature.value}
            unit={sensorData.temperature.unit}
            status={sensorData.temperature.status}
          />
          {/* StatusCard lainnya */}
        </div>
      )}
    </>
  );
}
```

#### 3. Halaman Chart/Analytics

```jsx
function Analytics() {
  const { rawSensorData, isEspOnline } = useEspData({
    includeRawData: true,
    onDataReceived: (data) => {
      // Update chart setiap data baru
      updateChart(data);
    },
  });

  return (
    <div>
      <Chart data={rawSensorData} />
      <ConnectionStatus online={isEspOnline} />
    </div>
  );
}
```

## Manfaat

1. **Single Source of Truth**: Hanya satu hook untuk semua kebutuhan ESP data
2. **Highly Configurable**: Bisa disesuaikan dengan kebutuhan komponen
3. **DRY Principle**: Tidak ada duplikasi kode
4. **Easy Maintenance**: Update logic di satu tempat
5. **Performance Optimized**: Hanya mengambil data yang diperlukan
6. **Type Safety**: Clear interface dan return values
7. **Flexible Usage**: Dari basic status sampai full notification system

## Migration dari Hook Lama

Jika sebelumnya menggunakan `useEspDataWithNotifications`:

```jsx
// BEFORE
const { sensorData, isEspOnline, formattedTimestamp } =
  useEspDataWithNotifications(triggerWarningModal);

// AFTER
const { sensorData, isEspOnline, formattedTimestamp } = useEspData({
  processedSensorData: true,
  enableNotifications: true,
  triggerWarningModal: triggerWarningModal,
});
```
