function StatusCard({ title, value, unit, status, icon, iconBg }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-5 transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Kolom Kiri: Ikon */}
      <div
        className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <i className={`${icon} text-3xl`}></i>
      </div>

      {/* Kolom Kanan: Konten Teks dengan Tata Letak Baru */}
      <div className="flex-grow">
        {/* Baris 1: Judul Kartu */}
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>

        {/* Baris 2: Nilai & Satuan */}
        <div className="flex items-baseline gap-1.5 mt-1">
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <span className="text-sm font-medium text-gray-600">{unit}</span>
        </div>

        {/* Baris 3: Status Badge */}
        <div className="mt-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${status.bgColor} ${status.textColor}`}
          >
            {status.text}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
