function SubmitButton({onClick}) {
  return (
    <div className="w-[190px] h-[30px] relative flex items-center justify-center bg-[#214768] rounded-md cursor-pointer" onClick={onClick}>
      <span className="text-white text-[10px] font-bold inter-inter">Submit</span>
    </div>
  );
}

export default SubmitButton;
