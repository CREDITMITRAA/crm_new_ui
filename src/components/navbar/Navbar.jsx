import NotificationIcon from "../icons/NotificationIcon";
import ProfileIcon from "../icons/ProfileIcon";
import { useState } from "react";
import Profile from "./Profile";
import { useSelector } from "react-redux";
import CreateBackupButton from "../common/CreateBackupButton";
import Snackbar from "../common/snackbars/Snackbar";
import { createBackup } from "../../features/backups/backupsApi";
import { ROLE_ADMIN, ROLE_EMPLOYEE } from "../../utilities/AppConstants";
import CreateBackupIcon from "../icons/CreateBackupIcon";

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastStatusMessage, setToastStatusMessage] = useState(null);
  const [toastStatusType, setToastStatusType] = useState(null);
  const [
    shouldSnackbarCloseOnClickOfOutside,
    setShouldSnackbarCloseOnClickOfOutside,
  ] = useState(true);
  const { onlineUsers } = useSelector((state) => state.onlineUsers);
  const { users } = useSelector((state) => state.users);
  const { user: currentUser, role } = useSelector((state) => state.auth);

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const getUserColor = (userId) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[parseInt(userId) % colors.length];
  };

  const getOnlineUsersWithDetails = () => {
    const currentUserId = currentUser?.user?.id?.toString();

    return onlineUsers
      .filter((userId) => userId !== currentUserId)
      .map((userId) => {
        const user = users.find(
          (u) => u.id === userId || u.id === parseInt(userId)
        );
        return user ? { ...user, id: userId } : null;
      })
      .filter(Boolean)
      .slice(0, 7);
  };

  const onlineUsersWithDetails = getOnlineUsersWithDetails();
  const remainingCount = Math.max(
    0,
    onlineUsers.length - onlineUsersWithDetails.length - 1
  );

  async function handleClickOnCreateBackup() {
    setToastStatusType("INFO");
    setToastStatusMessage("In Progress...");
    setToastMessage("Creating Backup...");
    setShouldSnackbarCloseOnClickOfOutside(false);
    setOpenToast(true);
    try {
      const response = await createBackup({ isManualBackup: true });
      setToastStatusType("SUCCESS");
      setToastStatusMessage("Success...");
      setToastMessage("Created Backup...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    } catch (error) {
      console.log(error);
      setToastStatusType("ERROR");
      setToastStatusMessage("Error...");
      setToastMessage("Failed to create backup...");
      setShouldSnackbarCloseOnClickOfOutside(true);
    }
  }

  return (
    <>
      <div className="flex justify-end w-full bg-slate-300 h-11 rounded-2xl px-[1.25rem] py-[0.625rem] items-center shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
        {/* Online Users */}
        {currentUser?.user.role === ROLE_ADMIN && (
          <div className="w-[150px] h-[30px] relative flex items-center">
            {onlineUsersWithDetails.length > 0 ? (
              <>
                {onlineUsersWithDetails.map((user, index) => (
                  <div
                    key={user.id}
                    className="relative group"
                    style={{
                      position: "absolute",
                      right: `${index * 20}px`, // Changed from left to right
                      zIndex: onlineUsersWithDetails.length - index,
                    }}
                  >
                    <div className="relative">
                      <div
                        className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-medium ${getUserColor(
                          user.id
                        )}`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="w-2.5 h-2.5 absolute bottom-0 left-0 bg-[#19ff00] rounded-full border border-white" />

                      {/* Tooltip at bottom */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        {user.name}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-gray-800" />
                      </div>
                    </div>
                  </div>
                ))}
                {/* If you want to keep the "+X more" indicator, uncomment this and adjust positioning */}
                {/* {remainingCount > 0 && (
          <div
            className="absolute right-[140px] bg-purple-100 text-[#4300A0] text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center group"
            style={{ zIndex: onlineUsersWithDetails.length + 1 }}
          >
            +{remainingCount}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {remainingCount} more online
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-gray-800" />
            </div>
          </div>
        )} */}
              </>
            ) : (
              <div className="text-sm text-gray-500">
                {onlineUsers.length > 1
                  ? "Loading user data..."
                  : "No users online"}
              </div>
            )}
          </div>
        )}

        {/* Current User */}
        {/* {currentUser?.user && (
          <div className="relative mr-2 group">
            <div
              className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-medium ${getUserColor(
                currentUser.user.id
              )}`}
            >
              {getInitials(currentUser.user.name)}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {currentUser.user.name} (You)
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-gray-800" />
            </div>
          </div>
        )} */}

        {/* Notification Button */}
        {role === ROLE_EMPLOYEE && (
          <button 
          className="button-hover-shadow rounded-full flex items-center justify-center w-[2.25rem] h-[2.25rem] mr-[1.25rem] button-hover-shadow cursor-pointer"
          style={{backgroundColor:'unset', borderRadius: '50%'}}
          >
            <NotificationIcon className="text-[#464646]" />
          </button>
        )}

        {/* Profile Button */}
        <button
          className="button-hover-shadow rounded-full flex items-center justify-center w-[2.25rem] h-[2.25rem] cursor-pointer mx-2 "
          style={{backgroundColor:'unset', borderRadius: '50%'}}
        >
          <ProfileIcon className="text-[#4300A0]" onClick={() => setShowProfile(!showProfile)}/>
        </button>

        {/* Profile Component */}
        {showProfile && (
          <div className="absolute top-[70px] right-[16px] z-50">
            <Profile onClose={() => setShowProfile(false)} />
          </div>
        )}

        {currentUser?.user.role === ROLE_ADMIN && (
          <button className="w-[2.25rem] h-[2.25rem] rounded-full flex justify-center items-center button-hover-shadow"
          style={{backgroundColor:'unset', borderRadius: '50%'}}
          >
            {/* <CreateBackupButton onClick={() => handleClickOnCreateBackup()} /> */}
            <CreateBackupIcon onClick={() => handleClickOnCreateBackup()} />
          </button>
        )}
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

export default Navbar;
