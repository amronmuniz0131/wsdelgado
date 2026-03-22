import React from "react";

/**
 * A reusable placeholder component that mimics the wireframe's "X" box style
 * but with a cleaner, more structural look.
 */
export const Placeholder = ({ className = "", text = "" }) => (
  <div
    className={`relative overflow-hidden bg-gray-50 border border-gray-200 ${className}`}
  >
    {/* Diagonal lines to create the "X" effect */}
    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
      <div className="w-[150%] h-[1px] bg-gray-900 absolute transform rotate-12" />
      <div className="w-[150%] h-[1px] bg-gray-900 absolute transform -rotate-12" />
    </div>
    {/* Content center */}
    {text && (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <span className="bg-gray-50 px-4 py-2 text-gray-400 font-medium tracking-widest uppercase border border-gray-200">
          {text}
        </span>
      </div>
    )}
  </div>
);
