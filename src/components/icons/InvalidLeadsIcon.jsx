const InvalidLeadsIcon = ({ className, color = "#64748B" }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Additional SVG */}
      <div data-svg-wrapper className="relative">
        <svg
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.33398 18.3332V1.6665H10.9173L14.6673 6.0415V18.3332H1.33398Z"
            stroke={color}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.08398 7.5L10.9173 13.3333M12.1673 10.4167C12.1673 12.7179 10.3019 14.5833 8.00065 14.5833C5.6994 14.5833 3.83398 12.7179 3.83398 10.4167C3.83398 8.11542 5.6994 6.25 8.00065 6.25C9.06455 6.24876 10.0884 6.65576 10.8611 7.38709C11.2742 7.77609 11.6032 8.24559 11.8278 8.76664C12.0525 9.28769 12.168 9.84925 12.1673 10.4167Z"
            stroke={color}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.1673 10.4167C12.1673 12.7179 10.3019 14.5833 8.00065 14.5833M3.83398 10.4167C3.83398 8.11542 5.6994 6.25 8.00065 6.25"
            stroke={color}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default InvalidLeadsIcon;
