import { FC, ReactElement, useState } from "react"
import { Link, useNavigate } from "react-router-dom"


const Header: FC = (): ReactElement => {
  const [showMobileNav, setShowMobileNav] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <header className="md:h-20 w-full sticky top-0 flex items-center justify-center z-50"   >
      <nav className="bg-gray-100 w-full md:w-[90%] py-2 px-5 md:rounded-2xl flex items-center justify-between ">
        <div className="cursor-pointer flex items-center gap-1" onClick={()=>navigate("/home")} >
          <img src="/images/logo.png" alt="logo" className="h-10 " />
          <span className="text-2xl font-bold " >ITSYBIZZ</span>
        </div>
        <div className="sm:hidden" onClick={() => setShowMobileNav(!showMobileNav)}>
          <img src="/svg/line.svg" className="h-10 w-10" alt="" />
        </div>
        <div className="hidden sm:flex gap-5 items-center justify-center ">
          <Link to="/home" className="font-medium text-lg border-b-2 sm:border-2 border-transparent hover:border-blue-600 px-3 sm:rounded-md hover:italic transition-all duration-100 ease-in-out  " > Home</Link>
          {/* <Link to="" className="font-medium text-lg border-b-2 sm:border-2 border-transparent hover:border-blue-600 px-3 sm:rounded-md hover:italic transition-all duration-100 ease-in-out   " > About</Link> */}
          <Link to="/contact" className="font-medium text-lg border-b-2 sm:border-2 border-transparent hover:border-blue-600 px-3 sm:rounded-md hover:italic transition-all duration-100 ease-in-out   " > Contact Us</Link>
          <Link to="/login" className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-transparent border-2 hover:text-black hover:border-blue-600 transition-all duration-500 font-medium  " >Login</Link>
        </div>

        {/* mobile nav  */}
        <div onClick={() => setShowMobileNav(!showMobileNav)} className={` ${showMobileNav ? "flex" : "hidden"} overflow-hidden sm:hidden  flex-col absolute top-full bg-gray-200 w-full left-0  py-3 transition-all duration-500`}>
          <Link to="/home" className="font-medium text-lg border-b-2  px-5 hover:bg-white " > Home</Link>
          {/* <Link to="" className="font-medium text-lg border-b-2  px-5 hover:bg-white " > About</Link> */}
          <Link to="/contact" className="font-medium text-lg border-b-2  px-5 hover:bg-white " > Contact Us</Link>
          <Link to="/login" className="font-medium text-lg border-b-2  px-5 hover:bg-white " >Login</Link>
        </div>
      </nav>
    </header>
  )
}

export default Header
