import { useSelector } from "react-redux";
import UserProfileAvatar from "../../assets/images/user_profile.png";

function UserProfile({ onClick, showLabel = true }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full h-[42px] justify-center items-center gap-1 inline-flex">
      {showLabel && (
        <>
          <div className="h-max w-max bg-[#ffb21f] rounded-[99px] justify-center items-center flex overflow-hidden">
            <img className="w-[1.5rem] h-[1.5rem]" src={UserProfileAvatar} />
          </div>
          <div className="w-max grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
            <div className="self-stretch text-slate-500 text-[8px] font-medium poppins-thin leading-tight">
              Welcome back 👋
            </div>
            <div className="self-stretch text-[#080f20] text-xs font-medium poppins-thin leading-tight">
              {user?.user.name}
            </div>
          </div>
        </>
      )}
      <div className="relative group">
        <div
          className="cursor-pointer p-1" // hover:border border-[#646CFF] rounded-[9px]
          onClick={onClick}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16667 17.5C3.70833 17.5 3.31611 17.3369 2.99 17.0108C2.66389 16.6847 2.50056 16.2922 2.5 15.8333V4.16667C2.5 3.70833 2.66333 3.31611 2.99 2.99C3.31667 2.66389 3.70889 2.50056 4.16667 2.5H9.16667C9.40278 2.5 9.60083 2.58 9.76083 2.74C9.92083 2.9 10.0006 3.09778 10 3.33333C9.99944 3.56889 9.91944 3.76694 9.76 3.9275C9.60056 4.08806 9.40278 4.16778 9.16667 4.16667H4.16667V15.8333H9.16667C9.40278 15.8333 9.60083 15.9133 9.76083 16.0733C9.92083 16.2333 10.0006 16.4311 10 16.6667C9.99944 16.9022 9.91944 17.1003 9.76 17.2608C9.60056 17.4214 9.40278 17.5011 9.16667 17.5H4.16667ZM14.3125 10.8333H8.33333C8.09722 10.8333 7.89944 10.7533 7.74 10.5933C7.58056 10.4333 7.50056 10.2356 7.5 10C7.49944 9.76444 7.57944 9.56667 7.74 9.40667C7.90056 9.24667 8.09833 9.16667 8.33333 9.16667H14.3125L12.75 7.60417C12.5972 7.45139 12.5208 7.26389 12.5208 7.04167C12.5208 6.81944 12.5972 6.625 12.75 6.45833C12.9028 6.29167 13.0972 6.20472 13.3333 6.1975C13.5694 6.19028 13.7708 6.27028 13.9375 6.4375L16.9167 9.41667C17.0833 9.58333 17.1667 9.77778 17.1667 10C17.1667 10.2222 17.0833 10.4167 16.9167 10.5833L13.9375 13.5625C13.7708 13.7292 13.5731 13.8092 13.3442 13.8025C13.1153 13.7958 12.9172 13.7089 12.75 13.5417C12.5972 13.375 12.5244 13.1772 12.5317 12.9483C12.5389 12.7194 12.6186 12.5283 12.7708 12.375L14.3125 10.8333Z"
              fill="#64748B"
            />
          </svg>
        </div>
        {/* Tooltip */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-[#EBEBEB] text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
          {"Logout"}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
