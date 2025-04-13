import CreateBackupIcon from "../icons/CreateBackupIcon";

function CreateBackupButton({ onClick }) {
  return (
    <div
      className="w-max min-w-[120px] h-[38px] bg-stone-500 rounded-lg flex items-center px-2 cursor-pointer"
      onClick={onClick}
    >
      {/* Text with proper spacing */}
      <span className="text-white text-[10px] font-medium poppins-thin mx-auto">
        Create Backup
      </span>

      {/* Icon with tighter spacing */}
      <div className="ml-2">
        <CreateBackupIcon />
      </div>
    </div>
  );
}

export default CreateBackupButton;
