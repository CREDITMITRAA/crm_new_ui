import { useSelector } from "react-redux";
import { 
  EX_EMPLOYEES_LEADS_TABLE, 
  EXPORT_LEADS, 
  INVALID_LEADS_TABLE,
  ROLE_EMPLOYEE // Make sure this is imported from your constants
} from "../../../utilities/AppConstants";
import ExEmployeesIcon from "../../icons/ExEmployeesIcon";
import ExportIcon from "../../icons/ExportIcon";
import InvalidLeadsIcon from "../../icons/InvalidLeadsIcon";

function MoreOptionsPopUp({onClick}) {
  const {user} = useSelector((state)=>state.auth);
  
  // Base options that everyone gets
  const baseOptions = [
    {
      optionIcon: <ExportIcon color="#214768" />,
      optionName: "Export Leads",
      optionKey: EXPORT_LEADS
    },
    // {
    //   optionIcon: <ExEmployeesIcon color="#214768"/>,
    //   optionName: "Ex Employees",
    //   optionKey: EX_EMPLOYEES_LEADS_TABLE
    // },
  ];

  // Conditional option for employees only
  const employeeOnlyOption = {
    optionIcon: <InvalidLeadsIcon color="#214768"/>,
    optionName: "Invalid Leads",
    optionKey: INVALID_LEADS_TABLE
  };

  // Combine options based on user role
  const options = user?.user?.role !== ROLE_EMPLOYEE 
    ? [employeeOnlyOption, ...baseOptions] 
    : baseOptions;

  return (
    <div className="bg-[#FAFAFA] border border-[#214768] rounded-[10px] py-[0.625rem] px-[0.938rem] w-max flex flex-col justify-start items-center">
      <div className="w-max flex flex-col">
        {options.map((option, index) => (
          <div
            key={option.optionKey} // Added key prop for React
            className={`flex justify-between items-center pb-[0.313rem] cursor-pointer ${
              index + 1 !== options.length && "border-b border-[#D3D3D3]"
            }`}
            onClick={()=>onClick(option.optionKey)}
          >
            <div className="mr-2">{option.optionIcon}</div>
            <div>
              <span className="text-[#214768] text-sm font-medium leading-[29px]">
                {option.optionName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoreOptionsPopUp;