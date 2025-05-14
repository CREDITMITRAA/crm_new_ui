import { useDispatch, useSelector } from "react-redux";
import ProfileAvatarMale from "../../assets/images/profile_avatar_male.png";
import ProfileAvatarFemale from "../../assets/images/profile_avatar_female.png";
import TwelveDocumentsButton from "../common/TwelveDocumentsButton";
import UploadBereauButton from "../common/UploadBereauButton";
import UploadPayslipButton from "../common/UploadPayslipButton";
import {
  activityOptions,
  ALL_DISPUTES_UPDATED,
  APPLICATION_APPROVED,
  applicationStatusBankLoginOptionsForPaidApprovedApplicationsPageTable,
  applicationStatusOptionsForPaidApprovedApplicationsPageTable,
  applicationStatusOptionsForUnPaidApprovedApplicationsPageTable,
  applicationStatusOptionsForWalkInsPageTable,
  APPOINTMENTS,
  APPROVED_APPLICATIONS,
  APPROVED_FOR_WALK_IN,
  BUREAU_DISPUTE_RAISED,
  CANCELLED,
  CLOSED,
  CLOSING_AMOUNT_PAID,
  CREDIT_BUREAU,
  LEADS,
  leadStatusAfterClosingAmountPaidOptionsForPaidApprovedApplicationsPageTable,
  leadStatusOptionsForPaidApprovedApplicationsPageTable,
  leadStatusOptionsForUnPaidApprovedApplicationsPageTable,
  leadStatusOptionsForVerification1Table,
  leadStatusOptionsForWalkInsPageTable,
  LOGIN,
  LOGIN_BANK_1,
  LOGIN_BANK_2,
  LOGIN_BANK_3,
  LOGIN_BANK_4,
  LOGIN_BANK_5,
  LOGIN_BANK_6,
  NORMAL_LOGIN,
  OTHER_DOCS,
  OTHERS,
  PAYSLIP,
  PENDING,
  PIPELINE_ENTRIES,
  PRELIMINERY_CHECK,
  REJECTED,
  RESCHEDULE_CALL_WITH_MANAGER,
  RESCHEDULE_WALK_IN,
  RESCHEDULED_FOR_WALK_IN,
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  SCHEDULE_CALL_WITH_MANAGER,
  SCHEDULE_FOR_WALK_IN,
  SCHEDULED_CALL_WITH_MANAGER,
  SCHEDULED_FOR_WALK_IN,
  terminologiesMap,
  TWELVE_DOCUMENTS_COLLECTED,
  TWELVE_DOCUMENTS_NOT_COLLECTED,
  UPCOMING,
  VERIFICATION_1,
  verificationStatusOptionsForVerificationTable,
  WALK_INS,
} from "../../utilities/AppConstants";
import { uploadLeadDocument } from "../../features/lead-documents/leadDocumentsThunks";
import Snackbar from "../common/snackbars/Snackbar";
import { useEffect, useState } from "react";
import DropDown from "../common/dropdowns/DropDown";
import AddActivityDialogue from "../common/dialogues/AddActivityDialogue";
import {
  getLeadByLeadId,
  getRecentActivityNotesByLeadId,
} from "../../features/leads/leadsThunks";
import { formatName, isEmpty } from "../../utilities/utility-functions";
import { getRecentActivity } from "../../features/activities/activitiesThunks";
import UpdateLeadStatusDialogue from "../common/dialogues/UpdateLeadStatusDialogue";
import ScheduleWalkInOrCallDialogue from "../common/dialogues/ScheduleWalkInOrCallDialogue";
import { getAllWalkInLeads } from "../../features/walk-ins/walkInsThunks";
import UpdateApplicationStatusDialogue from "../common/dialogues/UpdateApplicationStatusDialogue";
import UpdateVerificationStatusDialogue from "../common/dialogues/UpdateVerificationStatusDialogue";

function EmployeeDetailsCard() {
  const dispatch = useDispatch();
  const { lead, recentActivityNotes } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const {
    loading,
    error,
    uploadDocumentsLoading,
    uploadDocumentsError,
    payslips,
    bureaus,
  } = useSelector((state) => state.leadDocuments);
  const {
    recentActivity,
    loading: activitiesLoading,
    error: activitiesError,
  } = useSelector((state) => state.activities);
  const { loanReports } = useSelector((state) => state.loanReports);
  const { creditReports } = useSelector((state) => state.creditReports);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const [selectedActivityStatus, setSelectedActivityStatus] = useState(null);
  const [showAddActivityDialogue, setShowAddActivityDialogue] = useState(false);
  const [leadBukcet, setLeadBucket] = useState(LEADS);
  console.log("activity status recent = ", recentActivity?.activity_status);
  const [showUpdateLeadStatusDialogue, setShowUpdateLeadStatusDialogue] =
    useState(false);
  const [apiPayload, setApiPayload] = useState({});
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
  const [isReschedule, setIsReschedule] = useState(false);
  const [selectedWalkIn, setSelectedWalkIn] = useState(null);
  const [selectedLeadName, setSelectedLeadName] = useState(null);
  const [
    showUpdateVerificationStatusDialogue,
    setShowUpdateVerificationStatusDialogue,
  ] = useState(false);

  useEffect(() => {
    console.log("LEAD FROM STORE = ", lead);
    // setLeadBucket(
    //   lead.last_updated_status === SCHEDULED_FOR_WALK_IN ||
    //     lead.verification_status === SCHEDULED_FOR_WALK_IN
    //     ? WALK_INS
    //     : lead.lead_status === VERIFICATION_1
    //     ? VERIFICATION_1
    //     : LEADS
    // );
    setLeadBucket(lead.lead_bucket);
  }, [lead]);

  useEffect(() => {
    if (recentActivity?.activity_status) {
      console.log("activity status recent = ", recentActivity.activity_status);

      setSelectedActivityStatus(recentActivity.activity_status);
    }
  }, [recentActivity]);

  useEffect(() => {
    if (loading) {
      setToastStatusType("INFO");
      setToastMessage("Updating lead details...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Lead updated successfully...");
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

  useEffect(() => {
    if (uploadDocumentsLoading) {
      setToastStatusType("INFO");
      setToastMessage("Uploading Document...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Document Uploaded...");
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [uploadDocumentsLoading]);

  useEffect(() => {
    if (uploadDocumentsError) {
      setToastStatusType("ERROR");
      setToastMessage(uploadDocumentsError.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [uploadDocumentsError]);

  useEffect(() => {
    if (activitiesLoading) {
      setToastStatusType("INFO");
      setToastMessage("Adding activity...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Activity added...");
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [activitiesLoading]);

  useEffect(() => {
    if (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [activitiesError]);

  function uploadLeadDocumentHandler(document_type, file) {
    setOpenToast(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lead_id", lead.id);
    formData.append("document_type", document_type);
    formData.append("lead_name", lead.name);
    formData.append("user_id", user.user.id);
    dispatch(uploadLeadDocument(formData));
  }

  function handleSelectActivity(field, value) {
    setSelectedActivityStatus(value);
    setShowAddActivityDialogue(true);
  }

  function handleLeadStatusChange(e, lead) {
    const newStatus = e.target.value;
    console.log("New status selected:", newStatus);

    e.stopPropagation();

    // Check if user has permission
    if (![ROLE_EMPLOYEE, ROLE_ADMIN].includes(user.user.role)) {
      showErrorToast("Manager has no access to update lead status");
      return;
    }

    const walk_in = lead.walkIns?.[0]; // Safe access with optional chaining
    const walkInStatus = walk_in ? getStatusDetails(walk_in).status : null;

    // Handle reschedule cases
    if (
      [RESCHEDULE_WALK_IN, RESCHEDULE_CALL_WITH_MANAGER].includes(newStatus)
    ) {
      if ([UPCOMING, PENDING].includes(walkInStatus)) {
        const message = walk_in?.is_call
          ? "Please complete or cancel the existing Scheduled Call!"
          : "Please complete or cancel the existing Scheduled Walk-In!";
        showErrorToast(message);
        return;
      }
      console.log("walk in  = ", walk_in);

      // Proceed with rescheduling
      setIsCall(newStatus === RESCHEDULE_CALL_WITH_MANAGER);
      setIsReschedule(true);
      setSelectedLead(lead);
      setSelectedLeadStatus(newStatus);
      setShowScheduleWalkInOrCallDialogue(true);
      setSelectedWalkIn({ ...walk_in, walk_in_id: walk_in.id });
      return;
    }

    // Handle non-scheduling status changes
    if (
      ![SCHEDULED_FOR_WALK_IN, SCHEDULED_CALL_WITH_MANAGER].includes(newStatus)
    ) {
      if (walkInStatus === CANCELLED) {
        showErrorToast(
          "Please complete or cancel the existing Scheduled Walk-In!"
        );
        return;
      }

      if ([PENDING, UPCOMING].includes(walkInStatus)) {
        const message = walk_in?.is_call
          ? "Please complete existing Scheduled Call!"
          : "Please complete Scheduled Walk-In!";
        showErrorToast(message);
        return;
      }

      // Prepare payload for status update
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
  }

  function showErrorToast(message) {
    setToastStatusType("ERROR");
    setToastStatusMessage("Error...");
    setToastMessage(message);
    setShouldSnackbarCloseOnClickOfOutside(true);
    setOpenToast(true);
  }

  function handleApplicationStatusChange(e, lead) {
    e.stopPropagation();
    console.log("lead details = ", lead);

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
        setToastMessage(terminologiesMap.get(TWELVE_DOCUMENTS_NOT_COLLECTED));
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
        payload["assigned_to"] = lead.LeadAssignments[0].assigned_to;
        console.log("payload for update application status = ", payload);
        setApiPayload(payload);
        setShowUpdateApplicationStatusDialogue(true);
      }
    }
  }

  function handleLeadStatusChangeForVerificationsPageLeadStatus(e, lead) {
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

  function handleLeadStatusChangeForApprovedLeads(e, lead){
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

  function handleApplicationStatusChangeForApprovedLeads(e, lead) {
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
        payload["lead_bucket"] = APPROVED_APPLICATIONS
        console.log("payload for update application status = ", payload);
        setApiPayload(payload);
        setShowUpdateApplicationStatusDialogue(true);
      
    }
  }

  return (
    <>
      <div className="w-full bg-[#E9F3FF] h-full rounded-2xl shadow-lg flex flex-col justify-center items-center px-[0.625rem] pb-[0.938rem]">
        {/* profile avatar */}
        <div className="pt-[0.938rem] mx-auto">
          <div
            className={`w-[6.25rem] h-[6.25rem] bg-[#ba8bfc] rounded-full border-4 ${
              lead.is_rejected ? "border-[#CF2525BA]" : "border-[#229d00]"
            } flex justify-center items-center`}
          >
            <img
              className="w-[5rem] h-[5.625rem]"
              src={
                lead.gender === "female"
                  ? ProfileAvatarFemale
                  : ProfileAvatarMale
              }
            />
          </div>
        </div>

        {/* lead id */}
        <div className="text-[#214768] text-sm font-medium inter-inter leading-tight mt-[0.313rem]">
          Lead id : {lead.id}
        </div>

        {/* lead name */}
        <div className="text-[#214768] text-base font-semibold poppins-thin leading-tight mt-[0.625rem]">
          {formatName(lead.name)}
        </div>

        {/* lead email */}
        <div className="text-[#828282] text-xs font-normal poppins-thin leading-tight mt-[0.125rem]">
          {lead.email || "NA"}
        </div>

        {/* lead status */}
        <div className="flex justify-center mt-2 min-w-40">
          {/* <DropDown
            options={[
              ...activityOptions,
              ...(lead?.Activities?.[0]?.docs_collected
                ? [
                    {
                      label: terminologiesMap.get(VERIFICATION_1),
                      value: VERIFICATION_1,
                    },
                  ]
                : []),
            ]}
            onChange={(field, value) => handleSelectActivity(field, value)}
            className="w-full h-full flex items-center justify-between"
            defaultSelectedOptionIndex={
              recentActivity?.activity_status
                ? activityOptions.findIndex(
                    (activity) =>
                      activity.value === recentActivity.activity_status
                  )
                : 0
            }
          /> */}

          {leadBukcet === PIPELINE_ENTRIES ? (
            // Leads bucket select (unchanged)
            <select
              className="w-full bg-[#D9E4F2] h-full flex items-center justify-between border px-3 py-2 rounded-md text-[#464646] cursor-pointer"
              value={recentActivity?.activity_status || ""}
              onChange={(e) =>
                handleSelectActivity("activity_status", e.target.value)
              }
            >
              {[
                ...activityOptions,
                ...(lead?.Activities?.[0]?.docs_collected ||
                !isEmpty(payslips) ||
                !isEmpty(bureaus) ||
                !isEmpty(loanReports) ||
                !isEmpty(creditReports)
                  ? [
                      {
                        label: terminologiesMap.get(VERIFICATION_1),
                        value: VERIFICATION_1,
                      },
                    ]
                  : []),
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : leadBukcet === APPOINTMENTS &&
            user.user.role === ROLE_EMPLOYEE ? (
            // Walk-ins for employees
            <div className="w-full bg-[#D9E4F2] h-full flex items-center justify-between border border-[#6b7280] px-3 py-2 rounded-md text-[#464646]">
              <select
                className="w-full px-1 py-1 pl-0 text-xs font-normal inter-inter leading-tight bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                value={
                  lead?.lead_status ||
                  (lead?.last_updated_status === "Others"
                    ? lead.last_updated_status
                    : (lead?.Activities || [])[0]?.activity_status || "")
                }
                onChange={(e) => handleLeadStatusChange(e, lead)}
                disabled={lead?.application_status === REJECTED}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23${"464646".replace(
                    "#",
                    ""
                  )}'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 8px center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "14px",
                  zIndex: isConfirmationDialogueOpened && -1,
                  paddingLeft: "5px",
                }}
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
                  <option
                    value="Scheduled For Walk-In"
                    disabled
                    className="truncate"
                  >
                    {terminologiesMap.get("Scheduled For Walk-In") ||
                      "Scheduled For Walk-In"}
                  </option>
                )}
                {lead.lead_status === "Scheduled Call With Manager" && (
                  <option
                    value="Scheduled Call With Manager"
                    disabled
                    className="truncate"
                  >
                    {terminologiesMap.get("Scheduled Call With Manager") ||
                      "Scheduled Call With Manager"}
                  </option>
                )}
                {lead.lead_status === RESCHEDULED_FOR_WALK_IN && (
                  <option
                    value={RESCHEDULED_FOR_WALK_IN}
                    disabled
                    className="truncate"
                  >
                    {terminologiesMap.get(RESCHEDULED_FOR_WALK_IN) ||
                      RESCHEDULED_FOR_WALK_IN}
                  </option>
                )}
              </select>
            </div>
          ) : leadBukcet === APPOINTMENTS &&
            user.user.role !== ROLE_EMPLOYEE ? (
            // Walk-ins for non-employees
            <div className="w-full bg-[#D9E4F2] h-full flex items-center justify-between border border-[#6b7280] px-3 py-2 rounded-md text-[#464646]">
              <select
                className="w-full px-1 pl-0 py-1 text-xs font-normal inter-inter leading-tight bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                value={lead?.application_status}
                style={{
                  // color:
                  //   optionColors.find(
                  //     (option) =>
                  //       option.optionName ===
                  //       (lead?.application_status || "")
                  //   )?.optionColor || "#32086d",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23${
                    // optionColors
                    //   .find(
                    //     (option) =>
                    //       option.optionName ===
                    //       (lead?.application_status || "")
                    //   )
                    //   ?.optionColor?.replace("#", "") || "32086d"
                    "464646"
                  }'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 8px center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "14px",
                  zIndex: isConfirmationDialogueOpened && -1,
                  paddingLeft: "5px",
                }}
                onChange={(e) => handleApplicationStatusChange(e, lead)}
                disabled={user.user.role === ROLE_EMPLOYEE}
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
            </div>
          ) : leadBukcet === PRELIMINERY_CHECK &&
            user.user.role === ROLE_EMPLOYEE ? (
            // Verification for employees
            <div className="w-full bg-[#D9E4F2] h-full flex items-center justify-between border border-[#6b7280] px-3 py-2 rounded-md text-[#464646]">
              <select
                className="w-full px-1 py-1 pl-0 text-xs font-normal inter-inter leading-tight bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                value={
                  lead?.last_updated_status === "Others"
                    ? lead.last_updated_status
                    : lead?.Activities[0]?.activity_status || ""
                }
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23464646'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 8px center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "14px",
                  zIndex: isConfirmationDialogueOpened && -1,
                  paddingLeft: "5px",
                }}
                onChange={(e) =>
                  handleLeadStatusChangeForVerificationsPageLeadStatus(e, lead)
                }
                disabled={lead?.verification_status === REJECTED}
              >
                {leadStatusOptionsForVerification1Table.map((option, index) => (
                  <option
                    key={index}
                    value={option.value}
                    className="text-xs p-2 truncate"
                    style={{ ...option.style }}
                    disabled={option.value === ""}
                  >
                    {terminologiesMap.get(option.value) || option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : leadBukcet === PRELIMINERY_CHECK &&
            user.user.role !== ROLE_EMPLOYEE ? (
            // Verification for non-employees
            <div className="w-full bg-[#D9E4F2] h-full flex items-center justify-between border border-[#6b7280] px-3 py-2 rounded-md text-[#464646]">
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
            </div>
          ) : leadBukcet === APPROVED_APPLICATIONS &&
            user.user.role === ROLE_EMPLOYEE ? (
            <div className="w-full bg-[#D9E4F2] h-full flex items-center justify-between border border-[#6b7280] px-3 py-2 rounded-md text-[#464646]">
              {lead.is_paid ? (
                <select
                  className="w-full px-1 py-1 pl-0 text-xs font-normal inter-inter leading-tight bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                  value={
                    // lead?.lead_status ||
                    // (lead?.last_updated_status === "Others"
                    //   ? lead.last_updated_status
                    //   : (lead?.Activities || [])[0]?.activity_status || "")
                    lead.lead_status
                  }
                  onChange={(e) => handleLeadStatusChangeForApprovedLeads(e, lead)}
                  onClick={(e) => (e.target.value = "")}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      e.target.value = lead?.lead_status;
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
                  {[
                    BUREAU_DISPUTE_RAISED,
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
                        style={{ color: "#464646", backgroundColor: "#F2F7FE" }}
                      >
                        {terminologiesMap.get(status) || status}
                      </option>
                    ) : null
                  )}
                </select>
              ) : (
                <select
                  className="w-full px-1 py-1 pl-0 text-xs font-normal inter-inter leading-tight bg-transparent border border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                  value={
                    // lead?.lead_status ||
                    // (lead?.last_updated_status === "Others"
                    //   ? lead.last_updated_status
                    //   : (lead?.Activities || [])[0]?.activity_status || "")
                    lead.lead_status
                  }
                  // value={lead.last_updated_status || lead.verification_status}
                  onChange={(e) => handleLeadStatusChangeForApprovedLeads(e, lead)}
                  onClick={(e) => (e.target.value = "")}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      e.target.value = lead?.lead_status;
                    }
                  }}
                  // disabled={lead?.LEA === TWELVE_DOCUMENTS_COLLECTED}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23${"464646".replace(
                      "#",
                      ""
                    )}'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 8px center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "14px",
                    zIndex: isConfirmationDialogueOpened && -1,
                    paddingLeft: "5px",
                  }}
                >
                  {leadStatusOptionsForUnPaidApprovedApplicationsPageTable.map(
                    (option, index) => (
                      <option
                        key={index}
                        value={option.value}
                        className="text-xs p-2 truncate"
                        style={{ ...option.style }}
                        disabled={option.value === TWELVE_DOCUMENTS_COLLECTED}
                      >
                        {terminologiesMap.get(option.value) || option.label}
                      </option>
                    )
                  )}
                </select>
              )}
            </div>
          ) : leadBukcet === APPROVED_APPLICATIONS &&
            user.user.role !== ROLE_EMPLOYEE ? (
            <div className="w-full bg-[#D9E4F2] h-full flex items-center justify-between border border-[#6b7280] px-3 py-2 rounded-md text-[#464646]">
              {lead.is_paid ? (
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
                  onChange={(e) => handleApplicationStatusChangeForApprovedLeads(e, lead)}
                  disabled={user.user.role === ROLE_EMPLOYEE}
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
                  onChange={(e) => handleApplicationStatusChangeForApprovedLeads(e, lead)}
                  onClick={(e) => (e.target.value = "")}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      e.target.value = lead?.application_status;
                    }
                  }}
                  disabled={user.user.role === ROLE_EMPLOYEE}
                >
                  {applicationStatusOptionsForUnPaidApprovedApplicationsPageTable.map(
                    (option, index) => (
                      <option
                        key={index}
                        value={option.value}
                        className="text-xs p-2 truncate"
                        style={{ ...option.style }}
                        disabled={option.value === APPLICATION_APPROVED}
                      >
                        {terminologiesMap.get(option.value) || option.label}
                      </option>
                    )
                  )}

                  {/* Show disabled option if status is one of the commented-out ones */}
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
              )}
            </div>
          ) : null}
        </div>

        {/* notes container */}
        {recentActivityNotes?.length > 0 && (
          <div className="w-full bg-[#214768]/20 rounded-[10px] border border-[#214768] mt-[0.625rem] p-[0.938rem]">
            <ul className="list-disc pl-0 text-black text-sm font-normal inter-inter leading-[30px]">
              {recentActivityNotes.map((item, index) => (
                <li
                  key={index}
                  title={item.description} // Tooltip for full text on hover
                  className="relative flex items-center before:content-['•'] before:mr-2 before:text-black truncate hover:overflow-visible hover:whitespace-normal hover:bg-white hover:p-1 hover:rounded transition-all duration-200 cursor-pointer"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%", // Ensures ellipsis applies properly
                  }}
                >
                  {item.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* upload buttons container */}
        <div className="w-full flex justify-between gap-1 mt-[0.625rem]">
          <UploadPayslipButton
            onFileSelect={(file) => uploadLeadDocumentHandler(PAYSLIP, file)}
          />
          <UploadBereauButton
            onFileSelect={(file) =>
              uploadLeadDocumentHandler(CREDIT_BUREAU, file)
            }
          />
        </div>
        <TwelveDocumentsButton
          onFileSelect={(file) => uploadLeadDocumentHandler(OTHER_DOCS, file)}
        />
      </div>
      <Snackbar
        isOpen={openToast}
        onClose={() => setOpenToast(false)}
        status={toastStatusMessage}
        message={toastMessage}
        statusType={toastStatusType}
        shouldCloseOnClickOfOutside={shouldSnackbarCloseOnClickOfOutside}
      />
      {showAddActivityDialogue && (
        <AddActivityDialogue
          onClose={() => setShowAddActivityDialogue(false)}
          selectedActivityStatus={selectedActivityStatus}
          selectedLead={lead}
          onActivityAdded={() => {
            dispatch(
              getRecentActivityNotesByLeadId({ leadId: lead.id, limit: 3 })
            );
            dispatch(getRecentActivity({ leadId: lead.id }));
          }}
          setShowAddActivityDialogue={setShowAddActivityDialogue}
          setOpenToast={setOpenToast}
          openToast={openToast}
          setToastStatusType={setToastStatusType}
          setToastStatusMessage={setToastStatusMessage}
          setToastMessage={setToastMessage}
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
            // dispatch(
            //   getAllWalkInLeads({
            //     ...defaultWalkInLeadsTableFilters,
            //     page: pagination.page,
            //     pageSize: pagination.pageSize,
            //   })
            // );
            dispatch(getLeadByLeadId({ leadId: lead.id }));
          }}
          fromTable={true}
          isReschedule={isReschedule}
          selectedWalkIn={selectedWalkIn}
          setToastMessage={setToastMessage}
          setToastStatusType={setToastStatusType}
          setToastStatusMessage={setToastStatusMessage}
        />
      )}
      {showUpdateLeadStatusDialogue && (
        <UpdateLeadStatusDialogue
          onClose={() => setShowUpdateLeadStatusDialogue(false)}
          payload={apiPayload}
          openToast={openToast}
          setOpenToast={setOpenToast}
          onStatusUpdate={() => {
            // dispatch(
            //   getAllWalkInLeads({
            //     ...defaultWalkInLeadsTableFilters,
            //     page: pagination.page,
            //     pageSize: pagination.pageSize,
            //   })
            // );
            dispatch(getLeadByLeadId({ leadId: lead.id }));
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
            dispatch(getLeadByLeadId({ leadId: lead.id }));
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
            // dispatch(
            //   getVerificationLeads({
            //     ...filters,
            //     page: pagination.page,
            //     pageSize: pagination.pageSize,
            //   })
            // );
            dispatch(getLeadByLeadId({ leadId: lead.id }));
          }}
        />
      )}
    </>
  );
}

export default EmployeeDetailsCard;
