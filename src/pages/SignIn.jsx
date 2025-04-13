import CompanyInfo from "../components/signin/CompanyInfo";
import SignInForm from "../components/signin/SignInForm";
import noise from "../assets/images/noise.png";
import noiseImage from "../assets/images/noise.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Loader from "../components/common/loaders/Loader";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user, loading} = useSelector((state)=>state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      dispatch({ type: "auth/login/fulfilled", payload: user });
      navigate("/dashboard");
    } else {
      setIsLoading(false)
    }
  }, [dispatch, navigate]);

  return (
    <div className="w-screen h-screen bg-[#F4EBFE] flex justify-center items-center relative overflow-hidden">
      {/* Loading overlay - only shown when loading */}
      {(loading || isLoading) && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/40 backdrop-blur-lg z-10">
          <Loader size={50}/>
        </div>
      )}
      
      <div
        className="h-[29.313rem] absolute bottom-[10.688rem]"
        style={{ left: "4%", bottom: "6%", width: "30%", scale: 0.75 }}
      >
        <SignInForm />
      </div>
      <div
        style={{
          transformOrigin: "left",
          transform: "rotate(40deg)",
          top: "-232%",
          height: "261vh",
          right: "-58%",
          position: "absolute",
          backgroundImage: `linear-gradient(270deg, rgba(16,99,134,0.7923961821056548) 0%, rgba(9,9,121,0.06690598602722342) 35%, rgba(0,212,255,0.1201272745426295) 100%), url(${noiseImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="w-screen h-[120vh] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#058fda] to-[#058fda] mix-blend-overlay"></div>
      </div>
      <div
        className="h-max absolute bottom-[10.688rem]"
        style={{ right: "14%", top: "25%", width: "30%", scale: 1.1 }}
      >
        <CompanyInfo />
      </div>
    </div>
  );
}

export default SignIn;