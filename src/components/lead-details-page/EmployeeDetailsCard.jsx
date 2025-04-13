import { useDispatch, useSelector } from "react-redux";
import ProfileAvatarMale from "../../assets/images/profile_avatar_male.png";
import ProfileAvatarFemale from "../../assets/images/profile_avatar_female.png";
import TwelveDocumentsButton from "../common/TwelveDocumentsButton";
import UploadBereauButton from "../common/UploadBereauButton";
import UploadPayslipButton from "../common/UploadPayslipButton";
import {
  activityOptions,
  CREDIT_BUREAU,
  PAYSLIP,
  terminologiesMap,
  VERIFICATION_1,
} from "../../utilities/AppConstants";
import { uploadLeadDocument } from "../../features/lead-documents/leadDocumentsThunks";
import Snackbar from "../common/snackbars/Snackbar";
import { useEffect, useState } from "react";
import DropDown from "../common/dropdowns/DropDown";
import AddActivityDialogue from "../common/dialogues/AddActivityDialogue";
import { getRecentActivityNotesByLeadId } from "../../features/leads/leadsThunks";

function EmployeeDetailsCard() {
  const dispatch = useDispatch();
  const { lead, recentActivityNotes } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const { loading, error, uploadDocumentsLoading, uploadDocumentsError } =
    useSelector((state) => state.leadDocuments);
  const {
    recentActivity,
    loading: activitiesLoading,
    error: activitiesError,
  } = useSelector((state) => state.activities);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const [selectedActivityStatus, setSelectedActivityStatus] = useState(null);
  const [showAddActivityDialogue, setShowAddActivityDialogue] = useState(false);
  console.log("activity status recent = ", recentActivity?.activity_status);

  useEffect(() => {
    if (recentActivity?.activity_status) {
      console.log("activity status recent = ", recentActivity.activity_status);

      setSelectedActivityStatus(recentActivity.activity_status);
    }
  }, [recentActivity]);

  useEffect(() => {
    if (loading) {
      setToastStatusType("INFO");
      setToastMessage("Updating lead details...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Lead updated successfully...");
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

  useEffect(() => {
    if (uploadDocumentsLoading) {
      setToastStatusType("INFO");
      setToastMessage("Uploading Document...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Document Uploaded...");
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [uploadDocumentsLoading]);

  useEffect(() => {
    if (uploadDocumentsError) {
      setToastStatusType("ERROR");
      setToastMessage(uploadDocumentsError.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [uploadDocumentsError]);

  useEffect(() => {
    if (activitiesLoading) {
      setToastStatusType("INFO");
      setToastMessage("Adding activity...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      setToastStatusType("SUCCESS");
      setToastMessage("Activity added...");
      setToastStatusMessage("Success...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [activitiesLoading]);

  useEffect(() => {
    if (error) {
      setToastStatusType("ERROR");
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [activitiesError]);

  function uploadLeadDocumentHandler(document_type, file) {
    setOpenToast(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lead_id", lead.id);
    formData.append("document_type", document_type);
    formData.append("lead_name", lead.name);
    formData.append("user_id", user.user.id);
    dispatch(uploadLeadDocument(formData));
  }

  function handleSelectActivity(field, value) {
    setSelectedActivityStatus(value);
    setShowAddActivityDialogue(true);
  }

  return (
    <>
      <div className="w-full bg-[#E9F3FF] h-full rounded-2xl shadow-lg flex flex-col justify-center items-center px-[0.625rem] pb-[0.938rem]">
        {/* profile avatar */}
        <div className="pt-[0.938rem] mx-auto">
          <div className="w-[6.25rem] h-[6.25rem] bg-[#ba8bfc] rounded-full border-4 border-[#229d00] flex justify-center items-center">
            <img
              className="w-[5rem] h-[5.625rem]"
              src={
                lead.gender === "female"
                  ? ProfileAvatarFemale
                  : ProfileAvatarMale
              }
            />
          </div>
        </div>

        {/* lead id */}
        <div className="text-[#214768] text-sm font-medium inter-inter leading-tight mt-[0.313rem]">
          Lead id : {lead.id}
        </div>

        {/* lead name */}
        <div className="text-[#214768] text-base font-semibold poppins-thin leading-tight mt-[0.625rem]">
          {lead.name}
        </div>

        {/* lead email */}
        <div className="text-[#828282] text-xs font-normal poppins-thin leading-tight mt-[0.125rem]">
          {lead.email || "NA"}
        </div>

        {/* lead status */}
        <div className="flex justify-center mt-2 min-w-40">
          <DropDown
            options={[
              ...activityOptions,
              ...(lead?.Activities?.[0]?.docs_collected
                ? [
                    {
                      label: terminologiesMap.get(VERIFICATION_1),
                      value: VERIFICATION_1,
                    },
                  ]
                : []),
            ]}
            onChange={(field, value) => handleSelectActivity(field, value)}
            className="w-full h-full flex items-center justify-between"
            defaultSelectedOptionIndex={
              recentActivity?.activity_status
                ? activityOptions.findIndex(
                    (activity) =>
                      activity.value === recentActivity.activity_status
                  )
                : 0
            }
          />
        </div>

        {/* notes container */}
        <div className="w-full bg-[#214768]/20 rounded-[10px] border border-[#214768] mt-[0.625rem] p-[0.938rem]">
          <ul className="list-disc pl-0 text-black text-sm font-normal inter-inter leading-[30px]">
            {recentActivityNotes.map((item, index) => (
              <li
                key={index}
                title={item.description} // Tooltip for full text on hover
                className="relative flex items-center before:content-['•'] before:mr-2 before:text-black truncate hover:overflow-visible hover:whitespace-normal hover:bg-white hover:p-1 hover:rounded transition-all duration-200 cursor-pointer"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%", // Ensures ellipsis applies properly
                }}
              >
                {item.description}
              </li>
            ))}
          </ul>
        </div>

        {/* upload buttons container */}
        <div className="w-full flex justify-between gap-1 mt-[0.625rem]">
          <UploadPayslipButton
            onFileSelect={(file) => uploadLeadDocumentHandler(PAYSLIP, file)}
          />
          <UploadBereauButton
            onFileSelect={(file) =>
              uploadLeadDocumentHandler(CREDIT_BUREAU, file)
            }
          />
        </div>
        <TwelveDocumentsButton />
      </div>
      <Snackbar
        isOpen={openToast}
        onClose={() => setOpenToast(false)}
        status={toastStatusMessage}
        message={toastMessage}
        statusType={toastStatusType}
        shouldCloseOnClickOfOutside={shouldSnackbarCloseOnClickOfOutside}
      />
      {showAddActivityDialogue && (
        <AddActivityDialogue
          onClose={() => setShowAddActivityDialogue(false)}
          selectedActivityStatus={selectedActivityStatus}
          selectedLead={lead}
          onActivityAdded={() =>
            dispatch(
              getRecentActivityNotesByLeadId({ leadId: lead.id, limit: 3 })
            )
          }
          setShowAddActivityDialogue={setShowAddActivityDialogue}
          setOpenToast={setOpenToast}
          openToast={openToast}
        />
      )}
    </>
  );
}

export default EmployeeDetailsCard;
