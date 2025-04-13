function WarningIcon({fillColor='#F2C94C'}) {
    return (
      <div className="relative w-[45px] h-[45px] flex items-center justify-center">
        {/* Yellow Circle */}
        <svg
          width="45"
          height="45"
          viewBox="0 0 45 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="22.5" cy="22.5" r="22.5" fill={fillColor} />
        </svg>
  
        {/* Warning Icon (Centered) */}
        <div className="absolute flex items-center justify-center">
          <svg
            width="31"
            height="31"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5793 27.953C8.78925 27.953 3.28516 22.449 3.28516 15.6589C3.28516 8.86884 8.78925 3.36475 15.5793 3.36475C22.3694 3.36475 27.8735 8.86884 27.8735 15.6589C27.8735 22.449 22.3694 27.953 15.5793 27.953ZM15.5793 25.4942C18.1878 25.4942 20.6894 24.458 22.5339 22.6135C24.3784 20.769 25.4146 18.2674 25.4146 15.6589C25.4146 13.0504 24.3784 10.5488 22.5339 8.70428C20.6894 6.85979 18.1878 5.82358 15.5793 5.82358C12.9708 5.82358 10.4692 6.85979 8.62469 8.70428C6.7802 10.5488 5.74399 13.0504 5.74399 15.6589C5.74399 18.2674 6.7802 20.769 8.62469 22.6135C10.4692 24.458 12.9708 25.4942 15.5793 25.4942V25.4942ZM14.3499 19.3471H16.8087V21.806H14.3499V19.3471ZM14.3499 9.51182H16.8087V16.8883H14.3499V9.51182Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    );
  }
  
  export default WarningIcon;
  