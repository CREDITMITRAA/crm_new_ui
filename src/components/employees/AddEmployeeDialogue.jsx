import { useEffect, useRef, useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import AddEmployeeIcon from "../icons/AddEmployeeIcon";
import PopupButton from "../common/PopupButton";
import DropDown from "../common/dropdowns/DropDown";
import Snackbar from "../common/snackbars/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployee,
  updateEmployee,
} from "../../features/employee/employeeThunks";
import { userRoleOptions } from "../../utilities/AppConstants";
import { setIsConfirmationDialogueOpened } from "../../features/ui/uiSlice";

function AddEmployeeDialogue({ onClose, employee }) {
  console.log("employee in add or edit employee dialogue = ", employee);

  const dispatch = useDispatch();
  const dialogueRef = useRef(null);
  const { loading, error } = useSelector((state) => state.employees);
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    designation: employee?.designation || "",
    role_name: employee?.role_name || "",
    phone: employee?.phone || "",
    email: employee?.email || "",
    password: employee?.password || "",
    employee_id: employee?.employee_id || "",
    date_of_join: employee?.date_of_join || "",
    role_id: employee?.role_id || "",
  });
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);

  const mode = employee ? "edit" : "add";

  useEffect(() => {
    dispatch(setIsConfirmationDialogueOpened(true));
    return () => {
      dispatch(setIsConfirmationDialogueOpened(false));
    };
  }, []);

  useEffect(() => {
    setIsOpen(true);

    function handleClickOutside(e) {
      if (dialogueRef.current && !dialogueRef.current.contains(e.target)) {
        // onClose();
      }
    }

    function handleEscapeKey(e) {
      if (e.key === "Escape") {
        // onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (loading) {
      setOpenToast(true);
      setToastStatusType("INFO");
      setToastMessage(
        mode === "add" ? "Adding Employee..." : "Updating Employee..."
      );
      setToastStatusMessage("In Progress...");
    } else {
      setShouldSnackbarCloseOnClickOfOutside(true);
      setToastStatusType("SUCCESS");
      setToastMessage(mode === "add" ? "Employee Added" : "Employee Updated");
      setToastStatusMessage("Success...");
    }
  }, [loading, mode]);

  useEffect(() => {
    if (error) {
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setToastStatusType("ERROR");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [error]);

  useEffect(() => {
    console.log("form data = ", formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, role_name: value }));
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, date_of_join: value }));
  };

  const handleSubmit = () => {
    if (mode === "add") {
      dispatch(addEmployee(formData))
        .unwrap()
        .then(() => {
          setToastMessage("Employee added successfully!");
          setToastStatusType("SUCCESS");
          setOpenToast(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        })
        .catch((error) => {
          setToastMessage(error.message || "Failed to add employee");
          setToastStatusType("ERROR");
          setOpenToast(true);
        });
    } else if (mode === "edit") {
      dispatch(updateEmployee({ userId: employee.id, payload: formData }))
        .unwrap()
        .then(() => {
          setToastMessage("Employee updated successfully!");
          setToastStatusType("SUCCESS");
          setOpenToast(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        })
        .catch((error) => {
          setToastMessage(error.message || "Failed to update employee");
          setToastStatusType("ERROR");
          setOpenToast(true);
        });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        ref={dialogueRef}
        style={{
          minWidth: "28rem",
          backgroundColor: "#FCFEFF",
          minHeight: "10rem",
          position: "relative",
          transform: isOpen ? "scale(1)" : "scale(0.9)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          height: "max-content",
          width: "40vw",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-xl pt-[1.375rem] pb-[1.25rem]"
      >
        {/* icon and title section */}
        <div className="flex pl-[1.875rem]">
          <AddEmployeeIcon />
          <span className="text-[#214768] font-semibold leading-5 ml-[0.625rem]">
            {mode === "add" ? "Add Employee" : "Edit Employee"}
          </span>
        </div>

        {/* form section */}
        <div className="grid grid-cols-12 gap-2 w-full px-[2.75rem] mt-[0.75rem]">
          {/* employee name */}
          <div className="flex flex-col w-full col-span-12">
            <div className="text-[#214768] text-[10px] font-normal poppins-thin leading-tight">
              Employee name
            </div>
            <div className="w-full h-[30px] relative mt-[0.313rem]">
              <input
                type="text"
                placeholder="Enter the employee name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-full bg-[#21476810] rounded-md pl-3 text-[#214768] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#677F94] focus:outline-none border-none"
              />
            </div>
          </div>

          {/* job title */}
          <div className="flex flex-col w-full mt-[0.375rem] col-span-12">
            <div className="text-[#214768] text-[10px] font-normal poppins-thin leading-tight">
              Job Title
            </div>
            <div className="w-full h-[30px] relative mt-[0.313rem]">
              <input
                type="text"
                placeholder="Enter the job title"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full h-full bg-[#21476810] rounded-md pl-3 text-[#214768] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#677F94] focus:outline-none border-none"
              />
            </div>
          </div>

          {/* role */}
          <div className="flex flex-col w-full mt-[0.375rem] col-span-6">
            <div className="text-[#214768] text-[10px] font-normal poppins-thin leading-tight">
              Role
            </div>
            <div className="w-full h-[30px] relative mt-[0.313rem]">
              <DropDown
                options={userRoleOptions}
                onChange={handleRoleChange}
                defaultSelectedOptionIndex={
                  mode === "add"
                    ? 0
                    : userRoleOptions.findIndex(
                        (userRole) => userRole.id === formData.role_id
                      )
                }
                buttonBackgroundColor="#21476810"
                className="w-full h-full rounded-md"
                fieldName="role_name"
                backgroundColor="#F2F7FE"
                textColor="text-[#214768]"
                buttonBorder="none"
                buttonBorderRadius="0.4rem"
                buttonHeight="100%"
                optionsTextColor="#464646"
                buttonBoxShadow="none"
                buttonFontSize="10px"
                buttonPadding="0rem 0.5rem"
                optionsBackgroundColor="#F2F7FE"
              />
            </div>
          </div>

          {/* phone number */}
          <div className="flex flex-col w-full mt-[0.375rem] col-span-6">
            <div className="text-[#214768] text-[10px] font-normal poppins-thin leading-tight">
              Phone Number
            </div>
            <div className="w-full h-[30px] relative mt-[0.313rem]">
              <input
                type="text"
                placeholder="Enter the phone number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full h-full bg-[#21476810] rounded-md pl-3 text-[#214768] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#677F94] focus:outline-none border-none"
              />
            </div>
          </div>

          {/* email */}
          <div className="flex flex-col w-full mt-[0.375rem] col-span-6">
            <div className="text-[#214768] text-[10px] font-normal poppins-thin leading-tight">
              Email
            </div>
            <div className="w-full h-[30px] relative mt-[0.313rem]">
              <input
                type="text"
                placeholder="Enter the email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-full bg-[#21476810] rounded-md pl-3 text-[#214768] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#677F94] focus:outline-none border-none"
              />
            </div>
          </div>

          {/* password */}
          <div className="flex flex-col w-full mt-[0.375rem] col-span-6">
            <div className="text-[#214768] text-[10px] font-normal poppins-thin leading-tight">
              Password
            </div>
            <div className="w-full h-[30px] relative mt-[0.313rem]">
              <input
                type={mode === "edit" ? "password" : "text"}
                placeholder="Enter the password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                // disabled={mode === 'edit'}
                className="w-full h-full bg-[#21476810] rounded-md pl-3 text-[#214768] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#677F94] focus:outline-none border-none"
              />
            </div>
          </div>

          {/* employee id */}
          <div className="flex flex-col w-full mt-[0.375rem] col-span-6">
            <div className="text-[#214768] text-[10px] font-normal poppins-thin leading-tight">
              Employee id
            </div>
            <div className="w-full h-[30px] relative mt-[0.313rem]">
              <input
                type="text"
                placeholder="Enter the new employee id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                className="w-full h-full bg-[#21476810] rounded-md pl-3 text-[#214768] text-[10px] font-normal inter-inter placeholder-opacity-50 placeholder-[#677F94] focus:outline-none border-none"
              />
            </div>
          </div>

          {/* date of join */}
          <div className="flex flex-col w-full mt-[0.375rem] col-span-6">
            <div className="text-[#214768] text-[10px] font-normal poppins-thin leading-tight">
              Date of join
            </div>
            <div className="w-full h-[30px] relative mt-[0.313rem]">
            <input
                type="date"
                placeholder="Enter the date of join"
                name="date_of_join"
                value={formData.date_of_join}
                onChange={handleDateChange}
                className="w-full h-[30px] bg-[#21476810] rounded-md px-2 border border-none text-[#677F9450] text-[10px] inter-inter
                [&::-webkit-calendar-picker-indicator]:!opacity-0
                [&::-webkit-calendar-picker-indicator]:!absolute
                [&::-webkit-calendar-picker-indicator]:!left-0
                [&::-webkit-calendar-picker-indicator]:!w-full
                [&::-webkit-calendar-picker-indicator]:!h-full
                [&::-webkit-calendar-picker-indicator]:!cursor-pointer"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2V5"
                    stroke="#677F9450"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 2V5"
                    stroke="#677F9450"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.5 9.09H20.5"
                    stroke="#677F9450"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                    stroke="#677F9450"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.6947 13.7002H15.7037"
                    stroke="#677F9450"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.6947 16.7002H15.7037"
                    stroke="#677F9450"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9955 13.7002H12.0045"
                    stroke="#677F9450"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9955 16.7002H12.0045"
                    stroke="#677F9450"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.29431 13.7002H8.30329"
                    stroke="#677F9450"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.29431 16.7002H8.30329"
                    stroke="#677F9450"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex justify-between items-center mt-[0.325rem]">
            <div>
              <PopupButton
                name={"Cancel"}
                onClick={onClose}
                borderColor="#214768"
                textColor="#214768"
              />
            </div>

            <div>
              <PopupButton
                name={mode === "add" ? "Submit" : "Update"}
                isPrimary={true}
                onClick={handleSubmit}
                borderColor="#214768"
                backgroundColor="#214768"
              />
            </div>
          </div>
        </div>
      </div>
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

export default AddEmployeeDialogue;
