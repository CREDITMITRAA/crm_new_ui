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
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const [employees, setEmployees] = useState([
    { label: "Filter by associate", value: "" },
  ]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
  useEffect(() => {
    if (users && users.length > 0) {
      setEmployees([
        { label: "Filter by associate", value: "" },
        ...userOptions,
      ]);
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
      <div
        className="col-span-4 w-full h-8 relative"
        style={{ zIndex: isConfirmationDialogueOpened && -1 }}
      >
        <div className="w-full h-full bg-[#D4D5D53D] rounded-xl border border-[#214768] flex items-center px-2">
          <input
            type="text"
            className="text-[#214768] text-xs font-normal inter-inter w-full h-full bg-transparent focus:outline-none focus:border-[#4200a0] focus:ring-0 border-none placeholder:text-[#214768]/50"
            placeholder="Enter lead ID"
            value={filters?.lead_id || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, lead_id: e.target.value }))
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

      {/* Filter by Lead Name */}
      <div
        className="col-span-4 w-full h-8 relative"
        style={{ zIndex: isConfirmationDialogueOpened && -1 }}
      >
        <div className="w-full h-full bg-[#D4D5D53D] rounded-xl border border-[#214768] flex items-center px-2">
          <input
            type="text"
            className="text-[#214768] text-xs font-normal inter-inter w-full h-full bg-transparent focus:outline-none focus:border-[#4200a0] focus:ring-0 border-none placeholder:text-[#214768]/50"
            placeholder="Enter lead name"
            value={filters?.lead_name || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, lead_name: e.target.value }))
            }
            name="lead_id"
          />
        </div>
      </div>

      {/* Filter By Employee (Dropdown) */}
      <div
        className="col-span-4 w-full h-8 relative"
        style={{ zIndex: isConfirmationDialogueOpened && -1 }}
      >
        <div className="w-full h-full bg-[#D4D5D53D] rounded-xl flex items-center">
          <DropDown
            options={employees}
            onChange={(name, value) =>
              employeeNameFilterNameChange(name, value)
            }
            optionsBackgroundColor="#B7B7B700"
            buttonBackgroundColor="#B7B7B700"
            className={"min-w-full"}
            selectedOption={selectedEmployeeName}
            resetFilters={resetFilters}
            fieldName="created_by"
            placeholder="Filter By Employee"
            backgroundColor="#F2F7FE"
            textColor="text-[#214768]"
            buttonBorder="1px solid #214768"
            buttonBorderRadius="0.8rem"
            buttonHeight="100%"
            optionsTextColor="#464646"
            size="sm"
            shouldFirstOptionDisabled={false}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterDialogueForActivityLogsTable;
