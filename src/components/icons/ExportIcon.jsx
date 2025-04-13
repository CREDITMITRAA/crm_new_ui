function ExportIcon({ color = "#464646" }) {
  return (
    <div>
      {/* OLD */}
      {/* <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6665 2.5V5.83333C11.6665 6.05435 11.7543 6.26631 11.9106 6.42259C12.0669 6.57887 12.2788 6.66667 12.4998 6.66667H15.8332"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.58317 17.5H5.83317C5.39114 17.5 4.96722 17.3244 4.65466 17.0118C4.3421 16.6993 4.1665 16.2754 4.1665 15.8333V4.16667C4.1665 3.72464 4.3421 3.30072 4.65466 2.98816C4.96722 2.67559 5.39114 2.5 5.83317 2.5H11.6665L15.8332 6.66667V10.8333M11.6665 15.8333H17.4998M17.4998 15.8333L14.9998 13.3333M17.4998 15.8333L14.9998 18.3333"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg> */}

      {/* NEW */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6641 2.5V5.83333C11.6641 6.05435 11.7519 6.26631 11.9081 6.42259C12.0644 6.57887 12.2764 6.66667 12.4974 6.66667H15.8307"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.58073 17.5H5.83073C5.3887 17.5 4.96478 17.3244 4.65222 17.0118C4.33966 16.6993 4.16406 16.2754 4.16406 15.8333V4.16667C4.16406 3.72464 4.33966 3.30072 4.65222 2.98816C4.96478 2.67559 5.3887 2.5 5.83073 2.5H11.6641L15.8307 6.66667V10.8333M11.6641 15.8333H17.4974M17.4974 15.8333L14.9974 13.3333M17.4974 15.8333L14.9974 18.3333"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}

export default ExportIcon;
