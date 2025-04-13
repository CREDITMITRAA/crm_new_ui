function PopupButton({
  name,
  isPrimary = false,
  onClick,
  backgroundColor = "#32086d",
  disabled = false,
  className,
  borderColor="#32086d",
  textColor="#32086d"
}) {
  return (
    <div
      className={`h-8 px-[30px] py-2.5 rounded-[5px] justify-center items-center gap-2.5 inline-flex w-full
        ${isPrimary ? "text-white" : `border border-[${borderColor}] text-[${textColor}]`} 
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
      style={isPrimary ? { backgroundColor } : {}}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="text-[10px] font-semibold inter-inter">{name}</div>
    </div>
  );
}

export default PopupButton;
