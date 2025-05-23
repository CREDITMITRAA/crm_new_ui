function ViewIcon({ onClick }) {
  return (
    <div data-svg-wrapper className="cursor-pointer" onClick={onClick}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 10.832C5.5 4.16536 14.5 4.16536 17.5 10.832"
          stroke="black"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10 14.1641C9.6717 14.1641 9.34661 14.0994 9.04329 13.9738C8.73998 13.8481 8.46438 13.664 8.23223 13.4318C8.00009 13.1997 7.81594 12.9241 7.6903 12.6208C7.56466 12.3175 7.5 11.9924 7.5 11.6641C7.5 11.3358 7.56466 11.0107 7.6903 10.7074C7.81594 10.404 8.00009 10.1284 8.23223 9.8963C8.46438 9.66415 8.73998 9.48 9.04329 9.35436C9.34661 9.22873 9.6717 9.16406 10 9.16406C10.663 9.16406 11.2989 9.42745 11.7678 9.8963C12.2366 10.3651 12.5 11.001 12.5 11.6641C12.5 12.3271 12.2366 12.963 11.7678 13.4318C11.2989 13.9007 10.663 14.1641 10 14.1641Z"
          stroke="black"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}

export default ViewIcon;
