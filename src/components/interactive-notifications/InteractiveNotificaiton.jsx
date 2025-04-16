import { useEffect, useRef, useState } from "react";
import robot_image from "../../assets/images/robot_image.png";
import cloud from "../../assets/images/cloud.png";

function InteractiveNotification({ show = false, onClose, message = "This is a sample message for testing how the cloud adjusts dynamically based on the number of words." }) {
  const [showCloud, setShowCloud] = useState(false);
  const messageRef = useRef(null);
  const robotRef = useRef(null);
  const [cloudSize, setCloudSize] = useState({ width: 200, height: 100 });

  useEffect(()=>{
    window.addEventListener("click", onClose)
    return ()=>{
      window.removeEventListener("click", onClose)
    }
  },[])

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShowCloud(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowCloud(false);
    }
  }, [show]);

  useEffect(() => {
    if (messageRef.current) {
      const rect = messageRef.current.getBoundingClientRect();
      setCloudSize({
        width: rect.width + 40, // padding
        height: rect.height + 40, // padding
      });
    }
  }, [message, showCloud]);

  const formatMessage = (message) => {
    // Split the message into an array of words
    const words = message.split(' ');
    const lines = [];
    let currentLine = [];
    
    // Distribute words across lines in an increasing manner (first line with fewer words)
    for (let i = 0; i < words.length; i++) {
      currentLine.push(words[i]);
      // Start a new line if the current line has more words than previous ones
      if (currentLine.length > lines.length) {
        lines.push(currentLine.join(' '));
        currentLine = [];
      }
    }
    // If there are remaining words, add them to the last line
    if (currentLine.length) lines.push(currentLine.join(' '));

    return lines;
  };

  const formattedMessage = formatMessage(message);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 backdrop-blur-sm">
      <style>
        {`
          @keyframes robot-slide {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes cloud-fade {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-robot-slide {
            animation: robot-slide 0.6s ease-out forwards;
          }
          .animate-cloud-fade {
            animation: cloud-fade 0.5s ease-out forwards;
          }
        `}
      </style>

      <div className="relative">
        {/* Cloud Positioned Top-Left of Robot */}
        {showCloud && (
          <div
            className="absolute animate-cloud-fade"
            style={{
              top: message ? `-${cloudSize.width-10}px` : "0",
              right: message ?`${cloudSize.height/2}px` : "0",
              transform: "translate(-100%, -80%)", // offset cloud relative to robot top-left
              width: `${cloudSize.width}px`,
              height: `${cloudSize.height}px`,
              backgroundImage: `url(${cloud})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 20,
            }}
          >
            <div
              ref={messageRef}
              className="text-violet-950 text-sm font-medium text-center leading-snug whitespace-pre-wrap"
            >
              {/* Display the formatted message with each line simulating cloud shape */}
              {formattedMessage.map((line, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Robot */}
        <img
          ref={robotRef}
          src={robot_image}
          alt="Robot"
          className="w-32 animate-robot-slide relative z-10"
        />
      </div>
    </div>
  );
}

export default InteractiveNotification;
