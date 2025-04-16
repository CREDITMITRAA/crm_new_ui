import { useEffect, useState } from "react";
import AddButton from "../common/AddButton";
import DropDown from "../common/dropdowns/DropDown";
import { loanTypeOptions } from "../../utilities/AppConstants";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "../common/snackbars/Snackbar";
import { addLoanReport } from "../../features/loan-reports/loanReportsThunks";
import { resetLoanReportUpdaters } from "../../features/loan-reports/loanReportsSlice";
import { resetCreditReportUpdaters } from "../../features/credit-reports/creditReportsSlice";
import { addCreditReport } from "../../features/credit-reports/creditReportsThunks";

const initialPayload = {
  credit_card_name: "",
  total_outstanding: "",
};

function CreditReport() {
  const dispatch = useDispatch();
  const { lead } = useSelector((state) => state.leads);
  const { loading, error } = useSelector((state) => state.creditReports);
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [payload, setPayload] = useState({
    credit_card_name: "",
    total_outstanding: "",
  });
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);

  useEffect(() => {
    return () => {
      dispatch(resetCreditReportUpdaters());
    };
  }, []);

  useEffect(() => {
    if (loading) {
      setToastStatusType("INFO");
      setToastMessage("Adding Credit Report...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Credit Report Added...");
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
      setPayload(initialPayload);
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  function addCreditReportHandler() {
    setOpenToast(true);
    dispatch(
      addCreditReport({
        ...payload,
        lead_id: lead.id,
        created_by: user.user.id,
        lead_name:lead.name
      })
    ).then(() => {
      dispatch(resetCreditReportUpdaters()); // Reset Redux state after completion
    });
  }

  return (
    <>
      <div className={`${!isConfirmationDialogueOpened && "relative"} w-full h-full bg-[#2147682B] rounded-2xl border border-[#214768] px-[0.938rem] pt-[1.875rem] pb-[0.625rem]`}>
        {/* Loan Report Text */}
        <div className={`${!isConfirmationDialogueOpened && "absolute"} -top-[0.425rem] left-[1.25rem] px-3 bg-[#E9F3FF] rounded-full text-[#214768] text-[10px] font-medium poppins-thin leading-tight`}>
          Credit Report
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col w-full space-y-2">
          {/* Loan Type with Add+ Button */}
          <div className="flex justify-between items-center">
            <div className="text-[#214768] text-[0.625rem] font-semibold poppins-thin leading-tight">
              Credit Card Name
            </div>
            <AddButton onClick={() => addCreditReportHandler()} />
          </div>
          <input
            type="text"
            name="credit_card_name"
            value={payload.credit_card_name}
            onChange={handleInputChange}
            placeholder="Enter loan card name"
            className="w-full h-[30px] bg-[#D9E4F2] rounded-md px-2 border border-none text-[#214768] text-[10px] inter-inter"
          />

          {/* Bank Name */}
          <div>
            <div className="text-[#214768] text-[0.625rem] font-semibold poppins-thin leading-tight mb-[0.313rem]">
              Outstanding Amount
            </div>
            <input
              type="text"
              name="total_outstanding"
              value={payload.total_outstanding}
              onChange={handleInputChange}
              placeholder="Enter the outstanding"
              className="w-full h-[30px] bg-[#D9E4F2] rounded-md px-2 border border-none text-[#214768] text-[10px] inter-inter"
            />
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
    </>
  );
}

export default CreditReport;
