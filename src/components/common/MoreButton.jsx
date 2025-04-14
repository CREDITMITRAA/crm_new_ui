import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import MoreIcon from "../icons/MoreIcon";
import MoreOptionsPopUp from "./popups/MoreOptionsPopUp";
import { useSelector } from "react-redux";

function MoreButton({ onClick }) {
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    right: "auto",
    openUpward: false,
  });

  function togglePopup() {
    setIsOpen((prev) => !prev);
  }

  function updatePopupPosition() {
    if (buttonRef.current && popupRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const spaceRight = window.innerWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;

      let top, left, right;
      let openUpward = false;

      // Determine vertical position
      if (spaceBelow < popupRect.height && spaceAbove > popupRect.height) {
        top = buttonRect.top - popupRect.height - 5;
        openUpward = true;
      } else {
        top = buttonRect.bottom + 5;
      }

      // Determine horizontal position
      if (spaceRight < popupRect.width && spaceLeft > popupRect.width) {
        right = spaceRight;
        left = "auto";
      } else {
        left = buttonRect.left;
        right = "auto";
      }

      setPosition({ top, left, right, openUpward });
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", updatePopupPosition, true);
      window.addEventListener("resize", updatePopupPosition);
      updatePopupPosition();
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePopupPosition, true);
      window.removeEventListener("resize", updatePopupPosition);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePopupPosition, true);
      window.removeEventListener("resize", updatePopupPosition);
    };
  }, [isOpen]);

  return (
    <>
      <div className={`${!isConfirmationDialogueOpened && "relative group"} w-10 h-10`}>
        {/* More Button */}
        <button
          className="w-full h-full rounded-[9px] flex justify-center items-center cursor-pointer hover:border border-[#646CFF]"
          onClick={togglePopup}
          ref={buttonRef}
          style={{ backgroundColor: "unset" }}
        >
          <MoreIcon />
        </button>
        
        {/* Tooltip */}
        <div className="absolute top-full left-1/3 transform -translate-x-[35%] mt-2 px-2 py-1 bg-[#EBEBEB] text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
          {"More"}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
        </div>
      </div>

      {/* More Options Popup */}
      {isOpen &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute z-50 bg-white shadow-lg border border-gray-300 rounded-lg"
            style={{
              top: `${position.top}px`,
              left: position.left === "auto" ? "auto" : `${position.left}px`,
              right: position.right === "auto" ? "auto" : `${position.right}px`,
            }}
          >
            <MoreOptionsPopUp
              onClick={(data) => {
                onClick(data);
                setIsOpen(false);
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}

export default MoreButton;