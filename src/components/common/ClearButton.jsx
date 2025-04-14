import { useSelector } from "react-redux";
import ClearIcon from "../icons/ClearIcon";

function ClearButton({ onClick }) {
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  
  return (
    <div className={`${!isConfirmationDialogueOpened && 'relative group'} w-10 h-10`}>
      <button
        className="w-full h-full rounded-[9px] flex justify-center items-center px-2 cursor-pointer hover:border border-[#646CFF]"
        onClick={onClick}
        style={{ backgroundColor: 'unset' }}
      >
        <ClearIcon />
      </button>
      
      {/* Tooltip - positioned outside clickable area but controlled by group hover */}
      <div className="absolute top-full left-1/3 transform -translate-x-[35%] mt-2 px-2 py-1 bg-[#EBEBEB] text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
        {"Clear"}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
      </div>
    </div>
  );
}

export default ClearButton;