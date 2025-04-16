import { useState, useEffect } from "react";

function DropDown({
  options = [],
  onChange,
  defaultSelectedOptionIndex = 0,
  className = "",
  fieldName = "",
  disabled = false,
  // Button Styling
  buttonBackgroundColor = "#D9E4F2",
  buttonTextColor = "#214768",
  buttonBorder = "none",
  buttonBorderRadius = "0.375rem", // md
  buttonPadding = "0.5rem 0.75rem", // px-3 py-2
  buttonHeight = "auto",
  buttonWidth = "100%",
  buttonMinWidth = "4rem",
  buttonFontSize = "0.875rem", // text-sm
  buttonBoxShadow = "1px 1px 3px 0px #0000001A, 5px 2px 5px 0px #00000017, 10px 5px 7px 0px #0000000D, 18px 10px 8px 0px #00000003, 28px 15px 9px 0px #00000000",
  // Options Styling
  optionsBackgroundColor = "#FFFFFF",
  optionsTextColor = "#214768",
  optionsDisabledTextColor = "#ABAAB9",
  optionsFontSize = "0.75rem", // text-xs
  optionsFontWeight = "500", // font-medium
  optionsPadding = "0.375rem 0.75rem", // py-1.5 px-3
  optionsMaxHeight = "10rem", // max-h-40
  optionsBorder = "none",
  optionsBorderRadius = "0.375rem", // rounded-md
  optionsBoxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  // Dropdown Arrow
  dropdownArrowColor = "#214768",
  dropdownArrowSize = "1rem",
  // Other
  resetFilters = false,
  selectedOption,
}) {
  const [internalSelected, setInternalSelected] = useState(
    options.length > 0 ? options[defaultSelectedOptionIndex]?.value : ""
  );

  // Handle both controlled (selectedOption) and uncontrolled (internalSelected) scenarios
  const currentValue =
    selectedOption?.value !== undefined
      ? selectedOption.value
      : internalSelected;

  useEffect(() => {
    if (resetFilters) {
      const defaultValue =
        options.length > 0 ? options[defaultSelectedOptionIndex]?.value : "";
      setInternalSelected(defaultValue);
    }
  }, [resetFilters, options, defaultSelectedOptionIndex]);

  const handleChange = (event) => {
    const value = event.target.value;
    const selected = options.find((opt) => opt.value === value) || {
      label: "Select",
      value: "",
    };

    setInternalSelected(value);
    if (typeof onChange === "function") {
      onChange(fieldName, value);
    }
  };

  return (
    <select
      className={`${className} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      disabled={disabled}
      value={currentValue}
      onChange={handleChange}
      style={{
        // Button Styles
        backgroundColor: buttonBackgroundColor,
        color: currentValue === "" ? "#21476880" : buttonTextColor,
        border: buttonBorder,
        borderRadius: buttonBorderRadius,
        padding: buttonPadding,
        height: buttonHeight,
        width: buttonWidth,
        minWidth: buttonMinWidth,
        fontSize: buttonFontSize,
        boxShadow: buttonBoxShadow,
        // Dropdown Arrow
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(dropdownArrowColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `right 0.5rem center`,
        backgroundSize: `${dropdownArrowSize}`,
        // Focus State
        outline: "none",
        appearance: "none",
        transition: "all 0.2s ease",
      }}
    >
      {options.map((item, index) => (
        <option
          key={index}
          value={item.value}
          disabled={item?.value === ""}
          style={{
            backgroundColor: optionsBackgroundColor,
            color: item?.value === "" ? optionsDisabledTextColor : optionsTextColor,
            fontSize: optionsFontSize,
            fontWeight: optionsFontWeight,
            padding: optionsPadding,
            border: optionsBorder,
            borderRadius: optionsBorderRadius,
          }}
        >
          {item.label}
        </option>
      ))}
    </select>
  );
}

export default DropDown;