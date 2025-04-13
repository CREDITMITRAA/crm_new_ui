function DoneButton({onClick}) {
  return (
    <div class="flex justify-center items-center flex-row gap-2.5 py-[5px] px-[20px] bg-[#214768] rounded-[10px] inter-inter cursor-pointer" onClick={onClick}>
      <span class="text-[#CED8E6] text-sm font-medium leading-5">Done</span>
    </div>
  );
}

export default DoneButton;
