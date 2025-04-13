function DownloadDocumentButton({onClick}) {
  return (
    <div className="w-[136px] h-10 px-[30px] py-2.5 bg-[#214768] rounded-[10px] justify-center items-center gap-2.5 inline-flex cursor-pointer" onClick={onClick}>
      <div data-svg-wrapper className="relative">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.25 13.25H12.25M3.75 6.75L7.75 10.25M7.75 10.25L11.75 6.75M7.75 10.25V1.75"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div className="text-white text-xs font-semibold poppins-thin leading-tight">
        Download
      </div>
    </div>
  );
}

export default DownloadDocumentButton;
