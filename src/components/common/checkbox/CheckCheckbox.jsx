function CheckCheckbox() {
  return (
    <label className="w-5 h-5 bg-[#214768] rounded-md flex justify-center items-center cursor-pointer relative">
      <input type="checkbox" className="opacity-0 absolute" />
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#CED8E6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </label>
  );
}

export default CheckCheckbox;