function ConnectionStatusIndicator({ isConnected }) {
  const statusColor = isConnected ? "bg-green-500" : "bg-red-500";
  const statusText = isConnected ? "Online" : "Offline";
  const textColor = isConnected ? "text-green-600" : "text-red-600";

  return (
    <div className="flex items-center gap-2 px-3">
      <span className="relative flex h-3 w-3">
        {/* Animasi denyut hanya saat online */}
        {isConnected && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        {/* Lingkaran utama */}
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${statusColor}`}
        ></span>
      </span>
      <span className={`font-semibold text-sm ${textColor}`}>{statusText}</span>
    </div>
  );
}

export default ConnectionStatusIndicator;
