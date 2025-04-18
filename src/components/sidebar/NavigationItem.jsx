function NavigationItem({ name, icon, isActive, onClick, showLabel = true }) {
  return (
    <div
      className={`group relative w-full h-[2.75rem] ${
        showLabel ? "pl-1 justify-start" : "justify-center"
      } rounded-[99px] items-center inline-flex mb-[0.625rem] cursor-pointer ${
        isActive ? "bg-slate-200 text-[#4200a0]" : "text-[#4D5A6E]"
      }`}
      onClick={onClick}
    >
      <div
        className={`h-5 items-center gap-3 flex ${
          isActive ? "text-zinc-600" : "text-slate-600"
        }`}
      >
        {icon}
        {showLabel && (
          <div className="text-[10px] font-medium poppins-thin leading-tight">
            {name}
          </div>
        )}
      </div>

      {/* Tooltip - only shows when labels are hidden */}
      {!showLabel && (
        <div className={`absolute top-full left-1/2 transform -translate-x-1/4 ${isActive ? 'mt-2' : 'mt-0'} px-2 py-1 bg-slate-200 text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none`}>
          {name}
          <div className="absolute bottom-full left-1/4 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
        </div>
      )}
    </div>
  );
}

export default NavigationItem;