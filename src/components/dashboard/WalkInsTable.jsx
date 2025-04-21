import { useDispatch, useSelector } from "react-redux";
import CheckCheckbox from "../common/checkbox/CheckCheckbox";
import UncheckedCheckbox from "../common/checkbox/UnCheckedCheckbox";
import Pagination from "../common/Pagination";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import {
  getAllWalkInLeads,
  getWalkIns,
  updateWalkInOrCallStatus,
} from "../../features/walk-ins/walkInsThunks";
import DateButton from "../common/DateButton";
import FilterButton from "../common/FiltersButton";
import ClearButton from "../common/ClearButton";
import ExportButton from "../common/ExportButton";
import {
  exportWalkInLeadsHandler,
  formatDatePayload,
  formatName,
  formatSentence,
  getLast10Digits,
  isEmpty,
  truncateWithEllipsis,
} from "../../utilities/utility-functions";
import Snackbar from "../common/snackbars/Snackbar";
import DateTimeRangePicker from "../common/DateTimeRangePicker";
import FilterDialogue from "../common/filter-dialogue/FilterDialogue";
import FilterDialogueForWalkInsTable from "./walk-ins-table/FilterDialogueForWalkInsTable";
import { debounce } from "lodash";
import { ROLE_EMPLOYEE } from "../../utilities/AppConstants";
import Loader from "../common/loaders/Loader";
import EmptyDataMessageIcon from "../icons/EmptyDataMessageIcon";
import { useNavigate } from "react-router-dom";
import ScheduleWalkInOrCallDialogue from "../common/dialogues/ScheduleWalkInOrCallDialogue";
import { getVerificationLeads } from "../../features/verification/verificationThunks";

function WalkInsTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    walkIns,
    pagination,
    statusUpdateLoading,
    statusUpdateError,
    loading,
  } = useSelector((state) => state.walkIns);
  const { users } = useSelector((state) => state.users);
  const { user, role } = useSelector((state) => state.auth);
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const [filters, setFilters] = useState({
    // verification_status: "Approved for Walk-In",
    // verification_status: [
    //   "Scheduled For Walk-In",
    //   "Scheduled Call With Manager",
    // ],
    // lead_status: "",
    // for_walk_ins_page: true,
    // walk_in_attributes: [
    //   "is_call",
    //   "is_rescheduled",
    //   "rescheduled_date_time",
    //   "walk_in_date_time",
    //   "walk_in_status",
    // ],
    ...(role === ROLE_EMPLOYEE && { created_by: user.user.id }),
  });
  const fieldsToExport = [
    "id", // Walk-in ID
    "lead_id", // From lead.id
    "name", // From lead.name
    "phone", // From lead.phone
    "walk_in_status", // Walk-in status
    "walk_in_date_time", // Formatted walk-in time
    "lead_status", // From lead.lead_status
    "verification_status", // From lead.verification_status
    "LeadAssignments", // Processed assignments
    "createdAt", // Formatted walk-in creation date
    "updatedAt", // Formatted walk-in update date
  ];
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [resetFilters, setResetFilters] = useState(false);
  const paginationOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];
  const [showDot, setShowDot] = useState(false);
  const [
    showRescheduleConfirmationDialogue,
    setShowRescheduleConfirmationDialogue,
  ] = useState(false);
  const [isCall, setIsCall] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedWalkIn, setSelectedWalkIn] = useState(null);

  useEffect(() => {
    dispatch(getWalkIns({ ...filters, pageSize: 10 }));
  }, []);

  useEffect(() => {
    console.log("walk ins = ", walkIns, pagination);
  }, [walkIns]);

  useEffect(() => {
    console.log("filters = ", filters);
    fetchWalkIns({ ...filters });

    // Determine excluded keys based on role
    const excludedKeys =
      role === ROLE_EMPLOYEE
        ? ["pageSize", "date", "date_time_range", "created_by"]
        : ["pageSize", "date", "date_time_range"];

    // Filter out excluded keys and empty values (null, undefined, empty string, empty array, empty object)
    const filteredFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        // Skip if key is in excludedKeys
        if (excludedKeys.includes(key)) return acc;

        // Skip empty values
        if (
          value == null || // null or undefined
          value === "" || // empty string
          (Array.isArray(value) && value.length === 0) || // empty array
          (typeof value === "object" &&
            !Array.isArray(value) &&
            Object.keys(value).length === 0) // empty object
        ) {
          return acc;
        }

        // Add valid key-value pair
        acc[key] = value;
        return acc;
      },
      {}
    );

    // If you still need just the keys for some reason:
    const filterKeys = Object.keys(filteredFilters);

    setShowDot(filterKeys.length > 0);
  }, [filters]);

  useEffect(() => {
    if (statusUpdateLoading) {
      setToastStatusType("INFO");
      setToastMessage("Updating Status...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Status Updated...");
      setToastStatusMessage("Success...");
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page,
      };
      dispatch(getWalkIns(payload));
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [statusUpdateLoading]);

  useEffect(() => {
    if (statusUpdateError) {
      setToastStatusType("ERROR");
      setToastMessage(statusUpdateError.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [statusUpdateError]);

  const fetchWalkIns = useCallback(
    debounce((filters) => {
      dispatch(getWalkIns(filters));
    }, 500), // 500ms debounce time
    [dispatch]
  );

  function handleRowsPerChange(data) {
    dispatch(getWalkIns({ ...filters, page: 0, pageSize: data }));
  }

  function handlePageChange(data) {
    console.log("page number = ", data);
    let payload = {
      ...filters,
      pageSize: pagination.pageSize,
      page: data,
    };
    dispatch(getWalkIns(payload));
  }

  function handleNextPageClick() {
    if (pagination.page < pagination.totalPages) {
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page + 1,
      };
      dispatch(getWalkIns(payload));
    }
  }

  function handlePrevPageClick() {
    if (pagination.page > 1) {
      // Prevent going below page 1
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page - 1,
      };
      dispatch(getWalkIns(payload));
    }
  }

  async function handleExportLeads() {
    setToastStatusType("INFO");
    setToastMessage("Exporting Leads... 0%");
    setToastStatusMessage("In Progress...");
    setOpenToast(true);
    let response = null;
    response = await exportWalkInLeadsHandler(
      filters,
      [],
      walkIns,
      users,
      fieldsToExport,
      setToastMessage
    );
    if (response === true) {
      setToastStatusType("SUCCESS");
      setToastMessage("Leads Exported Successfully");
      setTimeout(() => setOpenToast(false), 1500);
    } else if (response === false && response !== null) {
      setToastStatusType("ERROR");
      setToastMessage("Failed to export leads !");
      setTimeout(() => setOpenToast(false), 1500);
    }
  }

  function handleDateChange(fieldName, data) {
    console.log("selected dates = ", data);
    console.log("converted date time = ", formatDatePayload(data));
    const date_filter = formatDatePayload(data);
    setFilters((prev) => ({ ...prev, ...date_filter }));
  }

  function handleResetFilters() {
    let initialFilters = {
      // verification_status: [
      //   "Scheduled For Walk-In",
      //   "Scheduled Call With Manager",
      // ],
      // lead_status: "",
      // for_walk_ins_page: true,
      // walk_in_attributes: [
      //   "is_call",
      //   "is_rescheduled",
      //   "rescheduled_date_time",
      //   "walk_in_date_time",
      //   "walk_in_status",
      // ],
      ...(role === ROLE_EMPLOYEE && { created_by: user.user.id }),
    };
    setFilters(initialFilters);
    setResetFilters(true);
    setTimeout(() => {
      setResetFilters(false);
    }, 1000);
    setShowFilter(false);
  }

  function handleStatusChange(
    walk_in_id,
    walk_in_status,
    lead_name,
    lead_id,
    is_call,
    lead
  ) {
    let payload = {
      walk_in_id,
      walk_in_status,
      lead_name,
      lead_id,
      user_id: user.user.id,
    };
    console.log("walkin status = ", walk_in_status);

    if (walk_in_status === "Rescheduled") {
      // setSelectedWalkInStatus("Reschedule Walk In");
      setIsCall(is_call);
      setSelectedWalkIn({ walk_in_id, walk_in_status, lead_name, is_call });
      setSelectedLead(lead);
      setShowRescheduleConfirmationDialogue(true);
    } else {
      setOpenToast(true);
      dispatch(updateWalkInOrCallStatus(payload));
    }
  }

  const getStatusDetails = (task_status) => {
    switch (task_status) {
      case "Pending":
        return {
          status: "Pending",
          style: { color: "#2B323B" }, // red fontWeight: "bold",
        };

      case "Upcoming":
        return {
          status: "Upcoming",
          style: { color: "#2B323B" }, // blue fontWeight: "bold",
        };

      case "Completed":
        return {
          status: "Completed",
          style: { color: "#2B323B" }, // green fontWeight: "bold",
        };

      case "Rescheduled":
        return {
          status: "Rescheduled",
          style: { color: "#2B323B" }, // blue fontWeight: "bold",
        };

      case "Cancelled":
        return {
          status: "Cancelled",
          style: { color: "#2B323B" }, // red fontWeight: "bold",
        };
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* <!-- Filters --> */}
      <div className="grid grid-cols-12 px-4">
        <div className="col-span-12 flex justify-between py-2 rounded-md mt-3 gap-2">
          <div className="text-black text-base font-semibold poppins-thin leading-tight flex items-center">
            Appointments
          </div>
          <div className="flex gap-x-2">
            <DateButton
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              onDateChange={(fieldName, data) =>
                handleDateChange(fieldName, data)
              }
              showDot={
                filters.hasOwnProperty("date") ||
                filters.hasOwnProperty("date_time_range")
              }
              resetFilters={resetFilters}
              buttonBackgroundColor="bg-[#46A9C9]"
              showBoxShadow={true}
            />
            <FilterButton
              onClick={() => setShowFilter(!showFilter)}
              showDot={showDot}
              showFilter={showFilter}
            />
            {showDot && <ClearButton onClick={() => handleResetFilters()} />}
            {role !== ROLE_EMPLOYEE && <ExportButton onClick={() => handleExportLeads()} />}
          </div>
        </div>
      </div>

      <div
        className={`col-span-12 rounded overflow-hidden transition-all duration-500 ease-in-out overflow-visible ${
          showFilter
            ? "max-h-[400px] opacity-100 pointer-events-auto visible"
            : "max-h-0 opacity-0 pointer-events-none invisible"
        }`}
      >
        <FilterDialogueForWalkInsTable
          setFilters={setFilters}
          filters={filters}
          resetFilters={resetFilters}
        />
      </div>

      {/* table */}
      {loading ? (
        <>
          <div className="w-full h-[20rem] flex justify-center items-center bg-[#E8EFF8]">
            <Loader />
          </div>
        </>
      ) : (
        <>
          {isEmpty(walkIns) ? (
            <>
              <div className="w-full h-[20rem] bg-[#F0F6FF] flex justify-center items-center rounded-2xl shadow-xl">
                <EmptyDataMessageIcon size={100} />
              </div>
            </>
          ) : (
            <div className="w-full h-max flex flex-col mt-1.5">
              {/* table header */}
              <div
                className="w-full h-9 justify-start flex rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] rounded-br-[10px] mb-2 px-[20px]"
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
                <div className="w-[8%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight rounded-tl-2xl px-1">
                  Lead ID
                </div>

                {/* name */}
                <div className="w-[12.5%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Name
                </div>

                {/* Phone */}
                <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Phone
                </div>

                {/* Emp Name */}
                <div className="w-[10.5%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Emp Name
                </div>

                {/* Walk-in/Call Date Time */}
                <div className="w-[15%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Appointment D&T
                </div>

                {/* Rescheduled Date Time */}
                <div className="w-[15%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Rescheduled D&T
                </div>

                {/* Status */}
                <div className="w-[13%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Status
                </div>

                {/* Note */}
                <div className="w-[16%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin rounded-tr-2xl px-1">
                  Note
                </div>
              </div>

              {/* table row */}
              {walkIns.map((walkIn, index) => {
                const { status, style } = getStatusDetails(
                  walkIn.walk_in_status
                );
                return (
                  <div
                    className="w-full h-9 justify-start flex cursor-pointer mb-1 rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg px-[20px]"
                    key={walkIn.id}
                    onDoubleClick={() =>
                      navigate(`/lead-details-page/${walkIn.lead_id}`)
                    }
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
                    <div className="w-[8%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight rounded-tl-[10px] rounded-bl-[10px] overflow-hidden">
                      <span
                        className="truncate w-full text-center px-1 flex justify-left"
                        title={walkIn.lead_id}
                      >
                        {truncateWithEllipsis(walkIn.lead_id, 8)}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="w-[12.5%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden">
                      <span
                        className="truncate w-full text-center px-1 flex justify-left"
                        title={formatName(walkIn.lead.name)}
                      >
                        {truncateWithEllipsis(
                          formatName(walkIn.lead.name),
                          15
                        ) || ""}
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="w-[10%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden">
                      <span
                        className="truncate w-full text-center px-1 flex justify-left"
                        title={getLast10Digits(walkIn?.lead?.phone)}
                      >
                        {getLast10Digits(walkIn?.lead?.phone) || ""}
                      </span>
                    </div>

                    {/* Assigned To */}
                    <div className="w-[10.5%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden">
                      <span
                        className="truncate w-full text-center px-1 flex justify-left"
                        title={formatName(
                          walkIn.lead?.LeadAssignments?.[0]?.AssignedTo?.name
                        )}
                      >
                        {formatName(
                          walkIn.lead?.LeadAssignments?.[0]?.AssignedTo?.name
                        ) || ""}
                      </span>
                    </div>

                    {/* Walk-in/Call Date Time */}
                    <div className="w-[15%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden">
                      <span
                        className="truncate w-full text-center px-1 flex justify-left"
                        title={moment(walkIn.walk_in_date_time)
                          .utcOffset(330)
                          .format("DD MMM, YYYY hh:mm A")}
                      >
                        {moment(walkIn.walk_in_date_time)
                          .utcOffset(330)
                          .format("DD MMM, YYYY hh:mm A")}
                      </span>
                    </div>

                    {/* Rescheduled Date Time */}
                    <div className="w-[15%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden">
                      <span
                        className="truncate w-full text-center px-1 flex justify-left"
                        title={
                          walkIn.is_rescheduled
                            ? moment(walkIn.rescheduled_date_time)
                                .utcOffset(330)
                                .format("DD MMM, YYYY hh:mm A")
                            : ""
                        }
                      >
                        {walkIn.is_rescheduled
                          ? moment(walkIn.rescheduled_date_time)
                              .utcOffset(330)
                              .format("DD MMM, YYYY hh:mm A")
                          : ""}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="w-[13%] flex justify-left items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden">
                      {user.user.role === ROLE_EMPLOYEE ? (
                        <div
                          className={`${
                            !isConfirmationDialogueOpened && "relative"
                          } w-full`}
                        >
                          {walkIn.walk_in_status === "Pending" && (
                            <span
                              className={`${
                                !isConfirmationDialogueOpened &&
                                "absolute left-1 top-1"
                              } truncate pointer-events-none`}
                              style={{
                                color: "#D18C31",
                                animation: "blink 1.5s ease-in-out infinite",
                              }}
                            >
                              Pending
                            </span>
                          )}
                          <select
                            className="w-full px-1 py-1 text-xs font-normal inter-inter leading-tight bg-transparent border-none outline-none appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent pr-6 truncate"
                            value={walkIn.walk_in_status || "Upcoming"}
                            onChange={(e) =>
                              handleStatusChange(
                                walkIn.id,
                                e.target.value,
                                walkIn.lead.name,
                                walkIn.lead_id,
                                walkIn.is_call,
                                walkIn.lead
                              )
                            }
                            onClick={(e) => (e.target.value = "")}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                e.target.value =
                                  walkIn.walk_in_status || "Upcoming";
                              }
                            }}
                            style={{
                              color:
                                walkIn.walk_in_status === "Pending"
                                  ? "transparent"
                                  : "inherit",
                            }}
                            title={walkIn.walk_in_status}
                          >
                            {walkIn.walk_in_status !== "Rescheduled" && (
                              <option
                                value="Upcoming"
                                disabled
                                className="truncate inter-inter"
                              >
                                Upcoming
                              </option>
                            )}
                            <option
                              value="Rescheduled"
                              className="truncate inter-inter"
                            >
                              Rescheduled
                            </option>
                            <option
                              value="Completed"
                              className="truncate inter-inter"
                            >
                              Completed
                            </option>
                            <option
                              value="Cancelled"
                              className="truncate inter-inter"
                            >
                              Cancel
                            </option>
                            <option
                              value="Pending"
                              disabled
                              className="truncate inter-inter"
                            >
                              Pending
                            </option>
                          </select>
                        </div>
                      ) : (
                        <span
                          className="truncate w-full inter-inter text-center px-1 flex justify-left"
                          style={{
                            color: status === "Pending" ? "#D18C31" : "inherit",
                            animation:
                              status === "Pending"
                                ? "blink 1.5s ease-in-out infinite"
                                : "none",
                          }}
                          title={status}
                        >
                          {status}
                        </span>
                      )}

                      <style jsx>{`
                        @keyframes blink {
                          50% {
                            opacity: 0;
                          }
                        }
                      `}</style>
                    </div>

                    {/* Notes */}
                    <div className="w-[16%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight rounded-tr-[10px] rounded-br-[10px] overflow-hidden">
                      <span
                        className="truncate w-full text-center px-1 flex justify-left"
                        title={formatSentence(walkIn.note)}
                      >
                        {truncateWithEllipsis(
                          formatSentence(walkIn.note),
                          25
                        ) || ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {!loading && !isEmpty(walkIns) && (
        <div className="mt-0.5 overflow px-4">
          <Pagination
            total={pagination.total}
            page={pagination.page}
            pageSize={pagination.pageSize}
            onRowsPerChange={(data) => handleRowsPerChange(data)}
            onPageChange={(data) => handlePageChange(data)}
            onNextPageClick={(data) => handleNextPageClick(data)}
            onPrevPageClick={(data) => handlePrevPageClick(data)}
            options={paginationOptions}
            resetFilters={resetFilters}
          />
        </div>
      )}
      <Snackbar
        isOpen={openToast}
        onClose={() => setOpenToast(false)}
        status={toastStatusMessage}
        message={toastMessage}
        statusType={toastStatusType}
        shouldCloseOnClickOfOutside={shouldSnackbarCloseOnClickOfOutside}
      />
      {showRescheduleConfirmationDialogue && (
        <ScheduleWalkInOrCallDialogue
          onClose={() => setShowRescheduleConfirmationDialogue(false)}
          isCall={isCall}
          setIsCall={setIsCall}
          // selectedLeadStatus={selectedLeadStatus}
          selectedLead={selectedLead}
          openToast={openToast}
          setOpenToast={setOpenToast}
          onScheduleWalkInOrCall={() => {
            dispatch(
              getAllWalkInLeads({
                ...filters,
                page: pagination.page,
                pageSize: pagination.pageSize,
              })
            );
          }}
          fromTable={true}
          isReschedule={true}
          setToastStatusMessage={setToastStatusMessage}
          setToastStatusType={setToastStatusType}
          setToastMessage={setToastMessage}
          selectedWalkIn={selectedWalkIn}
        />
      )}
      {/* <div>
        {isPickerOpen && (
          <DateTimeRangePicker
          // isPopover={true}
          // onClose={() => setIsPickerOpen(false)}
          />
        )}
      </div> */}
    </div>
  );
}

export default WalkInsTable;
