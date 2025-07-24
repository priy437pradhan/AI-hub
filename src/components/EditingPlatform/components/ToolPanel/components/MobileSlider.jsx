export const SliderStyles = () => (
  <style jsx>
    {`
      /* Hide scrollbars */
      div::-webkit-scrollbar {
        display: none;
      }
      
      /* Base slider styling */
      .slider {
        appearance: none;
        background: transparent;
        cursor: pointer;
        outline: none;
      }
      
      /* Webkit slider track */
      .slider::-webkit-slider-track {
        background: #374151;
        height: 4px;
        border-radius: 2px;
      }
      
      /* Webkit slider thumb */
      .slider::-webkit-slider-thumb {
        appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
      }
      
      .slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }
      
      /* Firefox slider track */
      .slider::-moz-range-track {
        background: #374151;
        height: 4px;
        border-radius: 2px;
        border: none;
      }
      
      /* Firefox slider thumb */
      .slider::-moz-range-thumb {
        appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
      }
      
      .slider::-moz-range-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }
      
      /* Color variants */
      .slider-blue::-webkit-slider-thumb,
      .slider-blue::-moz-range-thumb {
        background: #3b82f6;
      }
      
      .slider-red::-webkit-slider-thumb,
      .slider-red::-moz-range-thumb {
        background: #ef4444;
      }
      
      .slider-green::-webkit-slider-thumb,
      .slider-green::-moz-range-thumb {
        background: #10b981;
      }
      
      .slider-yellow::-webkit-slider-thumb,
      .slider-yellow::-moz-range-thumb {
        background: #f59e0b;
      }
      
      .slider-purple::-webkit-slider-thumb,
      .slider-purple::-moz-range-thumb {
        background: #8b5cf6;
      }
      
      /* Fade in animation */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
    `}
  </style>
);

export const MobileSlider = ({
  sliderKey,
  label,
  icon: Icon,
  value,
  onChange,
  color = "blue",
  min = -100,
  max = 100,
  isExpanded = false,
  onToggle = () => {}
}) => (
  <div className={`
    flex flex-col space-y-3 flex-shrink-0 
    transition-all duration-300 ease-in-out
    ${isExpanded ? 'min-w-[180px] p-3' : 'min-w-[90px] p-1~'}
     rounded-lg bg-gray-800/50 backdrop-blur-sm
    border border-gray-700/50 hover:border-gray-600/50
  `}>
    
    {/* Slider controls - show at top when expanded */}
    {isExpanded && (
      <div className="flex flex-col space-y-2 animate-fadeIn">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">{label}</span>
          <span className="text-xs text-white font-bold bg-gray-700 px-2 py-1 rounded">
            {value}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(sliderKey, parseInt(e.target.value))}
          className={`w-full h-1 rounded-full slider slider-${color}`}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    )}
         
    {/* Clickable label area */}
    <div 
      className={`
        flex items-center justify-center space-x-2 cursor-pointer
        transition-all duration-200 hover:scale-105
        ${isExpanded ? 'py-1' : 'py-2'}
      `}
      onClick={() => onToggle(sliderKey)}
    >
      <Icon 
        size={16} 
        className={`text-${color}-400 transition-colors duration-200`} 
      />
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-300 whitespace-nowrap font-medium">
          {isExpanded ? '' : label}
        </span>
        {!isExpanded && (
          <span className="text-xs text-white font-bold">
            {value}
          </span>
        )}
      </div>
    </div>
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
  <div className="relative">
    <div
      className="flex items-center space-x-3 overflow-x-auto pb-2"
      style={{ 
        scrollbarWidth: "none", 
        msOverflowStyle: "none",
        scrollBehavior: "smooth"
      }}
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
          isExpanded={expandedSliders.has(slider.key)}
          onToggle={onToggleSlider}
        />
      ))}
      <button
        onClick={resetFunction}
        className="
          px-4 py-3 bg-gray-700/80 hover:bg-gray-600/80 
          rounded-lg text-xs text-gray-300 hover:text-white
          transition-all duration-200 whitespace-nowrap flex-shrink-0
          border border-gray-600/50 hover:border-gray-500/50
          font-medium backdrop-blur-sm
          hover:scale-105 active:scale-95
        "
      >
        Reset
      </button>
    </div>
    <SliderStyles />
  </div>
);