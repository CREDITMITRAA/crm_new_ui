import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartStatusBadge from "./ChartStatusBadge";
import CustomTooltip from "./CustomTooltip";
import CustomTick from "./CustomTick";
import { useDispatch, useSelector } from "react-redux";
import {
  getChartDataByChartType,
  getChartDataByChartType2,
} from "../../../features/charts/chartsThunk";
import { utils, writeFile } from "xlsx";
import * as XLSX from "xlsx";
import Loader from "../../common/loaders/Loader";
import {
  formatDatePayload,
  hasNoData,
  isEmpty,
} from "../../../utilities/utility-functions";
import EmptyDataMessageIcon from "../../icons/EmptyDataMessageIcon";
import DateButton from "../../common/DateButton";
import FilterButton from "../../common/FiltersButton";
import ClearButton from "../../common/ClearButton";
import { ROLE_EMPLOYEE } from "../../../utilities/AppConstants";
import FilterDialogueForCharts from "./FilterDialogueForCharts";
import ExportButton from "../../common/ExportButton";

// Default date range constant outside component
const DEFAULT_DATE_RANGE = {
  date_time_range: `${new Date(new Date().setDate(new Date().getDate() - 6))
    .toISOString()
    .split('T')[0]} 00:00,${new Date().toISOString().split('T')[0]} 23:59`
};

const CustomYAxisTick = ({ x, y, payload }) => (
  <text
    x={x}
    y={y}
    dy="0.32em"
    textAnchor="end"
    fill="#32086D"
    className="text-[10px] leading-5"
  >
    <tspan className="text-[#32086D]">{payload.value}</tspan>
  </text>
);

const PerformanceChart = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { data2: originalData, loading2: loading } = useSelector(
    (state) => state.charts
  );
  const { isProfileDialogueOpened, isConfirmationDialogueOpened } = useSelector(
    (state) => state.ui
  );
  const { role } = useSelector((state) => state.auth);
  
  const [activeBadges, setActiveBadges] = useState({
    approved: true,
    walkinsToday: true,
    walkinsScheduled: true,
  });
  const [filters, setFilters] = useState(DEFAULT_DATE_RANGE);
  const [resetFilters, setResetFilters] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [exportData, setExportData] = useState(false);
  
  const prevFiltersRef = useRef();
  const apiCallTimeoutRef = useRef();

  // Initialize with default filters
  useEffect(() => {
    dispatch(getChartDataByChartType2(DEFAULT_DATE_RANGE));
    prevFiltersRef.current = DEFAULT_DATE_RANGE;
  }, []);

  // Debounced API call on filters change
  useEffect(() => {
    if (JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)) {
      clearTimeout(apiCallTimeoutRef.current);
      
      apiCallTimeoutRef.current = setTimeout(() => {
        dispatch(getChartDataByChartType2({ ...filters }));
        prevFiltersRef.current = filters;
      }, 300);
    }

    return () => clearTimeout(apiCallTimeoutRef.current);
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
  };

  function handleDateChange(fieldName, data) {
    const date_filter = formatDatePayload(data);
    const payload = {
      [fieldName]: date_filter.date ?? date_filter.date_time_range,
    };
    setFilters((prev) => ({ ...prev, ...date_filter }));
    setShowDot(true);
  }

  function handleResetFilters() {
    // Reset to default date range
    setFilters(DEFAULT_DATE_RANGE);
    setShowDot(false);
    setResetFilters(true);
    
    setTimeout(() => {
      setResetFilters(false);
    }, 1000);
  }

  const usersMap = useMemo(() => {
    return new Map(users.map((user) => [user.id, user.name]));
  }, [users]);

  const transformedData = useMemo(() => {
    if (!originalData) return [];

    const getCountByUserId = (array, userId) => {
      if (!array) return 0;
      const item = array.find((item) => item.created_by === userId);
      return item ? item.count : 0;
    };

    // Get all unique user IDs from all data sources
    const allUserIds = [
      ...new Set([
        ...(originalData.calls_done || []).map((item) => item.created_by),
        ...(originalData.connected_calls || []).map((item) => item.created_by),
        ...(originalData.walkins_scheduled_today || []).map(
          (item) => item.created_by
        ),
        ...(originalData.walkins_today || []).map((item) => item.created_by),
        ...(originalData.approved_for_walk_ins || []).map(
          (item) => item.created_by
        ),
      ]),
    ];

    return allUserIds.map((userId) => {
      return {
        name: usersMap.get(userId) || `User ${userId}`,
        callsDone: getCountByUserId(originalData.calls_done, userId),
        connected: getCountByUserId(originalData.connected_calls, userId),
        interested: getCountByUserId(
          originalData.approved_for_walk_ins,
          userId
        ),
        walkinsScheduled: getCountByUserId(
          originalData.walkins_scheduled_today,
          userId
        ),
        walkinsToday: getCountByUserId(originalData.walkins_today, userId),
      };
    });
  }, [originalData, usersMap]);

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
        bottom: 40,
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
              fieldName="date" // Uncomment this
              date={filters?.date_time_range || filters?.date} // Uncomment this
              buttonBackgroundColor="bg-[#C7D4E4]"
              showBoxShadow={true}
            />
            {role !== ROLE_EMPLOYEE && (
              <FilterButton
                onClick={() => setShowFilter(!showFilter)}
                showDot={showDot}
              />
            )}
            {(showDot ||
              filters.hasOwnProperty("date") ||
              filters.hasOwnProperty("date_time_range")) && (
              <ClearButton onClick={() => handleResetFilters()} />
            )}
            <ExportButton onClick={() => setExportData(true)} />
          </div>
        </div>
        <div
          className={`col-span-12 rounded overflow-hidden transition-all duration-500 ease-in-out overflow-visible ${
            showFilter ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <FilterDialogueForCharts
            setFilters={setFilters}
            filters={filters}
            resetFilters={resetFilters}
          />
        </div>
      </div>
      <div className="w-full bg-[#F0F6FF] p-4 rounded-2xl shadow-xl mt-1.5">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <span className="text-black text-base font-semibold poppins-thin leading-tight">
            Leaderboard Analytics
          </span>

          {/* Status Badges */}
          <div className="flex gap-2">
            <ChartStatusBadge
              text="Approved for walk-in"
              dotColor={"#9ECF4F"}
              bgColor={"#EAF0F8"} //9ECF4F33
              isActive={activeBadges.approved}
              onClick={() => handleBadgeClick("approved")}
            />
            <ChartStatusBadge
              text="Walk-Ins Today"
              dotColor={"#547494"}
              bgColor={"#EAF0F8"} // 54749433
              isActive={activeBadges.walkinsToday}
              onClick={() => handleBadgeClick("walkinsToday")}
            />
            <ChartStatusBadge
              text="Walk-Ins Scheduled Today"
              dotColor={"#7BB7A6"}
              bgColor={"#EAF0F8"} // 7BB7A633
              isActive={activeBadges.walkinsScheduled}
              onClick={() => handleBadgeClick("walkinsScheduled")}
            />
          </div>
        </div>

        {/* Bar Chart Section */}
        {!isConfirmationDialogueOpened && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={transformedData}
              margin={chartConfig.margin}
              barCategoryGap={chartConfig.barCategoryGap}
              barGap={chartConfig.barGap}
            >
              <defs>
                <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7BB7A6" />
                  <stop offset="100%" stopColor="#7BB7A6" />
                </linearGradient>
                <linearGradient
                  id="connectedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#547494" />
                  <stop offset="100%" stopColor="#547494" />
                </linearGradient>
                <linearGradient
                  id="interestedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#9ECF4F" />
                  <stop offset="100%" stopColor="#9ECF4F" />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="name"
                tick={<CustomTick />}
                interval={0}
                scale="point"
                padding={{ left: 40, right: 40 }}
              />

              <YAxis
                width={chartConfig.margin.left - 20}
                tickCount={10}
                domain={[0, "dataMax"]}
                allowDecimals={false}
                tick={<CustomYAxisTick />}
                padding={{ top: 10, bottom: 10 }}
              />

              <Tooltip
                content={<CustomTooltip activeBadges={activeBadges} />}
                cursor={{ fill: "transparent" }}
              />

              {activeBadges.approved && (
                <Bar
                  dataKey="interested"
                  fill="url(#interestedGradient)"
                  barSize={chartConfig.barSize}
                  radius={[10, 10, 0, 10]}
                />
              )}
              {activeBadges.walkinsToday && (
                <Bar
                  dataKey="walkinsToday"
                  fill="url(#connectedGradient)"
                  barSize={chartConfig.barSize}
                  radius={[10, 10, 0, 0]}
                />
              )}
              {activeBadges.walkinsScheduled && (
                <Bar
                  dataKey="walkinsScheduled"
                  fill="url(#callsGradient)"
                  barSize={chartConfig.barSize}
                  radius={[10, 10, 10, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;