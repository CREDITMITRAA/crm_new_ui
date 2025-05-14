import { useEffect, useRef, useState } from "react";
import {
  activityOptions,
  CALL_BACK,
  CLOSING_DATE,
  FOLLOW_UP,
  REJECTED,
  SCHEDULED_CALL_WITH_MANAGER,
  terminologiesMap,
  VERIFICATION_DATE,
} from "../../../utilities/AppConstants";
import DateButton from "../DateButton";
import DropDown from "../dropdowns/DropDown";
import PopupButton from "../PopupButton";
import { useDispatch, useSelector } from "react-redux";
import { addActivity } from "../../../features/activities/activitiesThunks";
import Snackbar from "../snackbars/Snackbar";
import {
  extractDate,
  formatDateTime,
} from "../../../utilities/utility-functions";
import {
  updateLeadStatus,
  updateVerificationStatus,
} from "../../../features/leads/leadsThunks";
import { updateApplicationStatus } from "../../../features/walk-ins/walkInsThunks";
import { setIsConfirmationDialogueOpened } from "../../../features/ui/uiSlice";

function ApplicationApprovedDialogue({
  onClose,
  setOpenToast,
  openToast,
  payload = null,
  onStatusUpdate,
}) {
  const dispatch = useDispatch();
  const dialogueRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [closingDate, setClosingDate] = useState(null);
  const [verificationDate, setVerificationDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    console.log("payload = ", payload);
    dispatch(setIsConfirmationDialogueOpened(true));
    return () => {
      onStatusUpdate();
      dispatch(setIsConfirmationDialogueOpened(false));
    };
  }, []);

  useEffect(() => {
    setIsOpen(true);

    function handleClickOutside(e) {
      if (dialogueRef.current && !dialogueRef.current.contains(e.target)) {
        if (openToast) {
          setOpenToast(false);
        } else {
          onClose();
        }
      }
    }

    function handleEscapeKey(e) {
      if (e.key === "Escape") {
        if (openToast) {
          setOpenToast(false);
        } else {
          onClose();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  async function handleSubmit() {
    if (!closingDate) {
      setErrorMessage(true);
      return;
    }
    setOpenToast(true);
    let apiPayload = {
      ...payload,
      closing_date: closingDate,
      verification_date: verificationDate || extractDate(new Date()),
    };

    try {
      dispatch(updateApplicationStatus(apiPayload));
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleDateChange(fieldName, date) {
    switch (fieldName) {
      case CLOSING_DATE:
        setClosingDate(extractDate(date));
        setErrorMessage(false)
        break;
      case VERIFICATION_DATE:
        setVerificationDate(extractDate(date));
        break;
    }
  }

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
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        ref={dialogueRef}
        style={{
          backgroundColor: "#E6F4FF",
          border: "0.5px solid #214768",
          borderRadius: "1rem",
          padding: "1.25rem 1.875rem",
          position: "relative",
          transform: isOpen ? "scale(1)" : "scale(0.9)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          minWidth: "35rem",
          width: "max-content",
          height: "max-content",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <>
          <div className="relative flex items-center w-full">
            {/* Left-aligned "Add Activity" */}
            <span className="text-[#32086D] font-bold leading-5 poppins-thin">
              {/* Update Application Status */}
            </span>

            {/* Centered "Are you sure?" */}
            <span className="absolute left-1/2 transform -translate-x-1/2 text-[#214768] font-semibold leading-5 poppins-thin">
              Are you really sure?
            </span>
          </div>

          <div className="w-full h-max flex justify-center mt-4">
            <div className="w-1/2 flex flex-col justify-between">
            <div className="flex justify-between">
              {/* closing date div */}
              <div className="flex flex-col w-max">
                <span className="text-[#214768] text-sm font-medium leading-5 mb-[0.625rem]">
                  Closing Date
                </span>
                <div className="h-8">
                  <DateButton
                    showDot={false}
                    showTimeFilterToggleButton={false}
                    showSingleCalender={true}
                    onDateChange={(fieldName, date) =>
                      handleDateChange(fieldName, date)
                    }
                    buttonBackgroundColor="[#D9E4F2]"
                    showBoxShadow={true}
                    borderColor="[#214768]"
                    date={closingDate}
                    fromTable={true}
                    fieldName="closing_date"
                  />
                </div>
              </div>
              {/* verification date div */}
              {/* <div className="flex flex-col w-max">
                <span className="text-[#214768] text-sm font-medium leading-5 mb-[0.625rem]">
                  Verification Date
                </span>
                <div className="h-8">
                  <DateButton
                    showDot={false}
                    showTimeFilterToggleButton={false}
                    showSingleCalender={true}
                    onDateChange={(fieldName, date) =>
                      handleDateChange(fieldName, date)
                    }
                    buttonBackgroundColor="[#D9E4F2]"
                    showBoxShadow={true}
                    borderColor="[#214768]"
                    date={verificationDate}
                    fromTable={true}
                    fieldName="verification_date"
                  />
                </div>
              </div> */}
              </div>
              {errorMessage && (
              <span className="text-red-500">Closing date is required !</span>
            )}
            </div>
          </div>

          <div className="w-full flex justify-between mt-[1.25rem]">
            <div className="w-max">
              <PopupButton
                name="Close"
                onClick={onClose}
                borderColor="#214768"
                textColor="#214768"
              />
            </div>
            <div className="w-max">
              <PopupButton
                name="Submit"
                isPrimary={true}
                onClick={() => handleSubmit()}
                borderColor="#214768"
                backgroundColor="#214768"
              />
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

export default ApplicationApprovedDialogue;
