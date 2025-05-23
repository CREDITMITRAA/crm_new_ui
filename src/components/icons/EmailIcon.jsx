import { useSelector } from "react-redux";

function EmailIcon() {
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
          d="M16.6654 5H3.33203L9.9987 9.15833L16.6654 5ZM3.33203 6.66667V15H16.6654V6.66667L9.9987 10.8333L3.33203 6.66667Z"
          fill="#464646"
        />
        <path
          d="M16.668 3.33203H3.33464C2.41797 3.33203 1.66797 4.08203 1.66797 4.9987V14.9987C1.66797 15.9154 2.41797 16.6654 3.33464 16.6654H16.668C17.5846 16.6654 18.3346 15.9154 18.3346 14.9987V4.9987C18.3346 4.08203 17.5846 3.33203 16.668 3.33203ZM16.668 4.9987L10.0013 9.15703L3.33464 4.9987H16.668ZM16.668 14.9987H3.33464V6.66536L10.0013 10.832L16.668 6.66536V14.9987Z"
          fill="#464646"
        />
      </svg>
    </div>
  );
}

export default EmailIcon;
