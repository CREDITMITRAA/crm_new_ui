import AssignToIcon from "../icons/AssignToIcon"

function AssignToButton({onClick}){
    return (
        <button className="w-10 h-10 bg-[#1B86FF] rounded-[9px] flex justify-center items-center cursor-pointer" onClick={onClick} style={{backgroundColor:'unset'}}>
             <AssignToIcon/>
        </button>
    )
}

export default AssignToButton