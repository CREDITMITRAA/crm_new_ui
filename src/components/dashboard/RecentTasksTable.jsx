import { useDispatch, useSelector } from "react-redux";
import Pagination from "../common/Pagination";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { getWalkIns } from "../../features/walk-ins/walkInsThunks";
import DateButton from "../common/DateButton";
import FilterButton from "../common/FiltersButton";
import ClearButton from "../common/ClearButton";
import ExportButton from "../common/ExportButton";
import Snackbar from "../common/snackbars/Snackbar";
import DateTimeRangePicker from "../common/DateTimeRangePicker";
import FilterDialogue from "../common/filter-dialogue/FilterDialogue";
import FilterDialogueForWalkInsTable from "./walk-ins-table/FilterDialogueForWalkInsTable";
import { debounce } from "lodash";
import { getTasks, updateTaskStatus } from "../../features/tasks/tasksThunks";
import FilterDialogueForRecentTasksTable from "./recent-tasks-table/FilterDialogueForRecentTasksTable";
import {
  exportTasks,
  formatDatePayload,
  formatName,
  formatSentence,
  getLast10Digits,
  isEmpty,
  truncateWithEllipsis,
} from "../../utilities/utility-functions";
import { ROLE_EMPLOYEE, terminologiesMap } from "../../utilities/AppConstants";
import Loader from "../common/loaders/Loader";
import EmptyDataMessageIcon from "../icons/EmptyDataMessageIcon";
import { useNavigate } from "react-router-dom";

function RecentTasksTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tasks, pagination, statusUpdateLoading, statusUpdateError, loading } =
    useSelector((state) => state.tasks);
  const { user, role } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({
    pageSize: 10,
    ...(role === ROLE_EMPLOYEE && { created_by: user.user.id }),
  });
  const [resetFilters, setResetFilters] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const paginationOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];
  const [showDot, setShowDot] = useState(false);

  const fieldsToExport = [
    "id",
    "name",
    "phone",
    "lead_source",
    "lead_status",
    "application_status",
    "status",
    "createdAt",
    "updatedAt",
    "LeadAssignments",
  ];

  useEffect(() => {
    fetchTasks({ ...filters });
  }, []);

  useEffect(() => {
    console.log("tasks = ", tasks, pagination);
    console.log("filters = ", filters);
    let excludedKeys = [];
    fetchTasks({ ...filters });
    if(role === ROLE_EMPLOYEE){
          excludedKeys = ["pageSize", "date", "date_time_range", "created_by"]
        }else{
          excludedKeys = ["pageSize", "date", "date_time_range"]
        }

    // Exclude 'pageSize' from the filters count check
    const filterKeys = Object.keys(filters).filter((key) => key !== "pageSize");
    const filteredKeys = Object.keys(filters).filter(
      (key) => !excludedKeys.includes(key) && filters[key] !== ""
    );
    setShowDot(filteredKeys.length > 0);
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
      dispatch(getTasks(payload));
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

  const fetchTasks = useCallback(
    debounce((filters) => {
      dispatch(getTasks(filters));
    }, 500), // 500ms debounce time
    [dispatch]
  );

  function handleRowsPerChange(data) {
    dispatch(getTasks({ ...filters, page: 0, pageSize: data }));
  }

  function handlePageChange(data) {
    console.log("page number = ", data);
    let payload = {
      ...filters,
      pageSize: pagination.pageSize,
      page: data,
    };
    dispatch(getTasks(payload));
  }

  function handleNextPageClick() {
    if (pagination.page < pagination.totalPages) {
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page + 1,
      };
      dispatch(getTasks(payload));
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
      dispatch(getTasks(payload));
    }
  }

  function handleDateChange(_, data) {
    console.log("selected dates = ", data);
    const task_date_filter = formatDatePayload(data);
    let payload = {};
    if (Object.keys(task_date_filter).includes("date")) {
      payload["follow_up"] = task_date_filter.date;
    } else {
      payload["follow_up_range"] = task_date_filter.date_time_range;
    }
    setFilters((prev) => ({ ...prev, ...payload }));
  }

  function handleResetFilters() {
    let initialFilters = {
      pageSize: 10,
      ...(role === ROLE_EMPLOYEE && { created_by: user.user.id }),
    };
    setFilters(initialFilters);
    setResetFilters(true);
    setTimeout(() => {
      setResetFilters(false);
    }, 1000);
    setShowFilter(false)
  }

  async function handleExportLeads() {
    setToastStatusType("INFO");
    setToastMessage("Exporting Leads... 0%");
    setToastStatusMessage("In Progress...");
    setOpenToast(true);
    let response = null;
    response = await exportTasks(filters, setToastMessage);
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

  function handleStatusChange(
    activity_id,
    task_status,
    task_type,
    lead_id,
    lead_name
  ) {
    let payload = {
      activity_id,
      task_status,
      task_type,
      lead_id,
      lead_name,
      user_id: user.user.id,
    };
    setOpenToast(true);
    dispatch(updateTaskStatus(payload));
  }

  const getStatusDetails = (task_status) => {
    switch (task_status) {
      case "Pending":
        return {
          status: "Pending",
          style: { color: "#2B323B" },
        };

      case "Upcoming":
        return {
          status: "Upcoming",
          style: { color: "#2B323B" },
        };

      case "Completed":
        return {
          status: "Completed",
          style: { color: "#2B323B" },
        };
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* <!-- Filters --> */}
      <div className="grid grid-cols-12 px-4">
        <div className="col-span-12 flex justify-between py-2 rounded-md mt-3 gap-2">
          <div className="text-black text-base font-semibold poppins-thin leading-tight flex items-center">
            Recent Tasks
          </div>
          <div className="flex gap-x-2">
            <DateButton
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              onDateChange={(fieldName, data) =>
                handleDateChange(fieldName, data)
              }
              showDot={
                filters.hasOwnProperty("follow_up") ||
                filters.hasOwnProperty("follow_up_range")
              }
              resetFilters={resetFilters}
              buttonBackgroundColor="bg-[#C7D4E4]"
              showBoxShadow={true}
            />
            <FilterButton
              onClick={() => setShowFilter(!showFilter)}
              showDot={showDot}
            />
            {showDot && <ClearButton onClick={() => handleResetFilters()} />}
            <ExportButton onClick={() => handleExportLeads()} />
          </div>
        </div>
      </div>

      <div
        className={`col-span-12 rounded overflow-hidden transition-all duration-500 ease-in-out overflow-visible ${
          showFilter ? "max-h-[400px] opacity-100 pointer-events-auto visible" : "max-h-0 opacity-0 pointer-events-none invisible"
        }`}
      >
        <FilterDialogueForRecentTasksTable
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
          {isEmpty(tasks) ? (
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
                <div className="w-[8%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1">
                  Lead ID
                </div>

                {/* name */}
                <div className="w-[10.5%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Name
                </div>

                {/* Phone */}
                <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Phone
                </div>

                {/* Emp Name */}
                <div className="w-[12.5%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Emp Name
                </div>

                {/* Task */}
                <div className="w-[17%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Task
                </div>

                {/* Note */}
                <div className="w-[19%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1 ">
                  Note
                </div>

                {/* Task Date */}
                <div className="w-[15%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight px-1">
                  Task Date
                </div>

                {/* Task Status */}
                <div className="w-[8%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin rounded-tr-2xl px-1">
                  Task Status
                </div>
              </div>

              {/* table row */}
              {tasks.map((task, index) => {
                const { status, style } = getStatusDetails(task.task_status);
                return (
                  <div
                    className="w-full h-10 flex cursor-pointer mb-1 rounded-lg px-[20px] items-center"
                    key={index}
                    onDoubleClick={() =>
                      navigate(`/lead-details-page/${task.lead_id}`)
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
                    <div className="w-[8%] h-full flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight">
                      <span className="truncate w-full px-1 py-0.5">
                        {truncateWithEllipsis(task.lead_id, 8)}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="w-[10.5%] h-full flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight">
                      <span className="truncate w-full px-1 py-0.5">
                        {truncateWithEllipsis(
                          formatName(task.Lead?.name),
                          15
                        ) || ""}
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="w-[10%] h-full flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight">
                      <span className="truncate w-full px-1 py-0.5">
                        {getLast10Digits(task.Lead?.phone) || ""}
                      </span>
                    </div>

                    {/* Assigned To */}
                    <div className="w-[12.5%] h-full flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight">
                      <span className="truncate w-full px-1 py-0.5">
                        {truncateWithEllipsis(
                          formatName(
                            task.Lead?.LeadAssignments?.[0]?.AssignedTo?.name,
                            15
                          ),
                          15
                        ) || ""}
                      </span>
                    </div>

                    {/* Task Type */}
                    <div className="w-[17%] h-full flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight">
                      <span className="truncate w-full px-1 py-0.5">
                        {truncateWithEllipsis("Executive Consultation", 24) ||
                          ""}
                      </span>
                    </div>

                    {/* Note */}
                    <div className="w-[19%] h-full flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight">
                      <span className="truncate w-full px-1 py-0.5">
                        {truncateWithEllipsis(
                          formatSentence(task.description),
                          30
                        ) || ""}
                      </span>
                    </div>

                    {/* Task Date */}
                    <div className="w-[15%] h-full flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight">
                      <span className="truncate w-full px-1 py-0.5">
                        {task.follow_up
                          ? moment(task.follow_up)
                              .utcOffset(330)
                              .format("DD MMM, YYYY hh:mm A")
                          : "-"}
                      </span>
                    </div>

                    {/* Task Status */}
                    <div className="w-[8%] h-full flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight">
                      {user.user.role === ROLE_EMPLOYEE ? (
                        <select
                          className="w-full px-1 py-0.5 text-xs font-normal inter-inter leading-tight bg-transparent border-none outline-none appearance-none cursor-pointer truncate"
                          value={task.task_status}
                          onChange={(e) =>
                            handleStatusChange(
                              task.id,
                              e.target.value,
                              task.activity_status,
                              task.lead_id,
                              task.Lead.name
                            )
                          }
                          style={{
                            ...style,
                            border: "none",
                            backgroundColor: "transparent",
                            outline: "none",
                            fontSize: "inherit",
                            cursor: "pointer",
                          }}
                        >
                          <option
                            value="Upcoming"
                            style={{ color: "#2B323B", cursor: "pointer" }}
                            disabled
                            className="truncate"
                          >
                            Upcoming
                          </option>
                          <option
                            value="Pending"
                            style={{ color: "#2B323B", cursor: "pointer" }}
                            disabled
                            className="truncate"
                          >
                            Pending
                          </option>
                          <option
                            value="Completed"
                            style={{ color: "#2B323B", cursor: "pointer" }}
                            className="truncate"
                          >
                            Completed
                          </option>
                        </select>
                      ) : (
                        <>
                          <span
                            className="truncate w-full px-1 py-0.5"
                            style={{
                              ...style,
                              color:
                                status === "Pending" ? "#D18C31" : "inherit",
                              // fontWeight: status === "Pending" && "bold",
                              animation:
                                status === "Pending"
                                  ? "blink 1.5s ease-in-out infinite"
                                  : "none",
                            }}
                          >
                            {status}
                          </span>

                          {status === "Pending" && (
                            <style>
                              {`
                  @keyframes blink {
                    50% { opacity: 0; }
                  }
                `}
                            </style>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {!loading && !isEmpty(tasks) && (
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
      <div>
        {isPickerOpen && (
          <DateTimeRangePicker
          // isPopover={true}
          // onClose={() => setIsPickerOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default RecentTasksTable;
