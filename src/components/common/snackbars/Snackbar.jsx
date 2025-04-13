import { useEffect, useRef, useState } from "react";
import SuccessIcon from "../../icons/SuccessIcon";
import ErrorIcon from "../../icons/ErrorIcon";
import WarningIcon from "../../icons/WarningIcon";
import { useDispatch, useSelector } from "react-redux";

function Snackbar({ isOpen, onClose, status, message, statusType, shouldCloseOnClickOfOutside=true }) {
  const {isProfileDialogueOpened} = useSelector((state)=>state.ui)
  const snackbarRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [ribColor, setRibColor] = useState(null);
  const [iconBackgroundColor, setIconBackgroundColor] = useState(null);
  const [icon, setIcon] = useState(null);
  const [statusText, setStatusText] = useState(null)
  const [messageText, setMessageText] = useState(null)

  useEffect(() => {
    if (!isOpen) return;
    
    // Auto-close after 3 seconds
    // const timer = setTimeout(() => onClose(), 3000);

    // Close on outside click
    const handleClickOutside = (event) => {
      if (shouldCloseOnClickOfOutside && snackbarRef.current && !snackbarRef.current.contains(event.target)) {
        onClose();
      }      
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    //   clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    updateSnackbar(statusType);
  }, [statusType,message]);

  function updateSnackbar(statusType) {
    switch (statusType) {
      case "SUCCESS":
        setStatusText(status)
        setMessageText(message)
        setBackgroundColor("#E6FAF5");
        setRibColor("#00CC99");
        setIcon(<SuccessIcon />);
        break;

      case "ERROR":
        setStatusText(status)
        setMessageText(message)
        setBackgroundColor("#FDEFEF");
        setRibColor("#EB5757");
        setIcon(<ErrorIcon />);
        break;

      case "INFO":
        setStatusText(status)
        setMessageText(message)
        setBackgroundColor("#EEEFFF");
        setRibColor("#5458F7");
        setIcon(<WarningIcon fillColor="#5458F7" />);
        break;

      case "WARNING":
        setStatusText(status)
        setMessageText(message)
        setBackgroundColor("#FDF8E8");
        setRibColor("#F2C94C");
        setIcon(<WarningIcon />);
        break;

      default:
        setStatusText('status')
        setMessageText('message')
        setBackgroundColor("#E6FAF5");
        setRibColor("#00CC99");
        setIcon(<SuccessIcon />);
        break;
    }
  }

  return (
    <>
      {/* Blurred Background (only when open) */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{zIndex: isProfileDialogueOpened && 1000}}
      />

      {/* Snackbar (Smooth Slide & Fade Effect) */}
      <div
        ref={snackbarRef}
        className={`fixed top-5 right-5 z-50 flex items-center max-w-xs text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-2xl dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800 
        transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        role="alert"
        style={{zIndex: isProfileDialogueOpened && 1200}}
      >
        <div
          className={`w-[225px] h-[75px] bg-[${backgroundColor}] rounded-[3.3px] flex justify-between shadow-2xl`}
        >
          <div
            className={`bg-[${ribColor}] rounded-[3.3px] h-full w-[1.5%] mr-[1rem]`}
          ></div>
          <div className="py-[1rem] flex items-center justify-start w-[90%]">
            <div className="mr-[1rem]">{icon}</div>
            <div className="flex flex-col">
              <div className="text-[#000000] text-[11.9px] font-medium">
                {statusText}
              </div>
              <p className="text-[#000000] text-[8px]">{messageText}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Snackbar;
