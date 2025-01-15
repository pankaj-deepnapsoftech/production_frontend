import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useCookies } from "react-cookie";
import Intro from "./Intro";
import axios from "axios";
import CoustomerForget from "./Coustomer.forget";
import ResetCustomerPassword from "./ResetCustomerPassword";

const CustomerLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [step,setStep] = useState<number>(0)
  const [forgetEmail,setForgetEmail] = useState<string>("")
  const navigate = useNavigate();

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}customer/login`,
        { email, password }
      );
      const data = response.data; 

      setCookie("access_token", data.token, { maxAge: 86400 });
      setCookie("role", "user", { maxAge: 86400 });
      setCookie("name", data.user.full_name , { maxAge: 86400 });
      setCookie("email", data.user.email , { maxAge: 86400 });
      toast.success(data.message);
      
     navigate("/userboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed!");
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="max-h-screen flex">
      <Intro />
     {step === 0 ?  <div className="w-[80%] md:w-[60%] flex items-center justify-center flex-col px-5">
        <h1 className="text-4xl text-black font-bold border-b pb-5">
          Customer Login
        </h1>

        <form
          onSubmit={loginHandler}
          className="mt-4 w-[90%] px-20 py-5 shadow-md "
        >
          <div className="flex flex-col items-start">
            <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
              <span>
                <FaStarOfLife size="6px" color="red" />
              </span>
              Email
            </label>
            <div className="relative w-[100%]">
              <div className="absolute top-[18px] left-[7px] text-base">
                <BiUser />
              </div>
              <input
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                type="email"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col items-start text-sm">
            <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
              <span>
                <FaStarOfLife size="6px" color="red" />
              </span>
              Password
            </label>
            <div className="relative w-[100%]">
              <div className="absolute top-[20px] left-[7px] text-base">
                <BiLockAlt />
              </div>
              <input
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              {!showPassword ? (
                <IoEyeOffOutline
                  onClick={() => setShowPassword(true)}
                  size={20}
                  className="absolute top-[20px] right-3"
                />
              ) : (
                <IoEyeOutline
                  onClick={() => setShowPassword(false)}
                  size={20}
                  className="absolute top-[20px] right-3"
                />
              )}
            </div>
          </div>
          <div className="py-2 flex justify-between items-center" >
            <button onClick={()=>setStep(1)} className="text-blue-500 font-bold" >Forgot Password</button>
            <button onClick={()=>navigate("/login")} className="text-blue-500 font-medium" >Company
               Login</button>
          </div>

          <button
            disabled={isLoginLoading}
            style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
            className="w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
          >
            {isLoginLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div> : step === 1 ?  <CoustomerForget setStep={setStep} forgetEmail={forgetEmail} setForgetEmail={setForgetEmail} /> : <ResetCustomerPassword email={forgetEmail} setStep={setStep}/>}
    </div>
  );
};

export default CustomerLogin;
