import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table generation in PDF
import montserratRegular from "../fonts/Montserrat-Regular-normal.js";
import montserratBold from "../fonts/Montserrat-Bold-bold.js";
import * as XLSX from "xlsx";
import { fetchAllLeads } from "../features/leads/leadsApi";
import { fetchAllTasks } from "../features/tasks/tasksApi";
import moment from "moment";
import { fetchAllActivityLogs } from "../features/activity-logs/activityLogsApi";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function exportLeadsHandler(
  params,
  selectedLeadIds = [],
  leads = [],
  users = [],
  fieldsToExport = [],
  setToastMessage
) {
  try {
    let leadsToBeExported = [];

    if (selectedLeadIds.length === 0) {
      let leads = [];
      let page = 1;
      let totalPages = 1; // Start with 1 to ensure loop runs at least once
      let pageSize = 100;

      while (page <= totalPages) {
        const response = await fetchAllLeads({ ...params, page, pageSize });

        leads = leads.concat(response.data.data);
        totalPages = response.data.pagination.totalPages; // Update total pages
        page += 1;

        // Ensure export progress doesn't exceed 100%
        let progress = Math.floor(Math.min((page / totalPages) * 100, 100));
        await new Promise((resolve) => setTimeout(resolve, 0));
        setToastMessage(`Exporting Leads... ${progress}%`);
      }

      leadsToBeExported = leads;
    } else {
      leadsToBeExported = leads.filter((lead) =>
        selectedLeadIds.includes(lead.id)
      );
    }

    const processedLeads = leadsToBeExported.map((lead) => {
      const formatToISTDate = (utcDate) => {
        if (!utcDate) return "";
        const date = new Date(utcDate);
        date.setMinutes(date.getMinutes() + 330); // Convert to IST
        return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
      };

      const processedLead = {
        ...lead,
        createdAt: formatToISTDate(lead.createdAt),
        updatedAt: formatToISTDate(lead.updatedAt),
      };

      if (lead.LeadAssignments && lead.LeadAssignments.length > 0) {
        const assignedToNames = lead.LeadAssignments.map((assignment) => {
          const user = users.find((user) => user.id === assignment.assigned_to);
          return user ? user.name : "Unknown";
        });
        processedLead.LeadAssignments = assignedToNames.join(", "); // Join multiple names
      }

      return processedLead;
    });

    const leadsToExport = processedLeads.map((lead) => {
      const exportedLead = {};
      fieldsToExport.forEach((field) => {
        exportedLead[field] = lead[field] || "";
      });
      return exportedLead;
    });

    const worksheet = utils.json_to_sheet(leadsToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Leads");
    const filename = `Leads_${new Date().toISOString().split("T")[0]}.xlsx`;
    writeFile(workbook, filename);
    return true;
  } catch (error) {
    console.error("Export Error:", error);
    return false;
  }
}

export async function exportTasks(params, setToastMessage) {
  try {
    // Fetch data from the API
    let leads = [];
    let page = 1;
    let totalPages = 1; // Start with 1 to ensure loop runs at least once
    let pageSize = 1000;

    while (page <= totalPages) {
      const response = await fetchAllTasks({ ...params, page, pageSize });
      console.log('fetch all tasks api response in export method = ', response);
      
      leads = leads.concat(response.data);
      totalPages = response.pagination.totalPages; // Update total pages
      page += 1;

      // Ensure export progress doesn't exceed 100%
      let progress = Math.floor(Math.min((page / totalPages) * 100, 100));
      await new Promise((resolve) => setTimeout(resolve, 0));
      setToastMessage(`Exporting Leads... ${progress}%`);
    }

    // Transform the data into the required structure
    const transformedData = leads.map((item) => {
      const leadAssignment = item.Lead?.LeadAssignments?.[0] || {};
      const assignedTo = leadAssignment?.AssignedTo?.name || "";
      const assignedDate = leadAssignment.createdAt
        ? formatToISTDate(leadAssignment.createdAt)
        : "";

      return {
        "Lead Id": item.Lead?.id || "",
        "Lead Name": item.Lead?.name || "",
        "Lead Status": item.Lead?.lead_status || "",
        Phone: item.Lead?.phone || "",
        "Assigned To": assignedTo,
        "Assigned Date": assignedDate,
        "Activity Status": item.activity_status || "",
        "Created On": item.createdAt ? formatToISTDate(item.createdAt) : "",
        Description: item.description || "",
        "Follow Up": item.follow_up
          ? formatToISTDate(item.follow_up, true)
          : "",
        "Verification Status": item.Lead?.verification_status || "",
      };
    });

    // Create a worksheet from the transformed data
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    // Export the workbook as an Excel file
    const filename = `Leads_${currentDate}.xlsx`;
    XLSX.writeFile(workbook, filename);
    return true;
  } catch (error) {
    console.log("Export Error : ", error);
    return false;
  }
}

export async function exportLeadActivityLogs(users, filters, setToastMessage){
  try {
    let logs = []
    let page = 1
    let totalPages = 1
    let pageSize = 1000
    while(page <= totalPages){
      const response = await fetchAllActivityLogs({...filters, page, pageSize})
      logs = logs.concat(response.data.data)
      totalPages = response.data.pagination.totalPages
      page += 1
      // Ensure export progress doesn't exceed 100%
      let progress = Math.floor(Math.min((page / totalPages) * 100, 100));
      await new Promise(resolve => setTimeout(resolve, 0));
      setToastMessage(`Exporting Logs... ${progress}%`);
    }

    const processedLogs = logs.map((log)=>{
      // const formatToISTDate = (utcDate) => {
      //   if (!utcDate) return ""; 
      //   const date = new Date(utcDate);
      //   date.setMinutes(date.getMinutes() + 330); // Convert to IST
      //   return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
      // };

      const getUserName = (created_by) => {
        return users.find((user)=> user.id === created_by).name
      }

      const processedLog = {
        ...log,
        createdAt : formatToISTDate(log.createdAt),
        updatedAt : formatToISTDate(log.updatedAt),
        created_by : getUserName(log.created_by)
      }

      return processedLog
    })

    const worksheet = utils.json_to_sheet(processedLogs)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, "Activity Logs")
    const filename = `Activity_Logs_${new Date().toISOString().split("T")[0]}.xlsx`
    writeFile(workbook, filename)
    return true
  } catch (error) {
    console.log('error in exportings lead activity logs = ', error);
    return false
  }
}

const formatToISTDate = (utcDate, showTime=false) => {
  if (!utcDate) return ""; // Handle missing or invalid dates
  const date = new Date(utcDate);
  // Adjust to IST
  // date.setMinutes(date.getMinutes() + 330); // 330 minutes = 5 hours 30 minutes

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const year = date.getFullYear();

  if (showTime) {
    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }

  return `${day}-${month}-${year}`; // Return in DD-MM-YYYY format
};

export function formatTimeTo12Hour(time) {
  // Parse the input UTC time correctly
  const timeMoment = moment.utc(time, "HH:mm").local(); 

  // Format the time to "hh:mm A" (e.g., "10:10 PM")
  return timeMoment.format("hh:mm A");
}

export async function downloadReport(
  format,
  loanReportsSummary,
  creditReportsSummary,
  leadName,
  leadId
) {
  console.log("format = ", format);
  console.log("load report summary = ", loanReportsSummary);
  console.log("creditReportsSummary = ", creditReportsSummary);
  console.log("leadName", leadName);
  console.log("lead id = ", leadId);

  if (format === "pdf") {
    const doc = new jsPDF();

    // Register both Regular and Bold fonts
    doc.addFileToVFS("Montserrat-Regular-normal.ttf", montserratRegular); // Add the regular font to VFS
    doc.addFont(
      "Montserrat-Regular-normal.ttf",
      "Montserrat-Regular",
      "normal"
    ); // Register the regular font
    doc.setFont("Montserrat-Regular"); // Set the regular font for the entire document

    doc.addFileToVFS("Montserrat-Bold-bold.ttf", montserratBold); // Add the bold font to VFS
    doc.addFont("Montserrat-Bold-bold.ttf", "Montserrat-Bold", "normal"); // Register the bold font

    // Add Header with LeadId and LeadName (Use Bold font for titles)
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("Montserrat-Bold"); // Use bold font for the titles
    doc.text(`Lead ID: ${leadId}`, 14, 20);
    doc.text(`Lead Name: ${leadName}`, 180, 20, { align: "right" });

    // Loan Report Summary Title (Use Bold font)
    doc.setFontSize(14);
    doc.text("Loan Reports Summary", 14, 30); // Adjust position for visibility

    // Loan Report Summary Table (Regular font)
    doc.setFont("Montserrat-Regular"); // Switch back to regular font for table content
    doc.autoTable({
      head: [["Loan Type", "Bank Name", "Loan Amount", "EMI", "Outstanding"]],
      body: [
        ...loanReportsSummary.map((loan) => [
          loan.loan_type,
          loan.bank_name,
          Number(loan.loan_amount),
          Number(loan.emi),
          Number(loan.outstanding),
        ]),
        [
          { content: "", colSpan: 1 },
          { content: "Total", colSpan: 1 },
          Number(
            loanReportsSummary.reduce(
              (total, loan) => total + Number(loan.loan_amount),
              0
            )
          ),
          Number(
            loanReportsSummary.reduce(
              (total, loan) => total + Number(loan.emi),
              0
            )
          ),
          Number(
            loanReportsSummary.reduce(
              (total, loan) => total + Number(loan.outstanding),
              0
            )
          ),
        ],
      ],
      theme: "grid",
      styles: { halign: "center", valign: "middle" },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
      startY: 35, // Adjusted startY
      didParseCell: (data) => {
        if (data.row.index === loanReportsSummary.length) {
          // Last row (Total row) - apply bold style
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    // Add spacing before Credit Report Summary
    const loanReportsEndY = doc.lastAutoTable.finalY + 10;

    // Credit Report Summary Title (Use Bold font)
    doc.setFontSize(14);
    doc.setFont("Montserrat-Bold"); // Use Bold font for Credit Report Title
    doc.text("Credit Reports Summary", 14, loanReportsEndY);

    // Credit Report Summary Table (Regular font)
    doc.setFont("Montserrat-Regular"); // Switch back to regular font for table content
    doc.autoTable({
      head: [["Credit Card Name", "Total Outstanding"]],
      body: [
        ...creditReportsSummary.map((credit) => [
          credit.credit_card_name,
          Number(credit.total_outstanding),
        ]),
        [
          { content: "Total", colSpan: 1 },
          Number(
            creditReportsSummary.reduce(
              (total, credit) => total + Number(credit.total_outstanding),
              0
            )
          ),
        ],
      ],
      theme: "grid",
      styles: { halign: "center", valign: "middle" },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        1: { halign: "right" },
      },
      startY: loanReportsEndY + 5,
      didParseCell: (data) => {
        if (data.row.index === creditReportsSummary.length) {
          // Last row (Total row) - apply bold style
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    // Save the PDF
    doc.save(`${leadId}_${leadName}_Loan_and_Credit_Reports.pdf`);
  } else if (format === "excel") {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Loan and Credit Report");

    // Header
    worksheet.mergeCells("A1:B1");
    worksheet.getCell("A1").value = `Lead ID: ${leadId}`;
    worksheet.getCell("A1").alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    worksheet.mergeCells("D1:E1");
    worksheet.getCell("D1").value = `Lead Name: ${leadName}`;
    worksheet.getCell("D1").alignment = {
      horizontal: "right",
      vertical: "middle",
    };

    // Loan Reports Section
    worksheet.addRow([]);
    worksheet.addRow(["Loan Reports Summary"]).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const loanSummaryHeader = worksheet.addRow([
      "Loan Type",
      "Bank Name",
      "Loan Amount",
      "EMI",
      "Outstanding",
    ]);

    // Styling Loan Header
    loanSummaryHeader.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0070C0" },
      };
      cell.alignment = { horizontal: "center" };
    });

    // Adding Loan Data
    loanReportsSummary.forEach((item) => {
      worksheet
        .addRow([
          item.loan_type,
          item.bank_name,
          Number(item.loan_amount),
          Number(item.emi),
          Number(item.outstanding),
        ])
        .eachCell((cell, colNumber) => {
          if (colNumber === 1 || colNumber === 2) {
            // Center alignment for loanType and bankName
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else {
            // Right alignment for numeric columns
            cell.alignment = { vertical: "middle", horizontal: "right" };
          }
        });
    });

    // Adding Loan Totals Row
    const totalLoanAmount = Number(
      loanReportsSummary.reduce((sum, row) => sum + Number(row.loan_amount), 0)
    );
    const totalEMI = Number(
      loanReportsSummary.reduce((sum, row) => sum + Number(row.emi), 0)
    );
    const totalOutstanding = Number(
      loanReportsSummary.reduce((sum, row) => sum + Number(row.outstanding), 0)
    );
    const loanTotalRow = worksheet.addRow([
      "",
      "Total",
      totalLoanAmount,
      totalEMI,
      totalOutstanding,
    ]);

    loanTotalRow.eachCell((cell, colNumber) => {
      if (colNumber === 2) {
        // Center alignment for loanType and bankName
        cell.alignment = { vertical: "middle", horizontal: "center" };
      } else {
        // Right alignment for numeric columns
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }
      cell.font = { bold: true };
    });

    // Credit Reports Section
    worksheet.addRow([]);
    worksheet.addRow(["Credit Reports Summary"]).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const creditSummaryHeader = worksheet.addRow([
      "Credit Card Name",
      "Total Outstanding",
    ]);

    // Styling Credit Header
    creditSummaryHeader.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0070C0" },
      };
      cell.alignment = { horizontal: "center" };
    });

    // Adding Credit Data
    creditReportsSummary.forEach((item) => {
      worksheet
        .addRow([item.credit_card_name, Number(item.total_outstanding)])
        .eachCell((cell, colNumber) => {
          if (colNumber === 1) {
            // Center alignment for loanType and bankName
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else {
            // Right alignment for numeric columns
            cell.alignment = { vertical: "middle", horizontal: "right" };
          }
        });
    });

    // Adding Credit Totals Row
    const totalCreditOutstanding = Number(
      creditReportsSummary.reduce(
        (sum, row) => sum + Number(row.total_outstanding),
        0
      )
    );
    const creditTotalRow = worksheet.addRow(["Total", totalCreditOutstanding]);

    creditTotalRow.eachCell((cell, colNumber) => {
      if (colNumber === 1) {
        // Center alignment for loanType and bankName
        cell.alignment = { vertical: "middle", horizontal: "center" };
      } else {
        // Right alignment for numeric columns
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }
      cell.font = { bold: true };
    });

    // Adjust Column Widths
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Save the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${leadId}_${leadName}_Loan_and_Credit_Reports.xlsx`);
  }
}

export function formatDateTime(taskDate, hour, minute, period) {
  try {
    if (taskDate && hour !== undefined && minute !== undefined && period) {
      let dateObj = new Date(taskDate); // Ensure taskDate is converted into a Date object

      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid taskDate provided");
      }

      let adjustedHour = Number(hour);
      const parsedMinute = Number(minute);

      if (isNaN(adjustedHour) || isNaN(parsedMinute)) {
        throw new Error("Invalid hour or minute provided");
      }

      if (period === "PM" && adjustedHour !== 12) {
        adjustedHour += 12; // Convert PM hour to 24-hour format
      } else if (period === "AM" && adjustedHour === 12) {
        adjustedHour = 0; // Convert 12 AM to 00 (midnight)
      }

      const formattedMinute = String(parsedMinute).padStart(2, "0");

      // Extract YYYY-MM-DD format from taskDate
      const formattedDate = dateObj.toISOString().split("T")[0];

      // Construct valid date-time string
      const dateString = `${formattedDate}T${String(adjustedHour).padStart(
        2,
        "0"
      )}:${formattedMinute}:00`;

      console.log("Constructed Date String:", dateString); // Debugging output

      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid Date");
      }

      return date.toString();
    } else {
      throw new Error("Missing required parameters");
    }
  } catch (error) {
    console.error("Error formatting date:", error.message);
    throw new Error(error.message);
  }
}

export function formatDatePayload(dateObject) {
  console.log('date object = ', dateObject);
  
  const { startDateTime, endDateTime } = dateObject;

  if (startDateTime) {
    const formattedStart = moment(startDateTime, "YYYY-MM-DD hh:mm A").format("YYYY-MM-DD HH:mm");

    let formattedEnd;
    if (endDateTime) {
      const momentEnd = moment(endDateTime, "YYYY-MM-DD hh:mm A");
      // If no time is given, set it to the last minute of the day (23:59)
      if (endDateTime.length <= 10) {
        formattedEnd = momentEnd.endOf("day").format("YYYY-MM-DD HH:mm");
      } else {
        formattedEnd = momentEnd.format("YYYY-MM-DD HH:mm");
      }
    }

    if (!formattedEnd) {
      return { date: moment(startDateTime, "YYYY-MM-DD hh:mm A").format("YYYY-MM-DD") };
    }

    return {
      date_time_range: `${formattedStart},${formattedEnd}`,
    };
  }

  return {};
}

export const getStatusDetails = (walkIn) => {
  if (walkIn.walk_in_status === "Cancelled") {
    return {
      status: "Cancelled",
      style: { fontWeight: "bold", color: "red" },
    };
  }

  const currentDate = moment().startOf("day");

  const followUpDate = walkIn.is_rescheduled
    ? moment(walkIn.rescheduled_date_time).startOf("day")
    : moment(walkIn.walk_in_date_time).startOf("day");

  const twoDaysFromNow = currentDate.clone().add(2, "days");

  const isUpcoming =
    followUpDate.isSameOrAfter(currentDate) &&
    followUpDate.isBefore(twoDaysFromNow);

  const isBeyondTPlus2 =
    followUpDate.isAfter(twoDaysFromNow) &&
    walkIn.walk_in_status !== "Completed";

  const isOverdue =
    followUpDate.isBefore(currentDate) &&
    walkIn.walk_in_status === "Upcoming";

  const isRescheduledOverdue =
    walkIn.is_rescheduled &&
    followUpDate.isBefore(currentDate) &&
    walkIn.walk_in_status === "Rescheduled";

  const isRescheduledUpcoming =
    walkIn.is_rescheduled &&
    followUpDate.isSameOrAfter(currentDate) &&
    walkIn.walk_in_status === "Rescheduled";

  if (walkIn.walk_in_status === "Completed") {
    return {
      status: "Completed",
      style: { fontWeight: "bold", color: "green" },
    };
  } else if (isUpcoming || isBeyondTPlus2 || isRescheduledUpcoming) {
    return {
      status: "Upcoming",
      style: { fontWeight: "bold", color: "blue" },
    };
  } else if (isOverdue || isRescheduledOverdue) {
    return {
      status: "Pending",
      style: { fontWeight: "bold", color: "red" },
    };
  }

  return { status: walkIn.walk_in_status, style: {} };
};

export function truncateWithEllipsis(text, maxLength) {
  if (typeof text !== 'string') return text;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function isEmpty(array){
  if (!Array.isArray(array) || array.length === 0) return true;
  return array.every(item => item.count === 0);
}

export function extractDate(timestamp) {
  // Try parsing with Date object first
  const date = new Date(timestamp);
  
  // If valid Date object, format as YYYY-MM-DD
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Fallback to string parsing if Date parsing fails
  const dateMatch = timestamp.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{4}\b/);
  if (dateMatch) {
    const months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const parts = dateMatch[0].split(/\s+/);
    const month = months[parts[0]];
    const day = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  
  // Return null if no date could be extracted
  return null;
}

export function hasNoData(array) {
  return isEmpty(array) || array.every(item => item.count === 0);
}

export const formatName = (name) => {
  if (!name || typeof name !== 'string') {
    return name || ''; // Return original or empty string if invalid
  }

  return name
    .split(' ') // Split into words
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' '); // Join back with spaces
};

export const formatSentence = (sentence) => {
  if (!sentence || typeof sentence !== 'string') {
    return sentence || '';
  }

  sentence = sentence.trim().toLowerCase(); // Remove extra space & lowercase all
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};


export function getLast10Digits(input) {
  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');
  
  // Extract last 10 digits
  const last10Digits = digitsOnly.slice(-10);
  
  // Return the result (or empty string if input had less than 10 digits)
  return last10Digits;
}

export const exportActivityDataToExcel = (users, date_time, data) => {

  const allUserIds = new Set();
  Object.values(data).forEach((arr) =>
    arr.forEach((item) => allUserIds.add(item.created_by))
  );

  const getCount = (arr, userId) =>
    arr.find((item) => item.created_by === userId)?.count || 0;

  const formattedData = [...allUserIds].map((userId) => {
    const user = users.find((u) => u.id === userId);
    const calls = getCount(data.calls_done, userId);
    const connected = getCount(data.connected_calls, userId);
    const scheduled = getCount(data.walkins_scheduled_today, userId);
    const walkins = getCount(data.walkins_today, userId);
    const approved = getCount(data.approved_for_walk_ins, userId);

    const conversionRate =
      calls > 0 ? ((connected / calls) * 100).toFixed(2) + "%" : "0%";

    return {
      "User ID": userId,
      Name: user?.name || "Unknown",
      "Calls Done": calls,
      "Connected Calls": connected,
      // "Conversion Rate": conversionRate,
      "Walk-ins Scheduled Today": scheduled,
      "Walk-ins Today": walkins,
      "Approved for Walk-ins": approved,
    };
  });

  const worksheet = utils.json_to_sheet(formattedData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Activity Data");

  writeFile(workbook, `Activity_Data_${date_time ? date_time : ""}.xlsx`);
};