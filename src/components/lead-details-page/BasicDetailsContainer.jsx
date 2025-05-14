import { useState } from "react";
import DownloadDocumentButton from "../common/DownloanDocumentButton";
import PrimaryButton from "../common/PrimaryButton";
import BackIcon from "../icons/BackIcon";
import BasicDetails from "./BasicDetails";
import BureauSection from "./BureauSection";
import CreditReport from "./CreditReport";
import CreditSummaryTable from "./CreditSummaryTable";
import DocumentCard from "./DocumentCard";
import DocumentDropdown from "./DocumentDropdown";
import EmployeeDetailsCard from "./EmployeeDetailsCard";
import EmploymentDetails from "./EmploymentDetails";
import LoanReport from "./LoanReport";
import LoansSummaryTable from "./LoansSummaryTable";
import OtherLoanReport from "./OtherLoanReport";
import PayslipsSection from "./PayslipsSection";
import SingleDetailCard from "./SingleDetailCard";
import { downloadReport } from "../../utilities/utility-functions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OtherDocsSection from "./OtherDocsSection";

function BasicDetailsContainer({ setShowActivityLog, showActivityLog }) {
  const navigate = useNavigate()
  const { lead } = useSelector((state) => state.leads);
  const { loanReports } = useSelector((state) => state.loanReports);
  const { creditReports } = useSelector((state) => state.creditReports);
  const [downloadFileFormat, setDownloadFileFormat] = useState("pdf");

  function handleClickOnDownload() {
    downloadReport(downloadFileFormat, loanReports, creditReports, lead.name, lead.id);
  }

  return (
    <>
      {/* Back icon section */}
      <div className="flex w-full justify-between my-2 mb-1 cursor-pointer" onClick={()=>navigate(-1)}>
        <BackIcon />
      </div>
      {/* Main content Container */}
      <div className="w-full grid grid-cols-12 gap-4 pb-8"> {/* Added pb-8 for bottom padding */}
        {/* Basic details container */}
        <div className="col-span-9 row-span-1 h-max text-white">
          {/* Title and buttons section */}
          <div className="grid grid-cols-12 mb-2">
            <div className="row col-span-12 flex justify-between items-center">
              <div>
                <span className="text-[#464646] text-base font-semibold poppins-thin leading-tight">
                  Basic Details
                </span>
              </div>
              <div className="flex grid-cols-6 gap-2">
                <PrimaryButton
                  isActive={!showActivityLog}
                  name="Lead Details"
                  onClick={() => setShowActivityLog(false)}
                  backgroundColor="#C7D4E4"
                />
                <PrimaryButton
                  isActive={showActivityLog}
                  name="Activity Log"
                  onClick={() => setShowActivityLog(true)}
                  backgroundColor="#C7D4E4"
                />
              </div>
            </div>
          </div>

          {/* Basic Details Section */}
          <BasicDetails />

          <EmploymentDetails />

          <PayslipsSection />

          <BureauSection />

          <OtherDocsSection/>
        </div>

        {/* Employee Card (Fixed at Top-Right) */}
        <div className="col-span-3 row-span-1 h-max">
          <EmployeeDetailsCard />
        </div>
        
        
        {/* loan details container */}
        <div className="col-span-12 row-span-1 h-max text-white">
          <div className="grid grid-cols-12 my-3">
            <div className="col-span-12 flex justify-between items-center">
              <span className="text-[#464646] text-base font-semibold poppins-thin leading-tight">
                Loan Details
              </span>
            </div>
          </div>
          <div className="col-span-12 bg-[#F0F6FF] p-[1.25rem] rounded-2xl shadow-lg">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 h-max">
                <LoanReport />
              </div>
              <div className="col-span-4 h-full">
                <CreditReport />
              </div>
              <div className="col-span-4 h-max">
                <OtherLoanReport />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12">
          <LoansSummaryTable />
        </div>

        <div className="col-span-12">
          <CreditSummaryTable />
        </div>

        {/* Download Button Section */}
        <div className="flex justify-end col-span-12 items-center mt-4"> {/* Added mt-4 for top margin */}
          <div className="w-max">
            <DocumentDropdown
              onChange={(fieldName, value) => setDownloadFileFormat(value)}
            />
          </div>
          <DownloadDocumentButton onClick={() => handleClickOnDownload()} />
        </div>
      </div>
    </>
  );
}

export default BasicDetailsContainer;
