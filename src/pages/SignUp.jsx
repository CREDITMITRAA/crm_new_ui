import CompanyInfo from "../components/signin/CompanyInfo";
import SignInForm from "../components/signin/SignInForm";

function SignUp() {
  return (
    <div className="w-screen h-screen bg-[#F4EBFE] flex justify-center items-center relative overflow-hidden">
      <div
        className="h-[29.313rem]  absolute bottom-[10.688rem] z-10"
        style={{ left: "10%", bottom: "-25%", width: "30%", scale: 0.75 }}
      >
        <CompanyInfo />
      </div>

      <div className="w-screen h-[120vh] rotate-[40deg] right-1/4 -bottom-72 absolute bg-gradient-to-r from-[#058fda] to-[#058fda]" />

      <div
        className="h-max absolute bottom-[10.688rem]"
        style={{ right: "6%", top: "0%", width: "30%", scale: 0.75 }}
      >
        
        <SignInForm />
      </div>
    </div>
  );
}

export default SignUp;
