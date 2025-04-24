import { useCallback, useEffect, useMemo } from "react";
import LeadNavigationIcon from "../icons/LeadNavigationIcon";
// import { fetchAllActivityLogs } from "../../features/activity-logs/activityLogsApi";
import { useState } from "react";
import Pagination from "../common/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getAllActivityLogs } from "../../features/activity-logs/activityLogsThunks";
import {
  exportLeadActivityLogs,
  formatDatePayload,
  formatTimeTo12Hour,
  isEmpty,
} from "../../utilities/utility-functions";
import DateButton from "../common/DateButton";
import FilterButton from "../common/FiltersButton";
import ClearButton from "../common/ClearButton";
import ExportButton from "../common/ExportButton";
import FilterDialogueForActivityLogsTable from "./FilterDialogueForActivityLogsTable";
import { debounce } from "lodash";
import Snackbar from "../common/snackbars/Snackbar";
import ActivityLogsContainer from "./ActivityLogsContainer";
import Loader from "../common/loaders/Loader";
import EmptyDataMessageIcon from "../icons/EmptyDataMessageIcon";
import ActivityLogsContainerEmployeeWise from "./ActivityLogsContainerEmployeeWise";

function ActivityLog() {
  const dispatch = useDispatch();
  const { activityLogsEmployeeWise, pagination, loading } = useSelector(
    (state) => state.activityLogs
  );
  const { users } = useSelector((state) => state.users);
  const [filters, setFilters] = useState({
    from_dashboard:true
  });
  const [resetFilters, setResetFilters] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const paginationOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  useEffect(() => {
    dispatch(getAllActivityLogs({ ...filters }));
  }, [dispatch]);

  useEffect(() => {
    console.log("logs = ", activityLogsEmployeeWise, users);
  }, [activityLogsEmployeeWise]);

  useEffect(() => {
    // Fetch activity logs with the current filters (fixed pageSize)
    fetchActivityLogs({ ...filters, pageSize: 10 });
  
    // Define keys to always exclude
    const excludedKeys = ["page", "pageSize", "totalPages", "createdAt", "total", "from_dashboard"];
  
    // Filter out excluded keys and empty values in a single pass
    const filteredFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      // Skip excluded keys
      if (excludedKeys.includes(key)) return acc;
      
      // Skip empty values
      if (
        value == null || // null or undefined
        value === "" || // empty string
        (Array.isArray(value) && value.length === 0 // empty array
        // Add more empty checks if needed (empty object, etc.)
      )) {
        return acc;
      }
      
      // Include valid key-value pair
      acc[key] = value;
      return acc;
    }, {});
  
    // Set dot visibility based on active filters
    setShowDot(Object.keys(filteredFilters).length > 0);
  
  }, [filters]); // Dependencies remain the same

  const fetchActivityLogs = useCallback(
    debounce((filters) => {
      dispatch(getAllActivityLogs(filters));
    }, 500), // 500ms debounce time
    [dispatch]
  );

  const userMap = useMemo(() => {
    return new Map(
      users.map((user) => [
        user.id,
        {
          name: user.name,
          role_id: user.role_id,
        },
      ])
    );
  }, [users]);

  const roleMap = useMemo(() => {
    return new Map();
  });

  function handleRowsPerChange(data) {
    dispatch(getAllActivityLogs({ ...filters, page: 1, pageSize: data }));
  }

  function handlePageChange(data) {
    console.log("page number = ", data);
    let payload = {
      ...filters,
      pageSize: pagination.pageSize,
      page: Number(data),
    };
    dispatch(getAllActivityLogs(payload));
  }

  function handleNextPageClick() {
    if (pagination.page < pagination.totalPages) {
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: Number(pagination.page) + 1,
      };
      dispatch(getAllActivityLogs(payload));
    }
  }

  function handlePrevPageClick() {
    if (pagination.page > 1) {
      // Prevent going below page 1
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: Number(pagination.page) - 1,
      };
      dispatch(getAllActivityLogs(payload));
    }
  }

  function handleResetFilters() {
    let initialFilters = {
      pageSize: 10,
      from_dashboard:true
    };
    setFilters(initialFilters);
    setResetFilters(true);
    setShowDot(false);
    setTimeout(() => {
      setResetFilters(false);
    }, 1000);
    setShowFilter(false)
  }

  async function handleExportLeads() {
    setToastStatusType("INFO");
    setToastMessage("Exporting Logs... 0%");
    setToastStatusMessage("In Progress...");
    setShouldSnackbarCloseOnClickOfOutside(false);
    setOpenToast(true);
    let response = null;
    response = await exportLeadActivityLogs(users, filters, setToastMessage);
    if (response === true) {
      setToastStatusType("SUCCESS");
      setToastStatusMessage("Success...");
      setToastMessage("Logs Exported Successfully");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else if (response === false && response !== null) {
      setToastStatusType("ERROR");
      setToastStatusMessage("Error...");
      setToastMessage("Failed to export logs !");
      setShouldSnackbarCloseOnClickOfOutside(true);
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
    <div className="w-full py-1 flex flex-col h-max ">
      <div className="grid grid-cols-12 px-4">
        <div className="col-span-12 flex justify-between py-2 rounded-md mt-3 gap-2">
          <div className="text-[#214768] text-base font-semibold poppins-thin leading-tight flex items-center">
            Activity Log
          </div>
          <div className="flex gap-x-2">
            <DateButton
              resetFilters={resetFilters}
              fieldName="createdAt"
              onDateChange={(fieldName, value) =>
                handleDateChange(fieldName, value)
              }
              showDot={filters.hasOwnProperty("createdAt")}
              buttonBackgroundColor="bg-[#C7D4E4]"
              showBoxShadow={true}
            />
            <FilterButton
              onClick={() => setShowFilter(!showFilter)}
              showDot={showDot}
              showFilter={showFilter}
            />
            {showDot && <ClearButton onClick={() => handleResetFilters()} />}
            <ExportButton onClick={() => handleExportLeads()} />
          </div>
        </div>
      </div>

      <div
        className={`col-span-12 rounded overflow-hidden transition-all duration-500 ease-in-out ${
          showFilter
            ? "max-h-[400px] opacity-100 overflow-visible pointer-events-auto visible"
            : "max-h-0 opacity-0 pointer-events-none invisible"
        }`}
      >
        <FilterDialogueForActivityLogsTable
          setFilters={setFilters}
          filters={filters}
          resetFilters={resetFilters}
        />
      </div>

      {/* content main container */}
      {loading ? (
        <>
          <div className="w-full h-[20rem] flex justify-center items-center bg-[#E8EFF8]">
            <Loader />
          </div>
        </>
      ) : (
        <>
          {isEmpty(activityLogsEmployeeWise) ? (
            <>
              <div className="w-full h-[20rem] bg-[#F0F6FF] flex justify-center items-center rounded-2xl">
                <EmptyDataMessageIcon size={100} />
              </div>
            </>
          ) : (
            <ActivityLogsContainerEmployeeWise
              activityLogs={activityLogsEmployeeWise}
              userMap={userMap}
            />
          )}
        </>
      )}

      {!loading && !isEmpty(activityLogsEmployeeWise) && (
        <div className="mt-4 px-2">
          <Pagination
            total={pagination?.total}
            page={Number(pagination?.page)}
            pageSize={pagination?.pageSize}
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
    </div>
  );
}

export default ActivityLog;
