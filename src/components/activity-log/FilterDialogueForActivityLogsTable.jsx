import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DropDown from "../common/dropdowns/DropDown";
import DateButton from "../common/DateButton";

function FilterDialogueForActivityLogsTable({
  setFilters,
  filters,
  resetFilters,
}) {
  const { users, userOptions } = useSelector((state) => state.users);
  const {isConfirmationDialogueOpened} = useSelector((state)=>state.ui)
  const [employees, setEmployees] = useState([
    { label: "Filter by employee", value: "" },
  ]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
  useEffect(() => {
    if (users && users.length > 0) {
      setEmployees([{ label: "Select Employee", value: "" }, ...userOptions]);
    }
  }, [users]);

  function employeeNameFilterNameChange(name, value) {
    const user = users.find((user) => user.name === value);
    setFilters((prev) => ({ ...prev, created_by: user?.id }));
    setSelectedEmployeeName(user?.name);
  }
  return (
    <div className="w-full h-max bg-[#E6F4FF] mb-2 p-2 grid grid-cols-12 gap-4 rounded-xl min-w-[36rem]">
      {/* Filter by Employee Name (Input) */}
      <div className="col-span-4 w-full h-max relative" style={{zIndex: isConfirmationDialogueOpened && -1}}>
        <div className="w-full h-max bg-[#F2F7FE] rounded-xl border border-[#214768] flex items-center px-2">
          <input
            type="text"
            className="text-[#214768] text-sm font-normal inter-inter w-full h-full bg-transparent focus:outline-none focus:border-[#4200a0] focus:ring-0 border-none placeholder:text-[#32086d]/50"
            placeholder="Enter lead id"
            value={filters?.lead_id || ""}
            onChange={(e) =>
              setFilters((prev)=>({...prev, lead_id:e.target.value}))
            }
            name="lead_id"
          />
        </div>
      </div>

      {/* Created On (Date Picker) */}
      {/* <div className="col-span-4 w-full h-max relative">
    <div className="w-full h-10 bg-[#F4EBFF] rounded-2xl border border-[#4200a0] justify-center items-center gap-2.5 inline-flex">
      <DateButton
        buttonBackgroundColor="[#F4EBFF]"
        onDateChange={(name, value) => console.log(name, value)}
        fieldName="created"
        placeholder="yyyy-mm-dd"
      />
    </div>
  </div> */}

      {/* Filter By Employee (Dropdown) */}
      <div className="col-span-4 w-full h-max relative" style={{zIndex: isConfirmationDialogueOpened && -1}}>
        <div className="w-full h-max bg-[#F2F7FE] rounded-xl border border-[#214768] flex items-center">
          <DropDown
            options={employees}
            onChange={(name, value) =>
              employeeNameFilterNameChange(name, value)
            }
            optionsBackgroundColor="#F4EBFF"
            buttonBackgroundColor="#F4EBFF"
            className={"min-w-full"}
            selectedOption={selectedEmployeeName}
            resetFilters={resetFilters}
            fieldName="created_by"
            placeholder="Filter By Employee"
            backgroundColor="#F2F7FE"
            textColor="text-[#214768]"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterDialogueForActivityLogsTable;
