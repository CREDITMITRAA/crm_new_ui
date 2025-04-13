import { format } from "date-fns";

function TimeSelector({ label = "Start Time", date }) {
    return (
      <div className="relative inline-block poppins-thin">
        {/* Label (Start Time or End Time) */}
        <div className="absolute -top-2 left-2 bg-[#CED8E6] px-1 text-[10px] font-medium text-[#202223] rounded-[3px]">
          {label}
        </div>
  
        {/* Main Box */}
        <div className="bg-[#D0E3F2] border border-[#214768] rounded-md px-3 py-2 flex gap-x-4">
          <span className="text-[#202223] text-xs font-medium">
            {date ? format(date, "dd-MMM-yy") : "dd-mm-yy"}
          </span>
        </div>
      </div>
    );
  }

  export default TimeSelector