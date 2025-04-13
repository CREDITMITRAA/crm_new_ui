import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "../icons/DeleteIcon";
import { deleteCreditReport } from "../../features/credit-reports/creditReportsThunks";
import { useEffect, useState } from "react";
import Snackbar from "../common/snackbars/Snackbar";
import Loader from "../common/loaders/Loader";
import EmptyDataMessageIcon from "../icons/EmptyDataMessageIcon";
import { ROLE_EMPLOYEE } from "../../utilities/AppConstants";

function CreditSummaryTable() {
  const dispatch = useDispatch();
  const { creditReports, loading, error } = useSelector(
    (state) => state.creditReports
  );
  const { user } = useSelector((state) => state.auth);
  const { lead } = useSelector((state) => state.leads);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const totalOutstanding = creditReports.reduce(
    (sum, credit) => sum + Number(credit.total_outstanding),
    0
  );

  useEffect(() => {
    if (loading) {
      setToastStatusType("INFO");
      setToastMessage("Deleting Credit Report...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Deleted Credit Report...");
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

  function handleClickOnDelete(creditReportId, creditReport) {
    setOpenToast(true);
    try {
      let payload = {};
      payload.id = creditReportId;
      payload.updated_by = user.user.id;
      payload.credit_report = creditReport;
      payload.lead_name = lead.name;
      dispatch(deleteCreditReport(payload));
    } catch (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }

  return (
    <>
      <div className="grid grid-cols-12 my-3">
        <div className="col-span-12 flex justify-between items-center">
          <span className="text-[#464646] text-base font-semibold poppins-thin leading-tight">
            Credit Summary
          </span>
        </div>
      </div>
      {loading ? (
        <div className="w-full h-[20rem] bg-white flex justify-center items-center rounded-2xl">
          <Loader />
        </div>
      ) : creditReports.length > 0 ? (
        <div className="w-full h-auto rounded-2xl border border-[#E9F3FF] overflow-hidden inter-inter">
          {/* Table Header */}
          <div className="bg-[#B6C9E3] grid grid-cols-[3fr_3fr_1fr]">
            {[
              "Credit Card Name",
              "Outstanding",
              ...(user.user.role !== ROLE_EMPLOYEE ? ["Actions"] : []),
            ].map((header, index) => (
              <div
                key={index}
                className="px-3 py-2.5 text-center text-[#214768] text-xs font-semibold border-l border-t border-[#E9F3FF] first:border-l-0"
              >
                {header}
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {creditReports.map((creditReport) => (
            <div
              key={creditReport.id}
              className="grid grid-cols-[3fr_3fr_1fr] border-t border-r border-[#E9F3FF] bg-[#D8E8FF]"
            >
              {[
                creditReport.credit_card_name,
                Number(creditReport.total_outstanding).toFixed(0),
              ].map((text, colIndex) => (
                <div
                  key={colIndex}
                  className="px-3 py-2.5 text-left text-[#464646] text-xs border-l border-r border-[#D8E8FF] first:border-l-0"
                >
                  {text}
                </div>
              ))}
              {/* Actions Column */}
              {user.user.role !== ROLE_EMPLOYEE && (
                <div className="px-3 py-2.5 flex justify-center items-center border-l border-[#E9F3FF]">
                  <DeleteIcon
                    color="#214768"
                    onClick={() =>
                      handleClickOnDelete(creditReport.id, creditReport)
                    }
                  />
                </div>
              )}
            </div>
          ))}

          {/* Total Row */}
          <div className="grid grid-cols-[3fr_3fr_1fr] border-t border-[#E9F3FF] bg-[#D8E8FF]">
            <div className="px-3 py-2.5 flex justify-center items-center border-l border-[#E9F3FF] first:border-l-0">
              <div className="text-[#214768] text-xs font-semibold">Total</div>
            </div>
            <div className="px-3 py-2.5 flex justify-start items-center border-l border-[#E9F3FF]">
              <div className="text-[#214768] text-xs font-semibold">
                {totalOutstanding}
              </div>
            </div>
            {user.user.role !== ROLE_EMPLOYEE && (
              <div className="px-3 py-2.5 border-l border-[#E9F3FF]"></div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-[20rem] bg-[#F0F6FF] flex justify-center items-center rounded-2xl shadow-xl">
          <EmptyDataMessageIcon
            size={100}
            message="No credit card reports available"
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

export default CreditSummaryTable;
