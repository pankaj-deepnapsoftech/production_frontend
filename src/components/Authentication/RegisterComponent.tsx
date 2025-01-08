import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import React, { useState } from "react";
import { useRegisterMutation } from "../../redux/api/api";
import { toast } from "react-toastify";

interface RegisterComponentProps{
  email: string | undefined,
  setEmail: (email: string | undefined)=>void,
  setShowRegisterComponent: (show: boolean)=>void,
  setShowOTPVerificationComponent: (show: boolean)=>void
}

const RegisterComponent: React.FC<RegisterComponentProps> = ({email, setEmail, setShowRegisterComponent, setShowOTPVerificationComponent})=>{

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [firstname, setFirstname] = useState<string | undefined>();
    const [lastname, setLastname] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [phone, setPhone] = useState<string | undefined>();

    const [isRegistering, setIsRegistering] = useState<boolean>(false);

    const [register] = useRegisterMutation();

    const registerHandler = async (e: React.FormEvent)=>{
      e.preventDefault();

      try {
        setIsRegistering(true);
        const response = await register({first_name: firstname, last_name: lastname, email, password, phone}).unwrap();
        toast.success(response.message);
        setShowRegisterComponent(false);
        setShowOTPVerificationComponent(true);
      } catch (err: any) {
        toast.error(err?.message || err?.data?.message || "Something went wrong");
      } finally{
        setIsRegistering(false);
      }
    }

    return <div className="w-[80%] md:w-[60%]">
            <h1 className="text-4xl text-black font-bold border-b pb-5">
              Sign Up
            </h1>

            <form onSubmit={registerHandler} className="mt-4 w-[100%]">
              <div className="mt-4 flex flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  First Name
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type="text"
                    placeholder="First Name"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  Last Name
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    // required={true}
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type="text"
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div className="flex mt-4 flex-col items-start">
                <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                  <span>
                    <FaStarOfLife size="6px" color="red" />
                  </span>
                  Phone
                </label>
                <div className="relative w-[100%]">
                  <div className="absolute top-[18px] left-[7px] text-base">
                    <BiUser />
                  </div>
                  <input
                    value={phone}
                    required={true}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type="number"
                    placeholder="Phone"
                  />
                </div>
              </div>
              <div className="flex mt-4 flex-col items-start">
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
                    required={true}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                    type="email"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col items-start font-bold text-sm">
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
                    required={true}
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
              <div className="my-6 flex items-center justify-between font-bold text-sm">
                <div className="text-[#1640d6]">
                  <Link to="/login">Already have an account?</Link>
                </div>
              </div>

              <button
                disabled={isRegistering}
                style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                className="w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
              >
                {isRegistering ? "Signing up..." : "Sign Up"}
              </button>
            </form>
          </div>
}

export default RegisterComponent;