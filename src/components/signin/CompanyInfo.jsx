import company_logo from "../../assets/images/company_logo.png";
import { quotes } from "../../utilities/AppConstants";

function CompanyInfo() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <div className="w-full flex flex-col justify-start items-center h-full">
      <img src={company_logo} alt="" />
      <div className="max-w-[564px] w-full text-center text-cyan-900 text-sm font-semibold poppins-thin leading-tight mt-[1rem]">
        {/* {randomQuote} */}
      </div>
    </div>
  );
}

export default CompanyInfo;
