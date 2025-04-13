import InfoIcon from "../icons/InfoIcon"

function InfoButton({onClick}){
    return (
        <button className="w-10 h-10 bg-[#2147681A] rounded-[9px] flex justify-center items-center cursor-pointer" onClick={onClick}>
            <InfoIcon/>
        </button>
    )
}

export default InfoButton