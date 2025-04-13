import RobotImage from "../../../assets/images/robot_image.png";

function NotificationSnackbar() {
  return (
    <div className="bg-[#EEEFFF] rounded-[1.25rem] w-[275px] flex justify-between items-center p-3 relative shadow-lg px-8 h-[75px]">
      {/* Text Content */}
      <div className="flex flex-col justify-center w-[70%]">
        <span className="text-[#32086D] text-sm font-semibold">
          Better Luck Next Time
        </span>
        <span className="text-[#7A7A7A] text-[10px]">
          This lead got rejected
        </span>
      </div>

      {/* Image */}
      <div className="w-[70px] h-[66px] flex items-center justify-center">
        <img
          className="w-full h-full object-contain relative drop-shadow-lg"
          src={RobotImage}
          alt="Robot"
        />
      </div>

      {/* Right Blue Strip */}
      <div className="bg-[#057CF6] rounded-tr-[20px] rounded-br-[20px] w-[7%] h-full absolute right-0 top-0"></div>
    </div>
  );
}

export default NotificationSnackbar;
