import { useEffect, useRef, useState } from "react";
import {
  activityOptions,
  CALL_BACK,
  FOLLOW_UP,
  RESCHEDULE_CALL_WITH_MANAGER,
  RESCHEDULE_WALK_IN,
  SCHEDULE_CALL_WITH_MANAGER,
  SCHEDULE_FOR_WALK_IN,
  SCHEDULED_CALL_WITH_MANAGER,
} from "../../../utilities/AppConstants";
import DateButton from "../DateButton";
import DropDown from "../dropdowns/DropDown";
import PopupButton from "../PopupButton";
import { useDispatch, useSelector } from "react-redux";
import { addActivity } from "../../../features/activities/activitiesThunks";
import Snackbar from "../snackbars/Snackbar";
import {
  extractDate,
  formatDatePayload,
  formatDateTime,
} from "../../../utilities/utility-functions";
import { scheduleWalkIn } from "../../../features/verification/verificationThunks";
import { setIsConfirmationDialogueOpened } from "../../../features/ui/uiSlice";

const options = [
  { label: SCHEDULE_FOR_WALK_IN, value: SCHEDULE_FOR_WALK_IN },
  { label: SCHEDULE_CALL_WITH_MANAGER, value: SCHEDULE_CALL_WITH_MANAGER },
];

function ScheduleWalkInOrCallDialogue({
  onClose,
  selectedLeadStatus = null,
  onScheduleWalkInOrCall,
  fromTable = false,
  selectedLead = {},
  setOpenToast,
  openToast,
  isCall = false,
  isReschedule = false,
  setIsCall,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { lead } = useSelector((state) => state.leads);
  const { loading, error } = useSelector((state) => state.activities);
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = String(i + 1).padStart(2, "0");
    return { label: hour, value: hour };
  });

  const minutes = Array.from({ length: 60 }, (_, i) => {
    const minute = String(i).padStart(2, "0");
    return { label: minute, value: minute };
  });
  const periods = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
  ];

  const dialogueRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [description, setDescription] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const taskForStatuses = [CALL_BACK, FOLLOW_UP, SCHEDULED_CALL_WITH_MANAGER];
  const [taskDate, setTaskDate] = useState("");
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  useEffect(() => {
    console.log("selected activity status = ", selectedLeadStatus);
    dispatch(setIsConfirmationDialogueOpened(true));
    if (selectedLeadStatus) {
      setSelectedStatus(selectedLeadStatus);
      // setSelectedOptionIndex(
      //   activityOptions.findIndex(
      //     (activity) => activity.value === selectedLeadStatus
      //   )
      // );
    }
    return () => {
      dispatch(setIsConfirmationDialogueOpened(false));
      setIsCall(false);
      onScheduleWalkInOrCall();
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

  function handleSelect(name, value) {
    console.log("name = ", name, " value = ", value);
    setSelectedStatus(value);
  }

  async function handleSubmit() {
    let payload = {};
    payload["is_call"] = isCall;
    payload["created_by"] = user.user.id;
    payload["lead_id"] = selectedLead.id;
    payload["lead_name"] = selectedLead.name;
    payload["note"] = description;
    if (isReschedule) {
      payload["is_rescheduled"] = true;
      payload["rescheduled_date_time"] = formatDateTime(
        taskDate,
        hour,
        minute,
        period
      );
    }else{
      payload["walk_in_date_time"] = formatDateTime(
        taskDate,
        hour,
        minute,
        period
      );
    }
    setOpenToast(true);
    try {
      const result = await dispatch(scheduleWalkIn(payload));
      if (scheduleWalkIn.fulfilled.match(result)) {
        // onScheduleWalkInOrCall();
      } else if (scheduleWalkIn.rejected.match(result)) {
        console.error("Error scheduling :", result.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleDateChange(date) {
    date = new Date(date);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    const formatted = `${year}-${month}-${day}`;
    setTaskDate(formatted);
  }

  function handleDateTimeChange(fieldName, value) {
    switch (fieldName) {
      case "hours":
        setHour(value);
        break;
      case "minutes":
        setMinute(value);
        break;
      case "periods":
        setPeriod(value);
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
          minWidth: "40rem",
          width: "max-content",
          height: "max-content",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <>
          <span className="text-[#214768] font-semibold leading-5 poppins-thin">
            {isReschedule
              ? isCall
                ? RESCHEDULE_CALL_WITH_MANAGER
                : RESCHEDULE_WALK_IN
              : isCall
              ? SCHEDULE_CALL_WITH_MANAGER
              : SCHEDULE_FOR_WALK_IN}
          </span>

          {/* status and date time container */}
          <div className="flex justify-start gap-x-2 mt-[1.25rem]">
            {/* status section */}
            <div className="flex flex-col">
              <span className="text-[#214768] text-sm font-medium leading-5 mb-[0.625rem]">
                Status
              </span>
              <DropDown
                options={options}
                className="min-w-[13rem]"
                onChange={(name, value) => handleSelect(name, value)}
                fieldName="activity_status"
                defaultSelectedOptionIndex={
                  fromTable
                    ? 0
                    : options?.findIndex(
                        (activity) => activity.value === selectedLeadStatus
                      ) || 0
                }
                disabled={true}
                backgroundColor="bg-[#F2F7FE]"
                buttonWidth="max-content"
                buttonMinWidth="13rem"
                buttonBorder="1px solid #214768"
                buttonBorderRadius="0.8rem"
                buttonHeight="100%"
                optionsTextColor="#464646"
                size="sm"
              />
            </div>

            {/* Date section */}
            <div className="flex flex-col w-max">
              <span className="text-[#214768] text-sm font-medium leading-5 mb-[0.625rem]">
                Date
              </span>
              <div className="h-8">
              <DateButton
                showDot={false}
                showTimeFilterToggleButton={false}
                showSingleCalender={true}
                onDateChange={(_, date) => handleDateChange(date)}
                date={taskDate && extractDate(taskDate)}
                fromTable={true}
                buttonBackgroundColor="[#D9E4F2]"
                showBoxShadow={true}
                borderColor="[#214768]"
              />
              </div>
            </div>

            {/* Time section */}
            <div className="flex flex-col">
              <span className="text-[#214768] text-sm font-medium leading-5 mb-[0.625rem]">
                Time
              </span>
              <div className="flex gap-x-4">
                <DropDown
                  options={hours}
                  defaultSelectedOptionIndex={[hours.length - 1]}
                  onChange={(fieldName, value) =>
                    handleDateTimeChange(fieldName, value)
                  }
                  fieldName="hours"
                  textColor="text-[#000000]"
                  buttonWidth="max-content"
                  buttonMinWidth="4rem"
                  buttonBorder="1px solid #214768"
                  buttonBorderRadius="0.8rem"
                  buttonHeight="100%"
                  optionsTextColor="#464646"
                  size="sm"
                />
                <DropDown
                  options={minutes}
                  onChange={(fieldName, value) =>
                    handleDateTimeChange(fieldName, value)
                  }
                  fieldName="minutes"
                  textColor="text-[#000000]"
                  buttonWidth="max-content"
                  buttonMinWidth="4rem"
                  buttonBorder="1px solid #214768"
                  buttonBorderRadius="0.8rem"
                  buttonHeight="100%"
                  optionsTextColor="#464646"
                  size="sm"
                />
                <DropDown
                  options={periods}
                  onChange={(fieldName, value) =>
                    handleDateTimeChange(fieldName, value)
                  }
                  fieldName="periods"
                  textColor="text-[#000000]"
                  buttonWidth="max-content"
                  buttonMinWidth="4rem"
                  buttonBorder="1px solid #214768"
                  buttonBorderRadius="0.8rem"
                  buttonHeight="100%"
                  optionsTextColor="#464646"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="relative w-full h-max mt-[1.375rem]">
            {/* Note Label */}
            <div className="absolute -top-2 left-4 bg-[#E6F4FF] px-2 text-[#214768] text-sm font-medium rounded-[5px]">
              Note
            </div>

            {/* Multiline Input (Textarea) */}
            <textarea
              className="border border-[#214768] rounded-2xl p-4 bg-[#21476815] min-h-[10rem] w-full resize-none outline-none focus:outline-none focus:ring-0 focus:border-[#214768] text-[#214768] text-sm placeholder:text-[#214768]"
              placeholder="Write your note here..."
              onChange={(e) => setDescription(e.target.value)}
            />
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
          {/* <Snackbar
            isOpen={openToast}
            onClose={() => setOpenToast(false)}
            status={toastStatusMessage}
            message={toastMessage}
            statusType={toastStatusType}
            shouldCloseOnClickOfOutside={shouldSnackbarCloseOnClickOfOutside}
          /> */}
        </>
      </div>
    </div>
  );
}

export default ScheduleWalkInOrCallDialogue;
