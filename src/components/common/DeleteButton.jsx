import { useSelector } from "react-redux";
import DeleteIcon from "../icons/DeleteIcon";

function DeleteButton({ height = "h-10", onClick, color=null }) {
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  return (
    <div className={`w-10 ${height} bg-none rounded-[9px] flex justify-center items-center cursor-pointer hover:border border-[#646CFF] ${!isConfirmationDialogueOpened && 'relative group'}`} onClick={onClick} style={{backgroundColor:'unset'}}>
      <DeleteIcon color={color && color}/>
      <div className="absolute top-full left-1/4 transform -translate-x-[35%] mt-2 px-2 py-1 bg-[#EBEBEB] text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        {"Delete"}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
      </div>
    </div>
  );
}

export default DeleteButton;
