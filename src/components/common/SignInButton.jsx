    function SignInButton({onClick}) {
        return (
        <div className="h-[52px] py-4 bg-[#214768] rounded-xl flex items-center justify-center" onClick={onClick}>
            <div className="text-white text-md font-semibold poppins-thin leading-tight tracking-tight">
            Sign in
            </div>
        </div>
        );
    }
    
    export default SignInButton;
    