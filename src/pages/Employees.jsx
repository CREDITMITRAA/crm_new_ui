import { useEffect, useState } from "react";
import AddEmployeeButton from "../components/common/AddEmployeeButton";
import DeleteButton from "../components/common/DeleteButton";
import EditButton from "../components/common/EditButton";
import AddEmployeeDialogue from "../components/employees/AddEmployeeDialogue";
import EmployeeCard from "../components/employees/EmployeeCard";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEmployee,
  getAllEmployees,
} from "../features/employee/employeeThunks";
import ConfirmationDialogue from "../components/common/dialogues/ConfirmationDialogue";
import AlertButton from "../components/common/AlertButton";
import Snackbar from "../components/common/snackbars/Snackbar";
import { ROLE_ADMIN } from "../utilities/AppConstants";
import { isEmpty } from "../utilities/utility-functions";
import EmptyDataMessageIcon from "../components/icons/EmptyDataMessageIcon";
import Loader from "../components/common/loaders/Loader";

function Employees() {
  const { user } = useSelector((state) => state.auth);
  const [showAddEmployeeDialogue, setShowAddEmployeeDialogue] = useState(false);
  const [showEditEmployeeDialogue, setShowEditEmployeeDialogue] =
    useState(false);
  const dispatch = useDispatch();
  const { employees, loadingForDeleteEmployee, error, loading } = useSelector(
    (state) => state.employees
  );
  const { height, isProfileDialogueOpened } = useSelector((state) => state.ui);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showConfirmationDialogue, setShowConfirmationDialogue] =
    useState(false);
  const [confirmationDialogueMessage, setConfirmationDialogueMessage] =
    useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const {isConfirmationDialogueOpened} = useSelector((state)=>state.ui)

  useEffect(() => {
    dispatch(getAllEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (loadingForDeleteEmployee) {
      setOpenToast(true);
      setToastStatusType("INFO");
      setToastMessage("Deleting Employee...");
      setToastStatusMessage("In Progress...");
    } else {
      setShouldSnackbarCloseOnClickOfOutside(true);
      setToastStatusType("SUCCESS");
      setToastMessage("Employee Deleted");
      setToastStatusMessage("Success...");
    }
  }, [loadingForDeleteEmployee]);

  useEffect(() => {
    if (error) {
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setToastStatusType("ERROR");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [error]);

  function handleClick(employee) {
    console.log("inside handle click function", employee);
    if (employee && employee.id === selectedEmployee?.id) {
      setSelectedEmployee(null);
    } else {
      setSelectedEmployee(employee);
    }
  }

  function handleClickOnDelete() {
    setConfirmationDialogueMessage("You are about to delete employee");
    setShowConfirmationDialogue(true);
  }

  function handleClickOnLogout() {
    dispatch(deleteEmployee(selectedEmployee.id));
  }

  return (
    <>
      <div className="w-full">
        {/* <!-- Cards Container --> */}
        <div className="grid grid-cols-12 gap-2">
          <div className="row col-span-12 flex justify-between items-center">
            <div>
              <span className="text-black text-base font-semibold poppins-thin leading-tight">
                Employees
              </span>
            </div>
            <div className="flex grid-cols-6 gap-2">
              {user.user.role === ROLE_ADMIN && (
                <AddEmployeeButton
                  onClick={() => setShowAddEmployeeDialogue(true)}
                />
              )}
              {selectedEmployee && (
                <>
                  <EditButton
                    onClick={() => setShowEditEmployeeDialogue(true)}
                  />
                  {user.user.role === ROLE_ADMIN && (
                    <DeleteButton onClick={() => handleClickOnDelete()} color="#464646"/>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {loading ? (
          <>
            {isEmpty(employees) ? (
              <>
                <div
                  className={`w-full h-[${height}px] bg-white flex justify-center items-center mt-2`}
                  style={{ height: `${height + 30}px` }}
                >
                  <EmptyDataMessageIcon size={100} />
                </div>
              </>
            ) : (
              <>
                <div
                  className={`w-full h-[${height}px] bg-[#E8EFF8] flex justify-center items-center mt-2`}
                  style={{ height: `${height + 30}px` }}
                >
                  <Loader />
                </div>
              </>
            )}
          </>
        ) : (
          <div className="grid grid-cols-12 gap-4 px-12 mt-4">
            {employees?.map((item, index) => (
              <div className="col-span-4" key={item.id} style={{zIndex: isConfirmationDialogueOpened || isProfileDialogueOpened ? -1 : 1}}>
                <EmployeeCard
                  employee={item}
                  onClick={(employee) => handleClick(employee)}
                  setSelectedEmployee={setSelectedEmployee}
                  selectedEmployee={selectedEmployee}
                />
              </div>
            ))}
          </div>
        )}

        {showAddEmployeeDialogue && (
          <AddEmployeeDialogue
            onClose={() => setShowAddEmployeeDialogue(false)}
          />
        )}
        {showEditEmployeeDialogue && (
          <AddEmployeeDialogue
            onClose={() => setShowEditEmployeeDialogue(false)}
            employee={selectedEmployee}
          />
        )}

        {showConfirmationDialogue && (
          <ConfirmationDialogue
            onClose={() => setShowConfirmationDialogue(false)}
            message={confirmationDialogueMessage}
            onSubmit={() => handleClickOnLogout()}
            button={<AlertButton />}
            disabled={false}
            buttonName="Delete"
            buttonBackgroundColor="#EE4444"
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
    </>
  );
}

export default Employees;
