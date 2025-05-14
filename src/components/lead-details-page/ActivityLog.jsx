import { useDispatch, useSelector } from "react-redux";
import ActivityLogsContainer from "../activity-log/ActivityLogsContainer";
import FilterDialogueForActivityLogsTable from "../activity-log/FilterDialogueForActivityLogsTable";
import ClearButton from "../common/ClearButton";
import DateButton from "../common/DateButton";
import ExportButton from "../common/ExportButton";
import FilterButton from "../common/FiltersButton";
import PrimaryButton from "../common/PrimaryButton";
import Snackbar from "../common/snackbars/Snackbar";
import BackIcon from "../icons/BackIcon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getUsersNameAndId } from "../../features/users/usersThunks";
import { resetActivityLogs } from "../../features/activity-logs/activityLogsSlice";
import { getAllActivityLogs } from "../../features/activity-logs/activityLogsThunks";
import { debounce } from "lodash";
import { exportLeadActivityLogs } from "../../utilities/utility-functions";
import { useNavigate } from "react-router-dom";
import Loader from "../common/loaders/Loader";
import EmptyDataMessageIcon from "../icons/EmptyDataMessageIcon";

function ActivityLog({ setShowActivityLog, showActivityLog, leadId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activityLogs, loading, error, pagination } = useSelector(
    (state) => state.activityLogs
  );
  const { height } = useSelector((state) => state.ui);
  const { users } = useSelector((state) => state.users);
  
  const [filters, setFilters] = useState({ lead_id: leadId });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activityLogsToShow, setActivityLogsToShow] = useState([]);
  const [resetFilters, setResetFilters] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [shouldSnackbarCloseOnClickOfOutside, setShouldSnackbarCloseOnClickOfOutside] = useState(true);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showNewActivityLogs, setShowNewActivityLogs] = useState(false);
  const [showDot, setShowDot] = useState(false);
  
  const containerRef = useRef(null);
  const initialLoad = useRef(true);

  // Memoized user map for quick lookups
  const userMap = useMemo(() => {
    return new Map(users.map((user) => [user.id, { 
      name: user.name, 
      role_id: user.role_id 
    }]));
  }, [users]);

  // Debounced fetch function with cleanup
  const fetchActivityLogs = useCallback(
    debounce((filters) => {
      dispatch(getAllActivityLogs(filters));
    }, 500),
    [dispatch]
  );

  // Initial setup
  useEffect(() => {
    dispatch(getUsersNameAndId());
    
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const itemHeight = 50;
      const calculatedPageSize = Math.ceil(containerHeight / itemHeight) + 2;
      setPageSize(calculatedPageSize);
    }

    return () => {
      dispatch(resetActivityLogs());
    };
  }, [dispatch]);

  // Handle pageSize changes
  useEffect(() => {
    if (!initialLoad.current) {
      fetchActivityLogs({ ...filters, page: 1, pageSize });
      setPage(1);
      setActivityLogsToShow([]);
    }
    initialLoad.current = false;
  }, [pageSize, fetchActivityLogs, filters]);

  // Handle filter changes
  useEffect(() => {
    const activeFilters = Object.keys(filters).filter(
      key => !["page", "pageSize", "totalPages", "total", "lead_id"].includes(key) &&
            filters[key] !== null &&
            filters[key] !== undefined &&
            filters[key] !== "" &&
            !(Array.isArray(filters[key]) && filters[key].length === 0)
    ).length > 0;

    setShowDot(activeFilters);
    
    if (activeFilters) {
      setShowNewActivityLogs(true);
      setPage(1);
    }

    fetchActivityLogs({ ...filters, page: 1, pageSize });
  }, [filters, pageSize, fetchActivityLogs]);

  // Update activity logs to show
  // Update activity logs to show
  useEffect(() => {
    console.log('activity logs = ', activityLogs);
    
    if (!activityLogs || Object.keys(activityLogs).length === 0) return;
  
    if (page === 1 || showNewActivityLogs) {
      // For first page or when we want to show new logs (after adding one)
      setActivityLogsToShow(activityLogs);
      setShowNewActivityLogs(false);
    } else {
      // For subsequent pages, deep merge the new logs with existing ones
      setActivityLogsToShow(prev => {
        // Create a new merged object
        const merged = {...prev};
        
        // Iterate through all keys in the new activityLogs
        for (const key in activityLogs) {
          if (Array.isArray(prev[key]) && Array.isArray(activityLogs[key])) {
            // If both values are arrays, concatenate them
            merged[key] = [...prev[key], ...activityLogs[key]];
          } else if (typeof prev[key] === 'object' && typeof activityLogs[key] === 'object') {
            // If both values are objects, merge them recursively
            merged[key] = {...prev[key], ...activityLogs[key]};
          } else {
            // For other cases (primitives), use the new value
            merged[key] = activityLogs[key];
          }
        }
        
        return merged;
      });
    }
  }, [activityLogs, page, showNewActivityLogs]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollTop + clientHeight + 10 > scrollHeight;

    if (isAtBottom && !loading && pagination.totalPages > page) {
      const nextPage = page + 1;
      dispatch(getAllActivityLogs({ ...filters, page: nextPage, pageSize }));
      setPage(nextPage);
    }
  };

  async function handleExportLeads() {
    setToastStatusType("INFO");
    setToastMessage("Exporting Logs... 0%");
    setToastStatusMessage("In Progress...");
    setShouldSnackbarCloseOnClickOfOutside(false);
    setOpenToast(true);
    
    try {
      const response = await exportLeadActivityLogs(users, filters, setToastMessage);
      if (response) {
        setToastStatusType("SUCCESS");
        setToastStatusMessage("Success...");
        setToastMessage("Logs Exported Successfully");
      } else {
        setToastStatusType("ERROR");
        setToastStatusMessage("Error...");
        setToastMessage("Failed to export logs!");
      }
    } catch (error) {
      setToastStatusType("ERROR");
      setToastStatusMessage("Error...");
      setToastMessage("Failed to export logs!");
    } finally {
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }

  function handleResetFilters() {
    const initialFilters = { lead_id: leadId };
    
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const itemHeight = 50;
      const newPageSize = Math.ceil(containerHeight / itemHeight) + 2;
      
      setPageSize(newPageSize);
      setFilters({ ...initialFilters, pageSize: newPageSize });
      setResetFilters(true);
      setShowDot(false);
      setPage(1);
      
      setTimeout(() => {
        setResetFilters(false);
      }, 1000);
    }
  }

  function handleDateChange(data) {
    setFilters(prev => ({
      ...prev,
      from_date: data.startDate,
      to_date: data.endDate,
      page: 1
    }));
    setIsPickerOpen(false);
    setPage(1);
  }

  // Calculate if we should show empty state
  const showEmptyState = useMemo(() => {
    return !loading && page === 1 && activityLogsToShow.length === 0;
  }, [loading, page, activityLogsToShow]);

  return (
    <>
      <div className="w-full flex flex-col justify-between h-full">
        <div className="grid grid-cols-12 px-4">
          <div className="col-span-12 flex justify-between py-2 rounded-md mt-3 gap-2">
            <div
              className="text-black text-base font-semibold poppins-thin leading-tight flex items-center cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <BackIcon />
            </div>
            <div className="flex gap-x-2">
              <div className="min-w-max">
                <PrimaryButton
                  isActive={!showActivityLog}
                  name="Lead Details"
                  onClick={() => setShowActivityLog(false)}
                  backgroundColor="#C7D4E4"
                />
              </div>
              <div className="min-w-max">
                <PrimaryButton
                  isActive={showActivityLog}
                  name="Activity Log"
                  onClick={() => setShowActivityLog(true)}
                  backgroundColor="#C7D4E4"
                />
              </div>
              <div className="h-9">
                <DateButton
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                  onDateChange={handleDateChange}
                  showDot={false}
                  buttonBackgroundColor="bg-[#C7D4E4]"
                  showBoxShadow={true}
                />
              </div>
              <FilterButton
                onClick={() => setShowFilter(!showFilter)}
                showDot={showDot}
              />
              {showDot && <ClearButton onClick={handleResetFilters} />}
              <ExportButton onClick={handleExportLeads} />
            </div>
          </div>
        </div>
        <div
          className={`col-span-12 rounded overflow-hidden transition-all duration-500 ease-in-out ${
            showFilter
              ? "max-h-[400px] opacity-100 overflow-visible"
              : "max-h-0 opacity-0"
          }`}
        >
          <FilterDialogueForActivityLogsTable
            setFilters={setFilters}
            filters={filters}
            resetFilters={resetFilters}
          />
        </div>
        {loading && page === 1 ? (
          <div
            className="w-full bg-white flex justify-center items-center rounded-2xl"
            style={{ height: `${height + 20}px` }}
          >
            <Loader />
          </div>
        ) : showEmptyState ? (
          <div
            className="w-full bg-white flex justify-center items-center rounded-2xl"
            style={{ height: `${height + 20}px` }}
          >
            <EmptyDataMessageIcon
              size={100}
              message="No activity logs available"
            />
          </div>
        ) : (
          <div
            className="h-full w-full overflow-y-auto"
            ref={containerRef}
            onScroll={handleScroll}
          >
            <ActivityLogsContainer
              activityLogs={activityLogsToShow}
              userMap={userMap}
              setShowActivityLog={setShowActivityLog}
            />
            {loading && page > 1 && (
              <div className="flex justify-center py-4">
                <Loader size="small" />
              </div>
            )}
          </div>
        )}
      </div>
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

export default ActivityLog;