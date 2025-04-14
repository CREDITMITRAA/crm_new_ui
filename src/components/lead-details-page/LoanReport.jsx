import { useEffect, useState } from "react";
import AddButton from "../common/AddButton";
import DropDown from "../common/dropdowns/DropDown";
import { loanTypeOptions } from "../../utilities/AppConstants";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "../common/snackbars/Snackbar";
import { addLoanReport } from "../../features/loan-reports/loanReportsThunks";
import { resetLoanReportUpdaters } from "../../features/loan-reports/loanReportsSlice";

const initialPayload = {
  loan_type: loanTypeOptions[0].value,
  bank_name: "",
  loan_amount: "",
  emi: "",
  outstanding: "",
};

function LoanReport() {
  const dispatch = useDispatch();
  const { lead } = useSelector((state) => state.leads);
  const { loading, error } = useSelector((state) => state.loanReports);
  const { user } = useSelector((state) => state.auth);
  const [payload, setPayload] = useState({
    loan_type: loanTypeOptions[0].value,
    bank_name: "",
    loan_amount: "",
    emi: "",
    outstanding: "",
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
      dispatch(resetLoanReportUpdaters());
    };
  }, []);

  useEffect(() => {
    if (loading) {
      setToastStatusType("INFO");
      setToastMessage("Adding Loan Report...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Loan Report Added...");
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

  function addLoanReportHandler() {
    setOpenToast(true);
    dispatch(
      addLoanReport({
        ...payload,
        lead_id: lead.id,
        created_by: user.user.id,
        lead_name: lead.name,
      })
    ).then(() => {
      dispatch(resetLoanReportUpdaters()); // Reset Redux state after completion
    });
  }

  return (
    <>
      <div className="relative w-full bg-[#2147682B] rounded-2xl border border-[#214768] px-[0.938rem] pt-[1.875rem] pb-[0.625rem]">
        {/* Loan Report Text */}
        <div className="absolute -top-[0.425rem] left-[1.25rem] px-3 bg-[#E9F3FF] rounded-full text-[#214768] text-[10px] font-medium poppins-thin leading-tight">
          Loan Report
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col w-full space-y-2">
          {/* Loan Type with Add+ Button */}
          <div className="flex justify-between items-center">
            <div className="text-[#214768] text-[0.625rem] font-semibold poppins-thin leading-tight">
              Loan Type
            </div>
            <AddButton onClick={() => addLoanReportHandler()} />
          </div>
          {/* <DropDown
            key={payload.loan_type} // Force re-render when payload.loan_type changes
            options={loanTypeOptions}
            onChange={(field, value) =>
              setPayload((prev) => ({ ...prev, loan_type: value }))
            }
            defaultSelectedOptionIndex={
              loanTypeOptions.findIndex(
                (loanType) => loanType.value === payload.loan_type
              ) || 0
            }
            className="w-full"
          /> */}

<select
  name="loan_type"
  value={payload.loan_type || ""}
  onChange={(e) => setPayload(prev => ({ ...prev, loan_type: e.target.value }))}
  className="
    w-full h-7 
    bg-[#D9E4F2] rounded-[5px] 
    border-[0.50px] border-neutral-300
    pl-[10px] pr-8 py-[5px]
    text-cyan-900 text-xs 
    font-medium font-['Poppins'] leading-tight
    appearance-none  /* Removes default dropdown arrow */
    bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB2aWV3Qm94PSIwIDAgOCA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0xIDEuNUw0IDQuNUw3IDEuNSIgc3Ryb2tlPSIjMTUzZTVDIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==')]
    bg-no-repeat bg-[right_10px_center]
    cursor-pointer
  "
>
  {loanTypeOptions.map((option) => (
    <option key={option.value} value={option.value} className="text-cyan-900">
      {option.label}
    </option>
  ))}
</select>

          {/* Bank Name */}
          <div>
            <div className="text-[#214768] text-[0.625rem] font-semibold poppins-thin leading-tight mb-[0.313rem]">
              Bank Name
            </div>
            <input
              type="text"
              name="bank_name"
              value={payload.bank_name}
              onChange={handleInputChange}
              placeholder="Enter bank name"
              className="w-full h-[30px] bg-[#D9E4F2] rounded-md px-2 border border-none text-[#214768] text-[10px] inter-inter"
            />
          </div>

          {/* Loan Amount */}
          <div>
            <div className="text-[#214768] text-[0.625rem] font-semibold poppins-thin leading-tight mb-[0.313rem]">
              Loan Amount
            </div>
            <input
              type="text"
              name="loan_amount"
              value={payload.loan_amount}
              onChange={handleInputChange}
              placeholder="Enter loan amount"
              className="w-full h-[30px] bg-[#D9E4F2] rounded-md px-2 border border-none text-[#214768] text-[10px] inter-inter"
            />
          </div>

          {/* EMI */}
          <div>
            <div className="text-[#214768] text-[0.625rem] font-semibold poppins-thin leading-tight mb-[0.313rem]">
              EMI
            </div>
            <input
              type="text"
              name="emi"
              value={payload.emi}
              onChange={handleInputChange}
              placeholder="Enter EMI"
              className="w-full h-[30px] bg-[#D9E4F2] rounded-md px-2 border border-none text-[#214768] text-[10px] inter-inter"
            />
          </div>

          {/* Outstanding Amount */}
          <div>
            <div className="text-[#214768] text-[0.625rem] font-semibold poppins-thin leading-tight mb-[0.313rem]">
              Outstanding Amount
            </div>
            <input
              type="text"
              name="outstanding"
              value={payload.outstanding}
              onChange={handleInputChange}
              placeholder="Enter outstanding amount"
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

export default LoanReport;
