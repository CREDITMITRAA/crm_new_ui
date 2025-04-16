import { useState, useRef, useEffect } from "react";
import DateTimeRangePicker from "./DateTimeRangePicker";
import { useSelector } from "react-redux";
import { setIsProfileDialogueOpened } from "../../features/ui/uiSlice";

function DateButton({
  showDot = false,
  onDateChange,
  buttonBackgroundColor = "white",
  fieldName = "",
  showTimeFilterToggleButton = true,
  showSingleCalender = false,
  resetFilters = false,
  date = null,
  fromTable = false,
  showBoxShadow = false,
  fromFilter=false,
  borderColor="none"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("dd-mm-yyyy");
  const {
    isConfirmationDialogueOpened,
    isProfileDialogueOpened,
    isAddActivityDialogueOpened,
  } = useSelector((state) => state.ui);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (date) {
      // Check if date is a comma-separated string
      if (typeof date === 'string' && date.includes(',')) {
        const [startDateTime, endDateTime] = date.split(',');
        formatDateRange({ startDateTime, endDateTime });
      } 
      // Check if date is already an object
      else if (typeof date === 'object') {
        formatDateRange(date);
      }
      // Handle single date string
      else {
        formatDateRange({ startDateTime: date });
      }
    } else {
      setSelectedDate("dd-mm-yyyy");
    }
  }, [date]);

  useEffect(() => {
    if (resetFilters) {
      setSelectedDate("dd-mm-yyyy");
    }
  }, [resetFilters]);

  // Check space and decide picker direction (Up/Down and Left/Right)
  const togglePicker = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;

      // Decide vertical positioning
      setOpenUpward(spaceBelow < 250 && spaceAbove > spaceBelow);

      // Decide horizontal positioning
      setAlignRight(spaceRight < 300 && spaceLeft > spaceRight);
    }
    setIsOpen(!isOpen);
  };

  function handleDateChange(value) {
    console.log("data in DateButton = ", value);

    onDateChange(fieldName, value);
    formatDateRange(value);
  }

  function formatDateRange(dateObj) {
    if (!dateObj) {
      setSelectedDate("dd-mm-yyyy");
      return;
    }

    console.log('date object = ', dateObj);
    
  
    // Handle both object format {startDateTime, endDateTime} and string format
    if (typeof dateObj === 'string') {
      setSelectedDate(dateObj);
      return;
    }
  
    const startDate = dateObj.startDateTime?.split(" ")[0] || "";
    const endDate = dateObj.endDateTime?.split(" ")[0] || "";
  
    if (!endDate || startDate === endDate) {
      setSelectedDate(startDate || "dd-mm-yyyy");
    } else {
      setSelectedDate(`${startDate} to ${endDate}`);
    }
  }

  return (
    <div
      className="relative inline-block w-full h-full rounded-2xl"
      style={{
        zIndex: fromTable
          ? 1
          : isAddActivityDialogueOpened
          ? 1
          : isConfirmationDialogueOpened || isProfileDialogueOpened
          ? -1
          : 1,
        boxShadow:
          showBoxShadow &&
          `
         1px 1px 3px 0px #0000001A,
          5px 2px 5px 0px #00000017,
          10px 5px 7px 0px #0000000D,
          18px 10px 8px 0px #00000003,
          28px 15px 9px 0px #00000000

      `,
      }}
    >
      {/* Date Button */}
      <div
        ref={buttonRef}
        className={`w-full h-full px-[10px] py-2.5 bg-${buttonBackgroundColor} rounded-2xl shadow-lg flex items-center gap-2.5 px-8 py-0 cursor-pointer border border-${borderColor}`}
        onClick={togglePicker}
      >
        {showDot && (
          <div>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path
                d="M4 0C2.939 0 1.922 0.421 1.172 1.172C0.421 1.922 0 2.939 0 4C0 5.061 0.421 6.078 1.172 6.828C1.922 7.579 2.939 8 4 8C6.22 8 8 6.22 8 4C8 2.939 7.579 1.922 6.828 1.172C6.078 0.421 5.061 0 4 0Z"
                fill="rgba(70, 170, 202, 1)"
              />
            </svg>
          </div>
        )}

        <div>
          <svg width="15" height="16" viewBox="0 0 15 16" fill="none">
            <path
              d="M5 4.875V2.375M10 4.875V2.375M4.375 7.375H10.625M3.125 13.625H11.875C12.565 13.625 13.125 13.065 13.125 12.375V4.875C13.125 4.185 12.565 3.625 11.875 3.625H3.125C2.435 3.625 1.875 4.185 1.875 4.875V12.375C1.875 13.065 2.435 13.625 3.125 13.625Z"
              stroke="#214768"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className={`${selectedDate === "dd-mm-yyyy" ? fromFilter ? "text-[#21476880]" : "text-[#464646]" : "text-[#214768]" }  text-xs font-medium inter-inter leading-tight`}>
          {selectedDate}
        </div>
      </div>

      {/* Date Picker (Position Adjusted Dynamically) */}
      {isOpen && (
        <div
          ref={pickerRef}
          className={`absolute z-50 rounded-xl shadow-xl transition-transform duration-300 scale-75 origin-top-left 
          ${openUpward ? "bottom-full mb-2" : "top-full mt-2"} 
          ${
            alignRight ? "right-0 origin-top-right" : "left-0 origin-top-left"
          }`}
        >
          <DateTimeRangePicker
            onClose={() => setIsOpen(false)}
            onDateChange={(data) => handleDateChange(data)}
            showTimeFilterToggleButton={showTimeFilterToggleButton}
            showSingleCalender={showSingleCalender}
          />
        </div>
      )}
    </div>
  );
}

export default DateButton;
