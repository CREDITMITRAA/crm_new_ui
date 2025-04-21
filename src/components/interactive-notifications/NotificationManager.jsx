// src/components/interactive-notifications/NotificationManager.js
import { useSelector, useDispatch } from "react-redux";
import { hideInteractiveNotification } from "../../features/interactive-notifications/interactiveNotificationsSlice";
import InteractiveNotification from "./InteractiveNotificaiton";

const NotificationManager = () => {
  const { show, videoSrc, message } = useSelector(
    (state) => state.interactiveNotifications
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideInteractiveNotification());
  };

  return (
    <InteractiveNotification
      show={show}
      onClose={handleClose}
      videoSrc={videoSrc}
      // message={"asdfihsd aifuhapsd fhasdpofh asdpfih asdpfiasdhfpsadi fhasdf fdasda sgag asga sgarhaerhwh5 hadfshadhdh sdhsdhdhfhsdh"}
      //   message={"asdofihas dpohasd poashfpoasfhapsoifh apoifhaspfiohaspfiomaspghaspg iadpghaghaspihas pfhapfh aspfihasdpf dsp aspodfijasdp ohaspfio asdpfihasdpfi asfpiashfpasi fpaosfapsdfi hasdpif"}
      message={message}
      autoPlay
    />
  );
};

export default NotificationManager;
