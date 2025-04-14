import moment from "moment";
import CheckCheckbox from "../common/checkbox/CheckCheckbox";
import UncheckedCheckbox from "../common/checkbox/UnCheckedCheckbox";
import Pagination from "../common/Pagination";
import ToggleCheckbox from "../common/checkbox/ToggleCheckbox";
import {
  formatName,
  getLast10Digits,
  truncateWithEllipsis,
} from "../../utilities/utility-functions";
import { useNavigate } from "react-router-dom";

function NotAssignedLeadsTable({
  leads,
  areAllLeadsSelected,
  setAreAllLeadsSelected,
  selectAllLeads,
  selectedLeadIds,
  handleCheckboxChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col">
      {/* table */}
      <div className="w-full h-max flex flex-col">
        {/* table header */}
        <div
          className="w-full h-9 bg-[#B3C6E0] justify-start flex rounded-[10px] mb-2"
          style={{
            boxShadow: `
              8px 5px 20px 0px rgba(0, 0, 0, 0.05) inset,
              31px 18px 36px 0px rgba(0, 0, 0, 0.04) inset,
              70px 41px 49px 0px rgba(0, 0, 0, 0.03) inset,
              124px 73px 58px 0px rgba(0, 0, 0, 0.01) inset,
              193px 115px 63px 0px rgba(0, 0, 0, 0) inset
            `,
            backgroundColor: "rgba(189, 209, 237, 1)",
          }}
        >
          {/* checkbox */}
          <div className="w-[5%] h-9 flex justify-center items-center rounded-tl-[10px]">
            <ToggleCheckbox
              checked={areAllLeadsSelected}
              onClick={() => {
                setAreAllLeadsSelected(!areAllLeadsSelected);
                selectAllLeads();
              }}
            />
          </div>

          {/* lead id */}
          <div className="w-[15%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
            Lead ID
          </div>

          {/* name */}
          <div className="w-[20%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
            Name
          </div>

          {/* Phone */}
          <div className="w-[25%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
            Phone
          </div>

          {/* Source */}
          <div className="w-[20%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight">
            Source
          </div>

          {/* Imported On */}
          <div className="w-[15%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-tight rounded-tr-2xl">
            Imported On
          </div>
        </div>

        {/* table row */}
        {leads.map((lead, index) => (
          <div
            className="w-full h-9 justify-start flex cursor-pointer mb-1 rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg"
            key={index}
            style={{
              boxShadow: `7px 2px 16px 0px rgba(0, 0, 0, 0.05) inset, 
        27px 7px 28px 0px rgba(0, 0, 0, 0.05) inset, 
        62px 16px 38px 0px rgba(0, 0, 0, 0.03) inset, 
        110px 29px 45px 0px rgba(0, 0, 0, 0.04) inset, 
        172px 46px 50px 0px rgba(0, 0, 0, 0.05) inset`,
              backgroundColor: "rgba(216, 232, 255, 1)",
            }}
          >
            {/* Checkbox */}
            <div
              className={`w-[5%] h-full flex justify-center items-center rounded-bl-lg rounded-tl-lg ${
                index + 1 === leads.length && "rounded-bl-lg"
              }`}
            >
              <ToggleCheckbox
                checked={selectedLeadIds?.some(
                  (selectedLead) => selectedLead.id === lead.id
                )}
                onClick={() =>
                  handleCheckboxChange(
                    lead.id,
                    lead.name,
                    lead.last_updated_status
                  )
                }
              />
            </div>

            {/* Lead ID */}
            <div
              className="w-[15%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate px-1 w-full text-center flex justify-left">
                {truncateWithEllipsis(lead.id, 8)}
              </span>
            </div>

            {/* Name */}
            <div
              className="w-[20%] px-1 flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate w-full text-center flex justify-left">
                {truncateWithEllipsis(formatName(lead.name), 15)}
              </span>
            </div>

            {/* Phone */}
            <div
              className="w-[25%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate w-full text-center flex justify-left">
                {getLast10Digits(lead.phone)}
              </span>
            </div>

            {/* Source */}
            <div
              className="w-[20%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate w-full text-center flex justify-left">
                {formatName(lead.lead_source)
                  ? truncateWithEllipsis(formatName(lead.lead_source), 10)
                  : "Not Available"}
              </span>
            </div>

            {/* Imported On */}
            <div
              className="w-[15%] flex flex-col justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-tight rounded-br-lg rounded-tr-lg overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate w-full text-center flex justify-left">
                {moment(lead.createdAt)
                  .utcOffset(330)
                  .format("DD MMM, YY hh:mm:ss a")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotAssignedLeadsTable;
