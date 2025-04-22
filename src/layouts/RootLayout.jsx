import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { setHeight } from "../features/ui/uiSlice";

function RootLayout({ children }) {
  const dispatch = useDispatch()
  const {isConfirmationDialogueOpened} = useSelector((state)=>state.ui)
  const contentRef = useRef();
  const location = useLocation()

  useEffect(()=>{
    function updateHeight(){
      const navbarHeight = document.getElementById("navbar")?.offsetHeight || 0
      const totalHeight = window.innerHeight
      const contentHeight = totalHeight - (navbarHeight*2) - 16
      dispatch(setHeight(contentHeight))
    }
    updateHeight()

    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  },[dispatch])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0 });
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-screen text-black">
      
      {/* Sidebar (Fixed) */}
      <div className="w-[4.75rem] h-full fixed left-0 top-0 p-2 pt-4 overflow-visible">
        <Sidebar/>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col w-[calc(100%-4.75rem)] ml-auto h-screen">
        
        {/* Navbar (Fixed) */}
        <div id="navbar" className="h-max flex items-center p-2 pt-4 fixed w-[calc(100%-4.75rem)]" style={{zIndex:isConfirmationDialogueOpened ? -1 : 1}}>
          <Navbar/>
        </div>

        {/* Scrollable Content */}
        <div ref={contentRef}  className="flex-grow overflow-auto h-max mt-16 p-2.5 pr-3.5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default RootLayout;
