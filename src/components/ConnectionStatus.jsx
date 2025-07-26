function ConnectionStatus({ isConnected, time, formatDateTime }) {
  return (
    <div className="text-center mt-2 mb-8">
      <p
        className={`font-semibold ${
          isConnected ? "text-green-400" : "text-red-400"
        }`}
      >
        {isConnected ? "✅ Connected" : "❌ Disconnected"}
      </p>
      <p className="text-sm text-gray-400 mt-1">📅 {formatDateTime(time)}</p>
    </div>
  );
}

export default ConnectionStatus;
