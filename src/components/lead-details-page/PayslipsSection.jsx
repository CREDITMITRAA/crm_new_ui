import { useDispatch, useSelector } from "react-redux";
import DocumentCard from "./DocumentCard";
import Snackbar from "../common/snackbars/Snackbar";
import { useEffect, useState } from "react";
import EmptyDataMessageIcon from "../icons/EmptyDataMessageIcon";
import Loader from "../common/loaders/Loader";

function PayslipsSection() {
  const dispatch = useDispatch();
  const { payslips, deleteDocumentLoading, deleteDocumentError, loading } = useSelector(
    (state) => state.leadDocuments
  );
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);

  useEffect(() => {
    if (deleteDocumentLoading) {
      setToastStatusType("INFO");
      setToastMessage("Deleting Document...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Document Deleted...");
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [deleteDocumentLoading, document, dispatch]);

  useEffect(() => {
    if (deleteDocumentError) {
      setToastStatusType("ERROR");
      setToastMessage(deleteDocumentError.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [deleteDocumentError]);

  return (
    <>
      {/* Title and buttons section */}
      <div className="grid grid-cols-12 my-3">
        <div className="row col-span-12 flex justify-between items-center">
          <div>
            <span className="text-[#464646] text-base font-semibold poppins-thin leading-tight">
              PaySlip
            </span>
          </div>
        </div>
      </div>

      {/* Payslip container */}
      {!loading ? (
  payslips.length > 0 ? (
    <div className="grid grid-cols-12 rounded-2xl px-[1.875rem] gap-6">
      {payslips.map((payslip) => (
        <div className="col-span-4" key={payslip.id}>
          <DocumentCard document={payslip} setOpenToast={setOpenToast} />
        </div>
      ))}
    </div>
  ) : (
    <div className="w-full h-[20rem] bg-[#F0F6FF] flex justify-center items-center rounded-2xl shadow-lg">
      <EmptyDataMessageIcon size={100} message="No payslips available"/>
    </div>
  )
) : (
  <div className="w-full h-[20rem] bg-white flex justify-center items-center rounded-2xl">
    <Loader />
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

export default PayslipsSection;
