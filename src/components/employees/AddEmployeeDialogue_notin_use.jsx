import { useEffect, useRef, useState } from "react";
import PopupButton from "../common/PopupButton";
import AddEmployeeIcon from "../icons/AddEmployeeIcon";

function AddEmployeeDialogue_Not_In_Use({ onClose }) {
  const [showEmploymentTypeSection, setShowEmploymentTypeSection] =
    useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const dialogueRef = useRef(null);

  useEffect(() => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    style={{
      // opacity: isOpen ? 1 : 0,
      transition: "opacity 0.3s ease-in-out",
    }}
    >
      <div
        className="w-[469px] h-[21.938rem] bg-white rounded-[20px] px-[2.75rem] relative"
        ref={dialogueRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="left-[64px] top-[22px] absolute text-[#32086d] text-base font-semibold poppins-thin leading-tight">
          Add Employee
        </div>
        <AddEmployeeIcon />
        <div className="w-[381px] h-[311px] left-[44px] top-[52px] absolute">
          {/* Tab Headers */}
          <div className="w-[381px] h-[22px] left-0 top-0 absolute flex justify-between relative">
            <div
              className={`absolute left-[57px] top-0 text-[#32086d] text-xs font-normal poppins-thin leading-tight cursor-pointer ${
                !showEmploymentTypeSection ? "font-semibold" : "opacity-50"
              }`}
              onClick={() => {
                setShowEmploymentTypeSection(false);
                setShowSubmitButton(false);
              }}
            >
              Basic details
            </div>
            <div
              className={`absolute left-[233px] top-0 text-[#32086d] text-xs font-normal poppins-thin leading-tight cursor-pointer ${
                showEmploymentTypeSection ? "font-semibold" : "opacity-50"
              }`}
              onClick={() => {
                setShowEmploymentTypeSection(true);
                setShowSubmitButton(true);
              }}
            >
              Employment type
            </div>

            {/* Underline Background */}
            <div className="w-[381px] h-0.5 left-0 top-[20px] absolute bg-[#e8e8e8] rounded-sm"></div>

            {/* Dynamic Underline */}
            <div
              className={`w-[190.50px] h-0.5 top-[20px] absolute bg-[#32086d] rounded-sm transition-all duration-300`}
              style={{ left: showEmploymentTypeSection ? "190px" : "0px" }}
            ></div>
          </div>

          {/* Content */}
          <div className="h-max absolute top-[1.75rem] w-full">
            {showEmploymentTypeSection ? (
              <EmploymentTypeContent />
            ) : (
              <BasicDetailsContent />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between absolute left-0 top-[15.313rem] w-full">
            <PopupButton
              name={showSubmitButton ? "Previous" : "Cancel"}
              onClick={() => {
                if (!showSubmitButton) {
                  onClose();
                }
                setShowEmploymentTypeSection(false);
                setShowSubmitButton(false);
              }}
            />
            <PopupButton
              name={showSubmitButton ? "Submit" : "Next"}
              isPrimary={true}
              onClick={() => {
                setShowEmploymentTypeSection(true);
                setShowSubmitButton(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BasicDetailsContent() {
  const [selectedGender, setSelectedGender] = useState("Male");

  return (
    <div className="flex flex-col">
      {/* Employee name */}
      <div className="flex flex-col">
        <div className="text-[#32086d] text-[10px] font-normal poppins-thin leading-tight">
          Employee name
        </div>
        <div className="w-[381px] h-[30px] relative mt-[0.313rem]">
          <input
            type="text"
            placeholder="Enter the employee name"
            className="w-full h-full bg-[#daeaff] rounded-md pl-3 text-[#32086d] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none"
          />
        </div>
      </div>

      {/* Job title */}
      <div className="flex flex-col mt-[0.375rem]">
        <div className="text-[#32086d] text-[10px] font-normal poppins-thin leading-tight">
          Job Title
        </div>
        <div className="w-[381px] h-[30px] relative mt-[0.313rem]">
          <input
            type="text"
            placeholder="Enter the job title"
            className="w-full h-full bg-[#daeaff] rounded-md pl-3 text-[#32086d] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none"
          />
        </div>
      </div>

      {/* email and phone number */}
      <div className="flex justify-between mt-[0.375rem] gap-x-2">
        {/* Location */}
        <div className="flex flex-col w-1/2">
          <div className="text-[#32086d] text-[10px] font-normal poppins-thin leading-tight">
            Email
          </div>
          <div className="w-full h-[30px] relative mt-[0.313rem]">
            <input
              type="text"
              placeholder="Enter the email"
              className="w-full h-full bg-[#daeaff] rounded-md pl-3 text-[#32086d] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col w-1/2">
          <div className="text-[#32086d] text-[10px] font-normal poppins-thin leading-tight">
            Phone number
          </div>
          <div className="w-full h-[30px] relative mt-[0.313rem]">
            <input
              type="text"
              placeholder="Enter the phone"
              className="w-full h-full bg-[#daeaff] rounded-md pl-3 text-[#32086d] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Location and Gender Container */}
      <div className="flex justify-between mt-[0.375rem] gap-x-2">
        {/* Location */}
        <div className="flex flex-col w-1/2">
          <div className="text-[#32086d] text-[10px] font-normal poppins-thin leading-tight">
            Location
          </div>
          <div className="w-full h-[30px] relative mt-[0.313rem]">
            <input
              type="text"
              placeholder="Enter the location"
              className="w-full h-full bg-[#daeaff] rounded-md pl-3 text-[#32086d] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col w-1/2">
          <div className="text-[#32086d] text-[10px] font-normal poppins-thin leading-tight">
            Gender
          </div>
          <div className="w-full h-[30px] relative mt-[0.313rem]">
            <div className="w-[187px] h-[30px] bg-[#daeaff] rounded-md flex justify-between px-2 items-center">
              {["Male", "Female", "Other"].map((gender) => (
                <div
                  key={gender}
                  className={`w-[50px] h-[25px] flex items-center justify-center rounded-md text-[#32086d] text-[10px] font-normal inter-inter cursor-pointer transition-colors ${
                    selectedGender === gender ? "bg-white" : ""
                  }`}
                  onClick={() => setSelectedGender(gender)}
                >
                  {gender}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmploymentTypeContent() {
  return (
    <div className="flex flex-col">
      {/* employee name */}
      <div className="flex flex-col">
        <div className="text-[#32086d] text-[10px] font-normal poppins-thin leading-tight">
          Employee id
        </div>
        <div className="w-[381px] h-[30px] relative mt-[0.313rem]">
          <input
            type="text"
            placeholder="Enter the employee id"
            className="w-full h-full bg-[#daeaff] rounded-md pl-3 text-[#32086d] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none"
          />
        </div>
      </div>

      {/* job title   */}
      <div className="flex flex-col mt-[0.375rem]">
        <div className="text-[#32086d] text-[10px] font-normal poppins-thin leading-tight">
          Date of join
        </div>
        <div className="w-[381px] h-[30px] relative mt-[0.313rem]">
          <input
            type="text"
            placeholder="Enter the date"
            className="w-full h-full bg-[#daeaff] rounded-md pl-3 text-[#32086d] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default AddEmployeeDialogue_Not_In_Use;
