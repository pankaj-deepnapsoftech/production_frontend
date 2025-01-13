import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userExists } from "../../redux/reducers/authSlice";
import { useState } from "react";
import { useCookies } from "react-cookie";

interface LoginComponentProps {
  email: string | undefined;
  password: string | undefined;
  setEmail: (email: string | undefined) => void;
  setPassword: (password: string | undefined) => void;
  setShowLoginComponent: (show: boolean) => void;
  setShowForgetPasswordComponent: (show: boolean) => void;
  setShowOTPVerificationComponent: (show: boolean) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  setShowLoginComponent,
  setShowForgetPasswordComponent,
  setShowOTPVerificationComponent,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  const [login] = useLoginMutation();
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  
  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoginLoading(true);
      const data = await login({
        email: email,
        password: password,
      }).unwrap();
      dispatch(userExists(data.user));
      setCookie('access_token', data.token, {maxAge: 86400});
      toast.success(data.message);
      navigate('/');
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || "Something went wrong");
    } finally{
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="w-[80%] md:w-[60%]">
      <h1 className="text-4xl text-black font-bold border-b pb-5">Sign In</h1>

      <form onSubmit={loginHandler} className="mt-4 w-[100%]">
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
        <div className="my-6 flex items-center justify-between font-bold text-sm">
          <div className="text-[#1640d6]">
            <Link to="/register">Don't have an account?</Link>
          </div>
          <div
            className="text-[#1640d6] cursor-pointer"
            onClick={() => {
              setShowForgetPasswordComponent(true);
              setShowLoginComponent(false);
              setShowOTPVerificationComponent(false);
            }}
          >
            Forgot Password
          </div>
        </div>

        <button
          disabled={isLoginLoading}
          style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
          className="w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
        >
          {isLoginLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;
