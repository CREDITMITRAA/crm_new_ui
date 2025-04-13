function InteractiveNotification({
  videoSrc = "",
  show = false,
  onClose,
  autoPlay = true,
  loop = false,
  message = ""
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden flex justify-center items-center flex-col py-4">
        {/* Close button positioned absolutely at top-right */}
        <div
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-300 hover:text-blue-400 cursor-pointer z-10"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Video container */}
        <div className="w-full">
          <video
            src={videoSrc}
            autoPlay={autoPlay}
            loop={loop}
            controls={false}
            className="w-full h-auto"
            playsInline
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="w-80 text-center justify-center text-violet-950 text-base font-medium poppins-thin leading-none tracking-tight">
          {message}
        </div>
      </div>
    </div>
  );
}

export default InteractiveNotification;
