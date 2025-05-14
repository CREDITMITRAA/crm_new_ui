import { useDispatch, useSelector } from "react-redux";
import ClearButton from "../components/common/ClearButton";
import DeleteButton from "../components/common/DeleteButton";
import ExportButton from "../components/common/ExportButton";
import FilterButton from "../components/common/FiltersButton";
import PrimaryButton from "../components/common/PrimaryButton";
import WalkInsTable from "../components/walk-ins/WalkInsTable";
import { useCallback, useEffect, useState, useRef } from "react";
import { getAllWalkInLeads } from "../features/walk-ins/walkInsThunks";
import Pagination from "../components/common/Pagination";
import Snackbar from "../components/common/snackbars/Snackbar";
import { debounce } from "lodash";
import FilterDialogueForWalkInLeadsTable from "../components/walk-ins/FilterDialogueForWalkInLeadsTable";
import { exportLeadsHandler, isEmpty } from "../utilities/utility-functions";
import { APPOINTMENTS, NORMAL_LOGIN, ROLE_EMPLOYEE, terminologiesMap, WALK_INS } from "../utilities/AppConstants";
import NormalLoginTable from "../components/walk-ins/NormalLoginTable";
import Loader from "../components/common/loaders/Loader";
import EmptyDataMessageIcon from "../components/icons/EmptyDataMessageIcon";
import { getAllDistinctLeadSources } from "../features/leads/leadsThunks";

const defaultWalkInLeadsTableFilters = {
  // verification_status: ["Scheduled For Walk-In", "Scheduled Call With Manager"],
  lead_bucket: APPOINTMENTS,
  lead_status: "",
  for_walk_ins_page: true,
  walk_in_attributes: [
    "id",
    "is_call",
    "is_rescheduled",
    "rescheduled_date_time",
    "walk_in_date_time",
    "walk_in_status",
  ],
};

function WalkIns() {
  const dispatch = useDispatch();
  const {
    leads,
    leadsPagination: pagination,
    loading,
  } = useSelector((state) => state.walkIns);
  const { users } = useSelector((state) => state.users);
  const { height } = useSelector((state) => state.ui);
  const { user, role } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({ 
    ...defaultWalkInLeadsTableFilters,
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
  const [showNormalLoginTable, setShowNormalLoginTable] = useState(false);
  const [tableType, setTableType] = useState("");

  const initialLoad = useRef(true);
  const debouncedFetchLeads = useRef(null);

  const fieldsToExport = [
    "id",
    "name",
    "phone",
    "lead_source",
    "lead_status",
    "application_status",
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
      dispatch(getAllWalkInLeads(filters));
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
      const excludedKeys = role === ROLE_EMPLOYEE
        ? [
            "page",
            "pageSize",
            "totalPages",
            "total",
            "assigned_to",
            ...Object.keys(defaultWalkInLeadsTableFilters).filter(k => k !== "lead_status"),
          ]
        : [
            "page",
            "pageSize",
            "totalPages",
            "total",
            ...Object.keys(defaultWalkInLeadsTableFilters).filter(k => k !== "lead_status"),
          ];

      const filteredFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (excludedKeys.includes(key)) return acc;
        if (key === "application_status" && value === NORMAL_LOGIN) return acc;
        if (
          value == null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'object' && Object.keys(value).length === 0)
        ) return acc;

        acc[key] = value;
        return acc;
      }, {});

      setShowDot(Object.keys(filteredFilters).length > 0);
    }
  }, [filters, pageSize, role]);

  // Effect for normal login table toggle
  useEffect(() => {
    if (showNormalLoginTable) {
      setFilters(prev => ({ ...prev, application_status: NORMAL_LOGIN }));
    } else {
      const { application_status, ...rest } = filters;
      setFilters(rest);
    }
  }, [showNormalLoginTable]);

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
    dispatch(getAllWalkInLeads({ ...filters, page: 1, pageSize: data }));
  }

  function handlePageChange(data) {
    let payload = {
      ...filters,
      pageSize: pagination.pageSize,
      page: data,
    };
    dispatch(getAllWalkInLeads(payload));
  }

  function handleNextPageClick() {
    if (pagination.page < pagination.totalPages) {
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page + 1,
      };
      dispatch(getAllWalkInLeads(payload));
    }
  }

  function handlePrevPageClick() {
    if (pagination.page > 1) {
      let payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: pagination.page - 1,
      };
      dispatch(getAllWalkInLeads(payload));
    }
  }

  function handleResetFilters() {
    if (showDot) {
      const newFilters = showNormalLoginTable
        ? { ...defaultWalkInLeadsTableFilters, application_status: NORMAL_LOGIN }
        : { ...defaultWalkInLeadsTableFilters };
      
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

  function showTable(tableType) {
    if (showLoader || isEmpty(leads)) return null;

    switch (tableType) {
      case NORMAL_LOGIN:
        return (
          <div className="mt-2">
            <NormalLoginTable leads={leads} />
          </div>
        );
      default:
        return (
          <div className="mt-2">
            <WalkInsTable leads={leads} />
          </div>
        );
    }
  }

  return (
    <div className="w-full">
      {/* Cards Container */}
      <div className="grid grid-cols-12 gap-2">
        <div className="row col-span-12 flex justify-between items-center">
          <div>
            <span className="text-black text-base font-semibold poppins-thin leading-tight">
              {terminologiesMap.get(WALK_INS)}
            </span>
          </div>
          <div className="flex grid-cols-6 gap-2">
            {/* <PrimaryButton
              isActive={!showNormalLoginTable}
              name="Appointments"
              onClick={() => {
                handleResetFilters();
                setShowNormalLoginTable(false);
                setTableType("");
                setShowFilter(false);
              }}
              backgroundColor="#C7D4E4"
            /> */}
            {/* <PrimaryButton
              name="Normal Login"
              isActive={showNormalLoginTable}
              onClick={() => {
                handleResetFilters();
                setShowNormalLoginTable(true);
                setTableType(NORMAL_LOGIN);
                setShowFilter(false);
              }}
              backgroundColor="#C7D4E4"
            /> */}
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
        <FilterDialogueForWalkInLeadsTable
          setFilters={setFilters}
          filters={filters}
          resetFilters={resetFilters}
          tableType={tableType}
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

export default WalkIns;