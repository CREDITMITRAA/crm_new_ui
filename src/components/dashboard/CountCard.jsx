import Loader from "../common/loaders/Loader";

function CountCard({ title, count, icon, loading }) {
  return (
    <div
      className="col-span-3 h-max flex items-center flex-col bg-[#E9F3FF] rounded-2xl shadow-[2px_1px_5px_0px_rgba(0,0,0,0.05)] shadow-[8px_5px_9px_0px_rgba(0,0,0,0.04)] shadow-[17px_12px_13px_0px_rgba(0,0,0,0.03)] shadow-[30px_21px_15px_0px_rgba(0,0,0,0.01)] shadow-[47px_33px_16px_0px_rgba(0,0,0,0.00)]"
      style={{
        // backgroundColor: "#FFFFFF", // White background
        borderRadius: "1rem", // Equivalent to rounded-2xl
        // boxShadow:
        //   "2px 1px 5px rgba(0,0,0,0.05), 8px 5px 9px rgba(0,0,0,0.04), 17px 12px 13px rgba(0,0,0,0.03), 30px 21px 15px rgba(0,0,0,0.01), 47px 33px 16px rgba(0,0,0,0.00)",
      }}
    >
      {loading ? (
        <div className="w-full h-[20rem] bg-[#E8EFF8] flex justify-center items-center rounded-2xl shadow-[2px_1px_5px_0px_rgba(0,0,0,0.05)] shadow-[8px_5px_9px_0px_rgba(0,0,0,0.04)] shadow-[17px_12px_13px_0px_rgba(0,0,0,0.03)] shadow-[30px_21px_15px_0px_rgba(0,0,0,0.01)] shadow-[47px_33px_16px_0px_rgba(0,0,0,0.00)]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-between w-full p-3">
            <span className="poppins-thin font-medium text-[13px] leading-[20px] tracking-[0%] text-slate-500">
              {title}
            </span>
            <span>{icon}</span>
          </div>
          <div className="poppins-thin font-semibold text-[14px] leading-[20px] tracking-[0%] text-[#464646] pb-3">
            {count}
          </div>
        </>
      )}
    </div>
  );
}

export default CountCard;
