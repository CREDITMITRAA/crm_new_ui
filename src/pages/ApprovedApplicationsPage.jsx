import { useEffect, useRef, useState } from "react";
import ClearButton from "../components/common/ClearButton";
import ExportButton from "../components/common/ExportButton";
import FilterButton from "../components/common/FiltersButton";
import PrimaryButton from "../components/common/PrimaryButton";
import {
  ADVANCE_AMOUNT_PAID,
  APPLICATION_APPROVED,
  APPLICATION_IS_CLOSED,
  APPROVED_APPLICATIONS,
  CLOSING_AMOUNT_PAID,
  CLOSING_DATE_CHANGED,
  LOAN_DISBURSED_FROM_BANK,
  LOGIN_STARTED,
  NORMAL_LOGIN,
  OTHERS,
  PAID,
  PRELIMINERY_CHECK,
  ROLE_EMPLOYEE,
  terminologiesMap,
  UNPAID,
} from "../utilities/AppConstants";
import { useDispatch, useSelector } from "react-redux";
import UnPaidApplicationsTable from "../components/approved-applications/UnPaidApplicationsTable";
import { getApprovedLeads } from "../features/approved-leads/approvedLeadsThunks";
import { getAllDistinctLeadSources } from "../features/leads/leadsThunks";
import { debounce } from "lodash";
import Pagination from "../components/common/Pagination";
import { exportLeadsHandler, isEmpty } from "../utilities/utility-functions";
import EmptyDataMessageIcon from "../components/icons/EmptyDataMessageIcon";
import PaidApplicationsTable from "../components/approved-applications/PaidApplicationsTable";
import Loader from "../components/common/loaders/Loader";
import FilterDialogueForWalkInLeadsTable from "../components/walk-ins/FilterDialogueForWalkInLeadsTable";
import FilterDialogueForApprovedApplications from "../features/approved-leads/FilterDialogueForApprovedApplications";
import Snackbar from "../components/common/snackbars/Snackbar";
import NormalLoginTable from "../components/walk-ins/NormalLoginTable";
import FilterDialogueForVerificationLeadsTable from "../components/verification/FilterDialogueForVerificationLeadsTable";

const defaultApprovedLeadsTableFilters = {
  lead_bucket : APPROVED_APPLICATIONS,
  /* application_status: [APPROVED_APPLICATIONS,CLOSING_DATE_CHANGED] */
  is_paid : false
};

const defaultPaidApprovedLeadsTableFilters = {
  lead_bucket : APPROVED_APPLICATIONS,
  /* application_status: [CLOSING_AMOUNT_PAID, ADVANCE_AMOUNT_PAID, LOAN_DISBURSED_FROM_BANK, APPLICATION_IS_CLOSED, OTHERS, LOGIN_STARTED] */
  is_paid : true
}

function ApprovedApplicationsPage() {
  const dispatch = useDispatch();
  const { loading, error, leads, pagination } = useSelector(
    (state) => state.approvedLeads
  );
  const { height } = useSelector((state) => state.ui);
  const { users } = useSelector((state) => state.users);
  const { user, role } = useSelector((state) => state.auth);
  const [showFilter, setShowFilter] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [tableType, setTableType] = useState(UNPAID);
  const [filters, setFilters] = useState({
    ...defaultApprovedLeadsTableFilters,
    ...(role === ROLE_EMPLOYEE && { assigned_to: user.user.id })
  });
  const [pageSize, setPageSize] = useState(0);
  const [resetFilters, setResetFilters] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const initialLoad = useRef(true);
  const debouncedFetchLeads = useRef(null);
  const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastStatusMessage, setToastStatusMessage] = useState(null);
    const [toastStatusType, setToastStatusType] = useState(null);
    const [
      shouldSnackbarCloseOnClickOfOutside,
      setShouldSnackbarCloseOnClickOfOutside,
    ] = useState(true);

  const fieldsToExport = [
    "id",
    "name",
    "phone",
    "lead_source",
    "lead_status",
    "application_status",
    "closing_date",
    "verification_date",
    "status",
    "createdAt",
    "updatedAt",
    "LeadAssignments",
  ];

  const paginationOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  // Initialize debounced function
    useEffect(() => {
      debouncedFetchLeads.current = debounce((filters) => {
        dispatch(getApprovedLeads(filters));
      }, 500);
  
      return () => {
        debouncedFetchLeads.current?.cancel();
      };
    }, [dispatch]);
  
    // Main effect for initial load and page size changes
    useEffect(() => {
      if (height > 0) {
        const calculatedPageSize = Math.floor(height / 40);
        setPageSize(calculatedPageSize);
        
        if (initialLoad.current || pageSize !== calculatedPageSize) {
          debouncedFetchLeads.current({ ...filters, pageSize: calculatedPageSize });
          dispatch(getAllDistinctLeadSources());
          initialLoad.current = false;
        }
      }
    }, [dispatch, height, pageSize, filters]);
  
    // Effect for filter changes
    useEffect(() => {
      if (!initialLoad.current && pageSize > 0) {
        debouncedFetchLeads.current({ ...filters, pageSize });
      }
    }, [filters, pageSize]);
  
    // Effect for showing active filters dot
    useEffect(() => {
      if (pageSize > 0) {
        // Base excluded keys for all roles
        let excludedKeys = [
          "page",
          "pageSize",
          "totalPages",
          "total",
          "is_paid"
        ];
    
        // Role-specific exclusions
        if (role === ROLE_EMPLOYEE) {
          excludedKeys = [...excludedKeys, "assigned_to", "lead_bucket"];
        } else {
          excludedKeys = [...excludedKeys, "lead_bucket"];
        }
    
        // Special handling for NORMAL_LOGIN table type
        let isNormalLoginTable = tableType === NORMAL_LOGIN;
        if (isNormalLoginTable) {
          excludedKeys = [...excludedKeys, "lead_bucket", "verification_status"];
        }
    
        const filteredFilters = Object.entries(filters).reduce((acc, [key, value]) => {
          // Skip excluded keys
          if (excludedKeys.includes(key)) return acc;
          
          // Skip empty values
          if (
            value == null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && Object.keys(value).length === 0)
          ) return acc;
    
          // Special case for NORMAL_LOGIN tables
          if (isNormalLoginTable) {
            // Skip if verification_status is ['Normal Login']
            if (key === 'verification_status' && 
                Array.isArray(value) && 
                value.length === 1 && 
                value[0] === 'Normal Login') {
              return acc;
            }
            // Skip if lead_bucket is "PRELIMINARY_CHECK"
            if (key === 'lead_bucket' && value === "PRELIMINARY_CHECK") {
              return acc;
            }
          }
    
          acc[key] = value;
          return acc;
        }, {});
    
        setShowDot(Object.keys(filteredFilters).length > 0);
      }
    }, [filters, pageSize, role, tableType]);
  
    // Effect for normal login table toggle
    useEffect(() => {
      let newFilters = { ...filters };
      
      if (tableType === PAID) {
        newFilters = {
          ...defaultPaidApprovedLeadsTableFilters,
          ...(role === ROLE_EMPLOYEE && { assigned_to: user.user.id })
        };
      } else if(tableType === UNPAID){
        newFilters = {...defaultApprovedLeadsTableFilters, ...(role === ROLE_EMPLOYEE && { assigned_to: user.user.id })}
      } else if(tableType === NORMAL_LOGIN){
        newFilters = {
          lead_bucket : PRELIMINERY_CHECK,
          verification_status: [NORMAL_LOGIN],
          ...(role === ROLE_EMPLOYEE && { assigned_to: user.user.id })
        }
      }
      
      setFilters(newFilters);
    }, [tableType]);
  
    // Delayed loader display to prevent flashing
    useEffect(() => {
      let timer;
      if (loading) {
        timer = setTimeout(() => setShowLoader(true), 300);
      } else {
        setShowLoader(false);
      }
      return () => clearTimeout(timer);
    }, [loading]);

  function handleRowsPerChange(data) {
    dispatch(getApprovedLeads({ ...filters, page: 1, pageSize: data }));
  }

  function handlePageChange(data) {
    let payload = {
      ...filters,
      pageSize: pagination.pageSize,
      page: data,
    };
    dispatch(getApprovedLeads(payload));
  }

  function handleNextPageClick() {
    if (pagination.page < pagination.totalPages) {
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page + 1,
      };
      dispatch(getApprovedLeads(payload));
    }
  }

  function handlePrevPageClick() {
    if (pagination.page > 1) {
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page - 1,
      };
      dispatch(getApprovedLeads(payload));
    }
  }

  function handleResetFilters() {
    if (showDot) {
      let newFilters = null
      switch(tableType){
        case UNPAID:
          newFilters = {
            ...defaultApprovedLeadsTableFilters
          }
          break;

        case PAID:
          newFilters = {
            lead_bucket : APPROVED_APPLICATIONS,
            application_status: [CLOSING_AMOUNT_PAID,ADVANCE_AMOUNT_PAID]
          }
          break;

        case NORMAL_LOGIN:
          newFilters = {
            lead_bucket : PRELIMINERY_CHECK,
            verification_status : [NORMAL_LOGIN]
          }
          break;
      }

      if (role === ROLE_EMPLOYEE) {
        newFilters.assigned_to = user.user.id;
      }

      setFilters(newFilters);
      setResetFilters(true);
      setShowDot(false);

      setTimeout(() => {
        setResetFilters(false);
      }, 1000);
    }
  }

  function showTable(tableType) {
    if (showLoader || isEmpty(leads)) return null;
    switch (tableType) {
      case UNPAID:
        return (
          <div className="mt-2">
            <UnPaidApplicationsTable leads={leads} />
          </div>
        );

      case PAID:
          return (
            <div className="mt-2">
            <PaidApplicationsTable leads={leads} />
          </div>
          )

      case NORMAL_LOGIN:
        return (
          <div className="mt-2">
            <NormalLoginTable leads={leads}/>
          </div>
        )
    }
  }

  async function handleExportLeads() {
      setToastStatusType("INFO");
      setToastMessage("Exporting Leads... 0%");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(false);
      setOpenToast(true);
      
      let response = null;
      response = await exportLeadsHandler(
        filters,
        [],
        leads,
        users,
        fieldsToExport,
        setToastMessage
      );
      
      if (response === true) {
        setToastStatusType("SUCCESS");
        setToastMessage("Leads Exported Successfully");
        setShouldSnackbarCloseOnClickOfOutside(true);
      } else if (response === false && response !== null) {
        setToastStatusType("ERROR");
        setToastMessage("Failed to export leads!");
        setShouldSnackbarCloseOnClickOfOutside(true);
      }
    }

  return (
    <div className="w-full h-full">
      {/* Controls container */}
      <div className="grid grid-cols-12 gap-2">
        <div className="row col-span-12 flex justify-between items-center">
          <div>
            <span className="text-black text-base font-semibold poppins-thin leading-tight">
              {terminologiesMap.get(APPROVED_APPLICATIONS)}
            </span>
          </div>
          <div className="flex grid-cols-6 gap-2">
          <PrimaryButton
              isActive={tableType === NORMAL_LOGIN}
              name="Normal Login"
              onClick={() => {
                setTableType(NORMAL_LOGIN);
              }}
              backgroundColor="#C7D4E4"
            />
            <PrimaryButton
              isActive={tableType === UNPAID}
              name="UnPaid"
              onClick={() => {
                setTableType(UNPAID);
              }}
              backgroundColor="#C7D4E4"
            />
            <PrimaryButton
              name="Paid"
              isActive={tableType === PAID}
              onClick={() => {
                setTableType(PAID);
              }}
              backgroundColor="#C7D4E4"
            />
            <FilterButton
              onClick={() => setShowFilter(!showFilter)}
              showDot={showDot}
              showFilter={showFilter}
            />
            {showDot && <ClearButton onClick={() => handleResetFilters()} />}
            {role !== ROLE_EMPLOYEE && <ExportButton onClick={() => handleExportLeads()} />}
          </div>
        </div>
      </div>

      <div
        className={`col-span-12 rounded transition-all duration-500 ease-in-out z-0 ${
          showFilter
            ? "max-h-[400px] opacity-100 overflow-visible"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {
          tableType === NORMAL_LOGIN ?
          <FilterDialogueForVerificationLeadsTable
          setFilters={setFilters}
          filters={filters}
          resetFilters={resetFilters}
        /> :
          <FilterDialogueForApprovedApplications
          setFilters={setFilters}
          filters={filters}
          resetFilters={resetFilters}
          tableType={tableType}
        />
        }
      </div>

      {/* Content Area */}
            {showLoader ? (
              <div
                className="w-full flex justify-center items-center mt-2 bg-[#E8EFF8] rounded-2xl"
                style={{ height: `${height + 30}px` }}
              >
                <Loader />
              </div>
            ) : isEmpty(leads) ? (
              <div
                className="w-full bg-[#F0F6FF] flex justify-center items-center mt-2 rounded-2xl"
                style={{ height: `${height + 30}px` }}
              >
                <EmptyDataMessageIcon size={100} />
              </div>
            ) : (
              <>
                {showTable(tableType)}
                <div className="mt-0.5 px-4">
                  <Pagination
                    total={pagination?.total}
                    page={pagination?.page}
                    pageSize={pagination?.pageSize}
                    onRowsPerChange={handleRowsPerChange}
                    onPageChange={handlePageChange}
                    onNextPageClick={handleNextPageClick}
                    onPrevPageClick={handlePrevPageClick}
                    options={paginationOptions}
                    resetFilters={resetFilters}
                  />
                </div>
              </>
            )}
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

export default ApprovedApplicationsPage;
