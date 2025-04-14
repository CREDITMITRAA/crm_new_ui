function PrimaryButton({
  isActive = false,
  name,
  onClick,
  backgroundColor = "#2B323B",
  showBoxShadow = false,
}) {
  return (
    <div
      className={`w-[105px] h-9 p-2.5 cursor-pointer ${
        isActive ? "text-white" : "text-[#2B323B]"
      } rounded-[30px] justify-center items-center gap-2.5 inline-flex`}
      onClick={onClick}
      style={{
        backgroundColor: isActive ? backgroundColor : "transparent",
        boxShadow: isActive
          ? `1px 1px 4px 0px #0000001A,
             3px 5px 6px 0px #00000017,
             8px 12px 9px 0px #0000000D,
             13px 22px 10px 0px #00000003,
             21px 34px 1px 0px #00000000`
          : "none",
      }}
    >
      <div className="text-xs font-normal poppins-thin leading-tight text-[#464646]">
        {name}
      </div>
    </div>
  );
}

export default PrimaryButton
