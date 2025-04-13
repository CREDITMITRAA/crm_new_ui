import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DownloadDocumentButton from "../components/common/DownloanDocumentButton";
import Pagination from "../components/common/Pagination";
import PrimaryButton from "../components/common/PrimaryButton";
import BackIcon from "../components/icons/BackIcon";
import CategoryIcon from "../components/icons/CategoryIcon";
import CompanyIcon from "../components/icons/CompanyIcon";
import EmailIcon from "../components/icons/EmailIcon";
import GenderIcon from "../components/icons/GenderIcon";
import LocationIcon from "../components/icons/LocationIcon";
import PhoneIcon from "../components/icons/PhoneIcon";
import SalaryIcon from "../components/icons/SalaryIcon";
import SourceIcon from "../components/icons/SourceIcon";
import UserIcon from "../components/icons/UserIcon";
import CreditReport from "../components/lead-details-page/CreditReport";
import CreditSummaryTable from "../components/lead-details-page/CreditSummaryTable";
import DocumentCard from "../components/lead-details-page/DocumentCard";
import DocumentDropdown from "../components/lead-details-page/DocumentDropdown";
import EmployeeDetailsCard from "../components/lead-details-page/EmployeeDetailsCard";
import LoanReport from "../components/lead-details-page/LoanReport";
import LoansSummaryTable from "../components/lead-details-page/LoansSummaryTable";
import OtherLoanReport from "../components/lead-details-page/OtherLoanReport";
import SingleDetailCard from "../components/lead-details-page/SingleDetailCard";
import ExportButton from "../components/common/ExportButton";
import ClearButton from "../components/common/ClearButton";
import FilterButton from "../components/common/FiltersButton";
import DateButton from "../components/common/DateButton";
import { useDispatch, useSelector } from "react-redux";
import ActivityLogsContainer from "../components/activity-log/ActivityLogsContainer";
import { resetActivityLogs } from "../features/activity-logs/activityLogsSlice";
import { getAllActivityLogs } from "../features/activity-logs/activityLogsThunks";
import FilterDialogueForActivityLogsTable from "../components/activity-log/FilterDialogueForActivityLogsTable";
import Snackbar from "../components/common/snackbars/Snackbar";
import { exportLeadActivityLogs } from "../utilities/utility-functions";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";
import { getUsersNameAndId } from "../features/users/usersThunks";
import ActivityLog from "../components/lead-details-page/ActivityLog";
import BasicDetailsContainer from "../components/lead-details-page/BasicDetailsContainer";
import { getLeadByLeadId, getRecentActivityNotesByLeadId } from "../features/leads/leadsThunks";
import { getLoanReportsByLeadId } from "../features/loan-reports/loanReportsThunks";
import { getCreditReportsByLeadId } from "../features/credit-reports/creditReportsThunks";
import { getRecentActivity } from "../features/activities/activitiesThunks";
import { getLeadDocumentsByLeadId } from "../features/lead-documents/leadDocumentsThunks";
import { resetLead } from "../features/leads/leadsSlice";


const employmentDetailsCards = [
  {
    icon: <CompanyIcon />,
    name: "Company",
  },
  {
    icon: <LocationIcon />,
    name: "Place",
  },
  {
    icon: <SalaryIcon />,
    name: "Salary",
  },
  {
    icon: <CategoryIcon />,
    name: "Category",
  },
];

function LeadDetailsPage({}) {
  const dispatch = useDispatch();
  const { leadId } = useParams();
  const [showActivityLog, setShowActivityLog] = useState(false);

  useEffect(()=>{
      dispatch(getLeadByLeadId({leadId:leadId}))
      dispatch(getLoanReportsByLeadId(leadId))
      dispatch(getCreditReportsByLeadId(leadId))
      dispatch(getRecentActivityNotesByLeadId({leadId:leadId, limit:3}))
      dispatch(getRecentActivity({leadId:leadId}))
      dispatch(getLeadDocumentsByLeadId({lead_id:leadId}))
      return () => {
        dispatch(resetLead())
      }
  },[])

  return (
    <>
      <div className="w-full h-full">
        {showActivityLog ? (
          <>
            <ActivityLog
              setShowActivityLog={setShowActivityLog}
              showActivityLog={showActivityLog}
              leadId={leadId}
            />
          </>
        ) : (
          <>
            <BasicDetailsContainer
              employmentDetailsCards={employmentDetailsCards}
              setShowActivityLog={setShowActivityLog}
              showActivityLog={showActivityLog}
            />
          </>
        )}
        
      </div>
    </>
  );
}

export default LeadDetailsPage;