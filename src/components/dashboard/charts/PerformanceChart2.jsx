import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../common/loaders/Loader";
import {
  exportActivityDataToExcel,
  formatDatePayload,
  isEmpty,
} from "../../../utilities/utility-functions";
import EmptyDataMessageIcon from "../../icons/EmptyDataMessageIcon";
import ChartStatusBadge from "./ChartStatusBadge";
import { getChartDataByChartType } from "../../../features/charts/chartsThunk";
import { fill } from "lodash";
import CustomTick from "./CustomTick";
import { ROLE_EMPLOYEE } from "../../../utilities/AppConstants";
import DateButton from "../../common/DateButton";
import FilterButton from "../../common/FiltersButton";
import ClearButton from "../../common/ClearButton";
import ExportButton from "../../common/ExportButton";
import FilterDialogueForCharts from "./FilterDialogueForCharts";
import * as XLSX from "xlsx";

const CustomYAxisTick = ({ x, y, payload }) => (
  <text
    x={x}
    y={y}
    dy="0.32em"
    textAnchor="end"
    fill="#464646"
    className="text-[10px] leading-5"
  >
    <tspan className="text-[#464646]">{payload.value}</tspan>
  </text>
);

const CombinedBar = (props) => {
  const { x, y, width, height, data, activeBadges, maxValue } = props;

  // Calculate max value only from active badges with non-zero values
  console.log('active badges = ', activeBadges, ' data = ', data);
  
  // const maxValue = Math.max(
  //   ...[
  //     activeBadges.calls_done && data.callsDone > 0 ? data.callsDone : 0,
  //     activeBadges.connected && data.connected > 0 ? data.connected : 0,
  //     activeBadges.interested && data.interested > 0 ? data.interested : 0,
  //   ].filter((val) => val > 0),
  //   0
  // );

  if (maxValue === 0) return null;
  console.log('max value = ', maxValue);
  

  // Calculate heights and positions
  const callsDoneHeight = activeBadges.calls_done
    ? (data.callsDone / maxValue) * height
    : 0;
  const connectedHeight = activeBadges.connected
    ? (data.connected / maxValue) * height
    : 0;
  const interestedHeight = activeBadges.interested
    ? (data.interested / maxValue) * height
    : 0;

    console.log('call done height = ', callsDoneHeight);
    console.log('connected height = ', connectedHeight);
    console.log('interested height = ', interestedHeight);
    
    
    

  const callsDoneY = y + height - callsDoneHeight;
  const connectedY = y + height - connectedHeight;
  const interestedY = y + height - interestedHeight;

  // Shadow configuration
  const shadowOpacity = 0.2;
  const minHeightForShadow = 15; // Minimum bar height to show shadow
  const maxShadowHeight = 60; // Maximum shadow height in pixels

  // Dynamic shadow height calculation (capped percentage of bar height)
  const getShadowHeight = (barHeight) => {
    if (barHeight < minHeightForShadow) return 0;
    const proportionalHeight = Math.min(barHeight * 0.5, maxShadowHeight);
    return Math.max(proportionalHeight, 3); // Ensure minimum 3px if visible
  };

  // Shadow gradient definition
  const ShadowGradient = ({ id }) => (
    <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#000000" stopOpacity={shadowOpacity} />
      <stop
        offset="80%"
        stopColor="#000000"
        stopOpacity={shadowOpacity * 0.3}
      />
      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
    </linearGradient>
  );

  // Bar with shadow component
  const BarWithShadow = ({ yPos, barHeight, fill, id }) => {
    const shadowH = getShadowHeight(barHeight);
    const shouldShowShadow = shadowH > 0 && barHeight > 0;

    return (
      <>
        <rect
          x={x}
          y={yPos}
          width={width}
          height={barHeight}
          fill={fill}
          rx="10"
          ry="10"
        />
        {shouldShowShadow && (
          <rect
            x={x}
            y={yPos}
            width={width}
            height={shadowH}
            fill={`url(#${id})`}
            rx="10"
            ry="10"
          />
        )}
      </>
    );
  };

  return (
    <g>
      <defs>
        <ShadowGradient id="callsDoneShadow" />
        <ShadowGradient id="connectedShadow" />
        <ShadowGradient id="interestedShadow" />
      </defs>

      {/* Render bars with dynamic shadows */}
      {activeBadges.calls_done && data.callsDone > 0 && (
        <BarWithShadow
          yPos={callsDoneY}
          barHeight={callsDoneHeight}
          fill="#E2E3DE"
          id="callsDoneShadow"
        />
      )}

      {activeBadges.connected && data.connected > 0 && (
        <BarWithShadow
          yPos={connectedY}
          barHeight={connectedHeight}
          fill="#B0CCE1"
          id="connectedShadow"
        />
      )}

      {activeBadges.interested && data.interested > 0 && (
        <BarWithShadow
          yPos={interestedY}
          barHeight={interestedHeight}
          fill="#9D9D9D"
          id="interestedShadow"
        />
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload, label, activeBadges }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    // Check if there's any data to show based on active badges
    const hasData =
      (activeBadges.calls_done && data.callsDone > 0) ||
      (activeBadges.connected && data.connected > 0) ||
      (activeBadges.interested_leads && data.interested > 0);

    if (!hasData) {
      return null;
    }

    return (
      <div className="bg-[#FAFAFA] border border-[#214768] rounded-[10px] py-[0.625rem] px-[0.938rem] w-max shadow-md">
        <p className="text-[#214768] text-sm font-medium mb-2">{label}</p>
        {/* {activeBadges.calls_done && data.callsDone > 0 && (
          <div className="flex items-center mb-1">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
            <span>Calls done: {data.callsDone}</span>
          </div>
        )}
        {activeBadges.connected && data.connected > 0 && (
          <div className="flex items-center mb-1">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: "#cbd5e1" }}
            ></div>
            <span>Connected: {data.connected}</span>
          </div>
        )}
        {activeBadges.interested && data.interested > 0 && (
          <div className="flex items-center">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: "#a3a3a3" }}
            ></div>
            <span>Interested: {data.interested}</span>
          </div>
        )} */}
        <div className="text-[#214768] text-[10px] font-medium grid grid-cols-[auto_min-content_auto] gap-x-1 gap-y-1">
          <span>Call done</span> <span>:</span> <span>{data.callsDone}</span>
          <span>Connected</span> <span>:</span> <span>{data.connected}</span>
          <span>Interested</span> <span>:</span> <span>{data.interested}</span>
        </div>
      </div>
    );
  }
  return null;
};

const PerformanceChartHorizontal = (
  {
    // filters,
    // setShowDot,
    // setFilters,
    // exportData,
    // setExportData,
  }
) => {
  const dispatch = useDispatch();
  const { loading, data: originalData } = useSelector((state) => state.charts);
  const { isProfileDialogueOpened, isConfirmationDialogueOpened } = useSelector(
    (state) => state.ui
  );
  const { users } = useSelector((state) => state.users);
  const { role } = useSelector((state) => state.auth);
  const [activeBadges, setActiveBadges] = useState({
    calls_done: true,
    connected: true,
    interested: true,
  });
  const [filters, setFilters] = useState({});
  const [resetFilters, setResetFilters] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [exportData, setExportData] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'callsDone',
    direction: 'desc',
  });

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format: yyyy-mm-dd
    setFilters((prev) => ({ ...prev, date: formattedDate }));
    dispatch(getChartDataByChartType({ date: formattedDate }));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getChartDataByChartType({ ...filters }));
      const filteredFilters = Object.keys(filters)?.reduce((acc, key) => {
        const value = filters[key];
        if (
          !["date", "date_time_range"].includes(key) &&
          value != null &&
          value !== ""
        ) {
          acc[key] = value;
        }
        return acc;
      }, {});
      setShowDot(Object.keys(filteredFilters).length > 0);
      isEmpty(originalData.calls_done) &&
        isEmpty(originalData.connected_calls) &&
        isEmpty(originalData.interested_leads);
    }, 500);

    return () => clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    if (exportData) {
      exportToExcel();
      setExportData(false);
    }
  }, [exportData]);
  


  const handleBadgeClick = (badgeType) => {
    setActiveBadges((prev) => ({
      ...prev,
      [badgeType]: !prev[badgeType],
    }));
    requestSort(badgeType)
  };

  function handleDateChange(fieldName, data) {
    console.log("selected dates = ", data);
    console.log("converted date time = ", formatDatePayload(data));
    const date_filter = formatDatePayload(data);
    setFilters((prev) => ({ ...prev, ...date_filter }));
  }

  function handleResetFilters() {
    let initialFilters = {};
    setFilters(initialFilters);
    setResetFilters(true);
    setTimeout(() => {
      setResetFilters(false);
    }, 500);
    setShowFilter(false);
  }

  const usersMap = useMemo(() => {
    return new Map(users.map((user) => [user.id, user.name]));
  }, [users]);

  const transformedData = useMemo(() => {
    if (!originalData) return [];

    const getCountByUserId = (array, userId) => {
      if (!array) return 0;
      const item = array.find((item) => item?.created_by === userId);
      return item ? item.count : 0;
    };

    // Get all unique user IDs from all data sources
    const allUserIds = [
      ...new Set([
        ...(originalData.calls_done || []).map((item) => item?.created_by),
        ...(originalData.connected_calls || []).map((item) => item?.created_by),
        ...(originalData.interested_leads || []).map(
          (item) => item?.created_by
        ),
        ...(originalData.walkins_scheduled_today || []).map(
          (item) => item?.created_by
        ),
        ...(originalData.walkins_today || []).map((item) => item?.created_by),
        ...(originalData.approved_for_walk_ins || []).map(
          (item) => item?.created_by
        ),
      ]),
    ];

    return allUserIds.map((userId) => ({
      name: usersMap.get(userId) || `User ${userId}`,
      callsDone: getCountByUserId(originalData.calls_done, userId),
      connected: getCountByUserId(originalData.connected_calls, userId),
      interested: getCountByUserId(originalData.interested_leads, userId),
      walkinsScheduled: getCountByUserId(originalData.walkins_scheduled_today, userId),
      walkinsToday: getCountByUserId(originalData.walkins_today, userId),
    })).sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [originalData, usersMap]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const maxValue = useMemo(() => {
    return Math.max(
      ...transformedData.flatMap(item => [
        item.callsDone,
        item.connected,
        item.interested
      ]),
      1 // Ensure we don't divide by zero
    );
  }, [transformedData]);

  const chartConfig = useMemo(() => {
    const dataLength = transformedData.length;
    const activeBarCount = Object.values(activeBadges).filter(Boolean).length;

    return {
      barSize: dataLength <= 5 ? 30 : 15,
      barCategoryGap: dataLength <= 5 ? "30%" : "15%",
      barGap: activeBarCount > 1 ? (dataLength <= 5 ? 15 : 0) : 0,
      margin: {
        top: 20,
        right: 20,
        left: dataLength <= 5 ? 100 : 60,
        bottom: 20,
      },
    };
  }, [transformedData.length, activeBadges]);

  const exportToExcel = () => {
    if (!transformedData.length) return;

    // Prepare more detailed data for export
    const exportData = transformedData.map((item) => ({
      "Employee Name": item.name,
      "Total Calls Done": item.callsDone,
      "Connected Calls": item.connected,
      "Interested Leads": item.interested,
      "Walk-ins Scheduled": item.walkinsScheduled,
      "Walk-ins Completed": item.walkinsToday,
      "Conversion Rate (%)": item.callsDone
        ? ((item.interested / item.callsDone) * 100).toFixed(2)
        : "0.00",
    }));

    // Add summary row
    const summaryRow = {
      "Employee Name": "TOTAL",
      "Total Calls Done": transformedData.reduce(
        (sum, item) => sum + item.callsDone,
        0
      ),
      "Connected Calls": transformedData.reduce(
        (sum, item) => sum + item.connected,
        0
      ),
      "Interested Leads": transformedData.reduce(
        (sum, item) => sum + item.interested,
        0
      ),
      "Walk-ins Scheduled": transformedData.reduce(
        (sum, item) => sum + item.walkinsScheduled,
        0
      ),
      "Walk-ins Completed": transformedData.reduce(
        (sum, item) => sum + item.walkinsToday,
        0
      ),
      "Conversion Rate (%)": transformedData.reduce(
        (sum, item) => sum + item.callsDone,
        0
      )
        ? (
            (transformedData.reduce((sum, item) => sum + item.interested, 0) /
              transformedData.reduce((sum, item) => sum + item.callsDone, 0)) *
            100
          ).toFixed(2)
        : "0.00",
    };

    exportData.push(summaryRow);

    // Create worksheet with styles
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Add header style
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "32086D" } },
    };

    // Apply header style
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      if (!ws[headerCell]) continue;
      ws[headerCell].s = headerStyle;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Performance Report");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      data,
      `performance_report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  if (loading) {
    return (
      <div className="w-full h-[20rem] bg-[#E8EFF8] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // if (
  //   isEmpty(originalData.calls_done) &&
  //   isEmpty(originalData.connected_calls) &&
  //   isEmpty(originalData.interested)
  // ) {
  //   return (
  //     <div className="w-full h-[20rem] bg-[#F0F6FF] flex justify-center items-center rounded-xl shadow-xl">
  //       <EmptyDataMessageIcon size={100} />
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="grid grid-cols-12 px-4">
        <div className="col-span-12 flex justify-between py-2 rounded-md mt-3 gap-2">
          <div className="text-black text-base font-semibold poppins-thin leading-tight flex items-center"></div>
          <div className="flex gap-x-2">
            <DateButton
              onDateChange={(fieldName, data) =>
                handleDateChange(fieldName, data)
              }
              showDot={
                filters.hasOwnProperty("date") ||
                filters.hasOwnProperty("date_time_range")
              }
              resetFilters={resetFilters}
              fieldName="date"
              date={filters?.date_time_range || filters?.date}
              buttonBackgroundColor="bg-[#C7D4E4]"
              showBoxShadow={true}
            />
            {role !== ROLE_EMPLOYEE && (
              <FilterButton
                onClick={() => setShowFilter(!showFilter)}
                showDot={showDot}
                showFilter={showFilter}
              />
            )}
            {(showDot ||
              filters.hasOwnProperty("date") ||
              filters.hasOwnProperty("date_time_range")) && (
              <ClearButton onClick={() => handleResetFilters()} />
            )}
            {role !== ROLE_EMPLOYEE && (
              <ExportButton onClick={() => setExportData(true)} />
            )}
          </div>
        </div>
        <div
          className={`col-span-12 rounded overflow-hidden transition-all duration-500 ease-in-out overflow-visible ${
            showFilter
              ? "max-h-[400px] opacity-100 pointer-events-auto visible"
              : "max-h-0 opacity-0 pointer-events-none invisible"
          }`}
        >
          <FilterDialogueForCharts
            setFilters={setFilters}
            filters={filters}
            resetFilters={resetFilters}
          />
        </div>
      </div>

      {/* Modified chart container to handle empty state */}
      <div className="w-full bg-[#F0F6FF] rounded-2xl p-4 shadow-xl mt-1.5">
        <div className="flex justify-between items-center mb-6">
          <div className="text-black text-base font-semibold poppins-thin leading-tight">
            Strategic Performance Metrics
          </div>
          <div className="flex gap-4">
            <ChartStatusBadge
              text="Interested"
              dotColor={"#9D9D9D"}
              bgColor={"#EAF0F8"}
              isActive={activeBadges.interested}
              onClick={() => handleBadgeClick("interested")}
            />
            <ChartStatusBadge
              text="Connected"
              dotColor={"#B0CCE1"}
              bgColor={"#EAF0F8"}
              isActive={activeBadges.connected}
              onClick={() => handleBadgeClick("connected")}
            />
            <ChartStatusBadge
              text="Calls Done"
              dotColor={"#E2E3DE"}
              bgColor={"#EAF0F8"}
              isActive={activeBadges.calls_done}
              onClick={() => handleBadgeClick("calls_done")}
            />
          </div>
        </div>

        {isEmpty(originalData.calls_done) &&
        isEmpty(originalData.connected_calls) &&
        isEmpty(originalData.interested_leads) ? (
          <div className="w-full h-[20rem] flex justify-center items-center">
            <EmptyDataMessageIcon size={100} />
          </div>
        ) : !isConfirmationDialogueOpened ? (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={transformedData.sort((a,b)=>b-a)}
              margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
              key={Object.values(activeBadges).join("-")} // Force re-render when badges change
            >
              <XAxis
                dataKey="name"
                padding={{ left: 10, right: 10 }}
                tick={<CustomTick />}
              />
              <YAxis
                domain={[0, "dataMax + 20"]}
                padding={{ top: 10, bottom: 10 }}
                tick={<CustomYAxisTick />}
              />
              <Tooltip
                content={<CustomTooltip activeBadges={activeBadges} />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="callsDone"
                shape={(props) => {
                  const hasData =
                    (activeBadges.calls_done && props.payload.callsDone > 0) ||
                    (activeBadges.connected && props.payload.connected > 0) ||
                    (activeBadges.interested && props.payload.interested > 0);
                  return hasData ? (
                    <CombinedBar
                      {...props}
                      data={props.payload}
                      activeBadges={activeBadges}
                      maxValue={maxValue}
                    />
                  ) : null;
                }}
                barSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
};

export default PerformanceChartHorizontal;
