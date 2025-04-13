import { useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "../../icons/CloseIcon";
import { useDispatch, useSelector } from "react-redux";
import { getAllActivityLogs } from "../../../features/activity-logs/activityLogsThunks";
import ActivityLogsContainer from "../../activity-log/ActivityLogsContainer";
import { resetActivityLogs } from "../../../features/activity-logs/activityLogsSlice";
import { setIsConfirmationDialogueOpened } from "../../../features/ui/uiSlice";

function CommonDialogue({ onClose, leadId, fromTable=false }) {
  const dispatch = useDispatch();
  const {
    activityLogs = {},
    loading,
    error,
    pagination,
  } = useSelector(
    (state) => state.activityLogs || {} // Ensure state exists
  );

  const { users } = useSelector((state) => state.users);
  const dialogueRef = useRef(null);
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({ lead_id: leadId });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activityLogsToShow, setActivityLogsToShow] = useState([]);

  // Calculate pageSize based on container height
  useEffect(() => {
    dispatch(setIsConfirmationDialogueOpened(true))
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const itemHeight = 50; // Approximate height of each item
      const calculatedPageSize = Math.ceil(containerHeight / itemHeight) + 2; // Add buffer
      setPageSize(calculatedPageSize);
    }
    return ()=>{
        dispatch(resetActivityLogs())
        dispatch(setIsConfirmationDialogueOpened(false))
    }
  }, []);

  useEffect(() => {
    let newActivityLogs = {
      ...activityLogsToShow,
      ...activityLogs,
    };
    setActivityLogsToShow(newActivityLogs);
  }, [activityLogs]);

  // Fetch initial data with calculated pageSize
  useEffect(() => {
    dispatch(getAllActivityLogs({ ...filters, page: 1, pageSize }));
  }, [pageSize]);

  useEffect(() => {
    setIsOpen(true);

    function handleClickOutside(e) {
      if (dialogueRef.current && !dialogueRef.current.contains(e.target)) {
        onClose();
      }
    }

    function handleEscapeKey(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

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
          padding: "0rem",
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
        {/* Dialogue title */}
        <div
          className="w-full h-[10%] flex justify-between items-center px-4 
                border-b border-gray-300 shadow-md"
        >
          <div className="text-[#214768] text-base font-semibold poppins-thin leading-tight">
            Activity Logs
          </div>
          <div className="cursor-pointer" onClick={onClose}>
            <CloseIcon />
          </div>
        </div>

        {/* Dialogue content */}
        <div
          ref={containerRef}
          className="w-full h-[90%] rounded-bl-xl rounded-br-xl overflow-y-auto py-0"
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
    </div>
  );
}

export default CommonDialogue;
