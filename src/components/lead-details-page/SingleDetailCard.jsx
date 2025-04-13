import { useState, useEffect } from "react";
import EditIcon from "../icons/EditIcon";
import { useSelector } from "react-redux";
import { formatName } from "../../utilities/utility-functions";

function SingleDetailCard({
  icon,
  name,
  isEditable = false,
  onChange,
  fieldName,
}) {
  const { lead } = useSelector((state) => state.leads);
  const [editField, setEditField] = useState(false);
  const [inputValue, setInputValue] = useState(
    fieldName === "alternate_phones" 
      ? (Array.isArray(lead?.[fieldName]) ? lead[fieldName].join(", ") : "")
      : lead?.[fieldName] || ""
  );

  // Update inputValue when lead changes
  useEffect(() => {
    setInputValue(
      fieldName === "alternate_phones"
        ? (Array.isArray(lead?.[fieldName]) ? lead[fieldName].join(", ") : "")
        : lead?.[fieldName] || ""
    );
  }, [lead, fieldName]);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Transgender", value: "transgender" },
  ];

  const companyCategoryOptions = [
    { label: "SUPER CAT", value: 1 },
    { label: "CAT A", value: 2 },
    { label: "CAT B", value: 3 },
    { label: "CAT C", value: 4 },
    { label: "CAT D", value: 5 },
  ];

  const getOptions = () => {
    if (fieldName === "gender") return genderOptions;
    if (fieldName === "company_category_id") return companyCategoryOptions;
    return [];
  };

  const handleSave = () => {
    setEditField(false);
    let valueToSend = inputValue;
    
    if (fieldName === "alternate_phones") {
      // Split by comma and trim whitespace, then filter out empty strings
      const phonesArray = inputValue
        .split(",")
        .map(phone => phone.trim())
        .filter(phone => phone !== "");
      valueToSend = [...new Set(phonesArray)]; // Remove duplicates
    }
    
    onChange(fieldName, valueToSend);
  };

  const displayValue = fieldName === "alternate_phones"
    ? (Array.isArray(lead?.[fieldName]) 
        ? lead[fieldName].filter(phone => phone).join(", ") || "NA" 
        : "NA")
    : fieldName === "company_category_id"
      ? companyCategoryOptions.find((option) => option.value === Number(inputValue))?.label || "NA"
      : inputValue || "NA";

      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          handleSave();
        }
      };

  return (
    <div className="w-full h-[90px] bg-[#2147682B] rounded-2xl border border-[#214768] p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[#464646] text-[10px] font-semibold poppins-thin leading-tight">
            {name}
          </span>
        </div>
        {isEditable && (
          <div className="w-5 h-5 text-[#4200a0]">
            <EditIcon onClick={() => setEditField(true)} />
          </div>
        )}
      </div>

      <div className="text-[#464646] text-xs font-medium poppins-thin leading-tight w-full">
        {editField ? (
          ["gender", "company_category_id"].includes(fieldName) ? (
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full h-full bg-white rounded-md pl-3 text-[#464646] text-[10px] font-normal inter-inter focus:outline-none"
            >
              <option value="">Select {name}</option>
              {getOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={fieldName === "alternate_phones" ? "text" : "text"}
              value={inputValue}
              name={fieldName}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full h-full bg-white rounded-md pl-3 text-[#464646] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none"
              placeholder={fieldName === "alternate_phones" ? "Comma separated numbers" : name}
            />
          )
        ) : (
          <>{formatName(displayValue)}</>
        )}
      </div>
    </div>
  );
}

export default SingleDetailCard;