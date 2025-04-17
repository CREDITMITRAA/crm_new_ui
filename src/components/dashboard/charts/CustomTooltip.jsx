function CustomTooltip({ active, payload, activeBadges }){
    if (!active || !payload || payload.length === 0) return null;
  
    const data = payload[0].payload; // Extract data from payload
    console.log('data in custom ttoltip = ', data);
    const hasData =
      (activeBadges.approved && data.interested > 0) ||
      (activeBadges.walkinsScheduled && data.walkinsScheduled > 0) ||
      (activeBadges.walkinsToday && data.walkinsToday > 0);

    if (!hasData) {
      return null;
    }
  
    return (
      <div className="bg-[#FAFAFA] border border-[#214768] rounded-[10px] py-[0.625rem] px-[0.938rem] w-max shadow-md">
        {/* Name */}
        <div className="text-[#214768] text-sm font-medium mb-2">
          {data.name}
        </div>
  
        {/* Data Items */}
        <div className="text-[#214768] text-[10px] font-medium grid grid-cols-[auto_min-content_auto] gap-x-1 gap-y-1">
          <span>Approved for Walk-In</span> <span>:</span> <span>{data.interested}</span>
          <span>Walk-Ins Today</span> <span>:</span> <span>{data.walkinsToday}</span>
          <span>Walk-Ins Scheduled Today</span> <span>:</span> <span>{data.walkinsScheduled}</span>
        </div>
      </div>
    );
  };

  export default CustomTooltip