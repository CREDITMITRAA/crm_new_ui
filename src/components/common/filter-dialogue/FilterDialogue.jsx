import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "../dropdowns/DropDown";
import { getUsersNameAndId } from "../../../features/users/usersThunks";
import DateButton from "../DateButton";
import { formatDatePayload } from "../../../utilities/utility-functions";
import {
  BUSY,
  CALL_BACK,
  FOLLOW_UP,
  INTERESTED,
  NOT_CONTACTED,
  NOT_INTERESTED,
  NOT_POSSIBLE,
  NOT_WORKING_NOT_REACHABLE,
  RNR_RING_NO_RESPONSE,
  ROLE_EMPLOYEE,
  SCHEDULED_CALL_WITH_MANAGER,
  SCHEDULED_FOR_WALK_IN,
  SWITCHED_OFF,
  terminologiesMap,
  VERIFICATION_1,
} from "../../../utilities/AppConstants";

function FilterDialogue({ resetFilters, setFilters, filters }) {
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState([
    { label: "Filter by employee name", value: "" },
  ]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
  const { users, userOptions } = useSelector((state) => state.users);
  const { leadSources } = useSelector((state) => state.leads);
  const { role } = useSelector((state) => state.auth);
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const [leadStatusOptions, setLeadStatusOptions] = useState([
    { label: "Filter by status", value: "" },
    { label: terminologiesMap.get(NOT_CONTACTED), value: NOT_CONTACTED },
    { label: terminologiesMap.get(INTERESTED), value: INTERESTED },
    { label: terminologiesMap.get(FOLLOW_UP), value: FOLLOW_UP },
    { label: terminologiesMap.get(CALL_BACK), value: CALL_BACK },
    {
      label: terminologiesMap.get(RNR_RING_NO_RESPONSE),
      value: RNR_RING_NO_RESPONSE,
    },
    { label: terminologiesMap.get(SWITCHED_OFF), value: SWITCHED_OFF },
    { label: terminologiesMap.get(BUSY), value: BUSY },
    { label: terminologiesMap.get(NOT_INTERESTED), value: NOT_INTERESTED },
    {
      label: terminologiesMap.get(NOT_WORKING_NOT_REACHABLE),
      value: NOT_WORKING_NOT_REACHABLE,
    },
    { label: terminologiesMap.get(NOT_POSSIBLE), value: NOT_POSSIBLE },
    {
      label: terminologiesMap.get(SCHEDULED_FOR_WALK_IN),
      value: SCHEDULED_FOR_WALK_IN,
    },
    { label: terminologiesMap.get(VERIFICATION_1), value: VERIFICATION_1 },
    {
      label: terminologiesMap.get(SCHEDULED_CALL_WITH_MANAGER),
      value: SCHEDULED_CALL_WITH_MANAGER,
    },
  ]);
  const [leadSourceOptions, setLeadSourceOptions] = useState([
    { label: "Select lead source", value: "" },
  ]);

  useEffect(() => {
    if (users && users.length > 0) {
      setEmployees([{ label: "Select Employee", value: "" }, ...userOptions]);
    } else {
      dispatch(getUsersNameAndId());
    }
  }, [users]);

  useEffect(() => {
    setLeadSourceOptions([
      { label: "Select Lead Source", value: "" },
      ...leadSources,
    ]);
  }, [leadSources]);

  function handleSelect(name, value) {
    switch (name) {
      case "assigned_to":
        const user = users.find((user) => user.name === value);
        setFilters((prev) => ({ ...prev, assigned_to: user?.id }));
        setSelectedEmployeeName(user?.name);
        break;

      case "lead_status":
        setFilters((prev) => ({ ...prev, lead_status: value }));
        break;

      case "lead_source":
        setFilters((prev) => ({ ...prev, lead_source: value }));
    }
  }

  function handleDateChange(fieldName, data) {
    console.log("selected dates = ", data);
    const date_time_range_filter = formatDatePayload(data);
    const payload = {
      [fieldName]:
        date_time_range_filter.date ?? date_time_range_filter.date_time_range,
    };

    setFilters((prev) => ({ ...prev, ...payload }));
  }

  return (
    <div
      className="w-full h-max bg-[#E6F4FF] mt-4 p-4 grid grid-cols-12 gap-2 rounded-xl"
      style={{ zIndex: isConfirmationDialogueOpened && -1 }}
    >
      {/* lead id */}
      <div className="col-span-3 w-full h-10">
        <div className="w-full h-full bg-[#F2F7FE] rounded-xl border border-[#214768] flex items-center justify-start pl-0">
          <input
            type="text"
            name="leadId"
            value={filters?.leadId || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, leadId: e.target.value }))
            }
            placeholder="Filter by id"
            className="text-[#214768] text-sm font-normal inter-inter w-full h-full bg-transparent focus:outline-none focus:border-[#4200a0] focus:ring-0 border-none placeholder:text-[#214768]/50"
          />
        </div>
      </div>

      {/* phone no */}
      <div className="col-span-3 w-full h-10">
        <div className="w-full h-full bg-[#F2F7FE] rounded-xl border border-[#214768] flex items-center justify-start pl-0">
          <input
            type="text"
            name="phone"
            value={filters?.phone || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Filter by phone"
            className="text-[#214768] text-sm font-normal inter-inter w-full h-full bg-transparent focus:outline-none focus:border-[#4200a0] focus:ring-0 border-none placeholder:text-[#214768]/50"
          />
        </div>
      </div>

      {/* lead name */}
      <div className="col-span-3 w-full h-10">
        <div className="w-full h-full bg-[#F2F7FE] rounded-xl border border-[#214768] flex items-center justify-start pl-0">
          <input
            type="text"
            name="name"
            value={filters?.name || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Filter by lead name"
            className="text-[#214768] text-sm font-normal inter-inter w-full h-full bg-transparent focus:outline-none focus:border-[#4200a0] focus:ring-0 border-none placeholder:text-[#214768]/50"
          />
        </div>
      </div>

      {/* lead source */}
      <div className="col-span-3 w-full h-10">
        <div className="w-full h-full bg-[#F2F7FE] rounded-xl flex items-center justify-start pl-0">
          <DropDown
            options={leadSourceOptions}
            onChange={(name, value) => handleSelect(name, value)}
            optionsBackgroundColor="#F2F7FE"
            buttonBackgroundColor="#F2F7FE"
            className={"min-w-full"}
            selectedOption={selectedEmployeeName}
            resetFilters={resetFilters}
            fieldName="lead_source"
            autoSuggestOptions={true}
            backgroundColor="#F2F7FE"
            textColor="text-[#214768]"
            buttonBorder="1px solid #214768"
            buttonBorderRadius="0.8rem"
            buttonHeight="100%"
            optionsTextColor="#464646"
          />
        </div>
      </div>

      {/* Employee name */}
      {role !== ROLE_EMPLOYEE && (
        <div className="col-span-3 w-full h-10 mt-4">
          <div className="w-full h-full bg-[#F2F7FE] rounded-xl flex items-center">
            <DropDown
              options={employees}
              onChange={(name, value) => handleSelect(name, value)}
              optionsBackgroundColor="#F2F7FE"
              buttonBackgroundColor="#F2F7FE"
              className={"min-w-full"}
              selectedOption={selectedEmployeeName}
              resetFilters={resetFilters}
              fieldName="assigned_to"
              backgroundColor="#F2F7FE"
              textColor="text-[#214768]"
              buttonBorder="1px solid #214768"
              buttonBorderRadius="0.8rem"
              buttonHeight="100%"
              optionsTextColor="#464646"
            />
          </div>
        </div>
      )}

      {/* lead status */}
      <div className="col-span-3 w-full h-10 mt-4">
        <div className="w-full h-full bg-[#F2F7FE] rounded-xl flex items-center">
          <DropDown
            options={leadStatusOptions}
            onChange={(name, value) => handleSelect(name, value)}
            optionsBackgroundColor="#F2F7FE"
            buttonBackgroundColor="#F2F7FE"
            className={"min-w-full"}
            selectedOption={selectedEmployeeName}
            resetFilters={resetFilters}
            fieldName="lead_status"
            backgroundColor="#F2F7FE"
            textColor="text-[#214768]"
            buttonBorder="1px solid #214768"
            buttonBorderRadius="0.8rem"
            buttonHeight="100%"
            optionsTextColor="#464646"
          />
        </div>
      </div>

      {/* assigned on */}
      <div className="col-span-3 flex flex-col">
        <div className="text-[#214768] text-xs font-normal poppins-thin leading-none tracking-tight">
          Assigned on
        </div>
        <div className="w-full h-10 rounded-2xl border border-[#214768] justify-center items-center gap-2.5 inline-flex mt-[0.325rem]">
          <DateButton
            buttonBackgroundColor="[#F2F7FE]"
            onDateChange={(fieldName, value) =>
              handleDateChange(fieldName, value)
            }
            fieldName="assigned_on"
            resetFilters={resetFilters}
            fromFilter={true}
          />
        </div>
      </div>

      {/* imported on */}
      {/* <div className="col-span-4 flex flex-col">
        <div className="text-[#214768] text-xs font-normal poppins-thin leading-none tracking-tight">
          Imported On
        </div>
        <div className="w-full h-10 bg-[#FFFFFF] rounded-2xl border border-[#214768] justify-center items-center gap-2.5 inline-flex mt-[0.325rem]">
          <DateButton
            buttonBackgroundColor="[#FFFFFF]"
            onDateChange={(fieldName, value) =>
              handleDateChange(fieldName, value)
            }
            fieldName="importedOn"
            resetFilters={resetFilters}
          />
        </div>
      </div> */}

      {/* last updated on */}
      <div className="col-span-3 flex flex-col">
        <div className="text-[#214768] text-xs font-normal poppins-thin leading-none tracking-tight">
          last updated on
        </div>
        <div className="w-full h-10 bg-[#FFFFFF] rounded-2xl border border-[#214768] justify-center items-center gap-2.5 inline-flex mt-[0.325rem]">
          <DateButton
            buttonBackgroundColor="[#F2F7FE]"
            onDateChange={(fieldName, value) =>
              handleDateChange(fieldName, value)
            }
            fieldName="last_updated"
            resetFilters={resetFilters}
            fromFilter={true}
          />
        </div>
      </div>

      {/* <div className="col-span-12 flex justify-between"> */}
      {/* clear button */}
      {/* <div className="h-[26px] px-5 py-[5px] rounded-[30px] border border-[#4200a0] justify-center items-center gap-2.5 inline-flex">
          <div data-svg-wrapper className="relative">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0484 13.5875L13.2203 8.8125H13.5C13.725 8.8125 13.9062 8.63125 13.9062 8.40625V5.40625C13.9062 5.18125 13.725 5 13.5 5H9.65625V2.15625C9.65625 1.93125 9.475 1.75 9.25 1.75H6.75C6.525 1.75 6.34375 1.93125 6.34375 2.15625V5H2.5C2.275 5 2.09375 5.18125 2.09375 5.40625V8.40625C2.09375 8.63125 2.275 8.8125 2.5 8.8125H2.77969L1.95156 13.5875C1.94688 13.6109 1.94531 13.6344 1.94531 13.6562C1.94531 13.8813 2.12656 14.0625 2.35156 14.0625H13.6484C13.6719 14.0625 13.6953 14.0609 13.7172 14.0562C13.9391 14.0187 14.0875 13.8078 14.0484 13.5875ZM3.1875 6.09375H7.4375V2.84375H8.5625V6.09375H12.8125V7.71875H3.1875V6.09375ZM10.5 12.9688V10.5312C10.5 10.4625 10.4438 10.4062 10.375 10.4062H9.625C9.55625 10.4062 9.5 10.4625 9.5 10.5312V12.9688H6.5V10.5312C6.5 10.4625 6.44375 10.4062 6.375 10.4062H5.625C5.55625 10.4062 5.5 10.4625 5.5 10.5312V12.9688H3.16875L3.87344 8.90625H12.125L12.8297 12.9688H10.5Z"
                fill="#4300A0"
              />
            </svg>
          </div>
          <div className="text-[#4200a0] text-xs font-semibold inter-inter leading-3 tracking-tight">
            Clear
          </div>
        </div> */}

      {/* submit button */}
      {/* <div className="h-[26px] px-5 py-[5px] bg-[#4200a0] rounded-[30px] border justify-center items-center gap-2.5 inline-flex">
          <div data-svg-wrapper className="relative">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.2502 8.75005C13.7502 11.25 11.8652 13.604 9.22022 14.13C7.93022 14.3869 6.59204 14.2303 5.39623 13.6824C4.20042 13.1346 3.20794 12.2234 2.56012 11.0786C1.91229 9.93389 1.64214 8.61393 1.78813 7.30672C1.93413 5.99951 2.48882 4.77167 3.37322 3.79805C5.18722 1.80005 8.25022 1.25005 10.7502 2.25005"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.75 7.75L8.25 10.25L14.25 3.75"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div className="text-white text-xs font-semibold inter-inter leading-3 tracking-tight">
            Submit
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}

export default FilterDialogue;
