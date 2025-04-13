// components/NotificationContainer.js
import { useSelector, useDispatch } from 'react-redux';
import NotificationItem from './NotificationItem';
import { removeNotification } from '../../../features/notifications/notificationSlice';

const MAX_VISIBLE_NOTIFICATIONS = 5;

const NotificationContainer = () => {
  const dispatch = useDispatch();
  const allNotifications = useSelector(state => state.notifications.notifications);
  const visibleNotifications = allNotifications.slice(0, MAX_VISIBLE_NOTIFICATIONS);

  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  return (
    <>
      {/* Single blurred background for all notifications */}
      {visibleNotifications.length > 0 && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300" />
      )}

      {/* Render only visible notifications with proper gaps */}
      {visibleNotifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          notification={notification}
          onClose={handleClose}
          index={index}
        />
      ))}
    </>
  );
};

export default NotificationContainer;