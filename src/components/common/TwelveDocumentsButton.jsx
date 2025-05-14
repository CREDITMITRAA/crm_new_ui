import { useRef } from "react";
import { useSelector } from "react-redux";

function TwelveDocumentsButton({ onFileSelect }) {
  const { other, uploading } = useSelector((state) => state.leadDocuments);
  const fileInputRef = useRef(null);
  const isDisabled = uploading || (other && other.length >= 12);

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
    <div className="w-full mt-2">
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
        className={`w-full h-10 rounded-[9px] border border-[#D6A10F] flex justify-center items-center p-[0.625rem] px-[0.3rem] ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={isDisabled ? undefined : handleClick}
      >
        <div className="text-[#D6A10F] text-xs font-semibold poppins-thin leading-tight">
          {uploading ? "Uploading..." : `12 documents ${other?.length || 0}/12`}
        </div>
      </div>
    </div>
  );
}

export default TwelveDocumentsButton;
