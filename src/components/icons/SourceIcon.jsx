import { useSelector } from "react-redux";

function SourceIcon() {
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
  return (
    <div data-svg-wrapper className={`${!isConfirmationDialogueOpened && "relative"}`}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.2"
          d="M7.64036 5H3.33203V15H16.6654V6.66667H9.30703L7.64036 5Z"
          fill="#464646"
        />
        <path
          d="M16.668 5.00065H10.0013L8.33464 3.33398H3.33464C2.41797 3.33398 1.6763 4.08398 1.6763 5.00065L1.66797 15.0007C1.66797 15.9173 2.41797 16.6673 3.33464 16.6673H16.668C17.5846 16.6673 18.3346 15.9173 18.3346 15.0007V6.66732C18.3346 5.75065 17.5846 5.00065 16.668 5.00065ZM16.668 15.0007H3.33464V5.00065H7.64297L9.30964 6.66732H16.668V15.0007ZM15.0013 10.0007H5.0013V8.33398H15.0013V10.0007ZM11.668 13.334H5.0013V11.6673H11.668V13.334Z"
          fill="#464646"
        />
      </svg>
    </div>
  );
}

export default SourceIcon;
