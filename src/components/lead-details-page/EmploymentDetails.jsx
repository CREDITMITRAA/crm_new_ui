import { useCallback, useEffect, useState } from "react";
import EmailIcon from "../icons/EmailIcon";
import GenderIcon from "../icons/GenderIcon";
import LocationIcon from "../icons/LocationIcon";
import PhoneIcon from "../icons/PhoneIcon";
import SourceIcon from "../icons/SourceIcon";
import UserIcon from "../icons/UserIcon";
import SingleDetailCard from "./SingleDetailCard";
import { useDispatch, useSelector } from "react-redux";
import { updateLeadDetails } from "../../features/leads/leadsThunks";
import Snackbar from "../common/snackbars/Snackbar";
import { debounce } from "lodash";
import { updateLeadFields } from "../../features/leads/leadsSlice";
import CompanyIcon from "../icons/CompanyIcon";
import SalaryIcon from "../icons/SalaryIcon";
import CategoryIcon from "../icons/CategoryIcon";
import Loader from "../common/loaders/Loader";
import { companyCategoriesMap } from "../../utilities/AppConstants";

const employmentDetailsCards = [
  {
    icon: <CompanyIcon />,
    name: "Company",
    isEditable: true,
    fieldName: "company",
  },
  {
    icon: <LocationIcon />,
    name: "Place",
    isEditable: true,
    fieldName: "city",
  },
  {
    icon: <SalaryIcon />,
    name: "Salary",
    isEditable: true,
    fieldName: "salary",
  },
  {
    icon: <CategoryIcon />,
    name: "Category",
    isEditable: true,
    fieldName: "company_category_id",
  },
];

function EmploymentDetails() {
  const dispatch = useDispatch();
  const { lead, loading, error } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);

  const [apiPayload, setApiPayload] = useState({});
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);

  useEffect(() => {
    console.log("lead from store = ", lead);
  }, [lead]);

  const updateLeadDetailsDebounced = useCallback(
    debounce((leadId, payload, userId, leadName) => {
      const fullPayload = {
        ...payload,
        user_id: userId,
        lead_name: leadName,
      };
      console.log("Final payload being sent:", fullPayload);

      dispatch(updateLeadDetails({ id: leadId, payload: fullPayload }));
    }, 500),
    [dispatch]
  );

  function handleChange(fieldName, value) {
    // Skip if value is empty array, empty string, or unchanged
    if (
      (Array.isArray(value) && value.length === 0) ||
      value === "" ||
      value === lead[fieldName]
    ) {
      return;
    }

    // Special handling for alternate_phones to compare properly
    if (fieldName === "alternate_phones") {
      const existingPhones = Array.isArray(lead.alternate_phones)
        ? lead.alternate_phones
        : [];
      const newPhonesSet = new Set([...existingPhones, value]);

      // Check if the phone number is actually new
      if (
        newPhonesSet.size === existingPhones.length &&
        existingPhones.includes(value)
      ) {
        return; // No change, exit early
      }
    }

    let updatedPayload = { ...apiPayload };

    if (fieldName === "alternate_phones") {
      const existingPhones = Array.isArray(lead.alternate_phones)
        ? lead.alternate_phones
        : [];
      updatedPayload.alternate_phones = [
        ...new Set([...existingPhones, value]),
      ];
    } else if (fieldName === "company_category_id") {
      // Only update if the category actually changed
      if (value === lead.company_category_id) return;

      updatedPayload.company_category_id = value;
      updatedPayload.company_category_name = companyCategoriesMap.get(value);
    } else {
      updatedPayload[fieldName] = value;
    }

    setApiPayload(updatedPayload);

    setToastMessage("Updating lead details...");
    setToastStatusMessage("In Progress...");
    setToastStatusType("INFO");
    setOpenToast(true);
    setShouldSnackbarCloseOnClickOfOutside(false);

    setTimeout(() => {
      updateLeadDetailsDebounced(
        lead.id,
        updatedPayload,
        user.user.id,
        fieldName === "name" ? value : lead.name
      );
    }, 100);
  }

  useEffect(() => {
    console.log("api payload = ", apiPayload);
  }, [apiPayload]);

  useEffect(() => {
    if (loading) {
      setToastStatusType("INFO");
      setToastMessage("Updating lead details...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      dispatch(updateLeadFields(apiPayload));
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

  return (
    <>
      <div className="my-2">
        <span className="text-[#464646] text-base font-semibold poppins-thin leading-tight">
          Employment Details
        </span>
      </div>

      {loading ? (
        <div className="w-full h-[20rem] bg-white flex justify-center items-center rounded-2xl">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-12 bg-[#F0F6FF] rounded-2xl px-[1.875rem] py-[1.25rem] shadow-lg">
          {employmentDetailsCards.map((card, index) => (
            <div key={index} className="col-span-4 h-24 m-2">
              <SingleDetailCard
                icon={card.icon}
                name={card.name}
                fieldName={card.fieldName}
                isEditable={card?.isEditable ?? false}
                onChange={(fieldName, value) => handleChange(fieldName, value)}
                apiPayload={apiPayload}
              />
            </div>
          ))}
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

export default EmploymentDetails;
