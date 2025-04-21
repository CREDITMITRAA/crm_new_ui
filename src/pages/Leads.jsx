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
  const [reasons, setReasons] = useState([])
  const [filters, setFilters] = useState(() => ({
    ...(role === ROLE_EMPLOYEE && {
      userId: user.user.id,
      exclude_verification: true,
    }),
  }));
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

  const initialMount = useRef(true);

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

  // Create debounced fetch function
  const fetchLeads = useCallback(
    debounce((filters) => {
      if (role === ROLE_EMPLOYEE) {
        console.log("table type = ", tableType)
        dispatch(getLeadsByAssignedUserId(filters));
      } else if(tableType === INVALID_LEADS_TABLE) {
        console.log("table type = ", tableType)
        dispatch(getAllInvalidLeads(filters))
      } else {
        console.log("table type = ", tableType)
        dispatch(getAllLeads(filters));
      }
    }, 500),
    [dispatch, role, tableType]
  );

  useEffect(()=>{
    fetchUniqueInvalidLeadsReasons()
  },[])

  // Initial load effect
  useEffect(() => {
    if (height > 0) {
      const newPageSize = Math.floor(height / 40);
      setPageSize(newPageSize);

      // Only dispatch on initial mount
      if (initialMount.current) {
        if (role === ROLE_EMPLOYEE) {
          dispatch(getLeadsByAssignedUserId({ pageSize: newPageSize }));
        } else {
          dispatch(getAllLeads({ pageSize: newPageSize }));
        }
        dispatch(getAllDistinctLeadSources());
        if (role !== ROLE_EMPLOYEE && tableType === INVALID_LEADS_TABLE) {
          dispatch(getAllInvalidLeads());
        }
        initialMount.current = false;
      }
    }
  }, [dispatch, height, role]);

  // Filter change effect
  useEffect(() => {
    if (pageSize > 0 && !initialMount.current) {
      fetchLeads({ ...filters, pageSize });
      const filteredFilters = Object.keys(filters)?.reduce((acc, key) => {
        // Check if value is empty, null, or undefined
        const isEmptyValue = filters[key] === "" || filters[key] == null;
        
        // Check if key should be excluded based on role
        const shouldExcludeKey = role === ROLE_EMPLOYEE
          ? [
              "page",
              "pageSize",
              "totalPages",
              "total",
              "assigned_to",
              "userId",
              "exclude_verification",
            ].includes(key)
          : [
              "page",
              "pageSize",
              "totalPages",
              "total",
              "assigned_to",
            ].includes(key);
      
        // Only include if not empty and not in excluded keys
        if (!isEmptyValue && !shouldExcludeKey) {
          acc[key] = filters[key];
        }
        
        return acc;
      }, {});
      console.log("filtered filters = ", filteredFilters);

      setShowDot(Object.keys(filteredFilters).length > 0);
    }
  }, [filters, pageSize, fetchLeads]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      fetchLeads.cancel();
    };
  }, [fetchLeads]); // Ensure it runs only after pageSize is set

  // const fetchLeads = useCallback(
  //   debounce((filters) => {
  //     dispatch(getAllLeads(filters));
  //   }, 500), // 500ms debounce time
  //   [dispatch]
  // );

  useEffect(() => {
    if (users && users.length > 0) {
      setEmployees([{ label: "Select associate", value: "" }, ...userOptions]);
    } else {
      dispatch(getUsersNameAndId());
    }
  }, [users]);

  function handleRowsPerChange(data) {
    console.log("page size = ", data);
    if (tableType === INVALID_LEADS_TABLE) {
      dispatch(getAllInvalidLeads({ ...filters, page: 1, pageSize: data }));
    } else if (tableType === EX_EMPLOYEES_LEADS_TABLE) {
      // TO DO
    } else {
      if (role === ROLE_EMPLOYEE) {
        dispatch(
          getLeadsByAssignedUserId({ ...filters, page: 1, pageSize: data })
        );
      } else {
        dispatch(getAllLeads({ ...filters, page: 0, pageSize: data }));
      }
    }
  }

  function handlePageChange(data) {
    console.log("page number = ", data);
    let payload = {};
    if (tableType === INVALID_LEADS_TABLE) {
      payload = {
        pageSize: invalidLeadsPagination.pageSize,
        page: data,
      };
    } else {
      payload = {
        ...filters,
        pageSize: pagination.pageSize,
        page: data,
      };
    }
    if (tableType === INVALID_LEADS_TABLE) {
      dispatch(getAllInvalidLeads(payload));
    } else if (tableType === EX_EMPLOYEES_LEADS_TABLE) {
      // TO DO
    } else {
      if (role === ROLE_EMPLOYEE) {
        dispatch(
          getLeadsByAssignedUserId({ ...payload, limit: payload.pageSize })
        );
      } else {
        dispatch(getAllLeads(payload));
      }
    }
  }

  function handleNextPageClick() {
    if (tableType === INVALID_LEADS_TABLE) {
      if (invalidLeadsPagination.page < invalidLeadsPagination.totalPages) {
        let payload = {
          ...filters,
          pageSize: invalidLeadsPagination.pageSize,
          page: invalidLeadsPagination.page + 1,
        };
        dispatch(getAllInvalidLeads(payload));
      }
    } else {
      if (pagination.page < pagination.totalPages) {
        let payload = {
          ...filters,
          pageSize: pagination.pageSize,
          page: pagination.page + 1,
        };
        if (role === ROLE_EMPLOYEE) {
          dispatch(
            getLeadsByAssignedUserId({ ...payload, pageSize: payload.pageSize })
          );
        } else {
          dispatch(getAllLeads(payload));
        }
      }
    }
  }

  function handlePrevPageClick() {
    if (tableType === INVALID_LEADS_TABLE) {
      if (invalidLeadsPagination.page > 1) {
        // Prevent going below page 1
        let payload = {
          ...filters,
          pageSize: invalidLeadsPagination.pageSize,
          page: invalidLeadsPagination.page - 1,
        };
        dispatch(getAllInvalidLeads(payload));
      }
    } else {
      if (pagination.page > 1) {
        // Prevent going below page 1
        let payload = {
          ...filters,
          pageSize: pagination.pageSize,
          page: pagination.page - 1,
        };
        if (role === ROLE_EMPLOYEE) {
          dispatch(
            getLeadsByAssignedUserId({ ...payload, pageSize: payload.pageSize })
          );
        } else {
          dispatch(getAllLeads(payload));
        }
      }
    }
  }

  function handleResetFilters(tableType) {
    let initialFilters = {
      pageSize: 10,
      ...(role === ROLE_EMPLOYEE && {
        userId: user.user.id,
        exclude_verification: true,
      }),
    };
    setFilters(initialFilters);
    setResetFilters(true);
    setSelectedEmployeeName(null);
    setAreAllLeadsSelected(false);
    // setShowNotAssignedTable(false);
    setTableType(tableType)
    setSelectedLeadIds([]);
    setAssignedEmployee(null);
    setShowDot(false);
    setShowFilter(false);
    setTimeout(() => {
      setResetFilters(false);
    }, 1000);
  }

  function handleSelect(name, value) {
    console.log("employee name", name, value);
    if (value) {
      const user = users.find((user) => user.name === value);
      console.log("users = ", user);
      setAssignedEmployee(user);
      // setFilters((prev) => ({ ...prev, [name]: user?.id }));
      setSelectedEmployeeName(user?.name);
    } else {
      setSelectedEmployeeName(null);
    }
  }

  function selectAllLeads() {
    const updatedIds = leads.map((lead) => ({ id: lead.id, name: lead.name })); // Map once
    if (areAllLeadsSelected) {
      setSelectedLeadIds([]); // Unselect all
      setAreAllLeadsSelected(false);
    } else {
      setSelectedLeadIds(updatedIds); // Select all
      setAreAllLeadsSelected(true);
    }
  }

  const handleCheckboxChange = (id, name, last_updated_status) => {
    let updatedIds;
    const isLeadSelected = selectedLeadIds.some(
      (selectedLead) => selectedLead.id === id
    );
    if (isLeadSelected) {
      updatedIds = selectedLeadIds.filter(
        (selectedLead) => selectedLead.id !== id
      );
      setAreAllLeadsSelected(false);
    } else {
      updatedIds = [
        ...selectedLeadIds,
        { id: id, name: name, last_updated_status: last_updated_status },
      ];
      if (updatedIds.length === leads.length) {
        setAreAllLeadsSelected(true);
      }
    }
    console.log("selected lead ids = ", updatedIds);

    setSelectedLeadIds(updatedIds);
  };

  function assignLeadsToEmployee() {
    setDisableConfirmationDialogueSubmitButton(false);
    setShowConfirmationDialogue(true);
    try {
      const reassignedLeads = [];
      const freshLeads = [];
      const filteredLeadIds = selectedLeadIds.filter((leadId) => {
        const lead = leads.find((lead) => lead.id === leadId.id);
        if (
          lead &&
          lead.LeadAssignments[0]?.assigned_to === assignedEmployee.id
        ) {
          return false;
        }
        if (lead?.LeadAssignments[0]) {
          reassignedLeads.push(lead);
        } else {
          freshLeads.push(lead);
        }
        return true;
      });

      if (filteredLeadIds.length === 0) {
        throw new Error(
          "All selected leads are already assigned to the existing employee."
        );
      }

      const reassignedCount = reassignedLeads.length;
      const freshCount = freshLeads.length;

      if (reassignedCount > 0 && freshCount > 0) {
        setConfirmationDialogueMessage(
          <>
            You are about to reassign{" "}
            <span className="text-red-500">{reassignedCount}</span> lead(s) and
            assign <span className="text-green-500">{freshCount}</span> fresh
            lead(s) to{" "}
            <span className="font-bold text-black">
              {assignedEmployee.name}
            </span>
            .
          </>
        );
      } else if (reassignedCount > 0) {
        setConfirmationDialogueMessage(
          <>
            You are about to reassign{" "}
            <span className="text-red-500 font-bold">{reassignedCount}</span>{" "}
            lead(s) to{" "}
            <span className="font-bold text-black">
              {assignedEmployee.name}
            </span>
            .
          </>
        );
      } else if (freshCount > 0) {
        setConfirmationDialogueMessage(
          <>
            You are about to assign{" "}
            <span className="text-green-500 font-bold">{freshCount}</span> fresh
            lead(s) to{" "}
            <span className="font-bold text-black">
              {assignedEmployee.name}
            </span>
            .
          </>
        );
      }

      console.log("user = ", user);

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
        // Update toast to show success immediately
        setToastStatusType("SUCCESS");
        setToastMessage(response.data.message || "Leads assigned successfully");
        setToastStatusMessage("Success");

        // Re-fetch leads and wait for completion
        await dispatch(
          getAllLeads({
            ...pagination,
            ...(showNotAssignedTable ? { assigned_to: "not_assigned" } : {}),
          })
        );

        // Reset selections only after re-fetch
        setSelectedLeadIds([]);
        setAssignedEmployee(null);
        setSelectedEmployeeName(null);

        // Close Snackbar after 3 seconds (give users time to read)
        setTimeout(() => setOpenToast(false), 3000);
        setDisableConfirmationDialogueSubmitButton(false);
      } else {
        setToastStatusType("ERROR");
        setToastMessage("Failed to assign leads!");
        setToastStatusMessage("Error");
        setTimeout(() => setOpenToast(false), 3000);
        setDisableConfirmationDialogueSubmitButton(false);
      }
    } catch (error) {
      console.error("Lead assignment failed:", error);
      setToastStatusType("ERROR");
      setToastMessage(error.message || "An error occurred");
      setToastStatusMessage("Error");
      setTimeout(() => setOpenToast(false), 3000);
      setDisableConfirmationDialogueSubmitButton(false);
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
      setToastMessage("Failed to export leads !");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }

  async function handleFileUpload(e) {
    setToastStatusType("INFO");
    setToastMessage("Uploading Leads... 0%");
    setToastStatusMessage("In Progress...");
    setShouldSnackbarCloseOnClickOfOutside(false);
    setOpenToast(true);
    let totalValidLeads = 0;
    let totalInvalidLeads = 0;

    const fileInput = e.target;
    const file = fileInput.files[0];
    const reader = new FileReader();

    const validateHeaders = (headerRow) => {
      const requiredFields = {
        name: [
          "name",
          "lead name",
          "customer name",
          "full name",
          "Full Name",
          "full_name",
        ],
        phone: [
          "mobile",
          "mobile number",
          "phone",
          "phone number",
          "mob no",
          "mob. no.",
          "phone_number",
          "mobile_number",
          "Mobile",
        ],
        source: [
          "source",
          "lead source",
          "lead-source",
          "LEAD SOURCE",
          "Source",
        ],
      };

      const missingFields = Object.keys(requiredFields).filter(
        (field) =>
          !headerRow.some((header) =>
            requiredFields[field].some((name) =>
              header.trim().toLowerCase().includes(name.toLowerCase())
            )
          )
      );

      if (missingFields.length > 0) {
        throw new Error(
          `The uploaded sheet is missing the required fields : ${missingFields.join(
            " , "
          )}.`
        );
      }
    };

    const normalizeField = (field, possibleNames) =>
      Object.keys(field).find((key) =>
        possibleNames.some((name) =>
          key.trim().toLowerCase().includes(name.toLowerCase())
        )
      );

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Get raw data as rows

        if (!jsonData || jsonData.length === 0) {
          throw new Error("The uploaded sheet is empty.");
        }

        // Validate headers
        const headerRow = jsonData[0].map((col) => col.trim().toLowerCase());
        validateHeaders(headerRow);

        // Process data
        const jsonLeads = XLSX.utils.sheet_to_json(worksheet);
        const importedLeads = jsonLeads.map((item) => ({
          name:
            item[
              normalizeField(item, [
                "name",
                "lead name",
                "customer name",
                "full name",
                "Full Name",
                "full_name",
              ])
            ] || null,
          email:
            item[
              normalizeField(item, [
                "email",
                "email address",
                "e-mail",
                "Email",
              ])
            ] || null,
          phone:
            item[
              normalizeField(item, [
                "mobile",
                "mobile number",
                "phone",
                "phone number",
                "mob no",
                "mob. no.",
                "phone_number",
                "mobile_number",
                "Mobile",
              ])
            ] || null,
          lead_source:
            item[
              normalizeField(item, [
                "source",
                "lead source",
                "lead-source",
                "LEAD SOURCE",
                "Source",
              ])
            ] || null,
        }));

        const batchSize = 200;
        for (let i = 0; i < importedLeads.length; i += batchSize) {
          const batch = importedLeads.slice(i, i + batchSize);
          try {
            const response = await uploadLeadsInBulk(batch);
            console.log("Leads imported successfully:", response.data);
            totalValidLeads =
              totalValidLeads + response.data.data.totalValidLeads;
            totalInvalidLeads =
              totalInvalidLeads + response.data.data.totalInvalidLeads;
            // Update progress
            const newProgress = Math.round(
              ((i + batchSize) / importedLeads.length) * 100
            );
            setToastMessage(
              <>
                <span>Uploading leads... {newProgress}%</span>
                <br />
                <span>
                  Total Valid Leads:{" "}
                  {totalValidLeads + response.data.data.totalValidLeads}
                </span>
                <br />
                <span>
                  Total Invalid Leads:{" "}
                  {totalInvalidLeads + response.data.data.totalInvalidLeads}
                </span>
              </>
            );
          } catch (err) {
            console.error("Error importing leads batch:", err);
            const newProgress = Math.round(
              ((i + batchSize) / importedLeads.length) * 100
            );
            setToastMessage(
              `Error importing some batches. Continuing... ${newProgress}%`
            );
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

  function showTable(tableType) {
    switch (tableType) {
      case ASSIGNED_TABLE:
        return (
          !loading &&
          !isEmpty(leads) && (
            <AssignedLeadsTable
              leads={leads}
              areAllLeadsSelected={areAllLeadsSelected}
              setAreAllLeadsSelected={setAreAllLeadsSelected}
              selectAllLeads={selectAllLeads}
              selectedLeadIds={selectedLeadIds}
              handleCheckboxChange={handleCheckboxChange}
            />
          )
        );
      case NOT_ASSIGNED_TABLE:
        return (
          !loading &&
          !isEmpty(leads) && (
            <NotAssignedLeadsTable
              leads={leads}
              areAllLeadsSelected={areAllLeadsSelected}
              setAreAllLeadsSelected={setAreAllLeadsSelected}
              selectAllLeads={selectAllLeads}
              selectedLeadIds={selectedLeadIds}
              handleCheckboxChange={handleCheckboxChange}
            />
          )
        );
      case INVALID_LEADS_TABLE:
        return (
          !loading &&
          !isEmpty(leads) && (
            <InvalidLeadsTable
              leads={invalidLeads}
              areAllLeadsSelected={areAllLeadsSelected}
              setAreAllLeadsSelected={setAreAllLeadsSelected}
              selectAllLeads={selectAllLeads}
              selectedLeadIds={selectedLeadIds}
              handleCheckboxChange={handleCheckboxChange}
            />
          )
        );
      case EX_EMPLOYEES_LEADS_TABLE:
        break;
    }
  }

  function moreOptionsClickHandler(value) {
    console.log('value = ', value);
    
    if (value === EXPORT_LEADS) {
      if (tableType === NOT_ASSIGNED_TABLE) {
        handleExportLeads();
      } else if (tableType === INVALID_LEADS_TABLE) {
        exportToExcel();
      }
    } else {
      setTableType(value);
      handleResetFilters(value)
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

      // Generate a filename with current date and descriptive title
      const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
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
      console.log('calling reasons api');
  
      const response = await fetchDistinctInvalidLeadReasons();
      console.log('reasons = ', response.data.data);
  
      const latestReasons = [
        { label: "Filter by reason", value: "" }, // default option
        ...response.data.data.map((reason) => ({
          label: reason,
          value: reason
        }))
      ];
  
      setReasons(latestReasons);
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <div className="w-full">
      {/* <!-- Cards Container --> */}
      <div className="grid grid-cols-12 gap-4 overflow-y-visible">
        <div className="row col-span-12 flex justify-between items-center">
          <div>
            <span className="text-black text-base font-semibold poppins-thin leading-tight">
              {terminologiesMap.get(LEADS)}
              {/* - {tableType} */}
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
                    // Button Styling
                    buttonBackgroundColor="#D9E4F2"
                    buttonTextColor="#214768"
                    buttonBorder="1px solid #D1D5DB"
                    buttonBorderRadius="0.5rem"
                    buttonPadding="0.5rem 1rem"
                    buttonHeight="2.5rem"
                    buttonMinWidth="12rem"
                    buttonFontSize="0.875rem"
                    // Options Styling
                    optionsBackgroundColor="#F2F7FE"
                    optionsTextColor="#464646"
                    optionsDisabledTextColor="#ABAAB9"
                    optionsMaxHeight="15rem"
                    optionsBorder="1px solid #E5E7EB"
                    optionsFontWeight="500"
                    // Arrow Styling
                    dropdownArrowColor="#214768"
                    dropdownArrowSize="1rem"
                    // Other Props
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
            {tableType === ASSIGNED_TABLE && (
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

      {/* <!-- Additional Content (Expandable) --> */}
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

      <div className="col-span-12 mt-2 flex flex-col">
        {showTable(tableType)}
        {loading && (
          <div
            className={`w-full h-[${height}px] flex justify-center items-center bg=[#F0F6FF]`}
            style={{ height: `${height + 20}px` }}
          >
            <Loader />
          </div>
        )}

        {isEmpty(leads) && (
          <div
            className={`w-full h-[${height}px] bg-[#F0F6FF] flex justify-center items-center rounded-2xl`}
            style={{ height: `${height + 20}px` }}
          >
            <EmptyDataMessageIcon size={100} />
          </div>
        )}

        {!loading && !isEmpty(leads) && (
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
              onRowsPerChange={(data) => handleRowsPerChange(data)}
              onPageChange={(data) => handlePageChange(data)}
              onNextPageClick={(data) => handleNextPageClick(data)}
              onPrevPageClick={(data) => handlePrevPageClick(data)}
              options={paginationOptions}
              resetFilters={resetFilters}
            />
          </div>
        )}
      </div>
      {showConfirmationDialogue && (
        <ConfirmationDialogue
          onClose={() => setShowConfirmationDialogue(false)}
          message={confirmationDialogueMessage}
          onSubmit={() => handleClickOnSubmit()}
          button={<InfoButton />}
          disabled={disableConfirmationDialogueSubmitButton}
        />
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

export default Leads;
