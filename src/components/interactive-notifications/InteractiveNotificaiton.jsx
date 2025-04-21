import { useEffect, useRef, useState, useLayoutEffect } from "react";
import robot_image from "../../assets/images/robot_image.png";

function InteractiveNotification({
  show = false,
  onClose,
  message = "This is a sample message for testing how the cloud adjusts dynamically based on the number of words."
}) {
  const [showCloud, setShowCloud] = useState(false);
  const messageRef = useRef(null);
  const [cloudSize, setCloudSize] = useState({ width: 183, height: 100 });

  useEffect(() => {
    window.addEventListener("click", onClose);
    return () => {
      window.removeEventListener("click", onClose);
    };
  }, [onClose]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShowCloud(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowCloud(false);
    }
  }, [show]);

  useLayoutEffect(() => {
    if (messageRef.current && showCloud) {
      const rect = messageRef.current.getBoundingClientRect();
      const padding = 40;
      setCloudSize({
        width: Math.max(rect.width + padding, 183),
        height: Math.max(rect.height + padding, 100)
      });
    }
  }, [message, showCloud]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        backgroundColor: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)"
      }}
    >
      <style>
        {`
          @keyframes robot-slide {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>

      <div style={{ position: "relative" }}>
        {showCloud && (
          <div
            style={{
              position: "absolute",
              bottom: "100px",
              right: "100px",
              transformOrigin: "bottom right",
              zIndex: 20,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end"
            }}
          >
            {/* Cloud SVG */}
            <svg
              width={cloudSize.width + 20}
              height={cloudSize.height + 20}
              viewBox="0 0 183 100"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                zIndex: 1
              }}
            >
              <defs>
                <clipPath id="bubbleClip">
                  <path d="M34.0489 88.8197H155.953C160.718 94.5766 176.291 100.07 179.412 99.9993C174.816 98.814 165.528 89.3846 165.528 86.9151C180.335 81.8352 183.328 66.4541 182.973 59.3986C180.08 35.0148 159.925 32.4466 150.21 34.2104C140.849 18.4625 123.475 16.0778 115.957 16.8539C105.746 3.30727 90.7114 0.0618656 84.4708 0.132486C64.5576 -1.56084 51.0694 13.3964 46.8145 21.0867C42.3893 18.8854 35.4675 18.8995 32.5597 19.1817C5.83857 22.0604 -0.274379 45.0755 0.00928502 56.2232C2.39206 81.6231 23.6952 88.5375 34.0489 88.8197Z" />
                </clipPath>
              </defs>
              <g clipPath="url(#bubbleClip)">
                <rect
                  width={cloudSize.width}
                  height={cloudSize.height}
                  fill="#21476822"
                  rx="40"
                  style={{ filter: "blur(6.51px)" }}
                />
              </g>
            </svg>

            {/* Message content */}
            <div
              ref={messageRef}
              style={{
                position: "relative",
                padding: "40px",
                paddingLeft:'0px',
                paddingTop:'0px',
                width: cloudSize.width,
                height: cloudSize.height,
                color: "#214768",
                fontSize: "12px",
                fontWeight: 500,
                textAlign: "center",
                whiteSpace: "pre-wrap",
                lineHeight: 1.4,
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                minWidth: "183px",
                minHeight: "100px"
              }}
            >
              {message}
            </div>
          </div>
        )}

        {/* Robot */}
        <img
          src={robot_image}
          alt="Robot"
          style={{
            width: "128px",
            position: "relative",
            zIndex: 10,
            animation: "robot-slide 0.6s ease-out forwards"
          }}
        />
      </div>
    </div>
  );
}

export default InteractiveNotification;
