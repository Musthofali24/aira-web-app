function StatusCard({ title, value, unit, status, icon, iconBg }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md text-center w-full">
      {/* Icon bulat */}
      <div
        className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${iconBg}`}
      >
        <i className={`${icon} text-xl`}></i>
      </div>
      {/* Nilai & satuan */}
      <p className="text-2xl font-bold text-gray-800">
        {value}
        <span className="text-sm font-medium"> {unit}</span>
      </p>
      {/* Status */}
      <p className={`mt-1 font-semibold ${status.color}`}>{status.text}</p>
      {/* Judul */}
      <h4 className="text-sm font-medium text-gray-500 mt-1">{title}</h4>
    </div>
  );
}

export default StatusCard;
