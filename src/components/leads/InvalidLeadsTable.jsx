import moment from "moment";
import ToggleCheckbox from "../common/checkbox/ToggleCheckbox";
import {
  formatName,
  getLast10Digits,
  truncateWithEllipsis,
} from "../../utilities/utility-functions";

function InvalidLeadsTable({
  leads,
  areAllLeadsSelected,
  setAreAllLeadsSelected,
  selectAllLeads,
  selectedLeadIds,
  handleCheckboxChange,
}) {
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
          <div className="w-[4%] h-9 flex justify-center items-center rounded-tl-[10px]">
            {/* <CheckCheckbox /> */}
            <ToggleCheckbox
              checked={areAllLeadsSelected}
              onClick={() => {
                setAreAllLeadsSelected(!areAllLeadsSelected);
                selectAllLeads();
              }}
            />
          </div>

          {/* lead id */}
          <div className="w-[10%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none">
            Lead ID
          </div>

          {/* name */}
          <div className="w-[16%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none">
            Name
          </div>

          {/* Phone */}
          <div className="w-[16%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none">
            Phone
          </div>

          {/* Status */}
          <div className="w-[28%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none">
            Reason
          </div>

          {/* Source */}
          <div className="w-[13%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none">
            Source
          </div>

          {/* Imported On */}
          <div className="w-[13%] flex justify-left items-center text-[#214768] text-xs font-bold poppins-thin leading-none">
            Imported On
          </div>
        </div>

        {/* table row */}
        {leads.map((lead, index) => (
          <div
            className="w-full h-9 justify-start flex mb-1 cursor-pointer rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg"
            key={lead.id}
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
              className={`w-[4%] h-full flex justify-center items-center rounded-bl-lg rounded-tl-lg ${
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
              className="w-[10%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate px-1 w-full text-center flex justify-left">
                {lead.id}
              </span>
            </div>

            {/* Name */}
            <div
              className="w-[16%] flex items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate w-full flex justify-left">
                {truncateWithEllipsis(formatName(lead.name), 15)}
              </span>
            </div>

            {/* Phone */}
            <div
              className="w-[16%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate w-full text-center flex justify-left">
                {lead.phone}
              </span>
            </div>

            {/* Status */}
            <div
              className="w-[28%] flex justify-center items-center text-[#2B323B] text-xs font-semibold inter-inter leading-none overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate w-full text-center flex justify-left">
                {lead.reason}
              </span>
            </div>

            {/* Source */}
            <div
              className="w-[13%] flex justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate w-full text-center flex justify-left">
                {formatName(lead.lead_source)
                  ? truncateWithEllipsis(formatName(lead.lead_source), 10)
                  : truncateWithEllipsis("Not Available", 10)}
              </span>
            </div>

            {/* Imported On */}
            <div
              className="w-[13%] flex flex-col justify-center items-center text-[#2B323B] text-xs font-normal inter-inter leading-none rounded-br-lg rounded-tr-lg overflow-hidden"
              onDoubleClick={() => navigate(`/lead-details-page/${lead.id}`)}
            >
              <span className="truncate w-full text-center flex justify-left">
                {moment(lead.createdAt)
                  .utcOffset(330)
                  .format("DD MMM, YY hh:mm a")}
              </span>
              {/* <span className="truncate w-full text-center flex justify-left">
                {moment(lead.createdAt).utcOffset(330).format("hh:mm:ss A")}
              </span> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvalidLeadsTable;
