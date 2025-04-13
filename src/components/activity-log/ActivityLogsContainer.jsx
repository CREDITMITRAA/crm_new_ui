import moment from "moment";
import {
  formatName,
  formatTimeTo12Hour,
} from "../../utilities/utility-functions";
import LeadNavigationIcon from "../icons/LeadNavigationIcon";
import { terminologiesMap } from "../../utilities/AppConstants";
import { useSelector } from "react-redux";
import { useState } from "react";

function ActivityLogsContainer({
  activityLogs = [],
  userMap,
  fromTable = false,
}) {
  console.log("user map = ", userMap);

  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (leadId, time) => {
    const key = `${leadId}-${time}`;
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col bg-[#E8EFF8] rounded-2xl px-4 py-4">
      {Object.entries(activityLogs).map(([date, timeGroups]) => (
        <div key={date}>
          {/* Date section */}
          <div className="flex justify-start items-center">
            <span className="text-[#29343E] text-base font-semibold poppins-thin">
              Date :{" "}
            </span>
            <span className="text-[#29343E] text-base font-semibold poppins-thin">
              {date}
            </span>
          </div>

          {/* Iterate over time groups */}
          {Object.entries(timeGroups).map(([time, createdByGroups]) => (
            <div key={time}>
              {/* Iterate over created_by groups */}
              {Object.entries(createdByGroups).map(
                ([createdBy, leadIdGroups]) => (
                  <div key={createdBy}>
                    {/* Content section container */}
                    <div className="flex justify-start mx-4 bg-[#E8EFF8] h-max py-2.5">
                      {/* Left section */}
                      <div
                        className="relative flex flex-col items-start rounded-tr-2xl border-t border-[#0c5d00] pr-6 pt-2"
                        style={{
                          zIndex: fromTable
                            ? !isConfirmationDialogueOpened
                            : isConfirmationDialogueOpened
                            ? -1
                            : 1,
                        }}
                      >
                        {/* Time */}
                        <div className=" w-max px-2.5 py-[2px] bg-[#00000017] rounded-[40px] inline-flex justify-center items-center gap-2.5">
                          <div className="relative justify-start text-[#000000] text-xs font-medium poppins-thin">
                            {moment(time, "HH:mm:ss DD-MM-YYYY").isValid()
                              ? moment(time, "HH:mm:ss DD-MM-YYYY")
                                  .utcOffset(660)
                                  .format("hh:mm A")
                              : "Invalid Time"}
                          </div>
                        </div>
                        {/* Employee name */}
                        <div
                          className={`h-[18px] w-max px-2.5 rounded-[30px] border ${
                            userMap.get(Number(createdBy))?.role_id === 1
                              ? "border-[#E7710F]"
                              : userMap.get(Number(createdBy))?.role_id === 2
                              ? "border-[#114F00]"
                              : "border-[#02AAC4]"
                          } inline-flex justify-center items-center gap-2.5 mt-2 bg-[#5D5D5D]`}
                        >
                          <div className="relative justify-start text-[#FFFFFF] text-xs font-medium poppins-thin">
                            {formatName(userMap.get(Number(createdBy))?.name) ||
                              "Unknown"}
                          </div>
                        </div>
                      </div>

                      {/* Right section */}
                      <div className="flex flex-col flex-grow rounded-bl-2xl border-b border-[#0c5d00] py-3.5">
                        <div className="flex flex-col pl-4 border-l border-[#0c5d00]">
                          {/* Iterate over lead_id groups */}
                          {Object.entries(leadIdGroups).map(
                            ([leadId, logs]) => {
                              const itemKey = `${leadId}-${time}`;
                              const isExpanded =
                                expandedItems[itemKey] || false;

                              return (
                                <div key={itemKey} className="mb-1">
                                  {/* Lead name and dropdown toggle */}
                                  <div className="flex items-center gap-2">
                                    <div className="h-[21px] w-max px-2.5 bg-[#7BC2FF69] rounded-[20px] border border-[#969696] inline-flex items-center justify-center gap-1">
                                      <div className="text-[#425565] text-xs font-normal poppins-thin">
                                        {formatName(logs[0].lead_name)}
                                      </div>
                                      <div className="w-5 h-5 flex items-center justify-center">
                                        <LeadNavigationIcon />
                                      </div>
                                    </div>
                                    <div
                                      onClick={() => toggleItem(leadId, time)}
                                      className="text-[#425565] hover:text-[#114F00] transition-colors cursor-pointer"
                                    >
                                      <svg
                                        className={`w-5 h-5 transition-transform duration-300 ${
                                          isExpanded ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </div>
                                  </div>

                                  {/* Log text with smooth transition */}
                                  <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                      isExpanded
                                        ? "max-h-[500px] opacity-100"
                                        : "max-h-0 opacity-0"
                                    }`}
                                  >
                                    <ul className="list-disc list-outside pl-5 text-[#32086d] mt-1">
                                      {logs.map((log) => (
                                        <li
                                          key={log.id}
                                          className="text-sm poppins-thin mt-1"
                                        >
                                          <span className="text-[#425565] text-xs font-normal poppins-thin">
                                            {log.activity_desc.split(" to ")[0]}
                                          </span>
                                          <span className="text-[#114F00] text-xs font-semibold poppins-thin">
                                            {" to "}
                                            {log.activity_type ===
                                            "LEAD_ASSIGNMENT"
                                              ? terminologiesMap.get(
                                                  log.activity_desc.split(
                                                    " to "
                                                  )[1]
                                                ) ||
                                                log.activity_desc.split(
                                                  " to "
                                                )[1]
                                              : log.activity_desc.split(
                                                  " to "
                                                )[1]}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>

                                    {logs[0].note && (
                                      <div
                                        className={`w-fit h-max relative bg-none rounded-[5px] text-xs border border-[#005085] mt-2 py-0.5 px-1 text-[#425565] transition-opacity duration-300 ${
                                          isExpanded
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }`}
                                        style={{
                                          zIndex: fromTable
                                            ? !isConfirmationDialogueOpened
                                            : isConfirmationDialogueOpened
                                            ? -1
                                            : 1,
                                        }}
                                      >
                                        {formatName(logs[0].note)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ActivityLogsContainer;
