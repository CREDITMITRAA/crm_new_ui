const Verification1Icon = ({ className, color = "#64748B" }) => {
    return (
      <svg
        className={className}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6.66667 10.833V9.99967M10 10.833V8.33301M13.3333 10.833V6.66634M6.66667 17.4997L10 14.1663L13.3333 17.4997M2.5 3.33301H17.5M3.33333 3.33301H16.6667V13.333C16.6667 13.7932 16.2936 14.1663 15.8333 14.1663H4.16667C3.70643 14.1663 3.33333 13.7932 3.33333 13.333V3.33301Z"
          stroke={color} // Uses the color prop
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  
  export default Verification1Icon;  