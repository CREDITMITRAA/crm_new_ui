import DownloadIcon from "../icons/DownloadIcon";

function DownloadButton({onClick}) {
  return (
    <div className="w-[139px] h-[30px] bg-[#214768] rounded-[5px] flex items-center relative px-3 cursor-pointer" onClick={onClick}>
      {/* Centering text absolutely */}
      <span className="text-white text-[10px] font-medium poppins-thin absolute left-1/2 transform -translate-x-1/2">
        Download
      </span>
      {/* Icon stays at right */}
      <div className="ml-auto">
        <DownloadIcon />
      </div>
    </div>
  );
}

export default DownloadButton;
