import { useEffect, useRef, useState } from "react";
import CloseIcon from "../../icons/CloseIcon";
import AlertButton from "../AlertButton";
import PopupButton from "../PopupButton";
import InfoButton from "../InfoButton";
import { useDispatch } from "react-redux";
import { setIsConfirmationDialogueOpened } from "../../../features/ui/uiSlice";

function ConfirmationDialogue({
  onClose,
  message,
  onSubmit,
  button = <InfoButton />,
  disabled = false,
  buttonName = "Submit",
  buttonBackgroundColor = "#214768",
}) {
  const dialogueRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsConfirmationDialogueOpened(true));
    return () => {
      console.log("confirmation dialogue un mounted");
      dispatch(setIsConfirmationDialogueOpened(false));
    };
  }, []);

  useEffect(() => {
    // Trigger the open animation after the component mounts
    setIsOpen(true);

    function handleClickOutside(e) {
      if (dialogueRef.current && !dialogueRef.current.contains(e.target)) {
        onClose();
      }
    }

    function handleEscapeKey(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        opacity: isOpen ? 1 : 0,
        transform: "none",
        transition: "opacity 0.3s ease-in-out",
        zIndex: 10,
      }}
    >
      <div
        ref={dialogueRef}
        style={{
          padding: "1rem",
          minWidth: "28rem",
          backgroundColor: "#E6F4FF",
          borderRadius: "1rem",
          minHeight: "10rem",
          position: "relative",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          {button}
          <span className="text-[#214768] text-2xl text-center font-bold leading-5 mt-[1.25rem]">
            Are you sure?
          </span>
          <span className="text-[#888888] text-sm text-center leading-5 mt-[0.375rem]">
            {message}
          </span>
          <div className="mt-[1.875rem] w-2/4">
            <PopupButton
              isPrimary={true}
              name={buttonName}
              backgroundColor={buttonBackgroundColor}
              onClick={onSubmit}
              disabled={disabled}
            />
          </div>
          <div className="mt-[0.625rem] w-2/4">
            <PopupButton name={"Cancel"} onClick={onClose} borderColor="#214768" textColor="#214768"/>
          </div>
        </div>
        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}
        >
          <CloseIcon />
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialogue;
