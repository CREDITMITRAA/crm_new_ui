import moment from "moment";
import Pagination from "../common/Pagination";
import CallIcon from "../icons/CallIcon";
import {
  applicationStatusOptionsForWalkInsPageTable,
  CANCELLED,
  leadStatusOptionsForWalkInsPageTable,
  optionColors,
  PENDING,
  REJECTED,
  RESCHEDULE_CALL_WITH_MANAGER,
  RESCHEDULE_WALK_IN,
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  SCHEDULED_CALL_WITH_MANAGER,
  SCHEDULED_FOR_WALK_IN,
  terminologiesMap,
  TWELVE_DOCUMENTS_COLLECTED,
  UPCOMING,
} from "../../utilities/AppConstants";
import UpdateLeadStatusDialogue from "../common/dialogues/UpdateLeadStatusDialogue";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllWalkInLeads } from "../../features/walk-ins/walkInsThunks";
import Snackbar from "../common/snackbars/Snackbar";
import UpdateApplicationStatusDialogue from "../common/dialogues/UpdateApplicationStatusDialogue";
import ViewIcon from "../icons/ViewIcon";
import CommonDialogue from "../common/dialogues/CommonDialogue";
import ScheduleWalkInOrCallDialogue from "../common/dialogues/ScheduleWalkInOrCallDialogue";
import {
  formatName,
  getLast10Digits,
  getStatusDetails,
  truncateWithEllipsis,
} from "../../utilities/utility-functions";
import { useNavigate } from "react-router-dom";

const defaultWalkInLeadsTableFilters = {
  verification_status: ["Scheduled For Walk-In", "Scheduled Call With Manager"],
  lead_status: "",
  for_walk_ins_page: true,
  walk_in_attributes: [
    "is_call",
    "is_rescheduled",
    "rescheduled_date_time",
    "walk_in_date_time",
    "walk_in_status",
  ],
};

function NormalLoginTable({ leads }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    loading,
    error,
    leadsPagination: pagination,
  } = useSelector((state) => state.walkIns);
  const [openToast, setOpenToast] = useState(false);
  const [showUpdateLeadStatusDialogue, setShowUpdateLeadStatusDialogue] =
    useState(false);
  const [apiPayload, setApiPayload] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const [
    showUpdateApplicationStatusDialogue,
    setShowUpdateApplicationStatusDialogue,
  ] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [
    showActivityLogsInCommonDialogue,
    setShowActivityLogsInCommonDialogue,
  ] = useState(false);
  const [
    showScheduleWalkInOrCallDialogue,
    setShowScheduleWalkInOrCallDialogue,
  ] = useState(false);
  const [isCall, setIsCall] = useState(false);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState(null);
  const [selectedLead, setSelectedLead] = useState(false);

  useEffect(() => {
    if (loading) {
      setToastStatusType("INFO");
      if (showUpdateApplicationStatusDialogue) {
        setToastMessage("Updating Application Status...");
      } else {
        setToastMessage("Updating Lead Status...");
      }
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      if (showUpdateApplicationStatusDialogue) {
        setToastMessage("Application Status Updated...");
      } else {
        setToastMessage("Lead Status Updated...");
      }
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [error]);

  function handleLeadStatusChange(e, lead) {
    e.stopPropagation();
    let walk_in = lead.walkIns[0];
    if (![ROLE_EMPLOYEE, ROLE_ADMIN].includes(user.user.role)) {
      setToastStatusType("ERROR");
      setToastStatusMessage("Error...");
      setToastMessage("Manager has no access to update...");
      setShouldSnackbarCloseOnClickOfOutside(true);
      setOpenToast(true);
    } else {
      if (
        [RESCHEDULE_WALK_IN, RESCHEDULE_CALL_WITH_MANAGER].includes(
          e.target.value
        )
      ) {
        if ([UPCOMING, PENDING].includes(getStatusDetails(walk_in).status)) {
          setToastStatusType("ERROR");
          setToastStatusMessage("Error...");
          if (walk_in.is_call) {
            setToastMessage(
              "Please complete or cancel the existing Scheduled Call !"
            );
          } else {
            setToastMessage(
              "Please complete or cancel the existing Scheduled Walk-In !"
            );
          }
          setShouldSnackbarCloseOnClickOfOutside(true);
          setOpenToast(true);
        } else {
          if (e.target.value === RESCHEDULE_CALL_WITH_MANAGER) {
            setIsCall(true);
            setSelectedLead(lead);
            setSelectedLeadStatus(value);
            setShowScheduleWalkInOrCallDialogue(true);
          } else {
            setSelectedLead(lead);
            setSelectedLeadStatus(value);
            setShowScheduleWalkInOrCallDialogue(true);
          }
        }
      } else if (
        ![SCHEDULED_FOR_WALK_IN, SCHEDULED_CALL_WITH_MANAGER].includes(
          e.target.value
        )
      ) {
        if (getStatusDetails(walk_in).status === CANCELLED) {
          setToastStatusType("ERROR");
          setToastStatusMessage("Error...");
          setToastMessage(
            "Please complete or cancel the existing Scheduled Walk-In !"
          );
          setShouldSnackbarCloseOnClickOfOutside(true);
          setOpenToast(true);
        } else if (
          [PENDING, UPCOMING].includes(getStatusDetails(walk_in).status)
        ) {
          setToastStatusType("ERROR");
          setToastStatusMessage("Error...");
          if (walk_in.is_call) {
            setToastMessage("Please complete existing Scheduled Call !");
          } else {
            setToastMessage("Please complete Scheduled Walk-In !");
          }
          setShouldSnackbarCloseOnClickOfOutside(true);
          setOpenToast(true);
        } else {
          let payload = {};
          payload["lead_id"] = lead.id;
          payload["lead_status"] = e.target.value;
          payload["role"] = user.user.role;
          payload["user_id"] = user.user.id;
          payload["lead_name"] = lead.name;
          payload["prev_lead_status"] = lead.lead_status;
          console.log("payload for update lead status = ", payload);
          setApiPayload(payload);
          setShowUpdateLeadStatusDialogue(true);
        }
      }
    }
  }

  function handleApplicationStatusChange(e, lead) {
    e.stopPropagation();
    if (user.user.role === ROLE_EMPLOYEE) {
      setToastStatusType("ERROR");
      setToastStatusMessage("Error...");
      setToastMessage("Access Denied...");
      setShouldSnackbarCloseOnClickOfOutside(true);
      setOpenToast(true);
      return;
    } else {
      if (lead.lead_status !== TWELVE_DOCUMENTS_COLLECTED) {
        setToastStatusType("ERROR");
        setToastStatusMessage("Error...");
        setToastMessage(
          "Application Status Cannot change due to Invalid Lead Status !"
        );
        setShouldSnackbarCloseOnClickOfOutside(true);
        setOpenToast(true);
      } else {
        let payload = {};
        payload["lead_id"] = lead.id;
        payload["application_status"] = e.target.value;
        payload["lead_status"] = lead.lead_status;
        payload["role"] = user.user.role;
        payload["rejected_by_id"] = user.user.id;
        payload["user_id"] = user.user.id;
        payload["lead_name"] = lead.name;
        console.log("payload for update application status = ", payload);
        setApiPayload(payload);
        setShowUpdateApplicationStatusDialogue(true);
      }
    }
  }

  function handleClickOnView(leadId) {
    setSelectedLeadId(leadId);
    setShowActivityLogsInCommonDialogue(true);
  }

  return (
    <>
      <div className="w-full flex flex-col">
        {/* table */}
        <div className="w-full h-max flex flex-col">
          {/* table header */}
          <div
            className="w-full h-9 justify-start flex rounded-[10px] mb-2 px-[20px]"
            style={{
              boxShadow: `
                8px 5px 20px 0px rgba(0, 0, 0, 0.05) inset,
                31px 18px 36px 0px rgba(0, 0, 0, 0.04) inset,
                70px 41px 49px 0px rgba(0, 0, 0, 0.03) inset,
                124px 73px 58px 0px rgba(0, 0, 0, 0.01) inset,
                193px 115px 63px 0px rgba(0, 0, 0, 0) inset
              `,
              backgroundColor: "rgba(189, 209, 237, 1)",
            }}
          >
            {/* lead id */}
            <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold inter-inter leading-none rounded-tl-[10px]">
              Lead ID
            </div>

            {/* name */}
            <div className="w-[14%] flex justify-left items-center text-[#214768] text-xs font-bold inter-inter leading-none">
              Name
            </div>

            {/* Phone */}
            <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold inter-inter leading-none">
              Phone
            </div>

            {/* Emp Name */}
            <div className="w-[13%] flex justify-left items-center text-[#214768] text-xs font-bold inter-inter leading-none">
              Emp Name
            </div>

            {/* Source */}
            <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold inter-inter leading-none">
              Source
            </div>

            {/* Walk-In Call Date Time */}
            {/* <div className="w-[18%] flex justify-center items-center text-[#4200a0] text-xs font-bold inter-inter leading-none border-t border-b border-r border-gray-300">
              Walk-In Call Date Time
            </div> */}

            {/* Status */}
            <div className="w-[21%] flex justify-left items-center text-[#214768] text-xs font-bold inter-inter leading-none">
              Status
            </div>

            {/* Application Status */}
            <div className="w-[17%] flex justify-left items-center text-[#214768] text-xs font-bold inter-inter">
              Application Status
            </div>

            {/* View */}
            <div className="w-[5%] flex justify-center items-center text-[#214768] text-xs font-bold inter-inter rounded-tr-[10px]">
              View
            </div>
          </div>

          {/* table row */}
          {leads.map((lead, index) => (
            <div
              className="w-full h-9 justify-start flex cursor-pointer mb-1 rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg px-[20px]"
              key={index}
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
              style={{
                boxShadow: `7px 2px 16px 0px rgba(0, 0, 0, 0.05) inset, 
        27px 7px 28px 0px rgba(0, 0, 0, 0.05) inset, 
        62px 16px 38px 0px rgba(0, 0, 0, 0.03) inset, 
        110px 29px 45px 0px rgba(0, 0, 0, 0.04) inset, 
        172px 46px 50px 0px rgba(0, 0, 0, 0.05) inset`,
                backgroundColor: "rgba(216, 232, 255, 1)",
              }}
            >
              {/* lead id */}
              <div
                className={`w-[10%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-none rounded-tl-[10px] rounded-bl-[10px]`}
              >
                {truncateWithEllipsis(lead?.id,8)}
              </div>

              {/* name */}
              {/* <div className="w-[22%] flex justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300">
                {truncateWithEllipsis(lead.name, 20)}
              </div> */}

              <div className="w-[14%] px-4 pl-0 flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden text-ellipsis whitespace-nowrap">
                {truncateWithEllipsis(formatName(lead.name), 15)}
              </div>

              {/* Phone */}
              <div className="w-[10%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-none">
                {truncateWithEllipsis(getLast10Digits(lead?.phone), 10)}
              </div>

              {/* emp name */}
              <div className="w-[13%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-none">
                {(lead?.LeadAssignments || []).length > 0 &&
                  truncateWithEllipsis(
                    formatName(lead?.LeadAssignments[0]?.AssignedTo?.name),
                    15
                  )}
              </div>

              {/* Source */}
              <div className="w-[10%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-none pl-1">
                {truncateWithEllipsis(formatName(lead.lead_source), 10)}
              </div>

              {/* Walk-In Call Date Time */}
              {/* <div className="w-[18%] flex justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300 pl-1">
                {lead?.walkIns?.length > 0 && (
                  <div className="flex items-center justify-center w-full">
                    <div>
                      {lead.walkIns[0].is_rescheduled
                        ? moment(lead.walkIns[0].rescheduled_date_time)
                            .utcOffset(330)
                            .format("DD MMM, YYYY hh:mm:ss A")
                        : moment(lead.walkIns[0].walk_in_date_time)
                            .utcOffset(330)
                            .format("DD MMM, YYYY hh:mm:ss A")}
                    </div>
                    <div>{lead.walkIns[0].is_call && <CallIcon size={20}/>}</div>
                  </div>
                )}
              </div> */}

              {/* Status */}
              <div className="w-[21%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-none pl-1 overflow-hidden pr-6">
                {/* Colored Dot */}
                <div
                  className="w-[6px] h-[6px] rounded-full mr-1.5"
                  style={{
                    backgroundColor:
                      optionColors.find(
                        (option) =>
                          option.optionName ===
                          (lead?.last_updated_status === "Others"
                            ? lead.last_updated_status
                            : (lead?.Activities || [])[0]?.activity_status ||
                              "")
                      )?.optionColor || "#32086d",
                  }}
                ></div>

                <select
                  className="w-full px-1 py-1 pl-0 text-xs font-normal inter-inter leading-tight bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                  value={lead?.lead_status || lead?.last_updated_status}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23464646'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 8px center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "14px",
                    paddingLeft: "5px",
                  }}
                  onChange={(e) => handleLeadStatusChange(e, lead)}
                  disabled={lead?.application_status === REJECTED}
                >
                  {leadStatusOptionsForWalkInsPageTable.map((option, index) => (
                    <option
                      key={index}
                      value={option.value}
                      className="text-xs p-2 truncate"
                      style={{ ...option.style }}
                    >
                      {terminologiesMap.get(option.value) || option.label}
                    </option>
                  ))}

                  {lead.lead_status === "Scheduled For Walk-In" && (
                    <option value="Scheduled For Walk-In" disabled>
                      {terminologiesMap.get("Scheduled For Walk-In") ||
                        "Scheduled For Walk-In"}
                    </option>
                  )}

                  {lead.lead_status === "Scheduled Call With Manager" && (
                    <option value="Scheduled Call With Manager" disabled>
                      {terminologiesMap.get("Scheduled Call With Manager") ||
                        "Scheduled Call With Manager"}
                    </option>
                  )}
                </select>
              </div>

              {/* Application Status */}
              <div className="w-[17%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-none pl-1 overflow-hidden pr-8">
                {/* Colored Dot */}
                <div
                  className="w-[6px] h-[6px] rounded-full mr-1.5"
                  style={{
                    backgroundColor:
                      optionColors.find(
                        (option) =>
                          option.optionName === (lead?.application_status || "")
                      )?.optionColor || "#2B323B",
                  }}
                ></div>

                {user.user.role !== ROLE_EMPLOYEE ? (
                  <select
                    className="w-full px-1 py-1 pl-0 text-xs font-normal inter-inter leading-none bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                    value={lead?.application_status}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23${
                        optionColors
                          .find(
                            (option) =>
                              option.optionName ===
                              (lead?.application_status || "")
                          )
                          ?.optionColor?.replace("#", "") || "2B323B"
                      }'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 8px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "14px",
                      paddingLeft: "5px",
                    }}
                    onChange={(e) => handleApplicationStatusChange(e, lead)}
                    disabled={
                      user.user.role === ROLE_EMPLOYEE ||
                      lead?.lead_status !== TWELVE_DOCUMENTS_COLLECTED
                    }
                  >
                    {applicationStatusOptionsForWalkInsPageTable.map(
                      (option, index) => (
                        <option
                          key={index}
                          value={option.value}
                          className="text-xs p-2 truncate"
                          style={{ ...option.style }}
                        >
                          {terminologiesMap.get(option.value) || option.label}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <span
                    className="truncate w-full text-left px-1"
                    style={{
                      color:
                        optionColors.find(
                          (item) => item.optionName === lead?.application_status
                        )?.optionColor || "#2B323B",
                    }}
                  >
                    {terminologiesMap.get(lead?.application_status) ||
                      lead?.application_status ||
                      "Select Application Status"}
                  </span>
                )}
              </div>

              {/* Assigned */}
              <div
                className={`w-[5%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none rounded-br-[10px] rounded-tr-[10px]`}
              >
                <ViewIcon onClick={() => handleClickOnView(lead.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {showUpdateLeadStatusDialogue && (
        <UpdateLeadStatusDialogue
          onClose={() => setShowUpdateLeadStatusDialogue(false)}
          payload={apiPayload}
          openToast={openToast}
          setOpenToast={setOpenToast}
          onStatusUpdate={() => {
            dispatch(
              getAllWalkInLeads({
                ...defaultWalkInLeadsTableFilters,
                page: pagination.page,
                pageSize: pagination.pageSize,
              })
            );
          }}
        />
      )}
      {showUpdateApplicationStatusDialogue && (
        <UpdateApplicationStatusDialogue
          onClose={() => setShowUpdateApplicationStatusDialogue(false)}
          payload={apiPayload}
          openToast={openToast}
          setOpenToast={setOpenToast}
          onStatusUpdate={() => {
            dispatch(
              getAllWalkInLeads({
                ...defaultWalkInLeadsTableFilters,
                page: pagination.page,
                pageSize: pagination.pageSize,
              })
            );
          }}
        />
      )}
      <Snackbar
        isOpen={openToast}
        onClose={() => setOpenToast(false)}
        status={toastStatusMessage}
        message={toastMessage}
        statusType={toastStatusType}
        shouldCloseOnClickOfOutside={shouldSnackbarCloseOnClickOfOutside}
      />
      {showActivityLogsInCommonDialogue && (
        <CommonDialogue
          onClose={() => setShowActivityLogsInCommonDialogue(false)}
          leadId={selectedLeadId}
        />
      )}
      {showScheduleWalkInOrCallDialogue && (
        <ScheduleWalkInOrCallDialogue
          onClose={() => setShowScheduleWalkInOrCallDialogue(false)}
          isCall={isCall}
          setIsCall={setIsCall}
          selectedLeadStatus={selectedLeadStatus}
          selectedLead={selectedLead}
          openToast={openToast}
          setOpenToast={setOpenToast}
          onScheduleWalkInOrCall={() => {
            dispatch(
              getAllWalkInLeads({
                ...defaultWalkInLeadsTableFilters,
                page: pagination.page,
                pageSize: pagination.pageSize,
              })
            );
          }}
          fromTable={true}
        />
      )}
    </>
  );
}

export default NormalLoginTable;
