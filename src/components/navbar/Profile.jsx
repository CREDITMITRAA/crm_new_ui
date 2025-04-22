import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DesignationIcon from "../icons/DesignationIcon";
import ProfileImage from "../../assets/images/profile_image.png";
import UpdatePasswordButton from "../common/UpdatePasswordButton";
import SubmitButton from "../common/SubmitButton";
import {
  updatePassword,
  updateProfileImageUrl,
} from "../../features/auth/authThunks";
import Snackbar from "../common/snackbars/Snackbar";
import { setIsProfileDialogueOpened } from "../../features/ui/uiSlice";
import { fetchUserProfileImages } from "../../features/users/usersApi";

export default function Profile({ onClose }) {
  const dispatch = useDispatch();
  const { user, loading, error, profile_image_url } = useSelector(
    (state) => state.auth
  );
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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [profileImageUrls, setProfileImageUrls] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState([]);

  useEffect(() => {
    setProfileImageUrl(profile_image_url);
    dispatch(setIsProfileDialogueOpened(true));
    getProfileImageUrls();
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
      setToastMessage("Profile Updated");
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

  useEffect(() => {
    setProfileImageUrl(profile_image_url);
  }, [profile_image_url]);

  function handleSubmit() {
    dispatch(updatePassword({ ...apiPayload, userId: user.user.id }));
  }

  async function getProfileImageUrls() {
    try {
      const response = await fetchUserProfileImages();
      console.log(response);
      setProfileImageUrls(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      ref={popoverRef}
      className="w-[28rem] h-max shadow-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] rounded-2xl bg-white pb-1 absolute top-full right-0 z-50"
    >
      {/* Top Section with Gradient */}
      <div
        className={`w-full h-[5.625rem] rounded-t-2xl bg-gradient-to-r from-white to-[#214768] ${
          !showEditDialog && "relative z-[1000]"
        }`}
      >
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
        <div className="absolute left-10 top-8 w-20 h-20 relative">
          <img
            src={profileImageUrl || ProfileImage}
            alt="Profile"
            className="w-full h-full rounded-full"
          />
          <div
            className="absolute h-5 w-5 right-0 bottom-2 cursor-pointer"
            onClick={() => setShowEditDialog(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="10" fill="#214768" />
              <path
                d="M11.6658 6.66737L13.3325 8.33403M10.5547 14.4451H14.9991M6.11024 12.2229L5.55469 14.4451L7.77691 13.8896L14.2136 7.45292C14.4219 7.24456 14.5389 6.96199 14.5389 6.66737C14.5389 6.37274 14.4219 6.09018 14.2136 5.88181L14.118 5.78626C13.9097 5.57795 13.6271 5.46094 13.3325 5.46094C13.0378 5.46094 12.7553 5.57795 12.5469 5.78626L6.11024 12.2229Z"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
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
          { label: "Gender", value: user.user.gender || "NA" },
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
        onClose={() => {
          if (showEditDialog) {
            setShowEditDialog(false);
          }
          setOpenToast(false);
        }}
        status={toastStatusMessage}
        message={toastMessage}
        statusType={toastStatusType}
        shouldCloseOnClickOfOutside={shouldSnackbarCloseOnClickOfOutside}
      />
      {showEditDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowEditDialog(false)} // CLOSE on backdrop click
        >
          <div
            className="bg-[#E6F4FF] pl-5 p-2 pt-3 rounded-lg shadow-xl w-80 h-max min-h-60"
            onClick={(e) => e.stopPropagation()} // PREVENT closing when clicking inside the modal
          >
            <div className="flex flex-wrap">
              {profileImageUrls.length > 0 ? (
                <>
                  {profileImageUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`w-[18%] aspect-square rounded-full mb-1 cursor-pointer hover:border border-black ${
                        index === 0 || index % 4 || 5 !== 0 ? "mr-1" : ""
                      }`}
                      onClick={() => {
                        dispatch(
                          updateProfileImageUrl({
                            userId: user.user.id,
                            payload: {
                              profile_image_url: url.profile_image_urls,
                            },
                          })
                        );
                        setShowEditDialog(false); // Optional: close after selection
                      }}
                    >
                      <img
                        src={url.profile_image_urls}
                        alt=""
                        style={{ height: "100%", width: "100%" }}
                        className="rounded-full"
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div>Currently no pics available</div>
              )}
            </div>
          </div>
        </div>
      )}      
    </div>
  );
}
