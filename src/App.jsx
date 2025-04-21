import { useSelector } from "react-redux";
import NotificationContainer from "./components/common/notifications/NotificationContainer";
import InteractiveNotification from "./components/interactive-notifications/InteractiveNotificaiton";
import NotificationManager from "./components/interactive-notifications/NotificationManager";
import Routers from "./components/root/Routers";
import VideoDialogue from "./components/signin/VideoDialogue";

function App() {
  const { isOpen } = useSelector((state) => state.quoteDialogue);
  return (
    <>
      <NotificationContainer />
      {isOpen && <VideoDialogue/>}
      <NotificationManager/>
      <Routers />
    </>
  );
}

export default App;
