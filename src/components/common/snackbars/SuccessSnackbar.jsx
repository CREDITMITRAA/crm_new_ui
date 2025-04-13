import { useEffect, useRef } from "react";
import SuccessIcon from "../../icons/SuccessIcon";

function SuccessSnackbar({ isOpen, onClose, message }) {
  const snackbarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Auto-close after 3 seconds
    const timer = setTimeout(() => onClose(), 3000);

    // Close on outside click
    const handleClickOutside = (event) => {
      if (snackbarRef.current && !snackbarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Blurred Background (only when open) */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Snackbar (Smooth Slide & Fade Effect) */}
      <div
        ref={snackbarRef}
        className={`fixed top-5 right-5 z-50 flex items-center max-w-xs text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-2xl dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800 
        transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        role="alert"
      >
        <div className="w-[225px] h-[75px] bg-[#E6FAF5] rounded-[3.3px] flex justify-between shadow-2xl">
          <div className="bg-[#00CC99] rounded-[3.3px] h-full w-[1.5%] mr-[1rem]"></div>
          <div className="py-[1rem] flex items-center justify-start w-[90%]">
            <div className="mr-[1rem]">
              <SuccessIcon />
            </div>
            <div className="flex flex-col">
              <div className="text-[#000000] text-[11.9px] font-medium">
                Success
              </div>
              <p className="text-[#000000] text-[8px]">
                Some status updated to some status
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuccessSnackbar;
