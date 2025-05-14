import { useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "../../icons/CloseIcon";
import { useDispatch, useSelector } from "react-redux";
import { getAllActivityLogs } from "../../../features/activity-logs/activityLogsThunks";
import { setIsConfirmationDialogueOpened } from "../../../features/ui/uiSlice";
import ActivityLogsContainer from "../../activity-log/ActivityLogsContainer";
import AddActivityDialogue from "./AddActivityDialogue";
import AddNoteDialogue from "./AddNoteDialogue";
import Snackbar from "../snackbars/Snackbar";
import PopupButton from "../PopupButton";
import { resetActivityLogs } from "../../../features/activity-logs/activityLogsSlice";

function CommonDialogue({ onClose, leadId, fromTable = false, leadName }) {
  const dispatch = useDispatch();
  
  const { activityLogs = {}, loading, error, pagination } = useSelector(state => state.activityLogs || {});
  const { users } = useSelector(state => state.users);
  const { loading: activitiesLoading, error: activitiesError } = useSelector(state => state.activities);
  
  const dialogueRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({ lead_id: leadId });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [showAddActivityDialogue, setShowAddActivityDialogue] = useState(false);
  const [showAddNoteDialogue, setShowAddNoteDialogue] = useState(false);
  
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [shouldSnackbarCloseOnClickOfOutside, setShouldSnackbarCloseOnClickOfOutside] = useState(true);
  const [activityLogsToShow, setActivityLogsToShow] = useState([]);
  const [showNewActivityLogs, setShowNewActivityLogs] = useState(false);

  const userMap = useMemo(() => {
    return new Map(
      users.map(user => [user.id, { name: user.name, role_id: user.role_id }])
    );
  }, [users]);

  // When Dialogue Mounts
  useEffect(() => {
    dispatch(setIsConfirmationDialogueOpened(true));

    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const itemHeight = 50; // approximate single row height
      const calculatedPageSize = Math.ceil(containerHeight / itemHeight) + 2; 
      setPageSize(calculatedPageSize);
    }

    return () => {
      dispatch(resetActivityLogs());
      dispatch(setIsConfirmationDialogueOpened(false));
    };
  }, []);

  // Fetch Activity Logs after Page Size is Set
  useEffect(() => {
    if (pageSize > 0) {
      dispatch(getAllActivityLogs({ ...filters, page: 1, pageSize }));
      setPage(1);
    }
  }, [pageSize]);

  // Scroll for Pagination
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollTop + clientHeight + 10 >= scrollHeight;

    if (isAtBottom && !loading && page < pagination.totalPages) {
      const nextPage = page + 1;
      dispatch(getAllActivityLogs({ ...filters, page: nextPage, pageSize }));
      setPage(nextPage);
    }
  };

  // Click Outside and ESC to Close
  useEffect(() => {
    setIsOpen(true);

    function handleClickOutside(e) {
      if (dialogueRef.current && !dialogueRef.current.contains(e.target) && !showAddActivityDialogue && !showAddNoteDialogue) {
        onClose();
      }
    }

    function handleEscapeKey(e) {
      if (e.key === "Escape" && !showAddActivityDialogue && !showAddNoteDialogue) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose, showAddActivityDialogue, showAddNoteDialogue]);

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

  // Toast Handling
  useEffect(() => {
    if (activitiesLoading || loading) {
      setToastStatusType("INFO");
      setToastMessage("Processing...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }else {
      setToastStatusType("SUCCESS");
      setToastMessage("Activity added...");
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [activitiesLoading, loading]);

  useEffect(() => {
    if (activitiesError || error) {
      const errMsg = activitiesError?.message || error?.message;
      setToastStatusType("ERROR");
      setToastMessage(errMsg);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [activitiesError, error]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        ref={dialogueRef}
        style={{
          padding: "0",
          minWidth: "28rem",
          backgroundColor: "#E8EFF8",
          minHeight: "10rem",
          position: "relative",
          transform: isOpen ? "scale(1)" : "scale(0.9)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          height: "85vh",
          width: "65vw",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-bl-xl rounded-tl-xl rounded-tr-xl"
      >
        {/* Header */}
        <div className="w-full h-[10%] flex justify-between items-center px-4 border-b border-gray-300 shadow-md">
          <div className="text-[#214768] text-base font-semibold poppins-thin leading-tight">
            Activity Logs
          </div>
          <div className="flex">
            <div className="mr-3">
              <PopupButton
                name="Create Task"
                onClick={() => setShowAddActivityDialogue(true)}
                className="border-solid border-[#214768]"
                borderColor="#214768"
                textColor="#214768"
              />
            </div>
            <div className="mr-3">
              <PopupButton
                name="Add Note"
                onClick={() => setShowAddNoteDialogue(true)}
                className="border-solid border-[#214768]"
                borderColor="#214768"
                textColor="#214768"
              />
            </div>
            <div className="flex justify-center items-center cursor-pointer" onClick={onClose}>
              <CloseIcon />
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          ref={containerRef}
          className="w-full h-[90%] overflow-y-auto py-0"
          onScroll={handleScroll}
        >
          <ActivityLogsContainer
            activityLogs={activityLogsToShow}
            userMap={userMap}
            fromTable={fromTable}
          />
          {loading && <div className="text-center py-4">Loading...</div>}
        </div>
      </div>

      {/* Add Activity Dialogue */}
      {showAddActivityDialogue && (
        <AddActivityDialogue
          onClose={() => {
            setShowAddActivityDialogue(false)
            if(openToast){
              setOpenToast(false)
            }
            dispatch(getAllActivityLogs({ ...filters, ...pagination }))
          }}
          fromActivityLog
          setOpenToast={setOpenToast}
          openToast={openToast}
          setToastStatusType={setToastStatusType}
          setToastStatusMessage={setToastStatusMessage}
          setToastMessage={setToastMessage}
          leadId={leadId}
          leadName={leadName}
        />
      )}

      {/* Add Note Dialogue */}
      {showAddNoteDialogue && (
        <AddNoteDialogue
          onClose={() => {
            setShowAddNoteDialogue(false)
            if(openToast){
              setOpenToast(false)
            }
            dispatch(getAllActivityLogs({ ...filters, ...pagination }))
          }}
          fromActivityLog
          setOpenToast={setOpenToast}
          leadId={leadId}
          leadName={leadName}
        />
      )}

      {/* Snackbar */}
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

export default CommonDialogue;
