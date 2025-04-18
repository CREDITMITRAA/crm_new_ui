import { useEffect, useState } from "react";
import DropDown from "../../common/dropdowns/DropDown";
import { useSelector } from "react-redux";
import {
  CALL_BACK,
  FOLLOW_UP,
  ROLE_EMPLOYEE,
  SCHEDULED_CALL_WITH_MANAGER,
  terminologiesMap,
} from "../../../utilities/AppConstants";

function FilterDialogueForRecentTasksTable({
  setFilters,
  filters,
  resetFilters,
}) {
  const { users, userOptions } = useSelector((state) => state.users);
  const { role } = useSelector((state) => state.auth);
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const taskStatusOptions = [
    { label: "Filter by task status", value: "" },
    { label: "Pending", value: "Pending" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Completed", value: "Completed" },
  ];
  const taskTypeOptions = [
    { label: "Filter by tasks", value: "" },
    { label: terminologiesMap.get(FOLLOW_UP), value: FOLLOW_UP },
    { label: terminologiesMap.get(CALL_BACK), value: CALL_BACK },
    {
      label: terminologiesMap.get(SCHEDULED_CALL_WITH_MANAGER),
      value: SCHEDULED_CALL_WITH_MANAGER,
    },
  ];
  const [employees, setEmployees] = useState([
    { label: "Filter by associate", value: "" },
  ]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
  useEffect(() => {
    if (users && users.length > 0) {
      setEmployees([{ label: "Filter by associate", value: "" }, ...userOptions]);
    }
  }, [users]);

  function employeeNameFilterNameChange(name, value) {
    if (name === "created_by") {
      const user = users.find((user) => user.name === value);
      setFilters((prev) => ({ ...prev, created_by: user?.id }));
      setSelectedEmployeeName(user?.name);
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  }
  return (
    <div className="w-full h-max bg-[#E6F4FF] mb-2 p-2 grid grid-cols-12 gap-4 rounded-xl min-w-[36rem]">
      {/* filter by task type */}
      <div
        className="col-span-3 w-full h-8 relative"
        style={{ zIndex: isConfirmationDialogueOpened && -1 }}
      >
        <div className="w-full h-full bg-[#D4D5D53D] rounded-xl flex items-center">
          {/* <input
              type="text"
              placeholder="Filter By Walk-In / Call Status"
              className="text-[#21044b] text-sm font-normal inter-inter w-full h-full bg-transparent focus:outline-none focus:border-[#4200a0] focus:ring-0 border-none placeholder:text-[#32086d]/50"
            /> */}
          <div className="w-full">
            <DropDown
              options={taskTypeOptions}
              onChange={(name, value) =>
                employeeNameFilterNameChange(name, value)
              }
              optionsBackgroundColor="#B7B7B700"
              buttonBackgroundColor="#B7B7B700"
              className={"min-w-full"}
              selectedOption={filters?.task_type}
              resetFilters={resetFilters}
              fieldName="task_type"
              backgroundColor="#F2F7FE"
              textColor="text-[#214768]"
              buttonBorder="1px solid #214768"
              buttonBorderRadius="0.8rem"
              buttonHeight="100%"
              optionsTextColor="#464646"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* filter by task status */}
      <div
        className="col-span-3 w-full h-8 relative"
        style={{ zIndex: isConfirmationDialogueOpened && -1 }}
      >
        <div className="w-full bg-[#D4D5D53D] h-full rounded-xl flex items-center">
          {/* <input
              type="text"
              placeholder="Filter By Walk-In / Call Status"
              className="text-[#21044b] text-sm font-normal inter-inter w-full h-full bg-transparent focus:outline-none focus:border-[#4200a0] focus:ring-0 border-none placeholder:text-[#32086d]/50"
            /> */}
          <div className="w-full ">
            <DropDown
              options={taskStatusOptions}
              onChange={(name, value) =>
                employeeNameFilterNameChange(name, value)
              }
              optionsBackgroundColor="#B7B7B700"
              buttonBackgroundColor="#B7B7B700"
              className={"min-w-full"}
              selectedOption={filters?.task_status}
              resetFilters={resetFilters}
              fieldName="task_status"
              backgroundColor="#F2F7FE"
              textColor="text-[#214768]"
              buttonBorder="1px solid #214768"
              buttonBorderRadius="0.8rem"
              buttonHeight="100%"
              optionsTextColor="#464646"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Employee Name */}
      {role !== ROLE_EMPLOYEE && (
        <div
          className="col-span-3 w-full h-8 relative"
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
              backgroundColor="#F2F7FE"
              textColor="text-[#214768]"
              buttonBorder="1px solid #214768"
              buttonBorderRadius="0.8rem"
              buttonHeight="100%"
              optionsTextColor="#464646"
              size="sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterDialogueForRecentTasksTable;
