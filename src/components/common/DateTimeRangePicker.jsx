import React, { useState } from "react";
import {
  format,
  isSameDay,
  isAfter,
  isBefore,
  addMonths,
  startOfMonth,
  getDaysInMonth,
} from "date-fns";
import DropDown from "./dropdowns/DropDown";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import RightArrowIcon from "../icons/RightArrowIcon";
import CheckCheckbox from "./checkbox/CheckCheckbox";
import TimeFilterIcon from "../icons/TimeFilterIcon";
import UncheckedCheckbox from "./checkbox/UnCheckedCheckbox";
import Divider from "./Divider";
import DoneButton from "./DoneButton";
import TimeSelector from "./date-time-picker/TimeSelector";

const DateTimeRangePicker = ({
  onClose,
  onDateChange,
  showTimeFilterToggleButton = true,
  showSingleCalender = false,
}) => {
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [defaultSelectedOptionIndex, setDefaultSelecetdOptionIndex] =
    useState(``);
  const [startTime, setStartTime] = useState({
    hour: "12",
    minute: "00",
    period: "PM",
  });
  const [endTime, setEndTime] = useState({
    hour: "12",
    minute: "00",
    period: "PM",
  });

  const [leftMonthOffset, setLeftMonthOffset] = useState(0);
  const [rightMonthOffset, setRightMonthOffset] = useState(1); // Start with the next month
  const [isTimeFilterNeeded, setIsTimeFilterNeeded] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true)

  // const handleDateClick = (date) => {
  //   try {
  //     if (showSingleCalender) {
  //       console.log("date = ", date);
  //       onDateChange(date);
  //       setTimeout(() => {
  //         onClose();
  //       }, 1000);
  //     } else {
  //       if (!startDate || (startDate && endDate)) {
  //         setStartDate(date);
  //         setStartTime({
  //           hour: "12",
  //           minute: "00",
  //           period: "AM",
  //         });
  //         setEndDate(null);
  //       } else if (isBefore(date, startDate)) {
  //         setStartDate(date);
  //         setStartTime({
  //           hour: "12",
  //           minute: "00",
  //           period: "AM",
  //         });
  //       } else {
  //         setEndDate(date);
  //         setEndTime({
  //           hour: "11",
  //           minute: "59",
  //           period: "PM",
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const handleDateClick = (date) => {
    try {
      if (showSingleCalender) {
        console.log("date = ", date);
        onDateChange(date);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // First click: Set both start and end to same date with default times
        if (isFirstClick || (!startDate && !endDate)) {
          setStartDate(date);
          setStartTime({
            hour: "12",
            minute: "00",
            period: "AM",
          });
  
          setEndDate(date);
          setEndTime({
            hour: "11",
            minute: "59",
            period: "PM",
          });
  
          setIsFirstClick(false); // next click will be for actual endDate
        }
  
        // Second click: Set real endDate if it's after startDate
        else if (startDate && isAfter(date, startDate)) {
          setEndDate(date);
          // Optional: you may want to reset endTime again or let it be edited manually
          setIsFirstClick(true); // reset for future range selection
        }
  
        // Clicked an earlier date → reset range selection
        else if (startDate && isBefore(date, startDate)) {
          setStartDate(date);
          setStartTime({
            hour: "12",
            minute: "00",
            period: "AM",
          });
  
          setEndDate(date);
          setEndTime({
            hour: "11",
            minute: "59",
            period: "PM",
          });
  
          setIsFirstClick(false);
        }
  
        // Clicked same date again or invalid — ignore or reset based on UX
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const isDateSelected = (date) =>
    isSameDay(date, startDate) || isSameDay(date, endDate);
  const isDateInRange = (date) =>
    startDate && endDate && isAfter(date, startDate) && isBefore(date, endDate);

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleDone = () => {
    try {
      if (!startDate) {
        console.log("Please select a start date.");
        return;
      }

      const formatDateTime = (date, time) => {
        if (!date) return null;
        const formattedDate = format(date, "yyyy-MM-dd");

        if (!isTimeFilterNeeded) {
          return formattedDate; // Return only the date if time filter is not enabled
        }

        const { hour, minute, period } = time;
        return `${formattedDate} ${hour}:${minute} ${period}`;
      };

      const finalStartDate = formatDateTime(startDate, startTime);
      const finalEndDate = endDate ? formatDateTime(endDate, endTime) : null;

      console.log("Start Date-Time:", finalStartDate);
      if (finalEndDate) {
        console.log("End Date-Time:", finalEndDate);
      }

      let data = {
        startDateTime: finalStartDate,
      };
      if (finalEndDate) {
        data.endDateTime = finalEndDate;
      }
      onDateChange(data);
    } finally {
      onClose(); // ✅ Ensures picker closes always
    }
  };

  function handleChangeOption(optionType, option, isStartTime = false) {
    console.log("option type = ", optionType, "option = ", option);

    switch (optionType) {
      case "hours":
        if (isStartTime) {
          setStartTime((prev) => ({ ...prev, hour: option }));
        } else {
          setEndTime((prev) => ({ ...prev, hour: option }));
        }
        break;
      case "minutes":
        if (isStartTime) {
          setStartTime((prev) => ({ ...prev, minute: option }));
        } else {
          setEndTime((prev) => ({ ...prev, minute: option }));
        }
        break;
      case "periods":
        if (isStartTime) {
          setStartTime((prev) => ({ ...prev, period: option }));
        } else {
          setEndTime((prev) => ({ ...prev, period: option }));
        }
        break;
      default:
        break;
    }
  }

  const handleTodayClick = () => {
    const today = new Date();

    // Set start date to beginning of today
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    // Set end date to end of today
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    setStartDate(startOfDay);
    setEndDate(endOfDay);

    // Also set the times to match (12:00 AM to 11:59 PM)
    setStartTime({
      hour: "12",
      minute: "00",
      period: "AM",
    });

    setEndTime({
      hour: "11",
      minute: "59",
      period: "PM",
    });
  };

  return (
    <div className="p-4 border-2 border-gray-300 rounded-xl mx-auto bg-[#E6F4FF] shadow-lg w-full poppins-thin pb-0 min-w-[36rem]">
      <div className="grid grid-cols-2 gap-2">
        {[
          { offset: leftMonthOffset, setOffset: setLeftMonthOffset },
          { offset: rightMonthOffset, setOffset: setRightMonthOffset },
        ].map(({ offset, setOffset }, index) => {
          const firstDayOfMonth = startOfMonth(addMonths(new Date(), offset));
          const daysInMonth = getDaysInMonth(firstDayOfMonth);
          return (
            <div key={index}>
              {/* Calendar Header */}
              <div className="flex justify-between items-center text-lg font-semibold mb-2 text-[#214768]">
                <button
                  className="bg-[#E6F4FF] text-md text-black flex items-center justify-center p-1 rounded-full hover:#E6F4FF"
                  onClick={() => setOffset((prev) => prev - 1)}
                >
                  <LeftArrowIcon />
                </button>
                <span>{format(firstDayOfMonth, "MMMM yyyy")}</span>
                <button
                  className="text-gray-500 bg-[#E6F4FF] text-md flex items-center justify-center p-1 rounded-full hover:#E6F4FF"
                  onClick={() => setOffset((prev) => prev + 1)}
                >
                  <RightArrowIcon />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 text-center text-sm font-medium text-[#6D7175]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day}>{day}</div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 text-center mt-1">
                {Array.from({ length: firstDayOfMonth.getDay() }).map(
                  (_, index) => (
                    <div key={index} className="text-gray-300"></div>
                  )
                )}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const date = new Date(
                    firstDayOfMonth.getFullYear(),
                    firstDayOfMonth.getMonth(),
                    index + 1
                  );
                  const isSelected = isDateSelected(date);
                  const isInRange = isDateInRange(date);
                  const isStart = startDate && isSameDay(date, startDate);
                  const isEnd = endDate && isSameDay(date, endDate);

                  return (
                    <div
                      key={index}
                      className={`p-2 text-sm mt-[0.125rem] cursor-pointer flex items-center justify-center 
            ${isStart ? "bg-[#214768] text-[#FFFFFF] rounded-l-full" : ""}
            ${isEnd ? "bg-[#214768] text-[#FFFFFF] rounded-r-full" : ""}
            ${isInRange ? "bg-[#D0E3F2] text-[#202223]" : ""}
            ${!isSelected && !isInRange ? "hover:bg-gray-200" : ""}`}
                      onClick={() => handleDateClick(date)}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Filter Toggle */}
      {showTimeFilterToggleButton && (
        <div className="flex items-center mt-4 justify-between">
          <div className="flex items-center">
            <div
              className="mr-[0.625rem] cursor-pointer"
              onClick={() => setIsTimeFilterNeeded(!isTimeFilterNeeded)}
            >
              {isTimeFilterNeeded ? <CheckCheckbox /> : <UncheckedCheckbox />}
            </div>
            <div className="mr-[0.125rem]">
              <TimeFilterIcon />
            </div>
            <span class="text-[#202223] text-sm inter-inter text-center leading-6">
              Need time filter?
            </span>
          </div>

          <div className="flex items-center">
            <div
              class="flex justify-center items-center flex-row gap-2.5 py-[5px] px-2.5 rounded-[5px] cursor-pointer"
              onClick={() => handleTodayClick()}
            >
              <span class="text-[#214768] text-sm inter-inter text-center leading-6">
                Today
              </span>
            </div>

            <div
              class="flex justify-center items-center flex-row gap-2.5 py-[5px] px-2.5 rounded-[5px] cursor-pointer"
              onClick={() => handleClear()}
            >
              <span class="text-[#DF0404] text-sm inter-inter text-center leading-6">
                Clear
              </span>
            </div>

            {!isTimeFilterNeeded && (
              <div className="flex items-center justify-center">
                <DoneButton onClick={() => handleDone()} />
              </div>
            )}
          </div>
        </div>
      )}

      {isTimeFilterNeeded && (
        <div className="w-full border-t border-gray-200 my-3 transition-all duration-500 ease-in-out" />
      )}

      {/* timer main container */}
      <div
        className={`w-full transition-all duration-500 ease-in-out overflow-visible ${
          isTimeFilterNeeded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex items-center justify-center transition-all duration-500 transform mb-4 mt-2">
          <div className="flex flex-col space-y-2 mr-4">
            {/* Start Time */}
            <div className="flex items-center">
              <div className="flex flex-col min-w-[100px]">
                <TimeSelector label="Start Time" date={startDate} />
              </div>
              <div className="flex self-end ml-4 space-x-2">
                <span>:</span>
                <DropDown
                  options={hours}
                  onChange={(_, data) =>
                    handleChangeOption("hours", data, true)
                  }
                  defaultSelectedOptionIndex={hours.length - 1}
                  backgroundColor="#D0E3F2"
                  textColor="#000000"
                />
                <DropDown
                  options={minutes}
                  onChange={(_, data) =>
                    handleChangeOption("minutes", data, true)
                  }
                  backgroundColor="#D0E3F2"
                  textColor="#000000"
                />
                <DropDown
                  options={periods}
                  onChange={(_, data) =>
                    handleChangeOption("periods", data, true)
                  }
                  backgroundColor="#D0E3F2"
                  textColor="#000000"
                />
              </div>
            </div>

            {/* End Time */}
            <div className="flex items-center">
              <div className="flex flex-col min-w-[100px]">
                <TimeSelector label="End Time" date={endDate} />
              </div>
              <div className="flex self-end ml-4 space-x-2">
                <span>:</span>
                <DropDown
                  options={hours}
                  onChange={(_, data) => handleChangeOption("hours", data)}
                  defaultSelectedOptionIndex={hours.length - 2}
                  backgroundColor="#D0E3F2"
                  textColor="#000000"
                />
                <DropDown
                  options={minutes}
                  onChange={(_, data) => handleChangeOption("minutes", data)}
                  defaultSelectedOptionIndex={minutes.length - 1}
                  backgroundColor="#D0E3F2"
                  textColor="#000000"
                />
                <DropDown
                  options={periods}
                  onChange={(_, data) => handleChangeOption("periods", data)}
                  defaultSelectedOptionIndex={periods.length - 1}
                  backgroundColor="#D0E3F2"
                  textColor="#000000"
                />
              </div>
            </div>
          </div>

          {/* Done Button */}
          <div className="flex items-center justify-center">
            <DoneButton onClick={() => handleDone()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeRangePicker;
