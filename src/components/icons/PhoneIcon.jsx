import { useSelector } from "react-redux";

function PhoneIcon() {
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
          d="M6.66536 2.5C7.08203 2.5 8.7487 6.25 8.7487 6.66667C8.7487 7.5 7.4987 8.33333 7.08203 9.16667C6.66536 10 7.4987 10.8333 8.33203 11.6667C8.65703 11.9917 9.9987 13.3333 10.832 12.9167C11.6654 12.5 12.4987 11.25 13.332 11.25C13.7487 11.25 17.4987 12.9167 17.4987 13.3333C17.4987 15 16.2487 16.25 14.9987 16.6667C13.7487 17.0833 12.9154 17.0833 11.2487 16.6667C9.58203 16.25 8.33203 15.8333 6.2487 13.75C4.16536 11.6667 3.7487 10.4167 3.33203 8.75C2.91536 7.08333 2.91536 6.25 3.33203 5C3.7487 3.75 4.9987 2.5 6.66536 2.5Z"
          fill="#464646"
          fill-opacity="0.2"
          stroke="#464646"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}

export default PhoneIcon;
