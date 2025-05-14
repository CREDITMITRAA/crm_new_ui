import moment from "moment";
import {
  formatName,
  formatTimeTo12Hour,
  truncateWithEllipsis,
} from "../../utilities/utility-functions";
import LeadNavigationIcon from "../icons/LeadNavigationIcon";
import { terminologiesMap } from "../../utilities/AppConstants";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ActivityLogsContainer({
  activityLogs = [],
  userMap,
  fromTable = false,
  setShowActivityLog,
}) {
  console.log("user map = ", userMap);
  const navigate = useNavigate();
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (leadId, time) => {
    const key = `${leadId}-${time}`;
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  function handleNavigate(leadId) {
    console.log("current location = ", location.pathname);
    const path = location.pathname;
    const extracted = "/" + path.split("/")[1];
    console.log("extracted = ", extracted);

    if (extracted === "/lead-details-page") {
      setShowActivityLog(false);
    } else {
      navigate(`/lead-details-page/${leadId}`);
    }
  }

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
                ([createdBy, leadIdGroups]) => {
                  const contentHeight = createdBy.length * 60 + 40;
                  return (
                    <div key={createdBy}>
                      {/* Content section container */}
                      <div
                        className={`flex justify-start mx-4 bg-[#E8EFF8] h-max py-2.5 ${
                          (!isConfirmationDialogueOpened || fromTable) &&
                          "relative"
                        }`}
                      >
                        {/* SVG Divider */}
                        <div
                          className={`${
                            (!isConfirmationDialogueOpened || fromTable) &&
                            "absolute"
                          } left-[72px] top-0 h-full w-[132px] -translate-x-1/2`}
                          style={{
                            zIndex: fromTable
                              ? 1
                              : isConfirmationDialogueOpened
                              ? -1
                              : 1,
                          }}
                        >
                          <svg
                            width="132"
                            height={contentHeight}
                            viewBox={`0 0 132 ${contentHeight}`}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            className="h-full w-full"
                          >
                            <path
                              d={`M0.333333 3C0.333333 4.47276 1.52724 5.66667 3 5.66667C4.47276 5.66667 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333333 3 0.333333C1.52724 0.333333 0.333333 1.52724 0.333333 3ZM126.333 ${
                                contentHeight - 3
                              }C126.333 ${contentHeight - 1.5272} 127.527 ${
                                contentHeight - 0.3333
                              } 129 ${contentHeight - 0.3333}C130.473 ${
                                contentHeight - 0.3333
                              } 131.667 ${contentHeight - 1.5272} 131.667 ${
                                contentHeight - 3
                              }C131.667 ${contentHeight - 4.4728} 130.473 ${
                                contentHeight - 5.6667
                              } 129 ${contentHeight - 5.6667}C127.527 ${
                                contentHeight - 5.6667
                              } 126.333 ${contentHeight - 4.4728} 126.333 ${
                                contentHeight - 3
                              }ZM3 3.5H72.1858V2.5H3V3.5ZM81.6858 13V${
                                contentHeight - 13
                              }H82.6858V13H81.6858ZM92.1858 ${
                                contentHeight - 3.5
                              }H129V${contentHeight - 4.5}H92.1858V${
                                contentHeight - 3.5
                              }ZM81.6858 ${contentHeight - 13}C81.6858 ${
                                contentHeight - 8.201
                              } 86.3868 ${contentHeight - 3.5} 92.1858 ${
                                contentHeight - 3.5
                              }V${contentHeight - 4.5}C86.9391 ${
                                contentHeight - 4.5
                              } 82.6858 ${contentHeight - 8.7533} 82.6858 ${
                                contentHeight - 13
                              }H81.6858ZM72.1858 3.5C77.4325 3.5 81.6858 7.75329 81.6858 13H82.6858C82.6858 7.20101 77.9848 2.5 72.1858 2.5V3.5Z`}
                              fill="#0D5E00"
                            />
                          </svg>
                        </div>
                        {/* Left section */}
                        <div
                          className="relative flex flex-col items-start rounded-tr-2xl"
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
                            <div className="relative justify-start text-[#FFFFFF] text-xs font-medium poppins-thin min-w-[60px]">
                              {truncateWithEllipsis(
                                formatName(
                                  userMap.get(Number(createdBy))?.name
                                ),
                                8
                              ) || "Unknown"}
                            </div>
                          </div>
                        </div>

                        {/* Right section */}
                        <div className="flex flex-col flex-grow rounded-bl-2xl">
                          <div className="flex flex-col pl-4">
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
                                        <div className="w-5 h-5 flex items-center justify-center cursor-pointer">
                                          <LeadNavigationIcon
                                            color="#214768"
                                            onClick={() =>
                                              handleNavigate(leadId)
                                            }
                                          />
                                        </div>
                                      </div>
                                      {/* <div
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
                                      </div> */}
                                    </div>

                                    {/* Log text with smooth transition */}
                                    <div
                                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        !isExpanded
                                          ? "max-h-[500px] opacity-100"
                                          : "max-h-0 opacity-0"
                                      }`}
                                    >
                                      <ul className="list-disc list-outside pl-5 text-[#214768] mt-1">
                                        {logs.map((log) => {
                                          const [fromPart, toPart] =
                                            log.activity_desc.split(" to ");

                                          return (
                                            <li
                                              key={log.id}
                                              className="text-sm poppins-thin mt-1"
                                            >
                                              <span className="text-[#425565] text-xs font-normal poppins-thin">
                                                {fromPart}
                                              </span>

                                              {toPart && (
                                                <span className="text-[#114F00] text-xs font-semibold poppins-thin">
                                                  {" to "}
                                                  {toPart}
                                                </span>
                                              )}

                                              {log.note && (
                                                <div
                                                  className={`w-fit h-max relative bg-none rounded-[5px] text-xs border border-[#005085] mt-2 py-0.5 px-1 text-[#425565] transition-opacity duration-300 ${
                                                    !isExpanded
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
                                                  {formatName(log.note)}
                                                </div>
                                              )}
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ActivityLogsContainer;
