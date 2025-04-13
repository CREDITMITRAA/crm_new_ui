import moment from "moment";
import ProfileImage from "../../assets/images/profile_image.png";
import CheckedCircleIcon from "../icons/CheckedCircleIcon";

function EmployeeCard({ employee, onClick, selectedEmployee }) {
  return (
    <div className={`w-full bg-[#E9F3FF] relative rounded-2xl shadow-md ${selectedEmployee?.id === employee.id && ' border-2 border-[#464646]'} py-[1.188rem] px-[1.5rem] flex flex-col gap-4 poppins-thin`}>
      {/* Toggle circle */}
      <div className="w-5 h-5 absolute top-2 right-2 flex justify-center items-center cursor-pointer" onClick={()=>onClick(employee)}>
        {
          selectedEmployee?.id === employee.id ? <CheckedCircleIcon /> : <div className="w-5 h-5 bg-[#E9F3FF]/30 rounded-full border border-[#464646]" /> 
        }
      </div>

      {/* Profile image and name */}
      <div className="flex items-center gap-4">
        {/* Profile Image with Green Offset Circular Border */}
        <div className="relative w-12 h-12">
          {/* Green Offset Circular Border (Rotated 105° Counterclockwise) */}
          <svg
            className="absolute -top-1 -left-1 w-14 h-14 rotate-[-105]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="green"
              strokeWidth="4"
              strokeDasharray="225 75"
              strokeDashoffset="25"
              transform="rotate(-105, 50, 50)"
            />
          </svg>

          {/* Purple Circular Border */}
          <div className="w-12 h-12 rounded-[100px] border-2 border-[#464646] flex justify-center items-center overflow-hidden">
            <img
              className="w-full h-full rounded-full object-cover"
              src={ProfileImage}
              alt="Profile"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[#214768] text-lg font-semibold break-words">
            {employee.name}
          </div>
          <div className="text-[#214768] text-sm break-words whitespace-normal">
            {employee.designation}
          </div>
          <div className="text-[#214768] text-sm break-words whitespace-normal">
            Emp Id:{" "}
            <span className="font-semibold">
              {employee.employee_id || "Not Available"}
            </span>
          </div>
        </div>
      </div>

      {/* Contact details */}
      <div className="flex flex-col gap-1 text-sm text-[#214768]">
        <div className="flex items-start">
          <span className="font-semibold w-16 flex-shrink-0">Email</span>
          <span className="flex-1 break-all">: {employee.email}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold w-16 flex-shrink-0">Phone</span>
          <span className="flex-1 break-all">: {employee?.phone || "NA"}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold w-16 flex-shrink-0">Since</span>
          <span className="flex-1 break-all">
            : {moment(employee.createdAt).utcOffset(330).format("DD MMM, YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;
