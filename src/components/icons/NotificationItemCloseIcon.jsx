const NotificationItemCloseIcon = ({ className }) => {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className} // Allow external styling
      >
        <path
          d="M13 1L1 13"
          stroke="#4300A0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 1L13 13"
          stroke="#4300A0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  
  export default NotificationItemCloseIcon;
  