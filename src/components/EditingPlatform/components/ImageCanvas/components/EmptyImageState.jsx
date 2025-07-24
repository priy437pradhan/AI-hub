"use client";
import React from "react";

export const EmptyImageState = ({ handleUploadClick }) => (
  <div className="text-center p-8">
    <svg
      className="w-20 h-20 mx-auto text-gray-300 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <h3 className="text-xl font-semibold mb-2">Upload an Image</h3>
    <p className="text-gray-500 mb-6">JPG, PNG, GIF, WebP supported</p>
    <button
      onClick={handleUploadClick}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Choose Image
    </button>
  </div>
);
