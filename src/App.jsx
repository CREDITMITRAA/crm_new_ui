import NotificationContainer from "./components/common/notifications/NotificationContainer";
import InteractiveNotification from "./components/interactive-notifications/InteractiveNotificaiton";
import NotificationManager from "./components/interactive-notifications/NotificationManager";
import Routers from "./components/root/Routers";

function App() {
  return (
    <>
      <NotificationContainer />
      
      <NotificationManager/>
      <Routers />
    </>
  );
}

export default App;
