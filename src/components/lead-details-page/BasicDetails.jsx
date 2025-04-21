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
import Loader from "../common/loaders/Loader";
const basicDetailsCards = [
  {
    icon: <UserIcon />,
    name: "Name",
    isEditable: true,
    fieldName: "name",
  },
  {
    icon: <PhoneIcon />,
    name: "Phone",
    fieldName: "phone",
  },
  {
    icon: <EmailIcon />,
    name: "Email",
    fieldName: "email",
  },
  {
    icon: <LocationIcon />,
    name: "Location",
    fieldName: "address",
    isEditable: true,
  },
  {
    icon: <PhoneIcon />,
    name: "Alt-Number",
    fieldName: "alternate_phones",
    isEditable: true,
  },
  {
    icon: <GenderIcon />,
    name: "Gender",
    isEditable: true,
    fieldName: "gender",
  },
  {
    icon: <SourceIcon />,
    name: "Source",
    isEditable: true,
    fieldName: "lead_source",
  },
  {
    icon: <SourceIcon />,
    name: "Bureau Score",
    isEditable: true,
    fieldName: "bureau",
  },
];

function BasicDetails() {
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

  function handleChange(fieldName, value) {
    console.log("Field name =", fieldName, "Value =", value);
    
    // Skip if value is empty array or empty string
    if ((Array.isArray(value) && value.length === 0) || value === '') {
        return;
    }
    
    // Get the current value from the lead object
    let currentValue = null;
    let bureau_name = null
    let bureau_score = null
    if(fieldName == "bureau"){
      bureau_name = lead.bereau_name
      bureau_score = lead.bereau_score
      currentValue = {bureau_name, bureau_score}
    }else{
      currentValue = lead[fieldName]
    }
    
    // Function to compare values deeply
    const isValueChanged = (newVal, oldVal) => {
        if (Array.isArray(newVal) && Array.isArray(oldVal)) {
            if (newVal.length !== oldVal.length) return true;
            return newVal.some((item, index) => item !== oldVal[index]);
        }
        
        // Handle bureau object comparison
        if (fieldName === "bureau" && typeof newVal === 'object' && typeof oldVal === 'object') {
            return (
                newVal.bereau_name !== oldVal?.bureau_name ||
                newVal.bereau_score !== oldVal?.bureau_score
            );
        }
        
        return newVal !== oldVal;
    };
    
    // Check if the value has actually changed
    if (isValueChanged(value, currentValue)) {
        setApiPayload((prev) => {
            let updatedPayload = { ...prev };
    
            if (fieldName === "alternate_phones") {
                const phonesArray = Array.isArray(value) ? value : [value];
                const cleanedPhones = phonesArray.filter(phone => phone && phone.trim() !== "");
                updatedPayload.alternate_phones = [...new Set(cleanedPhones)];
            } else if (fieldName === "bureau") {
                // Only include changed bureau fields
                if (value.bureau_name !== lead?.bereau_name) {
                    updatedPayload.bereau_name = value.bureau_name;
                }
                if (value.bureau_score !== lead?.bereau_score) {
                    updatedPayload.bereau_score = value.bureau_score;
                }
            } else {
                updatedPayload[fieldName] = value;
            }
    
            return updatedPayload;
        });
    
setToastMessage("Updating lead details...");
        setToastStatusMessage("In Progress...");
        setToastStatusType("INFO");
        setOpenToast(true);
        setShouldSnackbarCloseOnClickOfOutside(false);
    
        setTimeout(() => {
            setApiPayload((latestPayload) => {
                updateLeadDetailsDebounced(lead.id, {
                    ...latestPayload,
                    lead_name: fieldName === 'name' ? value : lead.name
                });          
                return latestPayload;
            });
        }, 100);
    }
}

  useEffect(() => {
    console.log("api paylaod = ", apiPayload);
  }, [apiPayload]);

  useEffect(() => {
    if (loading) {
      setToastStatusType("INFO");
      setToastMessage("Updating lead details...");
      setToastStatusMessage("In Progress...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } else {
      updateLeadFields(apiPayload);
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

  const updateLeadDetailsDebounced = useCallback(
    debounce((leadId, payload) => {
      dispatch(
        updateLeadDetails({
          id: leadId,
          payload: { ...payload, user_id: user.user.id },
        })
      );
    }, 500), // 500ms debounce time
    [dispatch]
  );

  if (loading) {
    return (
      <div className="w-full h-[20rem] bg-white flex justify-center items-center rounded-2xl">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 bg-[#F0F6FF] rounded-2xl px-[1.875rem] py-[1.25rem] shadow-lg">
        {basicDetailsCards.map((card, index) => (
          <div key={index} className="col-span-4 h-24 m-2">
            <SingleDetailCard
              icon={card.icon}
              name={card.name}
              fieldName={card.fieldName}
              isEditable={card?.isEditable ? true : false}
              onChange={(fieldName, value) => handleChange(fieldName, value)}
              apiPayload={apiPayload}
            />
          </div>
        ))}
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

export default BasicDetails;
