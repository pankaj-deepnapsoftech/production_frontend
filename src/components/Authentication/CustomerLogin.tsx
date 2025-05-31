import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useCookies } from "react-cookie";
import Intro from "./Intro";
import axios from "axios";
import CoustomerForget from "./Coustomer.forget";
import ResetCustomerPassword from "./ResetCustomerPassword";
import logo from "../../assets/images/logo/logo.png";
import { Link } from "react-router-dom";
const CustomerLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [step, setStep] = useState<number>(0);
  const [forgetEmail, setForgetEmail] = useState<string>("");
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
      setCookie("name", data.user.full_name, { maxAge: 86400 });
      setCookie("email", data.user.email, { maxAge: 86400 });
      toast.success(data.message);

      window.location.href = "/userboard";
    } catch (error) {
      console.error("Login failed:", error);
      toast("Login failed!");
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <>
      {step === 0 ? (
        <section className="relative h-screen w-full bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] overflow-hidden">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover transform -scale-x-100 filter blur-sm brightness-75"
              src="/manufacturing-productio.gif"
              alt="Background"
            />
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-10 w-full max-w-md border border-white/50">

            <div className="absolute z-50 -top-10   left-28">
              <img src={logo} alt="Company Logo" className="h-56 w-auto" />
            </div>

            <h2 className="text-3xl font-bold text-center pt-20 text-sky-800 mb-8 font-serif">Sign In</h2>

            
            <form  className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <Link to="/company-forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition duration-200"
              >
                Sign In
              </button>


              <div className="flex items-center my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-sm text-gray-500">or</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

            
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition duration-150 bg-white"
              >
                <Link to="/login" className="text-sm text-blue-600 hover:underline">
                  Sign in with company
                </Link>
              </button>
            </form>
          </div>
        </section>
      ) : step === 1 ? (
        <CoustomerForget
          setStep={setStep}
          forgetEmail={forgetEmail}
          setForgetEmail={setForgetEmail}
        />
      ) : (
        <ResetCustomerPassword email={forgetEmail} setStep={setStep} />
      )}
    </>
  );
};

export default CustomerLogin;
