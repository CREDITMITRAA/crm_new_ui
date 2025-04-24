import { useCallback, useEffect, useRef, useState } from "react";
import ClearButton from "../components/common/ClearButton";
import DeleteButton from "../components/common/DeleteButton";
import ExportButton from "../components/common/ExportButton";
import FilterDialogue from "../components/common/filter-dialogue/FilterDialogue";
import FilterButton from "../components/common/FiltersButton";
import PrimaryButton from "../components/common/PrimaryButton";
import AssignedLeadsTable from "../components/leads/AssignedLeadsTable";
import NotAssignedLeadsTable from "../components/leads/NotAssignedLeadsTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDistinctLeadSources,
  getAllInvalidLeads,
  getAllLeads,
  getLeadsByAssignedUserId,
} from "../features/leads/leadsThunks";
import Pagination from "../components/common/Pagination";
import { debounce } from "lodash";
import DropDown from "../components/common/dropdowns/DropDown";
import AssignToButton from "../components/common/AssignToButton";
import UploadLeadsButton from "../components/common/UploadLeadsButton";
import ConfirmationDialogue from "../components/common/dialogues/ConfirmationDialogue";
import { assignLeads, fetchDistinctInvalidLeadReasons, uploadLeadsInBulk } from "../features/leads/leadsApi";
import Snackbar from "../components/common/snackbars/Snackbar";
import AlertButton from "../components/common/AlertButton";
import { exportLeadsHandler, isEmpty } from "../utilities/utility-functions";
import * as XLSX from "xlsx";
import { utils, writeFile } from "xlsx";
import MoreButton from "../components/common/MoreButton";
import InvalidLeadsTable from "../components/leads/InvalidLeadsTable";
import {
  ASSIGNED_TABLE,
  EX_EMPLOYEES_LEADS_TABLE,
  EXPORT_LEADS,
  INVALID_LEADS_TABLE,
  LEADS,
  NOT_ASSIGNED_TABLE,
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  terminologiesMap,
} from "../utilities/AppConstants";
import InfoButton from "../components/common/InfoButton";
import Loader from "../components/common/loaders/Loader";
import EmptyDataMessageIcon from "../components/icons/EmptyDataMessageIcon";
import { getUsersNameAndId } from "../features/users/usersThunks";

function Leads() {
  const dispatch = useDispatch();
  const { leads, pagination, invalidLeads, invalidLeadsPagination, loading } =
    useSelector((state) => state.leads);
  const { users, userOptions } = useSelector((state) => state.users);
  const { user, role } = useSelector((state) => state.auth);
  const { height } = useSelector((state) => state.ui);
  const [reasons, setReasons] = useState([]);
  const [filters, setFilters] = useState(() => {
    const baseFilters = {};
    if (user?.user?.role === ROLE_EMPLOYEE) {
      return {
        ...baseFilters,
        userId: user.user.id,
        exclude_verification: true
      };
    }
    return baseFilters;
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showNotAssignedTable, setShowNotAssignedTable] = useState(false);
  const [resetFilters, setResetFilters] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [areAllLeadsSelected, setAreAllLeadsSelected] = useState(false);
  const [showConfirmationDialogue, setShowConfirmationDialogue] =
    useState(false);
  const [confirmationDialogueMessage, setConfirmationDialogueMessage] =
    useState(null);
  const [confirmationDialogueButton, setConfirmationDialogueButton] =
    useState(null);
  const [
    disableConfirmationDialogueSubmitButton,
    setDisableConfirmationDialogueSubmitButton,
  ] = useState(false);
  const [assignedEmployee, setAssignedEmployee] = useState(null);
  const [assignmentApiPayload, setAssignmentApiPayload] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [showDot, setShowDot] = useState(false);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const [tableType, setTableType] = useState(ASSIGNED_TABLE);
  const [pageSize, setPageSize] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  const initialLoad = useRef(true);
  const debouncedFetchLeads = useRef(null);

  const fieldsToExport = [
    "id",
    "name",
    "phone",
    "lead_source",
    "reason",
    "verification_status",
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
    console.log('table type = ', tableType)
    debouncedFetchLeads.current = debounce((filters) => {
      if (user.user.role === ROLE_EMPLOYEE) {
        dispatch(getLeadsByAssignedUserId(filters));
      } else if (tableType === INVALID_LEADS_TABLE) {
        dispatch(getAllInvalidLeads(filters));
      } else {
        dispatch(getAllLeads(filters));
      }
    }, 500);

    return () => {
      debouncedFetchLeads.current?.cancel();
    };
  }, [dispatch, tableType, user.user.role]);

  // Track when initial data is loaded
  useEffect(() => {
    if (!loading && (leads.length > 0 || invalidLeads.length > 0) && !isInitialDataLoaded) {
      setIsInitialDataLoaded(true);
    }
  }, [loading, leads, invalidLeads, isInitialDataLoaded]);

  // Main effect for initial load and page size changes
  useEffect(() => {
    if (height > 0) {
      const newPageSize = Math.floor(height / 40);
      setPageSize(newPageSize);

      if (initialLoad.current) {
        const initialFilters = {
          pageSize: newPageSize,
          ...(user?.user?.role === ROLE_EMPLOYEE && {
            userId: user.user.id,
            exclude_verification: true
          })
        };

        debouncedFetchLeads.current(initialFilters);
        dispatch(getAllDistinctLeadSources());
        
        if (user?.user?.role !== ROLE_EMPLOYEE && tableType === INVALID_LEADS_TABLE) {
          dispatch(getAllInvalidLeads(initialFilters));
        }
        
        initialLoad.current = false;
      }
    }
  }, [height, user?.user?.role, user?.user?.id, tableType]);

  // Effect for filter changes and table type changes
  useEffect(() => {
    if (pageSize > 0 && !initialLoad.current) {
      const fetchFilters = { ...filters, pageSize };
      debouncedFetchLeads.current(fetchFilters);
      
      // Update active filters dot
      const filteredFilters = Object.keys(filters).reduce((acc, key) => {
        const isEmptyValue = filters[key] === "" || filters[key] == null;
        const isNotAssigned = filters[key] === "not_assigned";
        const shouldExcludeKey = user.user.role === ROLE_EMPLOYEE
            ? ["page", "pageSize", "totalPages", "total", "assigned_to", "userId", "exclude_verification"].includes(key)
            : ["page", "pageSize", "totalPages", "total", ...(isNotAssigned && key === "assigned_to" ? ["assigned_to"] : [])].includes(key);
    
        if (!isEmptyValue && !shouldExcludeKey) acc[key] = filters[key];
        return acc;
    }, {});

      setShowDot(Object.keys(filteredFilters).length > 0);
    }
  }, [filters, pageSize, user.user.role, tableType]);

  // Loading state management
  useEffect(() => {
    let timer;
    if (loading) {
      // Show loader immediately for initial load, after delay for subsequent loads
      const delay = isInitialDataLoaded ? 300 : 0;
      timer = setTimeout(() => setShowLoader(true), delay);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [loading, isInitialDataLoaded]);

  useEffect(() => {
    if (users && users.length > 0) {
      setEmployees([{ label: "Select associate", value: "" }, ...userOptions]);
    } else {
      dispatch(getUsersNameAndId());
    }
  }, [users]);

  useEffect(() => {
    if (role !== ROLE_EMPLOYEE) {
      fetchUniqueInvalidLeadsReasons();
    }
  }, []);

  function handleRowsPerChange(data) {
    const payload = { ...filters, page: 1, pageSize: data };
    if (tableType === INVALID_LEADS_TABLE) {
      dispatch(getAllInvalidLeads(payload));
    } else if (user.user.role === ROLE_EMPLOYEE) {
      dispatch(getLeadsByAssignedUserId(payload));
    } else {
      dispatch(getAllLeads(payload));
    }
  }

  function handlePageChange(data) {
    const payload = {
      ...filters,
      pageSize: tableType === INVALID_LEADS_TABLE ? invalidLeadsPagination.pageSize : pagination.pageSize,
      page: data,
    };

    if (tableType === INVALID_LEADS_TABLE) {
      dispatch(getAllInvalidLeads(payload));
    } else if (user.user.role === ROLE_EMPLOYEE) {
      dispatch(getLeadsByAssignedUserId(payload));
    } else {
      dispatch(getAllLeads(payload));
    }
  }

  function handleNextPageClick() {
    const paginationData = tableType === INVALID_LEADS_TABLE ? invalidLeadsPagination : pagination;
    if (paginationData.page < paginationData.totalPages) {
      const payload = {
        ...filters,
        pageSize: paginationData.pageSize,
        page: paginationData.page + 1,
      };

      if (tableType === INVALID_LEADS_TABLE) {
        dispatch(getAllInvalidLeads(payload));
      } else if (user.user.role === ROLE_EMPLOYEE) {
        dispatch(getLeadsByAssignedUserId(payload));
      } else {
        dispatch(getAllLeads(payload));
      }
    }
  }

  function handlePrevPageClick() {
    const paginationData = tableType === INVALID_LEADS_TABLE ? invalidLeadsPagination : pagination;
    if (paginationData.page > 1) {
      const payload = {
        ...filters,
        pageSize: paginationData.pageSize,
        page: paginationData.page - 1,
      };

      if (tableType === INVALID_LEADS_TABLE) {
        dispatch(getAllInvalidLeads(payload));
      } else if (user.user.role === ROLE_EMPLOYEE) {
        dispatch(getLeadsByAssignedUserId(payload));
      } else {
        dispatch(getAllLeads(payload));
      }
    }
  }

  function handleResetFilters(tableType) {
    const initialFilters = {
      pageSize: pagination.pageSize || 10,
      ...(user.user.role === ROLE_EMPLOYEE && {
        userId: user.user.id,
        exclude_verification: true,
      }),
    };
    setFilters(initialFilters);
    setResetFilters(true);
    setSelectedEmployeeName(null);
    setAreAllLeadsSelected(false);
    setTableType(tableType);
    setSelectedLeadIds([]);
    setAssignedEmployee(null);
    setShowDot(false);
    setShowFilter(false);
    setTimeout(() => {
      setResetFilters(false);
    }, 1000);
  }

  function handleSelect(name, value) {
    if (value) {
      const user = users.find((user) => user.name === value);
      setAssignedEmployee(user);
      setSelectedEmployeeName(user?.name);
    } else {
      setSelectedEmployeeName(null);
    }
  }

  function selectAllLeads() {
    const currentLeads = tableType === INVALID_LEADS_TABLE ? invalidLeads : leads;
    const updatedIds = currentLeads.map((lead) => ({ id: lead.id, name: lead.name }));
    
    if (areAllLeadsSelected) {
      setSelectedLeadIds([]);
      setAreAllLeadsSelected(false);
    } else {
      setSelectedLeadIds(updatedIds);
      setAreAllLeadsSelected(updatedIds.length > 0);
    }
  }

  const handleCheckboxChange = (id, name, last_updated_status) => {
    const isLeadSelected = selectedLeadIds.some((selectedLead) => selectedLead.id === id);
    let updatedIds;

    if (isLeadSelected) {
      updatedIds = selectedLeadIds.filter((selectedLead) => selectedLead.id !== id);
      setAreAllLeadsSelected(false);
    } else {
      updatedIds = [
        ...selectedLeadIds,
        { id, name, last_updated_status },
      ];
      const currentLeads = tableType === INVALID_LEADS_TABLE ? invalidLeads : leads;
      setAreAllLeadsSelected(updatedIds.length === currentLeads.length);
    }

    setSelectedLeadIds(updatedIds);
  };

  function assignLeadsToEmployee() {
    setDisableConfirmationDialogueSubmitButton(false);
    setShowConfirmationDialogue(true);
    
    try {
      const reassignedLeads = [];
      const freshLeads = [];
      const currentLeads = tableType === INVALID_LEADS_TABLE ? invalidLeads : leads;

      const filteredLeadIds = selectedLeadIds.filter((leadId) => {
        const lead = currentLeads.find((lead) => lead.id === leadId.id);
        if (!lead) return false;
        
        if (lead.LeadAssignments?.[0]?.assigned_to === assignedEmployee.id) {
          return false;
        }
        
        if (lead.LeadAssignments?.[0]) {
          reassignedLeads.push(lead);
        } else {
          freshLeads.push(lead);
        }
        return true;
      });

      if (filteredLeadIds.length === 0) {
        throw new Error("All selected leads are already assigned to the existing employee.");
      }

      const reassignedCount = reassignedLeads.length;
      const freshCount = freshLeads.length;

      let message;
      if (reassignedCount > 0 && freshCount > 0) {
        message = (
          <>
            You are about to reassign <span className="text-red-500">{reassignedCount}</span> lead(s) and
            assign <span className="text-green-500">{freshCount}</span> fresh lead(s) to{" "}
            <span className="font-bold text-black">{assignedEmployee.name}</span>.
          </>
        );
      } else if (reassignedCount > 0) {
        message = (
          <>
            You are about to reassign <span className="text-red-500 font-bold">{reassignedCount}</span>{" "}
            lead(s) to <span className="font-bold text-black">{assignedEmployee.name}</span>.
          </>
        );
      } else {
        message = (
          <>
            You are about to assign <span className="text-green-500 font-bold">{freshCount}</span> fresh
            lead(s) to <span className="font-bold text-black">{assignedEmployee.name}</span>.
          </>
        );
      }

      setConfirmationDialogueMessage(message);
      setAssignmentApiPayload({
        leadIds: filteredLeadIds,
        assignedTo: assignedEmployee.id,
        assignedBy: user.user.id,
        userName: assignedEmployee.name,
      });
    } catch (error) {
      setConfirmationDialogueButton(<AlertButton />);
      setDisableConfirmationDialogueSubmitButton(true);
      setConfirmationDialogueMessage(error.message);
    }
  }

  async function handleClickOnSubmit() {
    setShowConfirmationDialogue(false);
    setOpenToast(true);
    setToastStatusType("INFO");
    setToastMessage("Assigning Leads...");
    setToastStatusMessage("In Progress...");

    try {
      const response = await assignLeads(assignmentApiPayload);

      if (response?.data.status === "SUCCESS") {
        setToastStatusType("SUCCESS");
        setToastMessage(response.data.message || "Leads assigned successfully");
        setToastStatusMessage("Success");

        // Re-fetch leads
        await dispatch(getAllLeads({
          ...filters,
          pageSize: pagination.pageSize,
          page: pagination.page,
        }));

        // Reset selections
        setSelectedLeadIds([]);
        setAssignedEmployee(null);
        setSelectedEmployeeName(null);

        setTimeout(() => setOpenToast(false), 3000);
      } else {
        setToastStatusType("ERROR");
        setToastMessage("Failed to assign leads!");
        setToastStatusMessage("Error");
        setTimeout(() => setOpenToast(false), 3000);
      }
    } catch (error) {
      console.error("Lead assignment failed:", error);
      setToastStatusType("ERROR");
      setToastMessage(error.message || "An error occurred");
      setToastStatusMessage("Error");
      setTimeout(() => setOpenToast(false), 3000);
    } finally {
      setDisableConfirmationDialogueSubmitButton(false);
    }
  }

  async function handleExportLeads() {
    setToastStatusType("INFO");
    setToastMessage("Exporting Leads... 0%");
    setToastStatusMessage("In Progress...");
    setShouldSnackbarCloseOnClickOfOutside(false);
    setOpenToast(true);
    
    try {
      const response = await exportLeadsHandler(
        filters,
        [],
        tableType === INVALID_LEADS_TABLE ? invalidLeads : leads,
        users,
        fieldsToExport,
        setToastMessage
      );
      
      if (response === true) {
        setToastStatusType("SUCCESS");
        setToastMessage("Leads Exported Successfully");
        setShouldSnackbarCloseOnClickOfOutside(true);
      } else {
        setToastStatusType("ERROR");
        setToastMessage("Failed to export leads!");
        setShouldSnackbarCloseOnClickOfOutside(true);
      }
    } catch (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message || "Failed to export leads");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }

  async function handleFileUpload(e) {
    setToastStatusType("INFO");
    setToastMessage("Uploading Leads... 0%");
    setToastStatusMessage("In Progress...");
    setShouldSnackbarCloseOnClickOfOutside(false);
    setOpenToast(true);
    
    const fileInput = e.target;
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length === 0) {
          throw new Error("The uploaded sheet is empty.");
        }

        const headerRow = jsonData[0].map((col) => col?.toString().trim().toLowerCase());
        validateHeaders(headerRow);

        const jsonLeads = XLSX.utils.sheet_to_json(worksheet);
        const importedLeads = jsonLeads.map((item) => ({
          name: item.name || item["lead name"] || item["customer name"] || item["full name"] || item["Full Name"] || item["full_name"] || item["Name"] || null,
          email: item.email || item["email address"] || item["e-mail"] || item["Email"] || null,
          phone: item.phone || item.mobile || item["phone number"] || item["mobile number"] || item["mob no"] || item["mob. no."] || item["phone_number"] || item["mobile_number"] || item["Mobile"] || item["Phone"] || null,
          lead_source: item.source || item["lead source"] || item["lead-source"] || item["LEAD SOURCE"] || item["Source"] || null,
        }));

        let totalValidLeads = 0;
        let totalInvalidLeads = 0;
        const batchSize = 200;

        for (let i = 0; i < importedLeads.length; i += batchSize) {
          const batch = importedLeads.slice(i, i + batchSize);
          try {
            const response = await uploadLeadsInBulk(batch);
            totalValidLeads += response.data.data.totalValidLeads;
            totalInvalidLeads += response.data.data.totalInvalidLeads;
            
            const progress = Math.round(((i + batchSize) / importedLeads.length) * 100);
            setToastMessage(
              <>
                <span>Uploading leads... {progress}%</span>
                <br />
                <span>Total Valid Leads: {totalValidLeads}</span>
                <br />
                <span>Total Invalid Leads: {totalInvalidLeads}</span>
              </>
            );
          } catch (err) {
            console.error("Error importing leads batch:", err);
            const progress = Math.round(((i + batchSize) / importedLeads.length) * 100);
            setToastMessage(`Error importing some batches. Continuing... ${progress}%`);
          }
        }

        setToastStatusType("SUCCESS");
        setToastStatusMessage("Success");
        setToastMessage(
          <>
            <span>Leads uploaded successfully!</span>
            <br />
            <span>Valid Leads: {totalValidLeads}</span>
            <br />
            <span>Invalid Leads: {totalInvalidLeads}</span>
          </>
        );
        setShouldSnackbarCloseOnClickOfOutside(true);
      } catch (err) {
        console.error("Error processing the file:", err);
        setToastStatusType("ERROR");
        setToastStatusMessage("Error");
        setToastMessage(err.message);
        setShouldSnackbarCloseOnClickOfOutside(true);
      } finally {
        fileInput.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  }

  function validateHeaders(headerRow) {
    const requiredFields = {
      name: ["name",
           "lead name",
           "customer name",
           "full name",
           "Full Name",
           "full_name",
          "Name"],
      phone: ["mobile",
           "mobile number",
           "phone",
           "phone number",
           "mob no",
           "mob. no.",
           "phone_number",
           "mobile_number",
           "Mobile",
            "Phone"],
      source: ["source",
           "lead source",
           "lead-source",
           "LEAD SOURCE",
           "Source",],
    };

    const missingFields = Object.keys(requiredFields).filter(
      (field) => !headerRow.some((header) =>
        requiredFields[field].some((name) =>
          header?.includes(name.toLowerCase())
        )
      )
    );

    if (missingFields.length > 0) {
      throw new Error(
        `The uploaded sheet is missing required fields: ${missingFields.join(", ")}`
      );
    }
  }

  function showTable(tableType) {
    if (showLoader) return null;

    const currentLeads = tableType === INVALID_LEADS_TABLE ? invalidLeads : leads;
    if (isEmpty(currentLeads)) return (
      <div
          className={`w-full h-[${height}px] bg-[#F0F6FF] flex justify-center items-center rounded-2xl`}
          style={{ height: `${height + 20}px` }}
        >
          <EmptyDataMessageIcon size={100} />
        </div>
    );

    switch (tableType) {
      case ASSIGNED_TABLE:
        return (
          <AssignedLeadsTable
            leads={currentLeads}
            areAllLeadsSelected={areAllLeadsSelected}
            setAreAllLeadsSelected={setAreAllLeadsSelected}
            selectAllLeads={selectAllLeads}
            selectedLeadIds={selectedLeadIds}
            handleCheckboxChange={handleCheckboxChange}
            filters={filters}
          />
        );
      case NOT_ASSIGNED_TABLE:
        return (
          <NotAssignedLeadsTable
            leads={currentLeads}
            areAllLeadsSelected={areAllLeadsSelected}
            setAreAllLeadsSelected={setAreAllLeadsSelected}
            selectAllLeads={selectAllLeads}
            selectedLeadIds={selectedLeadIds}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case INVALID_LEADS_TABLE:
        return (
          <InvalidLeadsTable
            leads={currentLeads}
            areAllLeadsSelected={areAllLeadsSelected}
            setAreAllLeadsSelected={setAreAllLeadsSelected}
            selectAllLeads={selectAllLeads}
            selectedLeadIds={selectedLeadIds}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      default:
        return null;
    }
  }

  function moreOptionsClickHandler(value) {
    if (value === EXPORT_LEADS) {
      if (tableType === NOT_ASSIGNED_TABLE) {
        handleExportLeads();
      } else if (tableType === INVALID_LEADS_TABLE) {
        exportToExcel();
      }
    } else {
      setTableType(value);
      handleResetFilters(value);
    }
  }

  async function exportToExcel() {
    try {
      setToastStatusType("INFO");
      setToastMessage("Exporting Leads... 0%");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(false);
      setOpenToast(true);
      
      const leadsToExport = invalidLeads.map(
        ({ id, name, email, phone, lead_source, reason }) => ({
          id,
          name,
          email,
          phone,
          source: lead_source,
          reason,
        })
      );
      
      const worksheet = utils.json_to_sheet(leadsToExport);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Invalid Leads");

      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `Invalid_Leads_${currentDate}.xlsx`;

      writeFile(workbook, filename);
      
      setToastStatusType("SUCCESS");
      setToastMessage("Leads Exported Successfully");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } catch (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message);
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }

  async function fetchUniqueInvalidLeadsReasons() {
    try {
      const response = await fetchDistinctInvalidLeadReasons();
      const latestReasons = [
        { label: "Filter by reason", value: "" },
        ...response.data.data.map((reason) => ({
          label: reason,
          value: reason
        }))
      ];
      setReasons(latestReasons);
    } catch (error) {
      console.error("Failed to fetch invalid lead reasons:", error);
    }
  }

  return (
    <div className="w-full">
      {/* Cards Container */}
      <div className="grid grid-cols-12 gap-4 overflow-y-visible">
        <div className="row col-span-12 flex justify-between items-center">
          <div>
            <span className="text-black text-base font-semibold poppins-thin leading-tight">
              {terminologiesMap.get(LEADS)}
            </span>
          </div>
          <div className="flex grid-cols-8 gap-2">
            {user.user.role !== ROLE_EMPLOYEE && (
              <PrimaryButton
                isActive={tableType === ASSIGNED_TABLE}
                name="Assigned"
                onClick={() => {
                  setTableType(ASSIGNED_TABLE);
                  handleResetFilters(ASSIGNED_TABLE);
                  setShowNotAssignedTable(false);
                  setShowFilter(false);
                }}
                backgroundColor="#C7D4E4"
              />
            )}
            {user.user.role !== ROLE_EMPLOYEE && (
              <PrimaryButton
                name="Unassigned"
                isActive={tableType === NOT_ASSIGNED_TABLE}
                onClick={() => {
                  setTableType(NOT_ASSIGNED_TABLE);
                  handleResetFilters(NOT_ASSIGNED_TABLE);
                  setShowNotAssignedTable(true);
                  setFilters((prev) => ({
                    ...prev,
                    assigned_to: "not_assigned",
                  }));
                  setShowFilter(false);
                }}
                backgroundColor="#C7D4E4"
              />
            )}
            {selectedLeadIds?.length > 0 &&
              tableType !== INVALID_LEADS_TABLE && (
                <div className="w-max h-8 bg-[#F4EBFF] rounded-xl flex items-center my-1">
                  <DropDown
                    options={employees}
                    onChange={(name, value) => handleSelect(name, value)}
                    buttonBackgroundColor="#D9E4F2"
                    buttonTextColor="#214768"
                    buttonBorder="1px solid #D1D5DB"
                    buttonBorderRadius="0.5rem"
                    buttonPadding="0.5rem 1rem"
                    buttonHeight="2.5rem"
                    buttonMinWidth="12rem"
                    buttonFontSize="0.875rem"
                    optionsBackgroundColor="#F2F7FE"
                    optionsTextColor="#464646"
                    optionsDisabledTextColor="#ABAAB9"
                    optionsMaxHeight="15rem"
                    optionsBorder="1px solid #E5E7EB"
                    optionsFontWeight="500"
                    dropdownArrowColor="#214768"
                    dropdownArrowSize="1rem"
                    selectedOption={selectedEmployeeName}
                    resetFilters={resetFilters}
                    fieldName="created_by"
                    disabled={false}
                    size="sm"
                    shouldFirstOptionDisabled={false}
                  />
                </div>
              )}
            {selectedEmployeeName !== null && (
              <AssignToButton onClick={() => assignLeadsToEmployee()} />
            )}
            <FilterButton
              onClick={() => setShowFilter(!showFilter)}
              showDot={showDot}
              showFilter={showFilter}
            />
            {showDot && <ClearButton onClick={() => handleResetFilters(tableType)} />}
            {user.user.role !== ROLE_EMPLOYEE && tableType === ASSIGNED_TABLE && (
              <ExportButton onClick={() => handleExportLeads()} />
            )}
            {selectedLeadIds.length > 0 && role === ROLE_ADMIN && (
              <DeleteButton color="#464646" />
            )}
            {tableType === NOT_ASSIGNED_TABLE && (
              <UploadLeadsButton onFileUpload={(e) => handleFileUpload(e)} />
            )}
            {[NOT_ASSIGNED_TABLE, INVALID_LEADS_TABLE].includes(tableType) && (
              <MoreButton onClick={(e) => moreOptionsClickHandler(e)} />
            )}
          </div>
        </div>
      </div>

      {/* Filter Dialogue */}
      <div
        className={`col-span-12 rounded transition-all duration-500 ease-in-out z-0 ${
          showFilter
            ? "max-h-[400px] opacity-100 overflow-visible"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <FilterDialogue
          setFilters={setFilters}
          filters={filters}
          resetFilters={resetFilters}
          tableType={tableType}
          reasons={reasons}
        />
      </div>

      {/* Content Area */}
      {showLoader ? (
        <div
          className={`w-full h-[${height}px] flex justify-center items-center bg-[#F0F6FF] rounded-2xl`}
          style={{ height: `${height + 20}px` }}
        >
          <Loader />
        </div>
      ) : isEmpty(leads) && isEmpty(invalidLeads) ? (
        <div
          className={`w-full h-[${height}px] bg-[#F0F6FF] flex justify-center items-center rounded-2xl`}
          style={{ height: `${height + 20}px` }}
        >
          <EmptyDataMessageIcon size={100} />
        </div>
      ) : (
        <>
          {showTable(tableType)}
          {(!isEmpty(leads) || !isEmpty(invalidLeads)) && (
            <div className="mt-0 px-4">
              <Pagination
                total={
                  tableType === INVALID_LEADS_TABLE
                    ? invalidLeadsPagination?.total
                    : pagination?.total
                }
                page={
                  tableType === INVALID_LEADS_TABLE
                    ? invalidLeadsPagination?.page
                    : pagination?.page
                }
                pageSize={
                  tableType === INVALID_LEADS_TABLE
                    ? invalidLeadsPagination?.pageSize
                    : pagination?.pageSize
                }
                onRowsPerChange={handleRowsPerChange}
                onPageChange={handlePageChange}
                onNextPageClick={handleNextPageClick}
                onPrevPageClick={handlePrevPageClick}
                options={paginationOptions}
                resetFilters={resetFilters}
              />
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialogue */}
      {showConfirmationDialogue && (
        <ConfirmationDialogue
          onClose={() => setShowConfirmationDialogue(false)}
          message={confirmationDialogueMessage}
          onSubmit={() => handleClickOnSubmit()}
          button={<InfoButton />}
          disabled={disableConfirmationDialogueSubmitButton}
        />
      )}

      {/* Snackbar */}
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

export default Leads;