import { useSelector } from "react-redux";

function AddEmployeeButton({ onClick }) {
  const { isConfirmationDialogueOpened, isProfileDialogueOpened } = useSelector(
    (state) => state.ui
  );

  return (
    <div
      className={`w-10 h-10 flex items-center justify-center cursor-pointer hover:border border-[#646CFF] rounded-[9px] ${
        !isConfirmationDialogueOpened && "relative group"
      }`}
      style={{
        zIndex:
          isConfirmationDialogueOpened || isProfileDialogueOpened ? -1 : 2,
      }}
    >
      <div 
        onClick={onClick}
        className="w-full h-full flex items-center justify-center"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.167 10.8337H5.00033C4.76422 10.8337 4.56644 10.7537 4.407 10.5937C4.24755 10.4337 4.16755 10.2359 4.167 10.0003C4.16644 9.76477 4.24644 9.567 4.407 9.40699C4.56755 9.24699 4.76533 9.167 5.00033 9.167H9.167V5.00033C9.167 4.76422 9.24699 4.56644 9.40699 4.407C9.567 4.24755 9.76477 4.16755 10.0003 4.167C10.2359 4.16644 10.4339 4.24644 10.5945 4.407C10.7551 4.56755 10.8348 4.76533 10.8337 5.00033V9.167H15.0003C15.2364 9.167 15.4345 9.24699 15.5945 9.40699C15.7545 9.567 15.8342 9.76477 15.8337 10.0003C15.8331 10.2359 15.7531 10.4339 15.5937 10.5945C15.4342 10.7551 15.2364 10.8348 15.0003 10.8337H10.8337V15.0003C10.8337 15.2364 10.7537 15.4345 10.5937 15.5945C10.4337 15.7545 10.2359 15.8342 10.0003 15.8337C9.76477 15.8331 9.567 15.7531 9.40699 15.5937C9.24699 15.4342 9.167 15.2364 9.167 15.0003V10.8337Z"
            fill="#464646"
          />
        </svg>
      </div>
      
      {/* Tooltip positioned outside the clickable area but controlled by group hover */}
      <div className="absolute top-full left-1/4 transform -translate-x-[35%] mt-2 px-2 py-1 bg-[#EBEBEB] text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
        {"Add"}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
      </div>
    </div>
  );
}

export default AddEmployeeButton;