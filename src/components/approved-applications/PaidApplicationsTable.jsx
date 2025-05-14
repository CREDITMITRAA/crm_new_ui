import moment from "moment";
import Pagination from "../common/Pagination";
import CallIcon from "../icons/CallIcon";
import {
  ADVANCE_AMOUNT_PAID,
  ALL_DISPUTES_UPDATED,
  APPLICATION_IS_CLOSED,
  applicationStatusBankLoginOptionsForPaidApprovedApplicationsPageTable,
  applicationStatusOptionsForPaidApprovedApplicationsPageTable,
  applicationStatusOptionsForUnPaidApprovedApplicationsPageTable,
  applicationStatusOptionsForWalkInsPageTable,
  APPROVED_APPLICATIONS,
  BUREAU_DISPUTE_RAISED,
  CANCELLED,
  CLOSED,
  CLOSING_AMOUNT_PAID,
  leadStatusAfterClosingAmountPaidOptionsForPaidApprovedApplicationsPageTable,
  leadStatusOptionsForPaidApprovedApplicationsPageTable,
  leadStatusOptionsForUnPaidApprovedApplicationsPageTable,
  leadStatusOptionsForWalkInsPageTable,
  LOAN_DISBURSED_FROM_BANK,
  LOGIN,
  LOGIN_BANK_1,
  LOGIN_BANK_2,
  LOGIN_BANK_3,
  LOGIN_BANK_4,
  LOGIN_BANK_5,
  LOGIN_BANK_6,
  LOGIN_STARTED,
  NORMAL_LOGIN,
  optionColors,
  OTHERS,
  PENDING,
  REJECTED,
  RESCHEDULE_CALL_WITH_MANAGER,
  RESCHEDULE_WALK_IN,
  RESCHEDULED_FOR_WALK_IN,
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
import { updateLeadStatus } from "../../features/walk-ins/walkInsSlice";
import { getApprovedLeads } from "../../features/approved-leads/approvedLeadsThunks";

const defaultPaidApprovedLeadsTableFilters = {
  lead_bucket: APPROVED_APPLICATIONS,
  is_paid: true,
};

function PaidApplicationsTable({ leads }) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading, error, pagination } = useSelector(
    (state) => state.approvedLeads
  );
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { statusUpdateLoading, statusUpdateError } = useSelector(
    (state) => state.walkIns
  );
  const { loading: leadStatusUpdateLoading, error: leadStatusUpdateError } =
    useSelector((state) => state.leads);
  const [
    showUpdateApplicationStatusDialogue,
    setShowUpdateApplicationStatusDialogue,
  ] = useState(false);
  const [showUpdateLeadStatusDialogue, setShowUpdateLeadStatusDialogue] =
    useState(false);
  const [apiPayload, setApiPayload] = useState({});
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const [
    showActivityLogsInCommonDialogue,
    setShowActivityLogsInCommonDialogue,
  ] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedLeadName, setSelectedLeadName] = useState(null);

  useEffect(() => {
    console.log("approved leads = ", leads);
  }, []);

  useEffect(() => {
    if (leadStatusUpdateLoading || statusUpdateLoading) {
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
  }, [leadStatusUpdateLoading, statusUpdateLoading]);

  useEffect(() => {
    if (leadStatusUpdateError || statusUpdateError) {
      setToastStatusType("ERROR");
      setToastMessage(
        leadStatusUpdateError?.message || statusUpdateError.message
      );
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [leadStatusUpdateError, statusUpdateError]);

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
      let payload = {};
      payload["lead_id"] = lead.id;
      payload["application_status"] = e.target.value;
      payload["lead_status"] = lead.lead_status;
      payload["role"] = user.user.role;
      payload["rejected_by_id"] = user.user.id;
      payload["user_id"] = user.user.id;
      payload["lead_name"] = lead.name;
      payload["assigned_to"] = lead.LeadAssignments[0].assigned_to;
      payload["lead_bucket"] = APPROVED_APPLICATIONS;
      console.log("payload for update application status = ", payload);
      setApiPayload(payload);
      setShowUpdateApplicationStatusDialogue(true);
    }
  }

  function handleLeadStatusChange(e, lead) {
    e.stopPropagation();
    const newStatus = e.target.value;
    const payload = {
      lead_id: lead.id,
      lead_status: newStatus,
      role: user.user.role,
      user_id: user.user.id,
      lead_name: lead.name,
      prev_lead_status: lead.lead_status,
    };

    console.log("Payload for update lead status:", payload);
    setApiPayload(payload);
    setShowUpdateLeadStatusDialogue(true);
  }

  function handleClickOnView(leadId, leadName) {
    setSelectedLeadId(leadId);
    setSelectedLeadName(leadName);
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
            <div className="w-[8%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight rounded-tl-[10px]">
              Lead ID
            </div>

            {/* name */}
            <div className="w-[11%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Name
            </div>

            {/* Phone */}
            <div className="w-[9%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Phone
            </div>

            {/* Emp Name */}
            <div className="w-[12%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Emp Name
            </div>

            {/* Source */}
            <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Source
            </div>

            {/* Walk-In Call Date Time */}
            <div className="w-[7%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Cl.Date
            </div>

            {/* Walk-In Call Date Time */}
            <div className="w-[7%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Ver.Date
            </div>

            {/* login date */}
            <div className="w-[8%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Log.Date
            </div>

            {/* Status */}
            <div className="w-[13%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
              Lead Status
            </div>

            {/* Application Status */}
            <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin">
              Application Status
            </div>

            {/* View */}
            <div className="w-[5%] flex justify-center items-center text-[#214768] text-xs font-bold poppins-thin rounded-tr-[10px] pl-8">
              View
            </div>
          </div>

          {/* table row */}
          {leads.map((lead, index) => (
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
                title={`${lead.id}`} // Tooltip added here
              >
                <span className="truncate w-full text-center flex justify-left">
                  {truncateWithEllipsis(lead?.id, 8)}
                </span>
              </div>

              {/* Name */}
              <div
                className="w-[11%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={`${formatName(lead.name)}`} // Tooltip added here
              >
                <span className="truncate w-full text-center flex justify-left">
                  {truncateWithEllipsis(formatName(lead.name), 15)}
                </span>
              </div>

              {/* Phone */}
              <div
                className="w-[9%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={`${lead?.phone}`} // Tooltip added here
              >
                <span className="truncate w-full text-center flex justify-left">
                  {getLast10Digits(lead?.phone)}
                </span>
              </div>

              {/* Employee Name */}
              <div
                className="w-[12%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={`${lead?.LeadAssignments?.[0]?.AssignedTo?.name}`} // Tooltip added here
              >
                <span className="truncate w-full text-center flex justify-left">
                  {(lead?.LeadAssignments || []).length > 0
                    ? truncateWithEllipsis(
                        formatName(
                          lead?.LeadAssignments[0]?.AssignedTo?.name,
                          15
                        )
                      )
                    : ""}
                </span>
              </div>

              {/* Source */}
              <div
                className="w-[10%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={`${lead?.lead_source || "Not Available"}`} // Tooltip added here
              >
                <span className="truncate w-full text-center flex justify-left">
                  {truncateWithEllipsis(formatName(lead.lead_source), 10) ||
                    truncateWithEllipsis("Not Available", 10)}
                </span>
              </div>

              {/* Walk-In Call Date Time */}
              <div
                className="w-[7%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={moment(lead.closing_date)
                  .utcOffset(330)
                  .format("DD MMM YY")} // Tooltip added here
              >
                {moment(lead.closing_date).utcOffset(330).format("DD MMM YY")}
              </div>

              {/* Verification Date*/}
              <div
                className="w-[7%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={moment(lead.verification_date)
                  .utcOffset(330)
                  .format("DD MMM YY")} // Tooltip added here
              >
                {
                  lead.verification_date ?
                  moment(lead.verification_date)
                  .utcOffset(330)
                  .format("DD MMM YY") :
                  "-"
                }
              </div>

              {/* login date */}
              <div
                className="w-[8%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
                title={moment(lead.login_date)
                  .utcOffset(330)
                  .format("DD MMM YY")} // Tooltip added here
              >
                {
                  lead.login_date ?
                  moment(lead.login_date)
                  .utcOffset(330)
                  .format("DD MMM YY") :
                  "-"
                }
              </div>

              {/* lead Status */}
              <div
                className="w-[13%] flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden pr-4"
                title={`Status: ${
                  terminologiesMap.get(lead?.lead_status) || "Not Available"
                }`} // Tooltip added here
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
                            // (lead?.lead_status ||
                            //   (lead?.last_updated_status === "Others"
                            //     ? lead.last_updated_status
                            //     : (lead?.Activities || [])[0]
                            //         ?.activity_status || ""))
                            lead.lead_status
                          // lead.last_updated_status
                        )?.optionColor || "#46AACA"
                      }
                    />
                  </svg>
                </div>

                {/* Select */}
                <select
                  className="w-full px-1 py-1 pl-0 text-xs font-normal inter-inter leading-tight bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                  value={
                    // lead?.lead_status ||
                    // (lead?.last_updated_status === "Others"
                    //   ? lead.last_updated_status
                    //   : (lead?.Activities || [])[0]?.activity_status || "")
                    lead.lead_status
                  }
                  onChange={(e) => handleLeadStatusChange(e, lead)}
                  onClick={(e) => (e.target.value = "")}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                e.target.value =
                                  lead?.lead_status
                              }
                            }}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23464646'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 8px center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "14px",
                    zIndex: isConfirmationDialogueOpened && -1,
                    paddingLeft: "5px",
                  }}
                >
                  {(lead.application_status === CLOSING_AMOUNT_PAID
                    ? [
                        ...leadStatusOptionsForPaidApprovedApplicationsPageTable,
                        ...leadStatusAfterClosingAmountPaidOptionsForPaidApprovedApplicationsPageTable,
                      ]
                    : leadStatusOptionsForPaidApprovedApplicationsPageTable
                  ).map((option, index) => (
                    <option
                      key={index}
                      value={option.value}
                      className="text-xs p-2 truncate"
                      style={{ ...option.style }}
                      disabled={option.value === TWELVE_DOCUMENTS_COLLECTED}
                    >
                      {terminologiesMap.get(option.value) || option.label}
                    </option>
                  ))}
                  {[BUREAU_DISPUTE_RAISED,
                  ALL_DISPUTES_UPDATED,
                    LOGIN_BANK_1,
                    LOGIN_BANK_2,
                    LOGIN_BANK_3,
                    LOGIN_BANK_4,
                    LOGIN_BANK_5,
                    LOGIN_BANK_6,
                  ].map((status) =>
                    lead.lead_status === status &&
                    lead.application_status !== CLOSING_AMOUNT_PAID ? (
                      <option
                        key={status}
                        value={status}
                        disabled
                        className="truncate"
                        style={{color:'#464646', backgroundColor:'#F2F7FE'}}
                      >
                        {terminologiesMap.get(status) || status}
                      </option>
                    ) : null
                  )}
                </select>
              </div>

              {/* Application Status */}
              <div
                className="w-[10%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
                title={`Application Status: ${
                  terminologiesMap.get(lead?.application_status) ||
                  "Not Available"
                }`} // Tooltip added here
              >
                {/* Colored Dot */}
                <div
                  className="w-[6px] h-[6px] rounded-full mr-1.5"
                  style={{
                    backgroundColor:
                      optionColors.find(
                        (option) =>
                          option.optionName === (lead?.application_status || "")
                      )?.optionColor || "#32086d",
                  }}
                ></div>

                {user.user.role !== ROLE_EMPLOYEE ? (
                  <select
                    className="w-full px-1 pl-0 py-1 text-xs font-normal inter-inter leading-tight bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                    value={lead?.application_status}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23464646'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 8px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "14px",
                      zIndex: isConfirmationDialogueOpened && -1,
                      paddingLeft: "5px",
                    }}
                    onChange={(e) => handleApplicationStatusChange(e, lead)}
                    disabled={user.user.role === ROLE_EMPLOYEE}
                    onClick={(e) => (e.target.value = "")}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                e.target.value =
                                  lead?.application_status
                              }
                            }}
                  >
                    {([
                      LOGIN_BANK_1,
                      LOGIN_BANK_2,
                      LOGIN_BANK_3,
                      LOGIN_BANK_4,
                      LOGIN_BANK_5,
                      LOGIN_BANK_6,
                    ].includes(lead.lead_status)
                      ? [
                          ...applicationStatusOptionsForPaidApprovedApplicationsPageTable,
                          ...applicationStatusBankLoginOptionsForPaidApprovedApplicationsPageTable,
                        ]
                      : applicationStatusOptionsForPaidApprovedApplicationsPageTable
                    ).map((option, index) => (
                      <option
                        key={index}
                        value={option.value}
                        className="text-xs p-2 truncate"
                        style={{ ...option.style }}
                      >
                        {terminologiesMap.get(option.value) || option.label}
                      </option>
                    ))}

                    {/* Show disabled selected value if it matches restricted ones */}
                    {[REJECTED, CLOSED, LOGIN, NORMAL_LOGIN].includes(
                      lead?.application_status
                    ) && (
                      <option
                        value={lead.application_status}
                        disabled
                        className="text-xs p-2 truncate"
                        style={{ color: "#464646", backgroundColor: "#F2F7FE" }}
                      >
                        {terminologiesMap.get(lead.application_status) ||
                          lead.application_status}
                      </option>
                    )}
                  </select>
                ) : (
                  <span
                    className="truncate w-full text-left px-1"
                    style={{
                      color:
                        optionColors.find(
                          (item) => item.optionName === lead?.application_status
                        )?.optionColor || "#000",
                    }}
                  >
                    {terminologiesMap.get(lead?.application_status) ||
                      lead?.application_status ||
                      "Select Application Status"}
                  </span>
                )}
              </div>

              {/* View Icon */}
              <div className="w-[5%] flex justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-tight rounded-br-[10px] rounded-tr-[10px] overflow-hidden pl-8">
                <ViewIcon
                  onClick={() => handleClickOnView(lead.id, lead.name)}
                />
              </div>
            </div>
          ))}
        </div>
        {showUpdateApplicationStatusDialogue && (
          <UpdateApplicationStatusDialogue
            onClose={() => setShowUpdateApplicationStatusDialogue(false)}
            payload={apiPayload}
            openToast={openToast}
            setOpenToast={setOpenToast}
            onStatusUpdate={() => {
              dispatch(
                getApprovedLeads({
                  ...defaultPaidApprovedLeadsTableFilters,
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                })
              );
              dispatch(
                updateLeadStatus({
                  id: apiPayload.lead_id,
                  status: apiPayload.application_status,
                })
              );
            }}
          />
        )}
        {showUpdateLeadStatusDialogue && (
          <UpdateLeadStatusDialogue
            onClose={() => setShowUpdateLeadStatusDialogue(false)}
            payload={apiPayload}
            openToast={openToast}
            setOpenToast={setOpenToast}
            onStatusUpdate={() => {
              dispatch(
                getApprovedLeads({
                  ...defaultPaidApprovedLeadsTableFilters,
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                })
              );
            }}
          />
        )}
        {showActivityLogsInCommonDialogue && (
          <CommonDialogue
            onClose={() => setShowActivityLogsInCommonDialogue(false)}
            leadId={selectedLeadId}
            fromTable={true}
            leadName={selectedLeadName}
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
      </div>
    </>
  );
}

export default PaidApplicationsTable;
