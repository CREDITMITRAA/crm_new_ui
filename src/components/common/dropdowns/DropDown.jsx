import { useState, useEffect } from "react";

function DropDown({
  options = [],
  onChange,
  defaultSelectedOptionIndex = 0,
  className = "",
  fieldName = "",
  disabled = false,
  size = "md", // 'sm' for h-8 (32px), 'md' for h-10 (40px)
  // Button Styling
  buttonBackgroundColor = "#D9E4F2",
  buttonTextColor = "#214768",
  buttonBorder = "none",
  buttonBorderRadius = "0.375rem",
  buttonWidth = "100%",
  buttonMinWidth = "4rem",
  buttonFontSize = "0.75rem",
  buttonBoxShadow = "1px 1px 3px 0px #0000001A, 5px 2px 5px 0px #00000017, 10px 5px 7px 0px #0000000D, 18px 10px 8px 0px #00000003, 28px 15px 9px 0px #00000000",
  // Options Styling
  optionsBackgroundColor = "#FF0000",
  optionsTextColor = "#214768",
  optionsDisabledTextColor = "#ABAAB9",
  optionsFontSize = "0.75rem",
  optionsFontWeight = "500",
  optionsPadding = "0.375rem 0.75rem",
  optionsMaxHeight = "10rem",
  optionsBorder = "none",
  optionsBorderRadius = "0.375rem",
  optionsBoxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  // Dropdown Arrow
  dropdownArrowColor = "#214768",
  dropdownArrowSize = "1rem",
  // Other
  resetFilters = false,
  selectedOption,
  shouldFirstOptionDisabled=true
}) {
  // Size configuration
  const sizeConfig = {
    sm: {
      height: "2rem", // h-8 (32px)
      padding: "0.25rem 0.5rem",
      lineHeight: "1.5rem",
    },
    md: {
      height: "2.5rem", // h-10 (40px)
      padding: "0.5rem 0.75rem",
      lineHeight: "2rem",
    },
  };
  console.log('options = ',options[defaultSelectedOptionIndex]?.value )
  const [internalSelected, setInternalSelected] = useState(
    options.length > 0 ? options[defaultSelectedOptionIndex]?.value : ""
  );

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
      className={`outline-none ring-0 focus:ring-0 focus:outline-none ${className} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      disabled={disabled}
      value={currentValue}
      onChange={handleChange}
      style={{
        // Button Styles
        backgroundColor: buttonBackgroundColor,
        color: currentValue === "" ? "#21476880" : buttonTextColor,
        border: buttonBorder,
        borderRadius: buttonBorderRadius,
        padding: sizeConfig[size].padding,
        height: sizeConfig[size].height,
        lineHeight: sizeConfig[size].lineHeight,
        width: buttonWidth,
        minWidth: buttonMinWidth,
        fontSize: buttonFontSize,
        // boxShadow: buttonBoxShadow,
        // Text overflow
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
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
          disabled={shouldFirstOptionDisabled && item?.value === ""}
          style={{
            backgroundColor: "#D9E4F2",
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