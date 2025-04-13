import React from "react";

const Loader = ({ size = 40 }) => {
  return (
    <div className="relative flex items-center  justify-center">
      {/* Outer Dark Blue Semicircle - Counterclockwise */}
      <div
        className="absolute border-[3px] border-[#32086d] border-t-transparent border-l-transparent rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animation: "outerSpin 1.5s linear infinite",
        }}
      ></div>

      {/* Middle Light Blue Semicircle - Clockwise */}
      <div
        className="absolute border-[3px] border-[#5591ff] border-t-transparent border-l-transparent rounded-full"
        style={{
          width: `${size * 0.75}px`,
          height: `${size * 0.75}px`,
          animation: "spin 1.5s linear infinite",
        }}
      ></div>

      {/* Inner Dark Blue Semicircle - Counterclockwise */}
      <div
        className="absolute border-[3px] border-[#32086d] border-t-transparent border-l-transparent rounded-full"
        style={{
          width: `${size * 0.5}px`,
          height: `${size * 0.5}px`,
          animation: "outerSpin 1.5s linear infinite",
        }}
      ></div>

      {/* Inline Keyframes */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); } /* Clockwise */
          }
          @keyframes outerSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); } /* Counterclockwise */
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
