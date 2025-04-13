import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setHeight } from "../features/ui/uiSlice";

function RootLayout({ children }) {
  const dispatch = useDispatch()
  const {isConfirmationDialogueOpened} = useSelector((state)=>state.ui)

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

  return (
    <div className="flex h-screen w-screen text-black">
      
      {/* Sidebar (Fixed) */}
      <div className="w-[6%] h-full fixed left-0 top-0 p-2 pt-4 overflow-visible">
        <Sidebar/>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col w-[94%] ml-auto h-screen">
        
        {/* Navbar (Fixed) */}
        <div id="navbar" className="h-max flex items-center p-2 pt-4 fixed w-[94%]" style={{zIndex:isConfirmationDialogueOpened ? -1 : 1}}>
          <Navbar/>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-auto h-max mt-16 p-2.5 pr-3.5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default RootLayout;
