function PrimaryButton({ isActive=false,name, onClick }) {
    return (
      <div
        className={`w-[105px] h-10 p-2.5 cursor-pointer ${
          isActive ? "bg-[#2B323B] text-white" : "border border-[#2B323B] text-[#2B323B]"
        } rounded-[30px] justify-center items-center gap-2.5 inline-flex`}
        onClick={onClick}
      >
        <div className="text-xs font-normal poppins-thin leading-tight">
          {name}
        </div>
      </div>
    );
  }
  
  export default PrimaryButton;
  