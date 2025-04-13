import ErrorIcon from "../../icons/ErrorIcon";
import WarningIcon from "../../icons/WarningIcon";

function WarningSnackbar() {
  return (
    <div className="w-[225px] h-[75px] bg-[#FDF8E8] rounded-[3.3152761459350586px] flex justify-between">
      <div class="bg-[#F2C94C] rounded-[3.3152761459350586px] h-full w-[1.5%] mr-[1rem]"></div>
      <div className="py-[1rem] flex items-center justify-start w-[90%]">
        <div className="mr-[1rem]">
          <WarningIcon/>
        </div>
        <div className="flex flex-col">
          <div class="text-[#000000] text-[11.9349946975708px] font-medium">
            Warning
          </div>
          <p class="text-[#000000] text-[7.956663131713867px] ">
            some status updated to some status
          </p>
        </div>
      </div>
    </div>
  );
}

export default WarningSnackbar;
