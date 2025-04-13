import moment from "moment";
import CheckCheckbox from "../common/checkbox/CheckCheckbox";
import UncheckedCheckbox from "../common/checkbox/UnCheckedCheckbox";
import Pagination from "../common/Pagination";
import ToggleCheckbox from "../common/checkbox/ToggleCheckbox";
import { useEffect, useState } from "react";
import CommonDialogue from "../common/dialogues/CommonDialogue";
import ViewIcon from "../icons/ViewIcon";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROLE_EMPLOYEE, terminologiesMap } from "../../utilities/AppConstants";
import CallIcon from "../icons/CallIcon";
import AddActivityDialogue from "../common/dialogues/AddActivityDialogue";
import {
  getAllLeads,
  getLeadsByAssignedUserId,
  getRecentActivityNotesByLeadId,
} from "../../features/leads/leadsThunks";
import Snackbar from "../common/snackbars/Snackbar";
import {
  formatName,
  getLast10Digits,
  truncateWithEllipsis,
} from "../../utilities/utility-functions";

function AssignedLeadsTable({
  leads,
  areAllLeadsSelected,
  setAreAllLeadsSelected,
  selectAllLeads,
  selectedLeadIds,
  handleCheckboxChange,
}) {
  const dispatch = useDispatch();
  const { role, user } = useSelector((state) => state.auth);
  const { pagination } = useSelector((state) => state.leads);
  const { loading, error } = useSelector((state) => state.activities);
  const navigate = useNavigate();
  const [
    showActivityLogsInCommonDialogue,
    setShowActivityLogsInCommonDialogue,
  ] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [showAddActivityDialogue, setShowAddActivityDialogue] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);

  useEffect(() => {
    if (loading) {
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
  }, [loading]);

  useEffect(() => {
    if (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [error]);

  function handleClickOnView(leadId) {
    setSelectedLeadId(leadId);
    setShowActivityLogsInCommonDialogue(true);
  }

  // function addActivityHandler() {
  //   dispatch(
  //     getAllLeads({ page: pagination[page], pageSize: pagination[pageSize] })
  //   );
  //   dispatch(
  //     getRecentActivityNotesByLeadId({ leadId: selectedLead.id, limit: 3 })
  //   );
  // }

  return (
    <>
      <div className="w-full flex flex-col">
        {/* table */}
        <div className="w-full h-max flex flex-col">
          {/* table header */}
          <div
            className="w-full h-9 bg-[#B3C6E0] justify-start flex rounded-[10px] mb-2"
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
            {/* checkbox */}
            <div
              className={`w-[${
                role === ROLE_EMPLOYEE ? 0 : 5
              }%] h-9 flex justify-center items-center rounded-tl-[10px] ${
                role === ROLE_EMPLOYEE && "hidden"
              }`}
            >
              {/* <CheckCheckbox /> */}
              <ToggleCheckbox
                checked={areAllLeadsSelected}
                onClick={() => {
                  setAreAllLeadsSelected(!areAllLeadsSelected);
                  selectAllLeads();
                }}
              />
            </div>

            {/* lead id */}
            <div
              className={`w-[8%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1 ${
                role === ROLE_EMPLOYEE && "rounded-tl-[10px] pl-[20px]"
              }`}
            >
              Lead ID
            </div>

            {/* name */}
            <div className="w-[11%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1">
              Name
            </div>

            {/* Phone */}
            <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1 ">
              Phone
            </div>

            {/* Status */}
            <div className="w-[13%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1 ">
              Status
            </div>

            {/* Source */}
            <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1 ">
              Source
            </div>

            {/* Imported On */}
            <div className="w-[12%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1 ">
              Imported On
            </div>

            {/* Updated At */}
            <div className="w-[13%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1 ">
              Updated At
            </div>

            {/* Assigned */}
            {role !== ROLE_EMPLOYEE && (
              <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1 ">
                Assigned
              </div>
            )}

            {/* Assigned Date */}
            <div className="w-[13%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1 ">
              Assigned Date
            </div>

            {/* View */}
            <div
              className={`w-[${
                role === ROLE_EMPLOYEE ? 10 : 5
              }%] flex ${role === ROLE_EMPLOYEE ? 'justify-center' : 'justify-left'} items-center text-[#214768] text-xs font-bold poppins-thin leading-none px-1 rounded-tr-[10px] ${role === ROLE_EMPLOYEE && "pl-[40px]"}`}
            >
              {role === ROLE_EMPLOYEE ? "Action" : "View"}
            </div>
          </div>

          {/* table row */}
          {leads.map((lead, index) => (
            <div
              className="w-full h-9 justify-start flex cursor-pointer mb-1 rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg"
              key={lead.id}
              style={{
                boxShadow: `7px 2px 16px 0px rgba(0, 0, 0, 0.05) inset, 
        27px 7px 28px 0px rgba(0, 0, 0, 0.05) inset, 
        62px 16px 38px 0px rgba(0, 0, 0, 0.03) inset, 
        110px 29px 45px 0px rgba(0, 0, 0, 0.04) inset, 
        172px 46px 50px 0px rgba(0, 0, 0, 0.05) inset`,
                backgroundColor: "rgba(216, 232, 255, 1)",
              }}
            >
              {/* Checkbox */}
              <div
                className={`${
                  role === ROLE_EMPLOYEE ? "w-0 hidden" : "w-[5%]"
                } h-full flex justify-center items-center `}
              >
                <ToggleCheckbox
                  checked={selectedLeadIds?.some(
                    (selectedLead) => selectedLead.id === lead.id
                  )}
                  onClick={() =>
                    handleCheckboxChange(
                      lead.id,
                      lead.name,
                      lead.last_updated_status
                    )
                  }
                />
              </div>

              {/* Lead ID */}
              <div
                className={`w-[8%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none  overflow-hidden px-1 ${role === ROLE_EMPLOYEE && "pl-[20px]"}`}
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
              >
                <span className="truncate px-1 w-full text-center flex justify-left">
                  {/* {truncateWithEllipsis(lead.id, 8)} */}
                  00000000
                </span>
              </div>

              {/* Lead Name */}
              <div
                className="w-[11%] poppins-thin px-1 flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {truncateWithEllipsis(formatName(lead.name), 15)}
                </span>
              </div>

              {/* Phone */}
              <div
                className="w-[10%] inter-inter flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden px-1"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {getLast10Digits(lead.phone)}
                </span>
              </div>

              {/* Status */}
              <div
                className="w-[13%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden px-1"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {role === ROLE_EMPLOYEE
                    ? truncateWithEllipsis(
                        terminologiesMap.get(lead.leadStatus),
                        20
                      )
                    : truncateWithEllipsis(
                        terminologiesMap.get(
                          lead?.last_updated_status || lead?.lead_status
                        ),
                        20
                      )}
                </span>
              </div>

              {/* Source */}
              <div
                className="w-[10%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden px-1"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {role === ROLE_EMPLOYEE
                    ? truncateWithEllipsis(formatName(lead.leadSource), 10)
                    : truncateWithEllipsis(formatName(lead.lead_source), 10)
                    ? truncateWithEllipsis(formatName(lead.lead_source), 10)
                    : truncateWithEllipsis("Not Available", 10)}
                </span>
              </div>

              {/* Imported On */}
              <div
                className="w-[12%] flex flex-col justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {moment(lead.createdAt)
                    .utcOffset(330)
                    .format("DD MMM YY hh:mm a")}
                </span>
                {/* <span className="truncate w-full text-center flex justify-left">
                  {moment(lead.createdAt).utcOffset(330).format("hh:mm:ss A")}
                </span> */}
              </div>

              {/* Updated At */}
              <div
                className="w-[13%] flex flex-col justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {moment(lead.updatedAt)
                    .utcOffset(330)
                    .format("DD MMM, YY hh:mm a")}
                </span>
                {/* <span className="truncate w-full text-center flex justify-left">
                  {moment(lead.updatedAt).utcOffset(330).format("hh:mm:ss A")}
                </span> */}
              </div>

              {/* Assigned */}
              {role !== ROLE_EMPLOYEE && (
                <div
                  className="w-[10%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden"
                  onDoubleClick={() =>
                    navigate(`/lead-details-page/${lead.id}`)
                  }
                >
                  <span className="truncate w-full text-center flex justify-left">
                    {lead.LeadAssignments?.length > 0
                      ? truncateWithEllipsis(
                          formatName(lead.LeadAssignments[0]?.AssignedTo?.name),
                          15
                        )
                      : truncateWithEllipsis("Not Assigned", 15)}
                  </span>
                </div>
              )}

              {/* Assigned Date */}
              <div
                className="w-[13%] flex flex-col justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden"
                onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
              >
                <span className="truncate w-full text-center flex justify-left">
                  {role === ROLE_EMPLOYEE
                    ? moment(lead.assignedAt)
                        .utcOffset(330)
                        .format("DD MMM, YY hh:mm a")
                    : lead.LeadAssignments && lead.LeadAssignments.length > 0
                    ? moment(lead?.LeadAssignments[0]?.updatedAt)
                        .utcOffset(330)
                        .format("DD MMM, YY hh:mm a")
                    : "Not Assigned"}
                </span>
                {/* <span className="truncate w-full text-center flex justify-left">
                  {role === ROLE_EMPLOYEE
                    ? moment(lead.assignedAt)
                        .utcOffset(330)
                        .format("hh:mm:ss A")
                    : lead.LeadAssignments && lead.LeadAssignments.length > 0
                    ? moment(lead?.LeadAssignments[0]?.updatedAt)
                        .utcOffset(330)
                        .format("hh:mm:ss A")
                    : ""}
                </span> */}
              </div>

              {/* View */}
              <div
                className={`${
                  role === ROLE_EMPLOYEE ? "w-[10%]" : "w-[5%]"
                } flex ${role === ROLE_EMPLOYEE ? 'justify-center pl-8' : 'justify-left pl-2'} items-center text-[#000000] text-xs font-normal inter-inter leading-none rounded-tr-lg rounded-br-lg`}
                style={{paddingRight: role === ROLE_EMPLOYEE && '10px'}}
              >
                {role === ROLE_EMPLOYEE && (
                  <CallIcon
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowAddActivityDialogue(true);
                    }}
                  />
                )}
                <ViewIcon onClick={() => handleClickOnView(lead.id)} />
              </div>
            </div>
          ))}
        </div>
        {showActivityLogsInCommonDialogue && (
          <CommonDialogue
            onClose={() => setShowActivityLogsInCommonDialogue(false)}
            leadId={selectedLeadId}
            fromTable={true}
          />
        )}
      </div>
      {showAddActivityDialogue && (
        <AddActivityDialogue
          onClose={() => setShowAddActivityDialogue(false)}
          onActivityAdded={() => {
            dispatch(
              getLeadsByAssignedUserId({
                userId: user.user.id,
                page: pagination.page,
                pageSize: pagination.pageSize,
              })
            );
            dispatch(
              getRecentActivityNotesByLeadId({
                leadId: selectedLead.id,
                limit: 3,
              })
            );
          }}
          fromTable={true}
          selectedLead={selectedLead}
          setOpenToast={setOpenToast}
          openToast={openToast}
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
    </>
  );
}

export default AssignedLeadsTable;
