import { useCallback, useEffect, useState, useRef } from "react";
import ClearButton from "../components/common/ClearButton";
import ExportButton from "../components/common/ExportButton";
import FilterButton from "../components/common/FiltersButton";
import VerificationTable from "../components/verification/VerificationTable";
import { useDispatch, useSelector } from "react-redux";
import { getVerificationLeads } from "../features/verification/verificationThunks";
import Pagination from "../components/common/Pagination";
import FilterDialogueForVerificationLeadsTable from "../components/verification/FilterDialogueForVerificationLeadsTable";
import { debounce } from "lodash";
import Snackbar from "../components/common/snackbars/Snackbar";
import { exportLeadsHandler, isEmpty } from "../utilities/utility-functions";
import Loader from "../components/common/loaders/Loader";
import EmptyDataMessageIcon from "../components/icons/EmptyDataMessageIcon";
import { getAllDistinctLeadSources } from "../features/leads/leadsThunks";
import { ROLE_EMPLOYEE, terminologiesMap, VERIFICATION_1 } from "../utilities/AppConstants";

function Verification1() {
  const dispatch = useDispatch();
  const { leads, pagination, loading } = useSelector(
    (state) => state.verification
  );
  const { users } = useSelector((state) => state.users);
  const { height } = useSelector((state) => state.ui);
  const { user, role } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({ 
    lead_status: "Verification 1",
    ...(role === ROLE_EMPLOYEE && { assigned_to: user.user.id })
  });
  const [pageSize, setPageSize] = useState(0);
  const [resetFilters, setResetFilters] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);

  const initialLoad = useRef(true);
  const debouncedFetchLeads = useRef(null);

  const fieldsToExport = [
    "id",
    "name",
    "phone",
    "verification_status",
    "lead_source",
    "lead_status",
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
      dispatch(getVerificationLeads(filters));
    }, 500);

    return () => {
      debouncedFetchLeads.current.cancel();
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
      const excludedKeys = role === ROLE_EMPLOYEE
        ? ["page", "pageSize", "totalPages", "total", "assigned_to"]
        : ["page", "pageSize", "totalPages", "total"];

      const filteredFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (excludedKeys.includes(key)) return acc;
        if (value == null || value === "" || 
            (Array.isArray(value) && value.length === 0) || 
            (typeof value === 'object' && Object.keys(value).length === 0)) {
          return acc;
        }
        acc[key] = value;
        return acc;
      }, {});

      setShowDot(Object.keys(filteredFilters).length > 0);
    }
  }, [filters, pageSize, role]);

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
    dispatch(getVerificationLeads({ ...filters, page: 1, pageSize: data }));
  }

  function handlePageChange(data) {
    let payload = {
      ...filters,
      pageSize: pagination.pageSize,
      page: data,
    };
    dispatch(getVerificationLeads(payload));
  }

  function handleNextPageClick() {
    if (pagination.page < pagination.totalPages) {
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page + 1,
      };
      dispatch(getVerificationLeads(payload));
    }
  }

  function handlePrevPageClick() {
    if (pagination.page > 1) {
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page - 1,
      };
      dispatch(getVerificationLeads(payload));
    }
  }

  function handleResetFilters() {
    if (showDot) {
      let initialFilters = {
        lead_status: "Verification 1",
        ...(role === ROLE_EMPLOYEE && { assigned_to: user.user.id }),
        pageSize: pagination.pageSize || 10,
      };
      setFilters(initialFilters);
      setResetFilters(true);
      setShowDot(false);
      setTimeout(() => {
        setResetFilters(false);
      }, 1000);
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
    <div className="w-full">
      {/* Cards Container */}
      <div className="grid grid-cols-12 gap-2">
        <div className="row col-span-12 flex justify-between items-center">
          <div>
            <span className="text-black text-base font-semibold poppins-thin leading-tight">
              {terminologiesMap.get(VERIFICATION_1)}
            </span>
          </div>
          <div className="flex grid-cols-6 gap-2">
            <FilterButton
              onClick={() => setShowFilter(!showFilter)}
              showDot={showDot}
              showFilter={showFilter}
            />
            {showDot && <ClearButton onClick={handleResetFilters} />}
            {role !== ROLE_EMPLOYEE && <ExportButton onClick={handleExportLeads} />}
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
        <FilterDialogueForVerificationLeadsTable
          setFilters={setFilters}
          filters={filters}
          resetFilters={resetFilters}
        />
      </div>

      {/* Content Area */}
      {showLoader ? (
        <div
          className="w-full flex justify-center items-center mt-2 bg-[#E8EFF8] rounded-2xl"
          style={{ height: `${height + 30}px` }}
        >
          <Loader />
        </div>
      ) : (
        <>
          {isEmpty(leads) ? (
            <div
              className="w-full bg-[#F0F6FF] flex justify-center items-center mt-2 rounded-2xl"
              style={{ height: `${height + 30}px` }}
            >
              <EmptyDataMessageIcon size={100} />
            </div>
          ) : (
            <div className="mt-2 w-full">
              <VerificationTable leads={leads} filters={filters} />
            </div>
          )}
        </>
      )}

      {!showLoader && !isEmpty(leads) && (
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

export default Verification1;