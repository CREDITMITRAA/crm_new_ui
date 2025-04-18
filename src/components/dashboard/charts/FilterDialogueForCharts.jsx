import { useEffect, useState } from "react";
import DropDown from "../../common/dropdowns/DropDown";
import { useSelector } from "react-redux";

function FilterDialogueForCharts({ setFilters, filters, resetFilters }) {
  const { users, userOptions } = useSelector((state) => state.users);
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  
  const [employees, setEmployees] = useState([
    { label: "Filter by associate", value: "" },
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState(""); // Store the selected value, not name

  useEffect(() => {
    if (resetFilters) {
      // Reset local state
      setSelectedEmployee("");
      // Reset filters in parent component
      setFilters({});
    }
  }, [resetFilters]);

  useEffect(() => {
    if (users && users.length > 0) {
      setEmployees([
        { label: "Filter by associate", value: "" },
        ...userOptions,
      ]);
    }
  }, [users]);

  // Set the selected employee when filters change (e.g., when initial filters are loaded)
  useEffect(() => {
    if (filters.created_by) {
      const user = users.find((user) => user.id === filters.created_by);
      if (user) {
        setSelectedEmployee(user.name);
      }
    }
  }, [filters.created_by, users]);

  function handleFilterChange(name, value) {
    if (name === 'created_by') {
      const user = users.find((user) => user.name === value);
      setFilters((prev) => ({ ...prev, created_by: user?.id }));
      setSelectedEmployee(value); // Set the selected name directly
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  }

  return (
    <div className="w-full h-max bg-[#E6F4FF] mb-2 p-2 grid grid-cols-12 gap-4 rounded-xl min-w-[36rem]">
      <div className={`col-span-3 w-full h-10 relative`} style={{zIndex: isConfirmationDialogueOpened && -1}}>
        <div className="w-full h-full rounded-xl flex items-center">
          <DropDown
            options={employees}
            onChange={(name, value) => handleFilterChange('created_by', value)}
            optionsBackgroundColor="bg-[#F2F7FE]"
            buttonBackgroundColor="#F2F7FE"
            className={"min-w-full"}
            selectedOption={{ label: selectedEmployee || "Select Employee", value: selectedEmployee }}
            resetFilters={resetFilters}
            fieldName="created_by"
            backgroundColor="#F2F7FE"
            optionTextColor="#464646"
            textColor="text-[#214768]"
            buttonBorder="1px solid #214768"
            buttonBorderRadius="0.8rem"
            buttonHeight="100%"
            optionsTextColor="#464646"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterDialogueForCharts;