import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DesignationIcon from "../icons/DesignationIcon";
import ProfileImage from "../../assets/images/profile_image.png";
import UpdatePasswordButton from "../common/UpdatePasswordButton";
import SubmitButton from "../common/SubmitButton";
import { updatePassword } from "../../features/auth/authThunks";
import Snackbar from "../common/snackbars/Snackbar";
import { setIsProfileDialogueOpened } from "../../features/ui/uiSlice";

export default function Profile({ onClose }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const popoverRef = useRef(null);
  const [showUpdatePasswordSection, setShowUpdatePasswordSection] =
    useState(false);
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
    dispatch(setIsProfileDialogueOpened(true));
    return () => {
      dispatch(setIsProfileDialogueOpened(false));
    };
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle API response and show Snackbar
  useEffect(() => {
    if (loading) {
      setOpenToast(true);
      setToastStatusType("INFO");
      setToastMessage("Updating password...");
      setToastStatusMessage("In Progress...");
    } else {
      setShouldSnackbarCloseOnClickOfOutside(true);
      setToastStatusType("SUCCESS");
      setToastMessage("Password Updated");
      setToastStatusMessage("Success...");
      setApiPayload({}); // Reset the form
      setShowUpdatePasswordSection(false); // Hide the update password section
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      setToastMessage(error.message);
      setToastStatusMessage("Error...");
      setToastStatusType("ERROR");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }, [error]);

  function handleSubmit() {
    dispatch(updatePassword({ ...apiPayload, userId: user.user.id }));
  }

  return (
    <div
      ref={popoverRef}
      className="w-[28rem] h-max shadow-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] rounded-2xl bg-white pb-1 absolute top-full right-0 z-50"
    >
      {/* Top Section with Gradient */}
      <div className="w-full h-[5.625rem] rounded-t-2xl bg-gradient-to-r from-white to-[#214768] relative z-[1000]">
        <div className="text-white text-xl font-semibold absolute right-5 top-8">
          {user.user.name}
        </div>
        <div className="flex absolute right-5 bottom-2 items-center">
          <DesignationIcon />
          <div className="text-white text-xs font-normal ml-2">
            {user.user.designation}
          </div>
        </div>
        {/* Profile Picture */}
        <div className="absolute left-10 top-8 w-20 h-20">
          <img
            src={ProfileImage}
            alt="Profile"
            className="w-full h-full rounded-full"
          />
        </div>
      </div>

      {/* Update Password Button */}
      {/* <div
        className="mt-2 cursor-pointer text-right w-full flex justify-end"
        onClick={() => setShowUpdatePasswordSection(!showUpdatePasswordSection)}
      >
        <UpdatePasswordButton />
      </div> */}

      {/* User Details */}
      <div className="h-max bg-[#21476810] rounded-lg p-4 mt-2 shadow-md grid grid-cols-12 mx-4 my-2">
        {[
          { label: "Department", value: user.user.department },
          { label: "Email address", value: user.user.email },
          { label: "Address", value: user.user.address || "NA" },
          { label: "Gender", value: "Male" },
          { label: "Employee ID", value: user.user.employee_id || "NA" },
        ].map((item, index) => (
          <div key={index} className="mb-2 col-span-6">
            <div className="text-[#214768] text-[10px] font-normal">
              {item.label}
            </div>
            <div className="text-black text-xs">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Update Password Section */}
      <div
        className={`bg-[#21476810] w-full px-3 rounded-lg mt-2 transition-all duration-500 ease-in-out grid grid-cols-12 gap-2 overflow-hidden ${
          showUpdatePasswordSection
            ? "opacity-100 translate-y-0 py-4"
            : "opacity-0 translate-y-[-10px] max-h-0 py-0"
        }`}
        style={{
          transform: showUpdatePasswordSection
            ? "translateY(0)"
            : "translateY(-10px)",
          transition:
            "opacity 500ms ease-in-out, transform 500ms ease-in-out, max-height 500ms ease-in-out",
        }}
      >
        {[
          { name: "oldPassword", label: "Enter old password" },
          { name: "newPassword", label: "Enter new password" },
          { name: "renteredNewPassword", label: "Re-enter new password" },
        ].map((item, index) => (
          <div key={index} className="mb-2 col-span-6">
            <input
              type="password" // Use type="password" for password fields
              placeholder={item.label}
              name={item.name}
              value={apiPayload[item.name] || ""}
              onChange={(e) =>
                setApiPayload((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="w-full bg-white border border-none rounded-md p-2 text-xs text-[#21476810] outline-none"
            />
          </div>
        ))}
        <SubmitButton onClick={handleSubmit} />
      </div>

      {/* Snackbar */}
      <Snackbar
        isOpen={openToast}
        onClose={() => setOpenToast(false)}
        status={toastStatusMessage}
        message={toastMessage}
        statusType={toastStatusType}
        shouldCloseOnClickOfOutside={shouldSnackbarCloseOnClickOfOutside}
      />
    </div>
  );
}
