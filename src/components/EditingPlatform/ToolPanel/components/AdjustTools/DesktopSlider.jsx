import { useSliderDrag } from "../../hooks/AdjustTools/useSlider";
export const DesktopSlider = ({
  label,
  value,
  onChange,
  min = -100,
  max = 100,
  step = 1,
  icon,
  color = "red",
  disabled = false,
  onDragStart,
  onDragEnd,
  className = "",
  ...props
}) => {
  const { sliderRef, isDragging, percentage, handlers } = useSliderDrag({
    value,
    onChange,
    min,
    max,
    step,
    disabled,
    onDragStart,
    onDragEnd,
  });

  return (
    <div className={`mb-4 ${className}`} {...props}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <span className="text-sm text-gray-300 font-medium">{label}</span>
        </div>
        <span
          className={`text-sm font-medium ${
            value !== 0 ? `text-${color}-400` : "text-gray-400"
          }`}
        >
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <div
        ref={sliderRef}
        className={`relative w-full h-2 bg-gray-700 rounded-lg cursor-pointer ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        {...handlers}
      >
        {/* Track fill */}
        <div
          className={`absolute h-full bg-${color}-500 rounded-lg transition-all duration-75`}
          style={{ width: `${percentage}%` }}
        />
        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 w-5 h-5 bg-${color}-500 border-2 border-${color}-400 
            rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-grab
            transition-all duration-75 hover:scale-110
            ${isDragging ? "scale-125 cursor-grabbing" : ""}
            ${disabled ? "opacity-50" : ""}
          `}
          style={{ left: `${percentage}%` }}
        />
      </div>
      {/* Hidden input for accessibility */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="sr-only"
        aria-label={label}
      />
    </div>
  );
};


export const DesktopSliderContainer = ({
  sliders,
  values,
  handleChange,
  resetFunction,
  enhanceButton = null,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        {enhanceButton}
        <button
          onClick={resetFunction}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {sliders.map(({ key, label, icon, color, min = -100, max = 100 }) => (
        <DesktopSlider
          key={key}
          label={label}
          value={values[key]}
          onChange={(value) => handleChange(key, value)}
          icon={icon}
          color={color}
          min={min}
          max={max}
        />
      ))}
    </div>
  );
};

