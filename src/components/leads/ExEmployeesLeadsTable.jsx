import moment from "moment";
import CheckCheckbox from "../common/checkbox/CheckCheckbox";
import UncheckedCheckbox from "../common/checkbox/UnCheckedCheckbox";
import Pagination from "../common/Pagination";
import ToggleCheckbox from "../common/checkbox/ToggleCheckbox";

function ExEmployeesLeadsTable({ leads,areAllLeadsSelected,setAreAllLeadsSelected,selectAllLeads,selectedLeadIds,handleCheckboxChange }) {
  return (
    <div className="w-full flex flex-col">
      {/* table */}
      <div className="w-full h-max flex flex-col">
        {/* table header */}
        <div className="w-full h-9 bg-indigo-50 justify-start flex rounded-tl-2xl rounded-tr-2xl">
          {/* checkbox */}
          <div className="w-[5%] h-9 flex justify-center items-center border border-gray-300 rounded-tl-2xl">
            {/* <CheckCheckbox /> */}
            <ToggleCheckbox checked={areAllLeadsSelected} onClick={()=>{setAreAllLeadsSelected(!areAllLeadsSelected);selectAllLeads()}}/>
          </div>

          {/* lead id */}
          <div className="w-[8%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300">
            Lead ID
          </div>

          {/* name */}
          <div className="w-[15%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300">
            Name
          </div>

          {/* Phone */}
          <div className="w-[10%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300">
            Phone
          </div>

          {/* Status */}
          <div className="w-[13%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300">
            Status
          </div>

          {/* Source */}
          <div className="w-[7%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300">
            Source
          </div>

          {/* Imported On */}
          <div className="w-[9%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300">
            Imported On
          </div>

          {/* Updated At */}
          <div className="w-[9%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300">
            Updated At
          </div>

          {/* Assigned */}
          <div className="w-[10%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300">
            Assigned
          </div>

          {/* Assigned Date */}
          <div className="w-[9%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300">
            Assigned Date
          </div>

          {/* View */}
          <div className="w-[5%] flex justify-center items-center text-[#4200a0] text-xs font-semibold inter-inter leading-none border-t border-b border-r border-gray-300  rounded-tr-2xl">
            View
          </div>
        </div>

        {/* table row */}
        {leads.map((lead, index) => (
          <div className="w-full h-9 justify-start flex" key={lead.id}>
            {/* checkbox */}
            <div
              className={`w-[5%] h-full flex justify-center items-center bg-white border-b border-r border-l border-gray-300 ${
                index + 1 === leads.length && "rounded-bl-2xl"
              }`}
            >
              <ToggleCheckbox checked={selectedLeadIds?.some((selectedLead) => selectedLead.id === lead.id)} onClick={()=>handleCheckboxChange(lead.id, lead.name, lead.last_updated_status)}/>
            </div>

            {/* lead id */}
            <div className="w-[8%] flex justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300">
              {lead.id}
            </div>

            {/* name */}
            <div className="w-[15%] flex justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300">
              {lead.name}
            </div>

            {/* Phone */}
            <div className="w-[10%] flex justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300">
              {lead.phone}
            </div>

            {/* Status */}
            <div className="w-[13%] flex justify-center items-center text-[#506e00] text-xs font-semibold inter-inter leading-none bg-white border-b border-r border-gray-300">
              {lead?.last_updated_status || lead?.lead_status}
            </div>

            {/* Source */}
            <div className="w-[7%] flex justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300 pl-1">
              {lead.lead_source ? lead.lead_source : "Not Available"}
            </div>

            {/* Imported On */}
            <div className="w-[9%] flex flex-col justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300 pl-1">
              <span style={{ display: "flex", alignItems: "center" }}>
                {moment(lead.createdAt).utcOffset(330).format("DD MMM, YYYY")}
              </span>
              <span style={{ display: "flex", alignItems: "center" }}>
                {moment(lead.createdAt).utcOffset(330).format("hh:mm:ss A")}
              </span>
            </div>

            {/* Updated At */}
            <div className="w-[9%] flex flex-col justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300 pl-1">
              <span style={{ display: "flex", alignItems: "center" }}>
                {moment(lead.updatedAt).utcOffset(330).format("DD MMM, YYYY")}
              </span>
              <span style={{ display: "flex", alignItems: "center" }}>
                {moment(lead.updatedAt).utcOffset(330).format("hh:mm:ss A")}
              </span>
            </div>

            {/* Assigned */}
            <div className="w-[10%] flex justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300">
              {lead.LeadAssignments.length > 0
                ? lead.LeadAssignments[0]?.AssignedTo?.name
                : "Not Assigned"}
            </div>

            {/* Assigned Date */}
            <div className="w-[9%] flex flex-col justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300 pl-1">
              {lead.LeadAssignments && lead.LeadAssignments.length > 0 ? (
                <>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {moment(lead?.LeadAssignments[0]?.updatedAt)
                      .utcOffset(330)
                      .format("DD MMM, YYYY")}
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {moment(lead?.LeadAssignments[0]?.updatedAt)
                      .utcOffset(330)
                      .format("hh:mm:ss A")}
                  </span>
                </>
              ) : (
                "Not Assigned"
              )}
            </div>

            {/* View */}
            <div
              className={`w-[5%] flex justify-center items-center text-[#32086d] text-xs font-normal inter-inter leading-none bg-white border-b border-r border-gray-300 ${
                index + 1 === leads.length && "rounded-br-2xl"
              }`}
            >
              View
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExEmployeesLeadsTable;