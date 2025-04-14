const downloadOptions = [
  { label: "Pdf", value: "pdf" },
  { label: "Excel", value: "excel" },
];

function DocumentDropdown({ onChange }) {
  return (
    <div className="w-full h-10 relative mr-2 flex items-center justify-center bg-[#f2f7fe] rounded-[5px] border border-[#d3d3d3]">
      <select
        className="w-full h-full bg-[#D9E4F2] border-none px-3 py-2 rounded-[5px] text-[#464646] text-sm font-medium cursor-pointer appearance-none focus:outline-none"
        onChange={(e) => onChange('format', e.target.value)}
        defaultValue="pdf"
      >
        {downloadOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-[#464646]"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DocumentDropdown;