import { useEffect, useState } from "react";
import {
  APPROVED_FOR_WALK_IN,
  leadStatusOptionsForVerification1Table,
  optionColors,
  OTHERS,
  REJECTED,
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  SCHEDULE_CALL_WITH_MANAGER,
  SCHEDULE_FOR_WALK_IN,
  terminologiesMap,
  verificationStatusOptionsForVerificationTable,
} from "../../utilities/AppConstants";
import CheckCheckbox from "../common/checkbox/CheckCheckbox";
import UncheckedCheckbox from "../common/checkbox/UnCheckedCheckbox";
import Pagination from "../common/Pagination";
import UpdateLeadStatusDialogue from "../common/dialogues/UpdateLeadStatusDialogue";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "../common/snackbars/Snackbar";
import { getVerificationLeads } from "../../features/verification/verificationThunks";
import UpdateVerificationStatusDialogue from "../common/dialogues/UpdateVerificationStatusDialogue";
import ViewIcon from "../icons/ViewIcon";
import CommonDialogue from "../common/dialogues/CommonDialogue";
import ScheduleWalkInOrCallDialogue from "../common/dialogues/ScheduleWalkInOrCallDialogue";
import {
  formatName,
  getLast10Digits,
  truncateWithEllipsis,
} from "../../utilities/utility-functions";
import { useNavigate } from "react-router-dom";

function VerificationTable({ leads, filters }) {
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    loading,
    error,
    pagination,
    scheduleWalkInLoading,
    scheduleWalkInError,
  } = useSelector((state) => state.verification);
  const [showUpdateLeadStatusDialogue, setShowUpdateLeadStatusDialogue] =
    useState(false);
  const [
    showUpdateVerificationStatusDialogue,
    setShowUpdateVerificationStatusDialogue,
  ] = useState(false);
  const [apiPayload, setApiPayload] = useState({});
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  // const [filters, setFilters] = useState({ lead_status: "Verification 1" });
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
  const [selectedLeadName, setSelectedLeadName] = useState(null)

  useEffect(() => {
    if (scheduleWalkInLoading) {
      setToastStatusType("INFO");
      if (showUpdateVerificationStatusDialogue) {
        setToastMessage("Updating Verification Status...");
      } else if (showScheduleWalkInOrCallDialogue && isCall) {
        setToastMessage("Scheduling Call...");
      } else if (showScheduleWalkInOrCallDialogue && !isCall) {
        setToastMessage("Scheduling Walk-In...");
      } else {
        setToastMessage("Updating Lead Status...");
      }
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      if (showUpdateVerificationStatusDialogue) {
        setToastMessage("Verification Status Updated...");
      } else if (showScheduleWalkInOrCallDialogue && isCall) {
        setToastMessage("Call Scheduled...");
      } else if (showScheduleWalkInOrCallDialogue && !isCall) {
        setToastMessage("Walk-In Scheduled...");
      } else {
        setToastMessage("Lead Status Updated...");
      }
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [scheduleWalkInLoading]);

  useEffect(() => {
    if (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [scheduleWalkInLoading]);

  function handleLeadStatusChange(e, lead) {
    e.stopPropagation();
    const { name, value } = e.target;
    if (![ROLE_EMPLOYEE, ROLE_ADMIN].includes(user.user.role)) {
      setToastStatusType("ERROR");
      setToastStatusMessage("Error...");
      setToastMessage("Manager has no access to update...");
      setShouldSnackbarCloseOnClickOfOutside(true);
      setOpenToast(true);
      return;
    } else {
      if (
        lead.verification_status !== APPROVED_FOR_WALK_IN &&
        value === SCHEDULE_FOR_WALK_IN
      ) {
        setToastStatusType("ERROR");
        setToastStatusMessage("Error...");
        setToastMessage("Lead Not Approved For Walk-In Yet...");
        setShouldSnackbarCloseOnClickOfOutside(true);
        setOpenToast(true);
        return;
      } else if (value === SCHEDULE_CALL_WITH_MANAGER) {
        setIsCall(true);
        setSelectedLead(lead);
        setSelectedLeadStatus(value);
        setShowScheduleWalkInOrCallDialogue(true);
      } else if (value === SCHEDULE_FOR_WALK_IN) {
        setSelectedLead(lead);
        setSelectedLeadStatus(value);
        setShowScheduleWalkInOrCallDialogue(true);
      } else if (value === OTHERS) {
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

  function handleVerificationStatusChange(e, lead) {
    e.stopPropagation();
    if (user.user.role === ROLE_EMPLOYEE) {
      setToastStatusType("ERROR");
      setToastStatusMessage("Error...");
      setToastMessage("Access Denied...");
      setShouldSnackbarCloseOnClickOfOutside(true);
      setOpenToast(true);
    } else {
      let payload = {};
      payload["lead_id"] = lead.id;
      payload["verification_status"] = e.target.value;
      payload["role"] = user.user.role;
      payload["rejected_by_id"] = user.user.id;
      payload["user_id"] = user.user.id;
      payload["lead_name"] = lead.name;
      payload["assigned_to"] = lead.LeadAssignments[0].assigned_to;
      setApiPayload(payload);
      setShowUpdateVerificationStatusDialogue(true);
    }
  }

  function handleClickOnView(leadId, leadName) {
    setSelectedLeadId(leadId);
    setSelectedLeadName(leadName)
    setShowActivityLogsInCommonDialogue(true);
  }

  return (
    <>
      <div className="w-full flex flex-col">
        {/* table */}
        <div className="w-full h-max flex flex-col">
          {/* table header */}
          <div
            className="w-full h-9 bg-[#B4C7E1] justify-start flex rounded-[10px] mb-2 px-[20px]"
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
            <div className="w-[8%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Lead ID
            </div>

            {/* name */}
            <div className="w-[12.5%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Name
            </div>

            {/* Phone */}
            <div className="w-[12.5%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Phone
            </div>

            {/* Emp Name */}
            <div className="w-[12.5%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Emp Name
            </div>

            {/* Source */}
            <div className="w-[10.5%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Source
            </div>

            {/* Status */}
            <div className="w-[20%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Status
            </div>

            {/* Verification Status */}
            <div className="w-[18%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Verification Status
            </div>

            {/* Actions */}
            <div className="w-[6%] flex justify-center items-center text-[#214768] text-xs font-bold poppins-thin rounded-tr-[10px] pl-8">
              View
            </div>
          </div>

          {/* table row */}
          {leads?.map((lead, index) => (
            <div
              className="w-full h-9 justify-start flex cursor-pointer mb-1 rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg px-[20px]"
              key={index}
              style={{
                boxShadow: `7px 2px 16px 0px rgba(0, 0, 0, 0.05) inset, 
        27px 7px 28px 0px rgba(0, 0, 0, 0.05) inset, 
        62px 16px 38px 0px rgba(0, 0, 0, 0.03) inset, 
        110px 29px 45px 0px rgba(0, 0, 0, 0.04) inset, 
        172px 46px 50px 0px rgba(0, 0, 0, 0.05) inset`,
                backgroundColor: "rgba(216, 232, 255, 1)",
              }}
            >
              {/* Lead ID */}
              <div
                className="w-[8%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight rounded-tl-[10px] rounded-bl-[10px] overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={`${lead.id}`}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {truncateWithEllipsis(lead.id, 8)}
                </span>
              </div>

              {/* Name */}
              <div
                className="w-[12.5%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={`${lead.name}`}
              >
                <span className="truncate w-full flex justify-left">
                  {truncateWithEllipsis(formatName(lead.name), 15)}
                </span>
              </div>

              {/* Phone */}
              <div
                className="w-[12.5%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={`${lead.phone}`}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {getLast10Digits(lead.phone)}
                </span>
              </div>

              {/* Emp Name */}
              <div
                className="w-[12.5%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={`${
                  lead?.LeadAssignments[0]?.AssignedTo?.name || "Not Assigned"
                }`}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {truncateWithEllipsis(
                    formatName(lead?.LeadAssignments[0]?.AssignedTo?.name),
                    15
                  ) || ""}
                </span>
              </div>

              {/* Source */}
              <div
                className="w-[10.5%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={`${lead.lead_source || "Not Available"}`}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {truncateWithEllipsis(formatName(lead.lead_source), 10) ||
                    "Not Available"}
                </span>
              </div>

              {/* Status */}
              <div
                className="w-[20%] flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden pr-8"
                title={`Current Status: ${
                  terminologiesMap.get(lead?.last_updated_status) || "Not Updated"
                }\nActivity Status: ${
                  terminologiesMap.get(lead?.Activities[0]?.activity_status) || "No Activity"
                }`}
              >
                {/* Dot */}
                <div className="flex-shrink-0 mr-2">
                  <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M4 0C2.939 0 1.922 0.421 1.172 1.172C0.421 1.922 0 2.939 0 4C0 5.061 0.421 6.078 1.172 6.828C1.922 7.579 2.939 8 4 8C6.22 8 8 6.22 8 4C8 2.939 7.579 1.922 6.828 1.172C6.078 0.421 5.061 0 4 0Z"
                      fill={
                        optionColors.find(
                          (option) =>
                            option.optionName ===
                            // (lead?.last_updated_status === "Others"
                            //   ? lead.last_updated_status
                            //   : lead?.Activities[0]?.activity_status || "")
                            lead.lead_status
                        )?.optionColor || "#46AACA"
                      }
                    />
                  </svg>
                </div>

                {/* Dropdown */}
                <select
                  className="w-full px-1 py-1 pl-0 text-xs font-normal inter-inter leading-tight bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                  value={
                    // lead?.last_updated_status === "Others"
                    //   ? lead.last_updated_status
                    //   : lead?.Activities[0]?.activity_status || ""
                    lead.lead_status
                  }
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23464646'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 8px center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "14px",
                    zIndex: isConfirmationDialogueOpened && -1,
                    paddingLeft: "5px",
                  }}
                  onChange={(e) => handleLeadStatusChange(e, lead)}
                  disabled={lead?.verification_status === REJECTED}
                >
                  {leadStatusOptionsForVerification1Table.map(
                    (option, index) => (
                      <option
                        key={index}
                        value={option.value}
                        className="text-xs p-2 truncate"
                        style={{ ...option.style }}
                        disabled={option.value === ""}
                      >
                        {terminologiesMap.get(option.value) || option.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Verification Status */}
              <div
                className="w-[18%] flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                title={`Verification Status: ${
                  terminologiesMap.get(lead?.verification_status) || "Not Verified"
                }\nVerified By: ${
                  lead?.verified_by || "N/A"
                }\nVerification Date: ${terminologiesMap.get(lead?.verification_date) || "N/A"}`}
              >
                <div className="flex-shrink-0 mr-2">
                  <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M4 0C2.939 0 1.922 0.421 1.172 1.172C0.421 1.922 0 2.939 0 4C0 5.061 0.421 6.078 1.172 6.828C1.922 7.579 2.939 8 4 8C6.22 8 8 6.22 8 4C8 2.939 7.579 1.922 6.828 1.172C6.078 0.421 5.061 0 4 0Z"
                      fill={
                        optionColors.find(
                          (option) =>
                            option.optionName ===
                            (lead?.verification_status || "")
                        )?.optionColor || "#46AACA"
                      }
                    />
                  </svg>
                </div>

                {user.user.role !== ROLE_EMPLOYEE ? (
                  <select
                    className="w-full px-1 pl-0 py-1 text-xs font-normal inter-inter leading-tight bg-transparent border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                    value={lead?.verification_status || ""}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23464646'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 8px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "14px",
                      zIndex: isConfirmationDialogueOpened && -1,
                      paddingLeft: "5px",
                    }}
                    onChange={(e) => handleVerificationStatusChange(e, lead)}
                    disabled={user.user.role === ROLE_EMPLOYEE}
                  >
                    {verificationStatusOptionsForVerificationTable.map(
                      (option, index) => (
                        <option
                          key={index}
                          value={option.value}
                          className="text-xs p-2 truncate"
                          style={{ ...option.style }}
                          disabled={option.value === ""}
                        >
                          {terminologiesMap.get(option.value) || option.label}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <span className="truncate w-full text-center flex justify-left">
                    {terminologiesMap.get(lead?.verification_status)}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="w-[6%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight rounded-br-[10px] rounded-tr-[10px] overflow-hidden pl-8">
                 <ViewIcon onClick={() => handleClickOnView(lead.id, lead.name)} />
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
              getVerificationLeads({
                ...filters,
                page: pagination.page,
                pageSize: pagination.pageSize,
              })
            );
          }}
        />
      )}
      {showUpdateVerificationStatusDialogue && (
        <UpdateVerificationStatusDialogue
          onClose={() => setShowUpdateVerificationStatusDialogue(false)}
          payload={apiPayload}
          openToast={openToast}
          setOpenToast={setOpenToast}
          onStatusUpdate={() => {
            dispatch(
              getVerificationLeads({
                ...filters,
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
          fromTable={true}
          leadName={selectedLeadName}
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
              getVerificationLeads({
                ...filters,
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

export default VerificationTable;
