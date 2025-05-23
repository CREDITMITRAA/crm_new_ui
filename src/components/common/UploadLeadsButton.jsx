import { useRef } from "react";
import UploadLeadsIcon from "../icons/UploadLeadsIcon";
import { useSelector } from "react-redux";

function UploadLeadsButton({ onFileUpload }) {
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <button className={`${!isConfirmationDialogueOpened && 'relative group'} w-10 h-10`} style={{backgroundColor:'unset'}}>
      {/* Invisible File Input */}
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={(e) => onFileUpload(e)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />

      {/* Visible Button */}
      <div
        className="w-full h-full rounded-[9px] flex justify-center items-center cursor-pointer hover:border border-[#646CFF]"
        onClick={handleClick}
        style={{ backgroundColor: 'unset' }}
      >
        <UploadLeadsIcon />
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full left-1/3 transform -translate-x-[35%] mt-2 px-2 py-1 bg-[#EBEBEB] text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
        {"Upload"}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
      </div>
    </button>
  );
}

export default UploadLeadsButton;