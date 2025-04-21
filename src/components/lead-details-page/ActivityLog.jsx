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
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const [showNewActivityLogs, setShowNewActivityLogs] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    dispatch(getUsersNameAndId());
    console.log("activity log inside lead details page mounted");
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const itemHeight = 50; // Approximate height of each item
      const calculatedPageSize = Math.ceil(containerHeight / itemHeight) + 2; // Add buffer
      setPageSize(calculatedPageSize);
    }
    return () => {
      dispatch(resetActivityLogs());
    };
  }, []);
  useEffect(() => {
    if (showNewActivityLogs) {
      let newActivityLogs = {
        ...activityLogs,
      };
      setActivityLogsToShow(newActivityLogs);
    } else {
      let newActivityLogs = {
        ...activityLogsToShow,
        ...activityLogs,
      };
      setActivityLogsToShow(newActivityLogs);
    }
  }, [activityLogs]);

  useEffect(() => {
    dispatch(getAllActivityLogs({ ...filters, page: 1, pageSize }));
  }, [pageSize]);

  useEffect(() => {
    // Fetch activity logs with the current filters
    fetchActivityLogs({ ...filters, pageSize: Number(pageSize) });

    // Filter out keys with empty values
    const filteredFilters = Object.keys(filters)?.reduce((acc, key) => {
      // Skip keys like "page", "pageSize", "totalPages", and "total"
      if (
        !["page", "pageSize", "totalPages", "total", "lead_id"].includes(key)
      ) {
        // Check if the value is not empty
        const value = filters[key];
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

    // Set showDot based on whether there are any active filters
    if (Object.keys(filteredFilters).length > 0) {
      setShowNewActivityLogs(true);
      setShowDot(Object.keys(filteredFilters).length > 0);
    }
  }, [filters]);

  const fetchActivityLogs = useCallback(
    debounce((filters) => {
      dispatch(getAllActivityLogs(filters));
    }, 500), // 500ms debounce time
    [dispatch]
  );

  const userMap = useMemo(() => {
    return new Map(users.map((user) => [user.id, { 
      name: user.name, 
      role_id: user.role_id 
    }]));
  }, [users]);

  const loadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= pagination.totalPages) {
      dispatch(
        getAllActivityLogs({ ...filters, page: Number(nextPage), pageSize })
      );
      setPage(nextPage);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // const isAtBottom = scrollHeight - scrollTop > clientHeight;
    const isAtBottom = scrollTop + clientHeight + 10 > scrollHeight;
    console.log(
      "scroll top = ",
      scrollTop,
      " scroll height = ",
      scrollHeight,
      " client height = ",
      clientHeight,
      " is at bottom = ",
      isAtBottom
    );

    if (isAtBottom && !loading && pagination.totalPages > page) {
      loadMore();
    }
  };

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

  function handleResetFilters() {
    let initialFilters = {
      lead_id: leadId,
    };
    let pageSize = null;
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const itemHeight = 50; // Approximate height of each item
      pageSize = Math.ceil(containerHeight / itemHeight) + 2; // Add buffer
      setPageSize(pageSize);
      setFilters({ ...initialFilters, pageSize: pageSize });
      setResetFilters(true);
      setShowDot(false);
      setTimeout(() => {
        setResetFilters(false);
      }, 1000);
    }
  }

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
                onDateChange={(data) => handleDateChange(data)}
                showDot={false}
                buttonBackgroundColor="bg-[#C7D4E4]"
              showBoxShadow={true}
              />
              </div>
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
        {loading ? (
          <div
            className="w-full bg-white flex justify-center items-center rounded-2xl"
            style={{ height: `${height + 20}px` }}
          >
            <Loader />
          </div>
        ) : !activityLogsToShow.length > 0 ? (
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
          </div>
        ) : (
          <div
            className="w-full bg-white flex justify-center items-center rounded-2xl"
            style={{ height: `${height + 20}px` }}
          >
            <EmptyDataMessageIcon
              size={100}
              message="No activity logs available"
            />
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
