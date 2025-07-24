export const SliderStyles = () => (
  <style jsx>
    {`
      div::-webkit-scrollbar {
        display: none;
      }

      .slider::-webkit-slider-thumb,
      .slider::-moz-range-thumb {
        appearance: none;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: #3b82f6; 
        cursor: pointer;
        border: none;
      }
    `}
  </style>
);


export  const MobileSlider = ({
  sliderKey,
  label,
  icon: Icon,
  value,
  onChange,
  color = "blue",
  min = -100,
  max = 100,
  minWidth = "50px",
  isExpanded = false,
  onToggle = () => {}
}) => (
  <div className={`flex items-center space-x-2 flex-shrink-0 transition-all duration-300 ${
    isExpanded ? 'min-w-[140px]' : 'min-w-[80px]'
  }`}>
    
    {/* Clickable label area */}
    <div 
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => onToggle(sliderKey)}
    >
      <Icon size={14} className={`text-${color}-400`} />
      <span className="text-xs text-gray-300 whitespace-nowrap" style={{ minWidth }}>
        {label}
      </span>
      {!isExpanded && (
        <span className="text-xs text-white font-medium">({value})</span>
      )}
    </div>
    
    {/* Slider controls - only show when expanded */}
    {isExpanded && (
      <div className="flex items-center space-x-2 animate-fadeIn">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(sliderKey, parseInt(e.target.value))}
          className={`w-16 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer slider-${color}`}
        />
        <span className="text-xs text-white font-medium min-w-[25px]">{value}</span>
      </div>
    )}
  </div>
);
export const MobileSliderContainer = ({
  sliders,
  values,
  handleChange,
  resetFunction,
  enhanceButton = null,
  children,
  expandedSliders = new Set(),
  onToggleSlider = () => {}
}) => (
  <div
    className="flex items-center space-x-3 overflow-x-auto"
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    {enhanceButton}
    {children}
    {sliders.map((slider) => (
      <MobileSlider
        key={slider.key}
        sliderKey={slider.key}
        label={slider.label}
        icon={slider.icon}
        value={values[slider.key]}
        onChange={handleChange}
        color={slider.color}
        min={slider.min}
        max={slider.max}
        minWidth={slider.minWidth}
        isExpanded={expandedSliders.has(slider.key)}
        onToggle={onToggleSlider}
      />
    ))}
    <button
      onClick={resetFunction}
      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-gray-300 transition-colors whitespace-nowrap flex-shrink-0"
    >
      Reset
    </button>
    <SliderStyles />
  </div>
);
