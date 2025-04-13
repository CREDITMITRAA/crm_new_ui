import { useSelector } from "react-redux";

const NotificationIcon = ({ className }) => {
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  return (
    <div className={`${!isConfirmationDialogueOpened && "relative"} group`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={`${className}`} // Dynamic Tailwind class
      >
        <path
          fill="currentColor" // Uses text color dynamically
          d="M10.146 3.248a2 2 0 0 1 3.708 0A7 7 0 0 1 19 10v4.697l1.832 2.748A1 1 0 0 1 20 19h-4.535a3.501 3.501 0 0 1-6.93 0H4a1 1 0 0 1-.832-1.555L5 14.697V10c0-3.224 2.18-5.94 5.146-6.752M10.586 19a1.5 1.5 0 0 0 2.829 0zM12 5a5 5 0 0 0-5 5v5a1 1 0 0 1-.168.555L5.869 17H18.13l-.963-1.445A1 1 0 0 1 17 15v-5a5 5 0 0 0-5-5"
        />
      </svg>
      <div className="absolute top-full left-1/2 transform -translate-x-[35%] mt-2 px-2 py-1 bg-[#EBEBEB] text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        {"Notification"}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
      </div>
    </div>
  );
};

export default NotificationIcon;
