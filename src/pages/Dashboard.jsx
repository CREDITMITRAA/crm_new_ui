import { useEffect, useRef, useState } from "react";
import ActivityLog from "../components/activity-log/ActivityLog";
import ClearButton from "../components/common/ClearButton";
import DateButton from "../components/common/DateButton";
import DateTimeRangePicker from "../components/common/DateTimeRangePicker";
import AddActivityDialogue from "../components/common/dialogues/AddActivityDialogue";
import DropDown from "../components/common/dropdowns/DropDown";
import ExportButton from "../components/common/ExportButton";
import FilterButton from "../components/common/FiltersButton";
import Loader from "../components/common/loaders/Loader";
import Pagination from "../components/common/Pagination";
import GraphHoverPopUp from "../components/common/popups/GraphHoverPopUp";
import MoreOptionsPopUp from "../components/common/popups/MoreOptionsPopUp";
import ErrorSnackbar from "../components/common/snackbars/ErrorSnackbar";
import InfoSnackbar from "../components/common/snackbars/InfoSnackbar";
import NotificationSnackbar from "../components/common/snackbars/NotificationSnackbar";
import SuccessSnackbar from "../components/common/snackbars/SuccessSnackbar";
import WarningSnackbar from "../components/common/snackbars/WarningSnackbar";
import PerformanceChart from "../components/dashboard/charts/PerformanceChart";
import CountCard from "../components/dashboard/CountCard";
import RecentTasksTable from "../components/dashboard/RecentTasksTable";
import WalkInsTable from "../components/dashboard/WalkInsTable";
import TodaysLeadsIcon from "../components/icons/TodaysLeadsIcon";
import TodaysWalkInsIcon from "../components/icons/TodaysWalkInsIcon";
import TotalLeadsIcon from "../components/icons/TotalLeadsIcon";
import TotalWalkInsIcon from "../components/icons/TotalWalkInsIcon";
import LoaderPage from "./LoaderPage";
import {
  getAllDistinctLeadSources,
  getTodaysLeadsCount,
  getTotalLeadsCount,
} from "../features/leads/leadsThunks";
import { useDispatch, useSelector } from "react-redux";
import {
  getWalkIns,
  getWalkInsCount,
} from "../features/walk-ins/walkInsThunks";
import {
  exportLeadsHandler,
  formatDatePayload,
} from "../utilities/utility-functions";
import Snackbar from "../components/common/snackbars/Snackbar";
import { getUsersNameAndId } from "../features/users/usersThunks";
import ConfirmationDialogue from "../components/common/dialogues/ConfirmationDialogue";
import PerformanceChart2 from "../components/dashboard/charts/PerformanceChart2";
import PerformanceChartRecharts from "../components/dashboard/charts/PerformanceChart2";
import PerformanceChartHorizontal from "../components/dashboard/charts/PerformanceChart2";
import FilterDialogueForCharts from "../components/dashboard/charts/FilterDialogueForCharts";
import { utils, writeFile } from "xlsx";
import * as XLSX from "xlsx";
import { ROLE_EMPLOYEE } from "../utilities/AppConstants";

function Dashboard() {
  const calledRef = useRef();
  const dispatch = useDispatch();
  const { todaysLeadsCount, totalLeadsCount, loading } = useSelector(
    (state) => state.leads
  );
  const { totalWalkInsCount, todaysWalkInsCount } = useSelector(
    (state) => state.walkIns
  );
  const { user, role } = useSelector((state) => state.auth);
  const [countCards, setCountCards] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [filters, setFilters] = useState({});
  const [resetFilters, setResetFilters] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [exportData, setExportData] = useState(false);

  useEffect(() => {
    dispatch(getTodaysLeadsCount({...(role === ROLE_EMPLOYEE && {assigned_to : user.user.id})}));
    dispatch(getTotalLeadsCount({...(role === ROLE_EMPLOYEE && {assigned_to : user.user.id})}));
    dispatch(getWalkInsCount({...(role === ROLE_EMPLOYEE && {assigned_to : user.user.id})}));
    dispatch(getUsersNameAndId());
    dispatch(getAllDistinctLeadSources());
  }, [dispatch]);

  useEffect(() => {
    setCountCards([
      {
        title: "Total Pipeline Entries",
        count: totalLeadsCount || 0, // Fallback to 0 if undefined
        icon: <TotalLeadsIcon color="rgba(70, 70, 70, 1)" width="20" height="20"/>,
      },
      {
        title: `Today's Pipeline Entries`,
        count: todaysLeadsCount || 0, // Fallback to 0 if undefined
        icon: <TodaysLeadsIcon color="rgba(70, 70, 70, 1)" width="20" height="20"/>,
      },
      {
        title: "Total Appointments",
        count: totalWalkInsCount,
        icon: <TotalWalkInsIcon color="rgba(70, 70, 70, 1)" width="20" height="20"/>,
      },
      {
        title: `Today's Appointments`,
        count: todaysWalkInsCount,
        icon: <TodaysWalkInsIcon color="rgba(70, 70, 70, 1)" width="20" height="20"/>,
      },
    ]);
  }, [todaysLeadsCount, totalLeadsCount]);

  function handleDateChange(fieldName, data) {
    console.log("selected dates = ", data);
    console.log("converted date time = ", formatDatePayload(data));
    const date_filter = formatDatePayload(data);
    setFilters((prev) => ({ ...prev, ...date_filter }));
  }

  function handleResetFilters() {
    let initialFilters = {};
    setFilters(initialFilters);
    setResetFilters(true);
    setTimeout(() => {
      setResetFilters(false);
    }, 1000);
  }

  return (
    <div className="w-full">
      {/* <!-- Cards Container --> */}
      <div className="grid grid-cols-12 gap-7">
        {countCards.map((card, index) => (
          <CountCard
            title={card.title}
            count={card.count}
            icon={card.icon}
            key={card.title}
            loading={loading}
          />
        ))}
      </div>

      {/* <div className="grid grid-cols-12 px-4">
        <div className="col-span-12 flex justify-between py-2 rounded-md mt-3 gap-2">
          <div className="text-black text-base font-semibold poppins-thin leading-tight flex items-center">
            
          </div>
          <div className="flex gap-x-2">
            <DateButton
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              onDateChange={(fieldName, data) =>
                handleDateChange(fieldName, data)
              }
              showDot={
                filters.hasOwnProperty("date") ||
                filters.hasOwnProperty("date_time_range")
              }
              resetFilters={resetFilters}
              fieldName="date"
              date={filters?.date}
              buttonBackgroundColor="bg-[#C7D4E4]"
              showBoxShadow={true}
            />
            {role !== ROLE_EMPLOYEE && (
              <FilterButton
                onClick={() => setShowFilter(!showFilter)}
                showDot={showDot}
              />
            )}
            {showDot && <ClearButton onClick={() => handleResetFilters()} />}
            <ExportButton onClick={() => setExportData(true)} />
          </div>
        </div>
      </div> */}

      <div
        className={`col-span-12 rounded overflow-hidden transition-all duration-500 ease-in-out overflow-visible ${
          showFilter ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <FilterDialogueForCharts
          setFilters={setFilters}
          filters={filters}
          resetFilters={resetFilters}
        />
      </div>

      <div className="mr-4 w-full mb-2">
        <PerformanceChartHorizontal
          setFilters={setFilters}
          filters={filters}
          setShowDot={setShowDot}
          exportData={exportData}
          setExportData={setExportData}
        />
      </div>

      <div className="mr-4 w-full mb-2">
        <PerformanceChart
          // data={sampleData}
          // filters={filters}
          // setShowDot={setShowDot}
          // exportData={exportData}
          // setExportData={setExportData}
          // setFilters={setFilters}
        />
      </div>

      {/* walk-ins table container */}
      <div>
        <div className="mt-2 h-max flex flex-col mb-2">
          <WalkInsTable />
        </div>
      </div>

      {/* recent tasks container */}
      <div>
        <div className="mt-2 h-max flex flex-col mb-1">
          <RecentTasksTable />
        </div>
      </div>

      {/* activity log container */}
      {role !== ROLE_EMPLOYEE && (
        <div className="mt-0">
          <ActivityLog />
        </div>
      )}

      <Snackbar
        isOpen={openToast}
        onClose={() => setOpenToast(false)}
        status="Success"
        message="Lead exported Successfulyy"
      />
    </div>
  );
}

export default Dashboard;
