import { useSelector } from "react-redux";

function BackIcon() {
  const { isConfirmationDialogueOpened } = useSelector((state) => state.ui);
    return (
      <div className={`${!isConfirmationDialogueOpened && "relative"}`}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_5215_16564"
            maskUnits="userSpaceOnUse"
            x="0"
            y="1"
            width="20"
            height="18"
            style={{ maskType: "luminance" }} // Fixed the mask-type
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.3346 17.0163C16.2957 14.5274 14.4852 13.1152 12.903 12.7796C11.3207 12.4441 9.81436 12.3934 8.3838 12.6276V17.0846L1.66797 9.81172L8.3838 2.91797V7.15422C11.0291 7.17505 13.278 8.12408 15.1305 10.0013C16.9827 11.8785 18.0507 14.2169 18.3346 17.0163Z"
              fill="#555555"
              stroke="white"
              strokeWidth="2" // Fixed stroke-width
              strokeLinejoin="round"
            />
          </mask>
          <g mask="url(#mask0_5215_16564)">
            <path d="M0 0H20V20H0V0Z" fill="#464646" />
          </g>
        </svg>
      </div>
    );
  }
  
  export default BackIcon;
  