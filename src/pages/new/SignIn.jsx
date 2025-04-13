import CompanyIcon from "../../components/icons/CompanyIcon";
import CompanyIconNew from "../../components/icons/CompanyIconNew";
import HeroImageIcon from "../../components/icons/HeroImageIcon";
import SignInForm from "../../components/signin/SignInForm";
import company_logo from "../../assets/images/company_logo.png";
import sign_in_page_background_video from "../../assets/videos/sign_in_background_video.mp4";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Loader from "../../components/common/loaders/Loader";
import { useNavigate } from "react-router-dom";
import CompanyInfo from "../../components/signin/CompanyInfo";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      dispatch({ type: "auth/login/fulfilled", payload: user });
      navigate("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [dispatch, navigate]);
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {(loading || isLoading) && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/40 backdrop-blur-lg z-10">
          <Loader size={50} />
        </div>
      )}
      {/* 🔹 Background Video Layer */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={sign_in_page_background_video}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🔹 Foreground Content */}
      <div className="relative z-10 w-full h-full grid grid-cols-12">
        {/* Left side section */}
        <div className="col-span-6 h-full w-full flex justify-center items-center">
          <div className="py-8 h-full w-full px-24" style={{ display: "none" }}>
            <div className="w-full h-full bg-white/30 backdrop-blur-md rounded-[20px] flex flex-col items-center justify-center px-4">
              <div style={{ scale: 1.25 }}>
                <img src={company_logo} alt="Company Logo" />
              </div>
              <div style={{ scale: 0.75 }}>
                <HeroImageIcon />
              </div>
              <div className="w-full flex justify-center">
                <div className="w-[564px] text-center text-cyan-900 text-sm font-semibold poppins-thin leading-tight">
                  Lorem ipsum dolor sit amet consectetur. Vulputate sit aliquet
                  aliquam tristique mattis eget sodales sed. Dignissim ipsum
                  dictum lectus viverra platea viverra aliquet proin velit. Dui
                  in sed id vitae suspendisse. Nibh dolor ut pellentesque sed
                  leo arcu egestas suscipit in.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side section */}
        <div className="col-span-6 h-full w-full flex flex-col justify-center items-center px-36 py-10 gap-y-8">
          {/* Top Logo & Description */}
          <div className="flex flex-col items-center gap-4">
            {/* Logo */}
            {/* <div style={{ transform: "scale(1.25)" }}>
              <img src={company_logo} alt="Company Logo" />
            </div> */}
            {/* Description Text */}
            <div className="w-full max-w-[564px] text-center text-cyan-900 text-sm font-semibold poppins-thin leading-tight" style={{scale:0.9}}>
              <CompanyInfo/>
            </div>
          </div>

          {/* Sign In Form */}
          <div className="mt-10 bg-white/30 backdrop-blur-md rounded-[20px] p-4 w-full max-w-[564px]" style={{scale:0.8}}>
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
