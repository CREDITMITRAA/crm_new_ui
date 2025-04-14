import { useEffect, useState } from "react";
import DropDown from "../../common/dropdowns/DropDown";
import { useSelector } from "react-redux";
import { ROLE_EMPLOYEE } from "../../../utilities/AppConstants";

function FilterDialogueForWalkInsTable({ setFilters, filters, resetFilters }) {
  const { users, userOptions } = useSelector((state) => state.users);
  const { role } = useSelector((state) => state.auth);
  const {isConfirmationDialogueOpened} = useSelector((state)=>state.ui)
  const options = [
    { label: "Filter by status", value: "" },
    { label: "Pending", value: "Pending" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Completed", value: "Completed" },
    { label: "Rescheduled", value: "Rescheduled" },
  ];
  const [employees, setEmployees] = useState([
    { label: "Select employee", value: "" },
  ]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);

  useEffect(() => {
    if (resetFilters) {
      // Reset local state
      setSelectedEmployeeName(null);
      // Reset filters in parent component
      setFilters({
        walk_in_status: "",
        created_by: "",
        // Add any other filter fields you want to reset
      });
    }
  }, [resetFilters]);

  useEffect(() => {
    if (users && users.length > 0) {
      setEmployees([{ label: "Select Employee", value: "" }, ...userOptions]);
    }
  }, [users]);

  function handleFilterChange(name, value) {
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
      {/* Walk-In / Call Status */}
      <div className="col-span-3 w-full h-max relative" style={{zIndex: isConfirmationDialogueOpened && -1}}>
        <div className="w-full h-max bg-[#FFFFFF] rounded-xl border border-[#214768] flex items-center">
          <div className="w-full">
            <DropDown
              options={options}
              onChange={(name, value) =>
                handleFilterChange("walk_in_status", value)
              }
              optionsBackgroundColor="#F4EBFF"
              buttonBackgroundColor="#F4EBFF"
              className={"min-w-full"}
              selectedOption={filters?.walk_in_status || ""}
              resetFilters={resetFilters}
              fieldName="walk_in_status"
              defaultSelectedOptionIndex={!filters.walk_in_status && 0}
              backgroundColor="#F2F7FE"
              textColor="text-[#214768]"
            />
          </div>
        </div>
      </div>

      {/* Employee Name */}
      {role !== ROLE_EMPLOYEE && (
        <div className="col-span-3 w-full h-max relative" style={{zIndex: isConfirmationDialogueOpened && -1}}>
          <div className="w-full h-max bg-[#FFFFFF] rounded-xl border border-[#214768] flex items-center">
            <DropDown
              options={employees}
              onChange={(name, value) =>
                handleFilterChange("created_by", value)
              }
              optionsBackgroundColor="#F4EBFF"
              buttonBackgroundColor="#F4EBFF"
              className={"min-w-full"}
              selectedOption={selectedEmployeeName || ""}
              resetFilters={resetFilters}
              fieldName="created_by"
              defaultSelectedOptionIndex={!filters.created_by && 0}
              backgroundColor="#F2F7FE"
              textColor="text-[#214768]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterDialogueForWalkInsTable;
