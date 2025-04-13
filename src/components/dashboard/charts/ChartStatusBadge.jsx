import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const ChartStatusBadge = ({ 
  text, 
  dotColor, 
  bgColor, 
  isActive = false, 
  onClick 
}) => {
  const {isProfileDialogueOpened,isConfirmationDialogueOpened} = useSelector((state)=>state.ui)
  return (
    <div
      className={`flex items-center gap-2 py-2 px-3 rounded-full cursor-pointer transition-all ${
        isActive 
          ? "opacity-100 " //border border-solid
          : "opacity-60 "  // border border-dashed border-gray-300
      }`}
      style={{ 
        backgroundColor: isActive ? bgColor : 'transparent',
        borderColor: isActive ? dotColor : '#D1D5DB',
        zIndex: isConfirmationDialogueOpened || isProfileDialogueOpened ? -1 : 0,
        boxShadow: `
          1px 1px 3px 0px #0000001A,
          5px 2px 5px 0px #00000017,
          10px 5px 7px 0px #0000000D,
          18px 10px 8px 0px #00000003,
          28px 15px 9px 0px #00000000
        `
      }}
      
      onClick={onClick}
    >
      <div 
        className="w-2 h-2 rounded-full transition-colors" 
        style={{ 
          backgroundColor: isActive ? dotColor : '#9CA3AF'
        }} 
      />
      <span className={`text-xs font-medium ${
        // isActive ? 'text-[#32086D]' : 'text-gray-500'
        'text-[#464646]'
      }`}>
        {text}
      </span>
    </div>
  );
};

ChartStatusBadge.propTypes = {
  text: PropTypes.string.isRequired,
  dotColor: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ChartStatusBadge;