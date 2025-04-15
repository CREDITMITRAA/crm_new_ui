import { useState } from "react";
import { useSelector } from "react-redux";

function ToggleCheckbox({ checked, onClick }) {
  const { isConfirmationDialogueOpened, isProfileDialogueOpened } = useSelector(
      (state) => state.ui
    );
  return (
    <label
      className="relative w-[1.25rem] h-[1.25rem] rounded-[5px] flex justify-center items-center"
      onClick={onClick}
      style={{zIndex: isConfirmationDialogueOpened && -1}}
    >
      <input
        type="checkbox"
        className="opacity-0 absolute w-full h-full cursor-pointer"
        checked={checked}
        onChange={() => {}}
      />
      {checked ? (
        <div className="w-full h-full bg-[#C2D2E7] flex justify-center items-center rounded-[5px] cursor-pointer shadow-[0px_0px_1px_0px_rgba(0,0,0,0.05)] shadow-[2px_3px_2px_0px_rgba(0,0,0,0.05)] shadow-[5px_8px_3px_0px_rgba(0,0,0,0.00)]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#214768"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      ) : (
        <div className="w-full h-full bg-[#C2D2E7] rounded-[5px] cursor-pointer" />
      )}
    </label>
  );
}


export default ToggleCheckbox;
