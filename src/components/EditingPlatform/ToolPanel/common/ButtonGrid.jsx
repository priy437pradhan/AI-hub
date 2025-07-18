// 'use client'
// import React from 'react';

// const ButtonGrid = ({ items, activeId, onSelect, cols = 3 }) => (
//   <div className={`grid grid-cols-${cols} gap-1 mb-2`}>
//     {items.map((item) => (
//       <div
//         key={item.id}
//         onClick={() => onSelect(item.id)}
//         className={`flex flex-col items-center justify-center p-1 rounded cursor-pointer transition-colors ${
//           activeId === item.id 
//             ? 'bg-blue-500 bg-opacity-20 border border-blue-500' 
//             : 'border border-gray-600 hover:border-gray-500 hover:bg-gray-700'
//         }`}
//       >
//         <div className="text-gray-200 mb-1">{typeof item.icon === 'string' ? item.icon : item.icon}</div>
//         <span className="text-xs text-gray-300 truncate w-full text-center">{item.label}</span>
//       </div>
//     ))}
//   </div>
// );

// export default ButtonGrid;