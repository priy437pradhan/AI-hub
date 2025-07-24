import { useMemo } from 'react';

const useMobileGridButton = (isMobile = false) => {
  const gridConfig = useMemo(() => {
    if (isMobile) {
      return {
        containerClass: "flex space-x-2 overflow-x-auto mb-4 flex-shrink-0",
        containerStyle: { scrollbarWidth: "none", msOverflowStyle: "none" },
        buttonClass: "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 min-w-[60px]",
        iconSize: 20,
        showScrollbarStyles: true
      };
    }
    
    return {
      containerClass: "grid grid-cols-2 gap-3",
      containerStyle: {},
      buttonClass: "flex flex-col items-center justify-center p-4 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all",
      iconSize: 24,
      showScrollbarStyles: false
    };
  }, [isMobile]);

  const getButtonStateClass = (isActive = false) => {
    if (isMobile) {
      return isActive
        ? "bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400"
        : "border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300";
    }
    
    return isActive
      ? "bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400"
      : "border border-gray-600 hover:border-blue-500 hover:bg-gray-700";
  };

  const ScrollbarStyles = () => {
    if (!gridConfig.showScrollbarStyles) return null;
    
    return (
      <style jsx>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    );
  };

  return {
    gridConfig,
    getButtonStateClass,
    ScrollbarStyles
  };
};

export default useMobileGridButton;