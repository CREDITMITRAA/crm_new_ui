import { useEffect, useRef, useState } from "react";
import {
  activityOptions,
  CALL_BACK,
  FOLLOW_UP,
  SCHEDULED_CALL_WITH_MANAGER,
  terminologiesMap,
  VERIFICATION_1,
} from "../../../utilities/AppConstants";
import DateButton from "../DateButton";
import DropDown from "../dropdowns/DropDown";
import PopupButton from "../PopupButton";
import { useDispatch, useSelector } from "react-redux";
import { addActivity } from "../../../features/activities/activitiesThunks";
import Snackbar from "../snackbars/Snackbar";
import { formatDateTime } from "../../../utilities/utility-functions";
import {
  setIsAddActivityDialogueOpened,
  setIsConfirmationDialogueOpened,
} from "../../../features/ui/uiSlice";

function AddActivityDialogue({
  onClose,
  selectedActivityStatus = null,
  onActivityAdded,
  fromTable = false,
  selectedLead = {},
  setOpenToast,
  openToast,
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
  const baseOptions = activityOptions;

  useEffect(() => {
    console.log(
      "selected activity status = ",
      selectedActivityStatus,
      selectedLead
    );
    if (
      selectedLead?.activities?.[0]?.docsCollected ||
      selectedLead?.Activities?.[0].docs_collected
    ) {
      baseOptions.push({
        label: terminologiesMap.get(VERIFICATION_1),
        value: VERIFICATION_1,
      });
    }
    dispatch(setIsConfirmationDialogueOpened(true));
    dispatch(setIsAddActivityDialogueOpened(true));
    if (selectedActivityStatus) {
      setSelectedStatus(selectedActivityStatus);
      // setSelectedOptionIndex(
      //   activityOptions.findIndex(
      //     (activity) => activity.value === selectedActivityStatus
      //   )
      // );
    }
    return () => {
      dispatch(setIsConfirmationDialogueOpened(false));
      dispatch(setIsAddActivityDialogueOpened(false));
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

  // useEffect(() => {
  //   if (loading) {
  //     setToastStatusType("INFO");
  //     setToastMessage("Adding activity...");
  //     setToastStatusMessage("In Progress...");
  //     setShouldSnackbarCloseOnClickOfOutside(true);
  //   } else {
  //     setToastStatusType("SUCCESS");
  //     setToastMessage("Activity added...");
  //     setToastStatusMessage("Success...");
  //     setShouldSnackbarCloseOnClickOfOutside(true);
  //   }
  // }, [loading]);

  // useEffect(() => {
  //   if (error) {
  //     setToastStatusType("ERROR");
  //     setToastMessage(error.message);
  //     setToastStatusMessage("Error...");
  //     setShouldSnackbarCloseOnClickOfOutside(true);
  //   }
  // }, [error]);

  function handleSelect(name, value) {
    console.log("name = ", name, " value = ", value);
    setSelectedStatus(value);
  }

  async function handleSubmit() {
    let payload = {};
    if (fromTable) {
      payload.userId = user.user.id;
      payload.leadId = selectedLead.id;
      payload.lead_name = selectedLead.name;
      payload.activity_status = selectedStatus;
      if (taskForStatuses.includes(selectedStatus)) {
        console.log(taskDate, hour, minute, period);

        let followUpDate = formatDateTime(taskDate, hour, minute, period);
        payload.followUp = followUpDate;
      }
    } else {
      payload.userId = user.user.id;
      payload.leadId = lead.id;
      payload.lead_name = lead.name;
      payload.activity_status = selectedStatus;
    }

    if (description) {
      payload.description = description;
    }

    setOpenToast(true);

    try {
      const result = await dispatch(addActivity(payload));
      if (addActivity.fulfilled.match(result)) {
        console.log("Activity added successfully");
        onActivityAdded(); // Call the callback
      } else if (addActivity.rejected.match(result)) {
        console.error("Error adding activity:", result.error);
      }
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  }

  function handleDateChange(date) {
    console.log("date = ", date);

    setTaskDate(date);
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
            Add Activity
          </span>

          {/* status and date time container */}
          <div className="flex justify-start gap-x-2 mt-[1.25rem]">
            {/* status section */}
            <div className="flex flex-col">
              <span className="text-[#214768] text-sm font-medium leading-5 mb-[0.625rem]">
                Status
              </span>
              <DropDown
                // options={[
                //   ...activityOptions,
                //   ...(selectedLead?.activities?.[0]?.docsCollected || selectedLead?.Activities?.[0]?.docs_collected
                //       ? [{ label: terminologiesMap.get(VERIFICATION_1), value: VERIFICATION_1 }]
                //       : [])
                // ]}
                options={baseOptions}
                className="min-w-[13rem]"
                onChange={(name, value) => handleSelect(name, value)}
                fieldName="activity_status"
                defaultSelectedOptionIndex={
                  fromTable
                    ? 0
                    : baseOptions?.findIndex(
                        (activity) => activity.value === selectedActivityStatus
                      ) || 0
                }
                backgroundColor="bg-[#F2F7FE]"
                buttonWidth="max-content"
                buttonMinWidth="13rem"
                buttonBorder="1px solid #214768"
                buttonBorderRadius="0.8rem"
                buttonHeight="100%"
                optionsTextColor="#464646"
              />
            </div>

            {taskForStatuses.includes(selectedStatus) && (
              <>
                {/* Date section */}
                <div className="flex flex-col w-max">
                  <span className="text-[#214768] text-sm font-medium leading-5 mb-[0.625rem]">
                    Date
                  </span>
                  <DateButton
                    showDot={false}
                    showTimeFilterToggleButton={false}
                    showSingleCalender={true}
                    onDateChange={(date) => handleDateChange(date)}
                    buttonBackgroundColor="[#D9E4F2]"
                    showBoxShadow={true}
                    borderColor="[#214768]"
                  />
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
                      backgroundColor="bg-[#FFFFFF]"
                      textColor="text-[#000000]"
                      buttonWidth="max-content"
                      buttonMinWidth="4rem"
                      buttonBorder="1px solid #214768"
                      buttonBorderRadius="0.8rem"
                      buttonHeight="100%"
                      optionsTextColor="#464646"
                    />
                    <DropDown
                      options={minutes}
                      onChange={(fieldName, value) =>
                        handleDateTimeChange(fieldName, value)
                      }
                      fieldName="minutes"
                      backgroundColor="bg-[#FFFFFF]"
                      textColor="text-[#000000]"
                      buttonWidth="max-content"
                      buttonMinWidth="4rem"
                      buttonBorder="1px solid #214768"
                      buttonBorderRadius="0.8rem"
                      buttonHeight="100%"
                      optionsTextColor="#464646"
                    />
                    <DropDown
                      options={periods}
                      onChange={(fieldName, value) =>
                        handleDateTimeChange(fieldName, value)
                      }
                      fieldName="periods"
                      backgroundColor="bg-[#F2F7FE]"
                      textColor="text-[#000000]"
                      buttonWidth="max-content"
                      buttonMinWidth="4rem"
                      buttonBorder="1px solid #214768"
                      buttonBorderRadius="0.8rem"
                      buttonHeight="100%"
                      optionsTextColor="#464646"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative w-full h-max mt-[1.375rem]">
            {/* Note Label */}
            <div className="absolute -top-2 left-4 bg-[#E6F4FF] px-2 text-[#214768] text-sm font-medium rounded-[5px]">
              Note
            </div>

            {/* Multiline Input (Textarea) */}
            <textarea
              className="border border-[#214768] rounded-2xl p-4 bg-[#21476815] min-h-[10rem] w-full resize-none outline-none focus:outline-none focus:ring-0 focus:border-[#214768] text-[#214768] text-sm"
              placeholder="Write your note here..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="w-full flex justify-between mt-[1.25rem]">
            <div className="w-max">
              <PopupButton
                name="Close"
                onClick={onClose}
                className="border-solid border-[#214768]"
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

export default AddActivityDialogue;
