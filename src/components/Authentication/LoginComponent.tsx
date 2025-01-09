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
    <div className="w-[80%] md:w-[60%] mx-auto bg-white p-6 rounded-lg shadow-2xl shadow-gray-500">
    <h1 className="text-4xl text-black font-bold border-b pb-5 text-center">Sign In</h1>
  
    <form onSubmit={loginHandler} className="mt-6 space-y-6">
      <div className="flex flex-col items-start space-y-2">
        <label className="flex gap-x-1 items-center font-semibold text-sm text-gray-800">
          <FaStarOfLife size="8px" color="red" />
          Email
        </label>
        <div className="relative w-full">
          <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-600">
            <BiUser size={18} />
          </div>
          <input
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-base pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            type="email"
            placeholder="Email"
          />
        </div>
      </div>
  
      <div className="flex flex-col items-start space-y-2">
        <label className="flex gap-x-1 items-center font-semibold text-sm text-gray-800">
          <FaStarOfLife size="8px" color="red" />
          Password
        </label>
        <div className="relative w-full">
          <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-600">
            <BiLockAlt size={18} />
          </div>
          <input
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-base pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer text-gray-600"
          >
            {showPassword ? (
              <IoEyeOutline size={20} />
            ) : (
              <IoEyeOffOutline size={20} />
            )}
          </div>
        </div>
      </div>
  
      <div className="my-6 flex justify-between text-sm">
        <div className="text-blue-600 hover:text-blue-800 transition">
          <Link to="/register">Don't have an account?</Link>
        </div>
        <div
          className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
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
        style={{ boxShadow: "0 4px 8px rgba(5, 95, 255, 0.2)" }}
        className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 font-semibold disabled:cursor-not-allowed disabled:bg-gray-400 hover:from-blue-600 hover:to-blue-700 transition"
      >
        {isLoginLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  </div>
  
  );
};

export default LoginComponent;
