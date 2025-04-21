import React, { useState, useEffect, useRef } from "react";
import quote_bg_video from "../../assets/videos/quote_background_video.mp4";
import { useDispatch, useSelector } from "react-redux";
import { closeQuoteDialogue } from "../../features/quote-dialogue/quoteDialogueSlice";
import { quotes } from "../../utilities/AppConstants";
import company_logo from "../../assets/images/company_logo.png";
import { showInteractiveNotification } from "../../features/interactive-notifications/interactiveNotificationsSlice";

const VideoDialogue = () => {
  const dispatch = useDispatch();
  const { isOpen, navigate } = useSelector((state) => state.quoteDialogue);
  const { last_login_ago } = useSelector((state) => state.auth);
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const intervalRef = useRef(null);
  const [currentQuote, setCurrentQuote] = useState(null);

  // Get random quote only once when component mounts
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const [quote, author] = randomQuote.split("–").map((s) => s.trim());
    if (author) {
      setCurrentQuote(`"${quote}"\n\n– ${author}`);
    } else {
      setCurrentQuote(`"${quote}"\n`);
    }
    // const timer = setTimeout(() => {
    //   console.log("Calling handleClose...");
    //   handleClose();
    // }, 3000);

    // return () => clearTimeout(timer);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!isOpen || !currentQuote) return;

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    // Typing effect
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= currentQuote.length) {
          clearInterval(intervalRef.current);
          setShowCursor(false);
          //   setTimeout(() => dispatch(closeQuoteDialogue()), 3000);
          return prev;
        }
        setText(currentQuote.substring(0, prev + 1));
        return prev + 1;
      });
    }, 50); // Typing speed

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(cursorInterval);
      setCurrentIndex(0);
      setText("");
    };
  }, [isOpen, currentQuote, dispatch]);

  const handleClose = () => {
    dispatch(closeQuoteDialogue());

    if (last_login_ago === "less than an hour ago") {
      navigate("/dashboard");

      // delay navigation to let the notification render
      setTimeout(() => {
        dispatch(
          showInteractiveNotification({
            show: true,
            // videoSrc: last_login_ago_video,
            message: "Missed having you here! Hope all is well with you!",
          })
        );
      }, 100); // small delay can help
    } else {
      navigate("/dashboard");
    }
  };

  if (!isOpen || !currentQuote) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
        cursor: "pointer",
        backgroundColor: "rgba(0,0,0,0.7)",
      }}
      onClick={() => handleClose()}
    >
      <video
        autoPlay
        muted
        loop
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={quote_bg_video} type="video/mp4" />
      </video>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(255,255,255,0.3)",
          padding: "2rem",
          borderRadius: "10px",
          maxWidth: "600px",
          width: "80%",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        <pre
          style={{
            color: "#214768",
            fontSize: "1.2rem",
            fontWeight: "bold",
            whiteSpace: "pre-wrap",
            margin: 0,
            minHeight: "150px",
            fontFamily: "inherit",
          }}
        >
          {text}
          {showCursor && (
            <span
              style={{
                borderRight: "2px solid #214768",
                animation: "blink 1s step-end infinite",
              }}
            ></span>
          )}
        </pre>
      </div>

      <img
        src={company_logo}
        alt="Logo"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          height: "50px",
        }}
      />

      <div
        className="absolute bottom-10 right-10 flex justify-center items-center"
        onClick={() => handleClose()}
      >
        <svg
          className="rotate-180"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="12" fill="#214768" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.1672 8.23431C14.4797 8.54673 14.4797 9.05327 14.1672 9.36569L11.5329 12L14.1672 14.6343C14.4797 14.9467 14.4797 15.4533 14.1672 15.7657C13.8548 16.0781 13.3483 16.0781 13.0359 15.7657L9.83588 12.5657C9.52346 12.2533 9.52346 11.7467 9.83588 11.4343L13.0359 8.23431C13.3483 7.9219 13.8548 7.9219 14.1672 8.23431Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </div>
  );
};

export default VideoDialogue;
