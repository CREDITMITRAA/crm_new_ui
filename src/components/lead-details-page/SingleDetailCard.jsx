import { useState, useEffect, useRef } from "react";
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
      ? Array.isArray(lead?.[fieldName])
        ? lead[fieldName].join(", ")
        : ""
      : lead?.[fieldName] || ""
  );
  const [otherBureauName, setOtherBureauName] = useState(lead?.other_bureau_name || "");
  const [bureauScore, setBureauScore] = useState(lead?.bureau_score || "");
  const [isEditingBureau, setIsEditingBureau] = useState(false);
  const containerRef = useRef(null);

  // Update inputValue when lead changes
  useEffect(() => {
    setInputValue(
      fieldName === "alternate_phones"
        ? Array.isArray(lead?.[fieldName])
          ? lead[fieldName].join(", ")
          : ""
        : lead?.[fieldName] || ""
    );
    setOtherBureauName(lead?.other_bureau_name || "");
    setBureauScore(lead?.bureau_score || "");
  }, [lead, fieldName]);

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (isEditingBureau) {
          handleSave();
          setIsEditingBureau(false);
        } else if (editField) {
          handleSave();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingBureau, editField, inputValue, otherBureauName, bureauScore]);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "others" },
  ];

  const companyCategoryOptions = [
    { label: "SUPER CAT", value: 1 },
    { label: "CAT A", value: 2 },
    { label: "CAT B", value: 3 },
    { label: "CAT C", value: 4 },
    { label: "CAT D", value: 5 },
  ];

  const bureauNameOptions = [
    { label: "CIBIL", value: "CIBIL" },
    { label: "EXPERION", value: "EXPERION" },
    { label: "CRIF", value: "CRIF" },
    { label: "OTHERS", value: "OTHERS" }
  ];

  const getOptions = () => {
    if (fieldName === "gender") return genderOptions;
    if (fieldName === "company_category_id") return companyCategoryOptions;
    if (fieldName === "bureau") return bureauNameOptions;
    return [];
  };

  const handleBureauSelect = (e) => {
    setInputValue(e.target.value);
    if (fieldName === "bureau") {
      setIsEditingBureau(true);
    }
  };

  const handleSave = () => {
    if (!editField) return;
    
    setEditField(false);
    setIsEditingBureau(false);
    
    let valueToSend = inputValue;

    if (fieldName === "alternate_phones") {
      const phonesArray = inputValue
        .split(",")
        .map((phone) => phone.trim())
        .filter((phone) => phone !== "");
      valueToSend = [...new Set(phonesArray)];
    }

    if (fieldName === "bureau") {
      onChange(fieldName, {
        bureau_name: inputValue === "OTHERS" ? otherBureauName : inputValue,
        bureau_score: bureauScore
      });
    } else {
      onChange(fieldName, valueToSend);
    }
  };

  const displayValue =
    fieldName === "alternate_phones"
      ? Array.isArray(lead?.[fieldName])
        ? lead[fieldName].filter((phone) => phone).join(", ") || "NA"
        : "NA"
      : fieldName === "company_category_id"
      ? companyCategoryOptions.find(
          (option) => option.value === Number(inputValue)
        )?.label || "NA"
      : fieldName === "bureau"
      ? (lead?.bereau_name) || "NA"
      : inputValue || "NA";

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div 
      className="w-full bg-[#2147682B] rounded-2xl border border-[#214768] p-4 flex flex-col justify-between"
      ref={containerRef}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[#464646] text-[10px] font-semibold poppins-thin leading-tight">
            {name}
          </span>
        </div>
        {isEditable && (
          <div className="w-5 h-5 text-[#4200a0]">
            <EditIcon onClick={() => {
              setEditField(true);
              if (fieldName === "bureau") {
                setIsEditingBureau(true);
              }
            }} />
          </div>
        )}
      </div>

      <div className="text-[#464646] text-xs font-medium poppins-thin leading-tight w-full">
        {editField ? (
          ["gender", "company_category_id", "bureau"].includes(fieldName) ? (
            <div className="space-y-2">
              <div className="relative w-full h-8">
                <select
                  value={inputValue}
                  onChange={handleBureauSelect}
                  onBlur={fieldName === "bureau" ? undefined : handleSave}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full h-full bg-[#D9E4F2] rounded-md pl-3 pr-6 text-[#464646] text-[10px] font-normal inter-inter focus:outline-none border border-gray-300 appearance-none leading-none"
                >
                  <option value="">Select {fieldName === "bureau" ? "Bureau" : name}</option>
                  {getOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {fieldName === "bureau" && inputValue === "OTHERS" && (
                <input
                  type="text"
                  value={otherBureauName}
                  onChange={(e) => setOtherBureauName(e.target.value)}
                  onBlur={isEditingBureau ? undefined : handleSave}
                  onKeyDown={handleKeyDown}
                  autoFocus={inputValue === "OTHERS"}
                  className="w-full h-8 bg-[#D9E4F2] rounded-md px-3 text-[#464646] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none border border-gray-300 leading-[32px]"
                  placeholder="Enter Bureau Name"
                />
              )}
              
              {fieldName === "bureau" && inputValue && (
                <input
                  type="number"
                  value={bureauScore}
                  onChange={(e) => setBureauScore(e.target.value)}
                  onBlur={isEditingBureau ? undefined : handleSave}
                  onKeyDown={handleKeyDown}
                  autoFocus={inputValue !== "OTHERS"}
                  className="w-full h-8 bg-[#D9E4F2] rounded-md px-3 text-[#464646] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none border border-gray-300 leading-[32px]"
                  placeholder="Enter Score"
                />
              )}

              {fieldName === "bureau" && isEditingBureau && (
                <div className="flex justify-end gap-2 pt-1">
                  <button 
                    onClick={() => {
                      setEditField(false);
                      setIsEditingBureau(false);
                    }}
                    className="text-[#464646] text-[10px] px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="bg-[#4200a0] text-white text-[10px] px-2 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ) : (
            <input
              type={fieldName === "alternate_phones" ? "text" : "text"}
              value={inputValue}
              name={fieldName}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full h-8 bg-[#D9E4F2] rounded-md px-3 text-[#464646] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#32086d] focus:outline-none border border-gray-300 leading-[32px]"
              placeholder={
                fieldName === "alternate_phones" ? "Enter number" : name
              }
            />
          )
        ) : (
          <div className="space-y-1">
            <div>{formatName(displayValue)}</div>
            {fieldName === "bureau" && lead?.bereau_score && (
              <div className="text-[#464646] text-xs">
                Score: {lead.bereau_score}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleDetailCard;