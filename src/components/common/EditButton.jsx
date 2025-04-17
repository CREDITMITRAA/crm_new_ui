import { useSelector } from "react-redux";

function EditButton({ onClick }) {
  const { isConfirmationDialogueOpened, isProfileDialogueOpened } = useSelector(
    (state) => state.ui
  );

  return (
    <div
      className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-[9px] button-hover-shadow ${
        !isConfirmationDialogueOpened && "relative group"
      }`}
      style={{
        zIndex: isConfirmationDialogueOpened || isProfileDialogueOpened ? 0 : 5,
      }}
    >
      <div 
        onClick={onClick}
        className="w-full h-full flex items-center justify-center"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.8786 4.51327C17.9578 4.63344 17.993 4.77726 17.9785 4.92043C17.9639 5.0636 17.9004 5.19735 17.7986 5.29911L10.1378 12.9591C10.0594 13.0374 9.9616 13.0935 9.85442 13.1216L6.66359 13.9549C6.55812 13.9824 6.44728 13.9819 6.34208 13.9533C6.23689 13.9248 6.14099 13.8692 6.06392 13.7921C5.98684 13.715 5.93126 13.6191 5.9027 13.5139C5.87414 13.4087 5.87358 13.2979 5.90109 13.1924L6.73442 10.0024C6.75934 9.90691 6.80517 9.8181 6.86859 9.74244L14.5578 2.05827C14.6749 1.94123 14.8338 1.87549 14.9994 1.87549C15.165 1.87549 15.3239 1.94123 15.4411 2.05827L17.7986 4.41494C17.8277 4.44564 17.8545 4.47851 17.8786 4.51327ZM16.4728 4.85661L14.9994 3.3841L7.90109 10.4824L7.38026 12.4766L9.37442 11.9558L16.4728 4.85661Z"
            fill="#464646"
          />
          <path
            d="M16.3682 14.3001C16.5959 12.3534 16.6687 10.3916 16.5857 8.4334C16.5837 8.38724 16.5914 8.34119 16.6081 8.29815C16.6249 8.25512 16.6505 8.21604 16.6832 8.1834L17.5032 7.3634C17.5256 7.34086 17.554 7.32528 17.5851 7.31852C17.6161 7.31176 17.6485 7.31411 17.6782 7.32528C17.7079 7.33646 17.7338 7.35599 17.7527 7.38153C17.7717 7.40706 17.7828 7.43752 17.7848 7.46923C17.9387 9.79527 17.8802 12.1305 17.6098 14.4459C17.4132 16.1309 16.0598 17.4517 14.3823 17.6392C11.4701 17.9615 8.53122 17.9615 5.619 17.6392C3.94233 17.4517 2.58816 16.1309 2.3915 14.4459C2.04658 11.492 2.04658 8.50809 2.3915 5.55423C2.58816 3.86923 3.9415 2.5484 5.619 2.3609C7.82937 2.11677 10.0563 2.0574 12.2765 2.1834C12.3083 2.18568 12.3387 2.19702 12.3643 2.21607C12.3898 2.23513 12.4093 2.2611 12.4205 2.29091C12.4318 2.32073 12.4342 2.35313 12.4276 2.38429C12.421 2.41545 12.4055 2.44406 12.3832 2.46673L11.5557 3.2934C11.5233 3.32577 11.4846 3.35113 11.4421 3.36791C11.3995 3.38468 11.3539 3.39251 11.3082 3.3909C9.45546 3.32744 7.60059 3.39846 5.75816 3.6034C5.21978 3.66299 4.7172 3.90233 4.33162 4.28277C3.94604 4.66321 3.69997 5.16253 3.63316 5.70006C3.29888 8.55699 3.29888 11.4431 3.63316 14.3001C3.69997 14.8376 3.94604 15.3369 4.33162 15.7174C4.7172 16.0978 5.21978 16.3371 5.75816 16.3967C8.554 16.7092 11.4473 16.7092 14.244 16.3967C14.7824 16.3371 15.285 16.0978 15.6705 15.7174C16.0561 15.3369 16.3014 14.8376 16.3682 14.3001Z"
            fill="#464646"
          />
        </svg>
      </div>
      
      {/* Tooltip positioned outside the clickable area but controlled by group hover */}
      <div className="absolute top-full left-1/4 transform -translate-x-[35%] mt-2 px-2 py-1 bg-[#EBEBEB] text-[#214768] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
        {"Edit"}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-solid border-l-transparent border-r-transparent border-b-[#EBEBEB]" />
      </div>
    </div>
  );
}

export default EditButton;