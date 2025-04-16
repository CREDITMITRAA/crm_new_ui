import { useEffect, useRef, useState } from "react";
import {
  activityOptions,
  CALL_BACK,
  FOLLOW_UP,
  REJECTED,
  SCHEDULED_CALL_WITH_MANAGER,
} from "../../../utilities/AppConstants";
import DateButton from "../DateButton";
import DropDown from "../dropdowns/DropDown";
import PopupButton from "../PopupButton";
import { useDispatch, useSelector } from "react-redux";
import { addActivity } from "../../../features/activities/activitiesThunks";
import Snackbar from "../snackbars/Snackbar";
import { formatDateTime } from "../../../utilities/utility-functions";
import {
  updateLeadStatus,
  updateVerificationStatus,
} from "../../../features/leads/leadsThunks";
import { updateApplicationStatus } from "../../../features/walk-ins/walkInsThunks";
import { setIsConfirmationDialogueOpened } from "../../../features/ui/uiSlice";

function UpdateApplicationStatusDialogue({
  onClose,
  setOpenToast,
  openToast,
  payload = null,
  onStatusUpdate,
}) {
  const dispatch = useDispatch();
  const dialogueRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [applicationStatusNote, setApplicationStatusNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionReasonError, setRejectionReasonError] = useState("");

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
    if (payload.application_status === REJECTED) {
      if (!rejectionReason.trim()) {
        setRejectionReasonError("Please enter a rejection reason");
      } else {
        try {
          let apiPayload = {
            ...payload,
            rejection_reason: rejectionReason,
          };
          setOpenToast(true);
          dispatch(updateApplicationStatus(apiPayload));
        } catch (error) {
          console.log(error.message);
        }
      }
    } else {
      setOpenToast(true);
      let apiPayload = {
        ...payload,
        application_status_note: applicationStatusNote,
      };
      try {
        dispatch(updateApplicationStatus(apiPayload));
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  function handleChange(e) {
    setApplicationStatusNote(e.target.value);
  }

  function handleRejectionReasonChange(e) {
    setRejectionReason(e.target.value);
    setRejectionReasonError("");
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
          minWidth: "40rem",
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

          <div className="w-full flex justify-center my-2 text-[#888888]">
            <span>{`You are about to change application status to ${payload?.application_status}`}</span>
          </div>

          {payload?.application_status === REJECTED ? (
            <>
              {/* rejection case code */}
              <div className="relative w-full h-max mt-[1.375rem]">
                {/* Note Label */}
                <div
                  className={`absolute -top-2 left-4 bg-[#E6F4FF] px-2 rounded-[5px] ${
                    rejectionReasonError ? "text-[#FF0000]" : "text-[#214768]"
                  } text-sm font-medium`}
                >
                  Rejection Reason
                </div>

                {/* Multiline Input (Textarea) */}
                <textarea
                  className={`border ${
                    rejectionReasonError
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#214768] focus:border-[#214768]"
                  } rounded-2xl p-4 bg-[#21476815] min-h-[10rem] w-full resize-none outline-none focus:outline-none focus:ring-0 text-[#214768] text-sm placeholder:text-[#888888]`}
                  placeholder="Provide a rejection reason"
                  onChange={(e) => handleRejectionReasonChange(e)}
                />

                {/* Validation Error Message */}
                {rejectionReasonError && (
                  <p className="text-red-500 text-sm mt-1">
                    {rejectionReasonError}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="relative w-full h-max mt-[1.375rem]">
                {/* Note Label */}
                <div
                  className={`absolute -top-2 left-4 bg-[#E6F4FF] px-2 ${
                    rejectionReasonError ? "text-[#FF0000]" : "text-[#214768]"
                  } text-sm font-medium`}
                >
                  Note
                </div>

                {/* Multiline Input (Textarea) */}
                <textarea
                  className={`border ${"border-[#214768]"} rounded-2xl p-4 bg-[#21476815] min-h-[10rem] w-full resize-none outline-none text-[#32086D] text-sm`}
                  placeholder="Write your note here..."
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </>
          )}

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

export default UpdateApplicationStatusDialogue;
