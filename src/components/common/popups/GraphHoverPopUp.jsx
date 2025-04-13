function GraphHoverPopUp() {
  return (
    <div className="bg-[#F4EBFF] border border-[#32086D] rounded-[10px] py-[0.625rem] px-[0.938rem] w-max">
      {/* Name */}
      <div className="text-[#4300A0] text-sm font-medium mb-2">
        Priyanka Kumari
      </div>

      {/* Data Items with Proper Alignment */}
      <div className="text-[#32086D] text-[10px] font-medium grid grid-cols-[auto_min-content_auto] gap-x-1 gap-y-1">
        <span>Call done</span> <span>:</span> <span>876</span>
        <span>Connected</span> <span>:</span> <span>472</span>
        <span>Interested</span> <span>:</span> <span>20</span>
      </div>
    </div>
  );
}

export default GraphHoverPopUp;
