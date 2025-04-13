// components/NotificationItem.js
import { useEffect, useRef } from "react";
import NotificationItemIcon from "../../icons/NotificationItemIcon";
import NotificationItemCloseIcon from "../../icons/NotificationItemCloseIcon";
import { acknowledgeNotificationApi } from "../../../features/notifications/notificationsApi";

function NotificationItem({
  id,
  notification,
  onClose,
  index,
  autoCloseDelay = 5000,
}) {
  const timerRef = useRef(null);
  
  // Calculate position with 16px gap between notifications
  const topPosition = 20 + index * 108; // 80px height + 16px gap

  useEffect(() => {
    // if (autoCloseDelay) {
    //   timerRef.current = setTimeout(() => {
    //     handleClose();
    //   }, autoCloseDelay);
    // }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoCloseDelay]);

  const handleClose = async () => {
    await acknowledgeNotificationApi(id);
    onClose(id);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString || Date.now());
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="fixed z-50 transition-all duration-300 ease-in-out"
      style={{
        top: `${topPosition}px`,
        right: "20px",
        width: "calc(100% - 40px)",
        maxWidth: "576px",
      }}
      role="alert"
    >
      <div className="relative w-full bg-white rounded-3xl shadow-xl p-6 pr-6 mb-4"> {/* Added mb-4 for gap */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start gap-4">
            <NotificationItemIcon className="w-5 h-5 mt-1 flex-shrink-0" />
            <h3 className="text-violet-950 text-xl font-medium poppins-thin">
              New {notification.leadCount > 1 ? "Leads" : "Lead"} Assigned
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-violet-900 text-[10px] font-normal poppins-thin leading-none">
              Today {formatTime(notification.timestamp)}
            </span>
            <button
              onClick={handleClose}
              className="text-violet-900 hover:text-violet-700 p-1 bg-white rounded-full"
            >
              <NotificationItemCloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="ml-9 text-black text-sm font-normal poppins-thin leading-normal">
          {notification.message} assigned by {notification.assignedBy}
          {notification.leadCount > 1 && (
            <span> ({notification.leadCount} leads)</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;