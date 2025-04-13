import ErrorIcon from "../../icons/ErrorIcon";

function ErrorSnackbar() {
  return (
    <div className="w-[225px] h-[75px] bg-[#FDEFEF] rounded-[3.3152761459350586px] flex justify-between">
      <div class="bg-[#EB5757] rounded-[3.3152761459350586px] h-full w-[1.5%] mr-[1rem]"></div>
      <div className="py-[1rem] flex items-center justify-start w-[90%]">
        <div className="mr-[1rem]">
          <ErrorIcon/>
        </div>
        <div className="flex flex-col">
          <div class="text-[#000000] text-[11.9349946975708px] font-medium">
            Error
          </div>
          <p class="text-[#000000] text-[7.956663131713867px] ">
            some status updated to some status
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorSnackbar;
