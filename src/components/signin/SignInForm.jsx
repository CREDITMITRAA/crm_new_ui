import { useEffect, useState } from "react";
import PrimaryButton from "../common/PrimaryButton";
import SignInButton from "../common/SignInButton";
import SendOTPButton from "./SendOTPButton";
import SubmitButton from "./SubmitButton";
import { useDispatch, useSelector } from "react-redux";
import { login, resetError } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function SignInForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    dispatch(resetError());
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    console.log("error = ", error);
  }, [error]);

  const handleSubmit = () => {
    dispatch(login(formData));
  };
  const [clickedOnForgotPassword, setClickOnForgotPassowrd] = useState(false);
  const [clickedOnSendOTP, setClickedOnSendOTP] = useState(false);
  const [clickedOnSubmitButton, setClickedOnSubmitButton] = useState(false);
  return (
    <div className="w-full flex flex-col">
      <div className="text-center text-[#214768] text-xl font-semibold poppins-thin leading-tight">
        Sign in
      </div>

      {!clickedOnForgotPassword &&
        !clickedOnSendOTP &&
        !clickedOnSubmitButton && (
          <MainContent
            setClickOnForgotPassowrd={setClickOnForgotPassowrd}
            setClickedOnSendOTP={setClickedOnSendOTP}
            setClickedOnSubmitButton={setClickedOnSubmitButton}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formData
            error={error}
          />
        )}
      {clickedOnForgotPassword && (
        <SendOTPContent
          setClickedOnSendOTP={setClickedOnSendOTP}
          setClickOnForgotPassowrd={setClickOnForgotPassowrd}
        />
      )}
      {clickedOnSendOTP && (
        <SubmitOTPContent
          setClickedOnSubmitButton={setClickedOnSubmitButton}
          setClickedOnSendOTP={setClickedOnSendOTP}
        />
      )}
      {clickedOnSubmitButton && <ConfirmPasswordContent />}
    </div>
  );
}

function MainContent({
  setClickOnForgotPassowrd,
  handleChange,
  handleSubmit,
  formData,
  error,
}) {
  return (
    <>
      {/* Email Input */}
      <div className="w-full flex flex-col gap-2 mt-2">
        <label
          className={`${
            error?.message ? "text-[#F01923]" : "text-[#214768]"
          }  text-base font-normal poppins-thin`}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          tabIndex={1}
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter an email"
          className={`w-full h-12 px-4 rounded-xl border text-[#214768] poppins-thin focus:outline-none bg-transparent ${
            error?.message
              ? "border-[#F01923]"
              : "border-[#214768] focus:border-[#214768]"
          }`}
        />
        {/* {error?.message && (
          <span className="text-[#F01923] text-sm font-normal poppins-thin mt-1">
            {error.email}
          </span>
        )} */}
      </div>

      {/* Password Input */}
      <div className="w-full flex flex-col gap-2 mt-6">
        <label
          className={`${
            error?.message ? "text-[#F01923]" : "text-[#214768]"
          }  text-base font-normal poppins-thin`}
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          tabIndex={2}
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          className={`w-full h-12 px-4 rounded-xl border text-[#214768] poppins-thin focus:outline-none bg-transparent ${
            error?.message
              ? "border-[#F01923]"
              : "border-[#214768] focus:border-[#214768]"
          }`}
        />
        {/* {error?.password && (
          <span className="text-[#F01923] text-sm font-normal poppins-thin mt-1">
            {error.password}
          </span>
        )} */}
      </div>

      {/* General Error Message */}
      {error?.message && (
        <div className="text-left text-[#F01923] text-base font-normal poppins-thin leading-none tracking-tight mt-2">
          {error.message}
        </div>
      )}

      {/* Sign In Button */}
      <div className="mt-6 cursor-pointer" tabIndex={4} onClick={handleSubmit}>
        <SignInButton />
      </div>
    </>
  );
}

function SendOTPContent({ setClickedOnSendOTP, setClickOnForgotPassowrd }) {
  return (
    <>
      <div className="h-[72px] w-full flex-col justify-start items-start gap-2 inline-flex mt-[3.75rem] px-1.25rem">
        <div className="text-[#32086d] text-base font-normal poppins-thin leading-none tracking-tight">
          Email
        </div>
        <div className="self-stretch h-12 relative">
          <div className="w-full h-12 left-0 top-0 absolute rounded-xl border border-[#4200a0]" />
          <div className="left-[16px] top-[16px] absolute opacity-50 text-[#32086d] text-base font-normal poppins-thin leading-none tracking-tight">
            Example@email.com
          </div>
        </div>
      </div>
      <div
        className="mt-[1.5rem] cursor-pointer"
        onClick={() => {
          setClickedOnSendOTP(true);
          setClickOnForgotPassowrd(false);
        }}
      >
        <SendOTPButton />
      </div>
    </>
  );
}

function SubmitOTPContent({ setClickedOnSubmitButton, setClickedOnSendOTP }) {
  return (
    <>
      {/* otp */}
      <div className="h-[72px] flex-col justify-start items-start gap-2 inline-flex mt-[1.5rem]">
        <div className="text-[#f01923] text-base font-normal poppins-thin leading-none tracking-tight">
          OTP
        </div>
        <div className="self-stretch h-12 relative">
          <div className="w-full h-12 left-0 top-0 absolute rounded-xl border border-[#f01923]" />
          <div className="left-[16px] top-[16px] absolute opacity-50 text-[#32086d] text-base font-normal poppins-thin leading-none tracking-tight">
            At least 8 characters
          </div>
        </div>
      </div>

      {/* forgot password  */}
      <div
        className="flex justify-end mt-[1.5rem] cursor-pointer"
        onClick={() => setClickedOnPassword(true)}
      >
        <div className="text-center text-[#4200a0] text-base font-normal poppins-thin leading-none tracking-tight">
          Re-Send OTP
        </div>
      </div>
      <div
        className="mt-[1.5rem] cursor-pointer"
        onClick={() => {
          setClickedOnSubmitButton(true);
          setClickedOnSendOTP(false);
        }}
      >
        <SubmitButton />
      </div>
    </>
  );
}

function ConfirmPasswordContent() {
  return (
    <>
      {/* password */}
      <div className="h-[72px] flex-col justify-start items-start gap-2 inline-flex mt-[1.5rem]">
        <div className="text-[#f01923] text-base font-normal poppins-thin leading-none tracking-tight">
          Password
        </div>
        <div className="self-stretch h-12 relative">
          <div className="w-full h-12 left-0 top-0 absolute rounded-xl border border-[#f01923]" />
          <div className="left-[16px] top-[16px] absolute opacity-50 text-[#32086d] text-base font-normal poppins-thin leading-none tracking-tight">
            At least 8 characters
          </div>
        </div>
      </div>

      {/* confirm password */}
      <div className="h-[72px] flex-col justify-start items-start gap-2 inline-flex mt-[1.5rem]">
        <div className="text-[#f01923] text-base font-normal poppins-thin leading-none tracking-tight">
          Confirm Password
        </div>
        <div className="self-stretch h-12 relative">
          <div className="w-full h-12 left-0 top-0 absolute rounded-xl border border-[#f01923]" />
          <div className="left-[16px] top-[16px] absolute opacity-50 text-[#32086d] text-base font-normal poppins-thin leading-none tracking-tight">
            At least 8 characters
          </div>
        </div>
      </div>

      <div className="mt-[1.5rem]">
        <SignInButton />
      </div>
    </>
  );
}

export default SignInForm;

{
  /* {!clickedOnForgotPassword && (
        <div className="text-center">
          <span class="text-[#313957] text-lg font-normal poppins-thin leading-[28.80px] tracking-tight">
            Don't you have an account?{" "}
          </span>
          <span class="text-[#4200a0] text-lg font-normal poppins-thin leading-[28.80px] tracking-tight">
            Create an account
          </span>
        </div>
      )} */
}

{
  /* or section */
}
// {!clickedOnForgotPassword && (
//   <div className="w-full h-9 py-2.5 justify-center items-center gap-4 inline-flex mt-[1.25rem]">
//     <div className="grow shrink basis-0 h-[0px] border border-[#c4c4c4]"></div>
//     <div className="text-center text-[#32086d] text-base font-normal poppins-thin leading-none tracking-tight">
//       Or
//     </div>
//     <div className="grow shrink basis-0 h-[0px] border border-[#c4c4c4]"></div>
//   </div>
// )}
