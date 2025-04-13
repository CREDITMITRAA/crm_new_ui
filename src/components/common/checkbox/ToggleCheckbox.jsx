import { useState } from "react";

function ToggleCheckbox({ checked, onClick }) {
  return (
    <label
      className="relative w-[1.25rem] h-[1.25rem] rounded-[5px] flex justify-center items-center"
      onClick={onClick}
    >
      <input
        type="checkbox"
        className="opacity-0 absolute w-full h-full cursor-pointer"
        checked={checked}
        onChange={() => {}}
      />
      {checked ? (
        <div className="w-full h-full bg-[#2B323B] flex justify-center items-center rounded-[5px] cursor-pointer">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      ) : (
        <div className="w-full h-full bg-[#21476830] rounded-[5px] cursor-pointer" />
      )}
    </label>
  );
}


export default ToggleCheckbox;
