import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "../icons/DeleteIcon";
import Snackbar from "../common/snackbars/Snackbar";
import { deleteLoanReport } from "../../features/loan-reports/loanReportsThunks";
import { useEffect, useState } from "react";
import Loader from "../common/loaders/Loader";
import EmptyDataMessageIcon from "../icons/EmptyDataMessageIcon";
import { ROLE_EMPLOYEE } from "../../utilities/AppConstants";
import moment from "moment";

function LoansSummaryTable() {
  const dispatch = useDispatch();
  const { loanReports, loading, error } = useSelector(
    (state) => state.loanReports
  );
  const { lead } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const totalLoanAmount = loanReports.reduce(
    (sum, loan) => sum + Number(loan.loan_amount),
    0
  );
  const totalEmi = loanReports.reduce((sum, loan) => sum + Number(loan.emi), 0);
  const totalOutstanding = loanReports.reduce(
    (sum, loan) => sum + Number(loan.outstanding),
    0
  );

  useEffect(() => {
    if (loading) {
      setToastStatusType("INFO");
      setToastMessage("Deleting Loan Report...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Deleted Loan Report...");
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
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

  function handleClickOnDelete(loanReportId, loanReport) {
    setOpenToast(true);
    try {
      let payload = {};
      payload.id = loanReportId;
      payload.updated_by = user.user.id;
      payload.loan = loanReport;
      payload.lead_name = lead.name;
      dispatch(deleteLoanReport(payload));
    } catch (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }

  if (loading) {
    return (
      <div className="w-full h-[20rem] bg-white flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 my-3">
        <div className="col-span-12 flex justify-between items-center">
          <span className="text-[#464646] text-base font-semibold poppins-thin leading-tight">
            Loans Summary
          </span>
        </div>
      </div>
      {loading ? (
        <div className="w-full h-[20rem] bg-white flex justify-center items-center rounded-2xl">
          <Loader />
        </div>
      ) : loanReports.length > 0 ? (
        <div className="w-full h-auto rounded-2xl border border-[#E9F3FF] overflow-hidden inter-inter">
          {/* Table Header */}
          <div className="bg-[#f0f4ff] flex">
            {[
              "Loan Type",
              "Bank Name",
              "Loan Amount",
              "EMI",
              "EMI Date",
              "Loan Disbursal Date",
              "Outstanding",
              ...(user.user.role !== ROLE_EMPLOYEE ? ["Actions"] : []),
            ].map((header, index) => (
              <div
                key={index}
                className={`flex-1 px-3 py-2.5 bg-[#B6C9E3] text-center text-[#214768] text-xs font-semibold border-l border-t border-[#E9F3FF] ${
                  index === 0 ? "border-l-0" : ""
                }`}
              >
                {header}
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {loanReports.map((loanReport, rowIndex) => (
            <div
              key={loanReport.id}
              className="flex border-t border-[#E9F3FF] bg-white"
            >
              {[
                loanReport.loan_type,
                loanReport.bank_name,
                Number(loanReport.loan_amount).toFixed(0),
                Number(loanReport.emi).toFixed(0),
                loanReport.emi_date ? moment(loanReport.emi_date).format("DD-MM-YYYY") : '-',
                loanReport.loan_disbursal_date ? moment(loanReport.loan_disbursal_date).format("DD-MM-YYYY") : '-',
                Number(loanReport.outstanding).toFixed(0),
              ].map((text, colIndex) => (
                <div
                  key={colIndex}
                  className={`flex-1 px-3 py-2.5 bg-[#D8E8FF] text-[#464646] text-xs border-l border-[#E9F3FF] ${
                    colIndex === 0 ? "border-l-0" : ""
                  } ${
                    (colIndex >= 2 && colIndex !== 4 && colIndex !== 5) ? "text-right flex justify-end items-center" : "text-center flex justify-center items-center "
                  }`}
                >
                  {text}
                </div>
              ))}
              {/* Actions Column */}
              {user.user.role !== ROLE_EMPLOYEE && (
                <div className="flex-1 px-3 py-2.5 flex justify-center items-center border-l border-[#E9F3FF] bg-[#D8E8FF]">
                  <DeleteIcon
                    color="#214768"
                    onClick={() =>
                      handleClickOnDelete(loanReport.id, loanReport)
                    }
                  />
                </div>
              )}
            </div>
          ))}

          {/* Total Row */}
          <div className="flex border-t border-indigo-50 bg-[#D8E8FF]">
            <div className="flex-1 px-3 py-2.5"></div>
            <div className="flex-1 px-3 py-2.5 flex justify-center items-center border-l border-[#E9F3FF]">
              <div className="text-[#214768] text-xs font-semibold">Total</div>
            </div>

            {[totalLoanAmount, totalEmi, "", "", totalOutstanding].map(
              (total, index) => (
                <div
                  key={index}
                  className={`flex-1 px-3 py-2.5 flex justify-end items-center border-l border-[#E9F3FF] ${
                    index === 1 ? "flex-[1]" : "" // Adjust for EMI Date column
                  }`}
                >
                  <div className="text-[#214768] text-xs font-semibold">
                    {index === 1 ? total : index === 0 ? total : total}
                  </div>
                </div>
              )
            )}
            {user.user.role !== ROLE_EMPLOYEE && (
              <div className="flex-1 px-3 py-2.5 border-l border-[#E9F3FF] bg-[#D8E8FF]"></div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-[20rem] bg-[#F0F6FF] flex justify-center items-center rounded-2xl shadow-xl">
          <EmptyDataMessageIcon
            size={100}
            message="No loan reports available"
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
    </>
  );
}

export default LoansSummaryTable;