import { useRef } from "react";
import { useSelector } from "react-redux";

function UploadBureauButton({ onFileSelect }) {
  const { bureaus, uploading } = useSelector((state) => state.leadDocuments);
  const fileInputRef = useRef(null);
  const isDisabled = uploading || (bureaus && bureaus.length >= 3);

  const handleClick = () => {
    if (!isDisabled) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    if (isDisabled) return;
    
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
      event.target.value = null;
    }
  };

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        disabled={isDisabled}
      />

      {/* Button UI */}
      <div
        className={`w-full h-10 rounded-[0.563rem] border border-[#626AA2] flex justify-center items-center p-[0.625rem] px-[0.3rem] ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={isDisabled ? undefined : handleClick}
      >
        <div className="text-[#626AA2] text-xs font-semibold poppins-thin leading-tight">
          {uploading ? "Uploading..." : `Upload Bureau ${bureaus?.length || 0}/3`}
        </div>
      </div>
    </div>
  );
}

export default UploadBureauButton;