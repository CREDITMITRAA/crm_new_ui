import { useSelector } from "react-redux";

const ProfileIcon = ({ className, onClick }) => {
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  return (
    <div className={`${!isConfirmationDialogueOpened && "relative"} group`}>
      <div onClick={onClick}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.33594 15.0052C3.33594 14.1212 3.68713 13.2733 4.31225 12.6482C4.93737 12.0231 5.78522 11.6719 6.66927 11.6719H13.3359C14.22 11.6719 15.0678 12.0231 15.693 12.6482C16.3181 13.2733 16.6693 14.1212 16.6693 15.0052C16.6693 15.4472 16.4937 15.8712 16.1811 16.1837C15.8686 16.4963 15.4446 16.6719 15.0026 16.6719H5.0026C4.56058 16.6719 4.13665 16.4963 3.82409 16.1837C3.51153 15.8712 3.33594 15.4472 3.33594 15.0052Z"
            stroke="#464646"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <path
            d="M10 8.33594C11.3807 8.33594 12.5 7.21665 12.5 5.83594C12.5 4.45523 11.3807 3.33594 10 3.33594C8.61929 3.33594 7.5 4.45523 7.5 5.83594C7.5 7.21665 8.61929 8.33594 10 8.33594Z"
            stroke="#464646"
            stroke-width="1.5"
          />
        </svg>
      </div>
      <div className="absolute top-full left-1/4 transform -translate-x-[35%] mt-4 px-2 py-1 bg-[#EBEBEB] text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        {"Profile"}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
      </div>
    </div>
  );
};

export default ProfileIcon;
