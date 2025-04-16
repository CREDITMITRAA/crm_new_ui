import { useSelector } from "react-redux";

function CompanyIcon() {
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
          d="M15.0003 12.5H13.3337V14.1667H15.0003M15.0003 9.16667H13.3337V10.8333H15.0003M16.667 15.8333H10.0003V14.1667H11.667V12.5H10.0003V10.8333H11.667V9.16667H10.0003V7.5H16.667M8.33366 5.83333H6.66699V4.16667H8.33366M8.33366 9.16667H6.66699V7.5H8.33366M8.33366 12.5H6.66699V10.8333H8.33366M8.33366 15.8333H6.66699V14.1667H8.33366M5.00033 5.83333H3.33366V4.16667H5.00033M5.00033 9.16667H3.33366V7.5H5.00033M5.00033 12.5H3.33366V10.8333H5.00033M5.00033 15.8333H3.33366V14.1667H5.00033M10.0003 5.83333V2.5H1.66699V17.5H18.3337V5.83333H10.0003Z"
          fill="#464646"
        />
      </svg>
    </div>
  );
}

export default CompanyIcon;
