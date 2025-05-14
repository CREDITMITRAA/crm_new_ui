import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "../../layouts/RootLayout"; // Contains <Outlet />
import Dashboard from "../../pages/Dashboard";
import Leads from "../../pages/Leads";
import Verification1 from "../../pages/Verification1";
import WalkIns from "../../pages/WalkIns";
import Employees from "../../pages/Employees";
import LeadDetailsPage from "../../pages/LeadDetailsPage";
import PrivateRoute from "../PrivateRoute";
import useSocket from "../../hooks/useSocket";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../features/notifications/notificationSlice";
import { useEffect } from "react";
import { getNotificationsByEmployeeId } from "../../features/notifications/notificationsThunk";
import SignIn from "../../pages/new/SignIn";
import ApprovedApplicationsPage from "../../pages/ApprovedApplicationsPage";

function Routers() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let payload = {
      employee_id: user?.user.id,
      only_unacknowledged: true,
      is_interactive:false
    };
    if(user?.user.id){
      dispatch(getNotificationsByEmployeeId(payload));
    }
  }, []);

  useEffect(() => {
    if (user?.user.id && location.pathname !== "/") {
      let payload = {
        employee_id: user?.user.id,
        only_unacknowledged: true,
        is_interactive:false
      };
      dispatch(getNotificationsByEmployeeId(payload));
    }
  }, [user?.user.id, location.pathname]);

  function handleNotificationReceived(notification) {
    console.log("notification = ", notification);
    dispatch(addNotification(notification));
  }
  useSocket(user?.user.id, handleNotificationReceived);

  return (
    <Router>
      <Routes>
        {/* Public Route for SignIn */}
        <Route path="/" element={<SignIn />} />

        {/* Protected Routes inside RootLayout */}
        <Route element={<RootLayout />}>
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route path="/leads" element={<PrivateRoute element={<Leads />} />} />
          <Route
            path="/verification-1"
            element={<PrivateRoute element={<Verification1 />} />}
          />
          <Route
            path="/walk-ins"
            element={<PrivateRoute element={<WalkIns />} />}
          />
          <Route
            path="/employees"
            element={<PrivateRoute element={<Employees />} />}
          />
          <Route
            path="/lead-details-page/:leadId"
            element={<PrivateRoute element={<LeadDetailsPage />} />}
          />
          <Route
            path="/approved-applications"
            element={<PrivateRoute element={<ApprovedApplicationsPage/>}/>}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default Routers;
