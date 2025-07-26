function StatusCard({ title, value, unit, status }) {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">
        {value} {unit}
      </p>
      <p className={`mt-1 font-semibold ${status.color}`}>{status.text}</p>
    </div>
  );
}

export default StatusCard;
