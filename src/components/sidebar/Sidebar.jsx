import { useEffect, useState } from "react";
import company_logo from "../../assets/images/company_logo.png";
import DashboardIcon from "../icons/DashboardIcon";
import LeadsIcon from "../icons/LeadsIcon";
import Verification1Icon from "../icons/Verification1Icon";
import WalkInsIcon from "../icons/WalkInsIcon";
import EmployeesIcon from "../icons/EmployeesIcon";
import NavigationItem from "./NavigationItem";
import UserProfile from "./UserProfile";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmationDialogue from "../common/dialogues/ConfirmationDialogue";
import AlertButton from "../common/AlertButton";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import store from "../../store/store";
import { ROLE_EMPLOYEE } from "../../utilities/AppConstants";
import company_logo_icon from "../../assets/images/company_logo_icon.png"

function Sidebar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  function getActiveItem() {
    return localStorage.getItem("activeSidebarItem") || "Dashboard";
  }
  const [activeItem, setActiveItem] = useState(getActiveItem); // Default active item
  const [showConfirmationDialogue, setShowConfirmationDialogue] =
    useState(false);
  const [confirmationDialogueMessage, setConfirmationDialogueMessage] =
    useState(null);

  useEffect(() => {
    const activeNavItem = navigationItems.find(
      (item) => item.navigateTo === location.pathname
    );
    if (activeNavItem) {
      setActiveItem(activeNavItem.itemName);
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("activeSidebarItem", activeItem);
  }, [activeItem]);

  const navigationItems = [
    { itemName: "Dashboard", icon: DashboardIcon, navigateTo: "/dashboard" },
    { itemName: "Pipeline Entries", icon: LeadsIcon, navigateTo: "/leads" },
    {
      itemName: "Preliminary Check",
      icon: Verification1Icon,
      navigateTo: "/verification-1",
    },
    { itemName: "Appointments", icon: WalkInsIcon, navigateTo: "/walk-ins" },
    {
      itemName: "Client Executives",
      icon: EmployeesIcon,
      navigateTo: "/employees",
    },
  ];

  const filteredNavigationItems =
    user?.user.role === ROLE_EMPLOYEE
      ? navigationItems.filter((item) => item.itemName !== "Client Executives")
      : navigationItems;

  function handleClickOnLogout() {
    setConfirmationDialogueMessage("You are about to logout from CRM ?");
    setShowConfirmationDialogue(true);
  }

  function handleClickOnSubmit() {
    dispatch(logout());
    // store.dispatch({type:'RESET_STORE'})
  }

  return (
    <div
      className="flex bg-[#CED8E6] h-full rounded-2xl flex-col px-2 py-[2.5rem] pt-0 justify-between overflow-visible shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
      //   style={{
      //     boxShadow: `
      //   7px 14px 33px 0px rgba(0, 0, 0, 0.15),
      //   26px 55px 61px 0px rgba(0, 0, 0, 0.13),
      //   59px 123px 82px 0px rgba(0, 0, 0, 0.08),
      //   105px 219px 97px 0px rgba(0, 0, 0, 0.02),
      //   164px 342px 106px 0px rgba(0, 0, 0, 0)
      // `,
      //   }}
    >
      <div>
        {/* COMPANY LOGO */}
        <div className="mb-[3.75rem]" style={{scale:0.7}}>
          <img src={company_logo_icon} alt="Company Logo" />
        </div>

        {/* NAVIGATION TABS */}
        {filteredNavigationItems.map((item) => {
          const IconComponent = item.icon; // Get the icon component
          return (
            <NavigationItem
              key={item.itemName}
              name={item.itemName}
              icon={
                <IconComponent
                  color={activeItem === item.itemName ? "#464646" : "#4D5A6E"}
                />
              }
              isActive={activeItem === item.itemName}
              onClick={() => {
                setActiveItem(item.itemName);
                navigate(item.navigateTo);
              }}
              showLabel={false}
            />
          );
        })}
      </div>

      {/* LOGOUT BUTTON SECTION */}
      <div className="flex justify-center items-center">
        <UserProfile onClick={() => handleClickOnLogout()} showLabel={false}/>
      </div>

      {showConfirmationDialogue && (
        <ConfirmationDialogue
          onClose={() => setShowConfirmationDialogue(false)}
          message={confirmationDialogueMessage}
          onSubmit={() => handleClickOnSubmit()}
          button={<AlertButton />}
          disabled={false}
          buttonName="Logout"
          buttonBackgroundColor="#214768"
        />
      )}
    </div>
  );
}

export default Sidebar;
