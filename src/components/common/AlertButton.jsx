import AlertIcon from "../icons/AlertIcon"

function AlertButton({onClick}){
    return (
        <button className="w-10 h-10 bg-[#2147681A] rounded-[9px] flex justify-center items-center cursor-pointer" onClick={onClick}>
            <AlertIcon/>  
        </button>
    )
}

export default AlertButton