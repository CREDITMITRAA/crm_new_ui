import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import DownArrowIcon from "../../icons/DownArrowIcon";
import { useSelector } from "react-redux";

function DropDown({
  options = [],
  onChange,
  defaultSelectedOptionIndex = 0,
  className = "",
  fieldName = '',
  disabled = false,
  backgroundColor = 'bg-white',
  textColor = 'text-[#32086d]/50',
  buttonClassName = '',
  optionTextColor = 'text-[#464646]',
  optionHoverColor = 'bg-blue-100',
  dropdownClassName = '',
  cursor = 'cursor-pointer',
  resetFilters = false, // Add resetFilters prop
  optionsBackgroundColor="bg-white"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.length > 0 ? options[defaultSelectedOptionIndex] : { label: "Select", value: "" }
  );
  const {isConfirmationDialogueOpened} = useSelector((state)=>state.ui)

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Add useEffect to handle resetFilters
  useEffect(() => {
    if (resetFilters) {
      setSelectedOption(options.length > 0 ? options[defaultSelectedOptionIndex] : { label: "Select", value: "" });
    }
  }, [resetFilters, options, defaultSelectedOptionIndex]);

  const toggleDropdown = (event) => {
    if (disabled) return;
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option, event) => {
    event.stopPropagation();
    setSelectedOption(option);
    setIsOpen(false);
    if (typeof onChange === "function") {
      onChange(fieldName, option.value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`${!isConfirmationDialogueOpened && 'relative'} inter-inter inline-block w-full ${className}`}>
      {/* Dropdown Button */}
      <div
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`
          border px-3 py-2 flex justify-between items-center w-full
          min-w-[50px] rounded-xl ${backgroundColor} ${textColor} 
          ${buttonClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : cursor}
          transition-colors duration-200 hover:${disabled ? '' : 'brightness-95'}
        `}
        disabled={disabled}
        style={{backgroundColor: backgroundColor}}
      >
        <span className={`text-sm mr-1 ${textColor}`}>{selectedOption?.label}</span>
        <div className={`transform transition-transform duration-300 ${isOpen ? "-rotate-180" : "rotate-0"}`} style={{zIndex: isConfirmationDialogueOpened && -1}}>
          <DownArrowIcon className={textColor} />
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className={`
            absolute w-max border border-gray-300 rounded-md shadow-lg bg-white 
            z-50 max-h-40 h-max overflow-y-auto ${dropdownClassName}
          `}
          style={{width:"inherit"}}
        >
          {options.map((item, index) => (
            <div
              key={index}
              onClick={(event) => handleSelect(item, event)}
              className={`
                px-3 py-1.5 text-xs font-medium transition-colors 
                border-b border-gray-300 last:border-none ${item?.value === "" ? 'text-[#ABAAB9]' : `${optionTextColor}`} 
                hover:${optionHoverColor} ${cursor}
              `}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropDown;