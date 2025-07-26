import GaugeComponent from "react-gauge-component";

function SensorGauge({
  title,
  value,
  min,
  max,
  subArcs,
  formatLabel,
  pointerType = "needle",
}) {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <GaugeComponent
        value={value}
        minValue={min}
        maxValue={max}
        arc={{ subArcs }}
        pointer={{ type: pointerType, color: "#fff", elastic: true }}
        labels={{
          valueLabel: { formatTextValue: formatLabel },
        }}
      />
    </div>
  );
}

export default SensorGauge;
