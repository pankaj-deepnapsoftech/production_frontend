import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import React, { useState } from "react";
import { useRegisterMutation } from "../../redux/api/api";
import { toast } from "react-toastify";
import logo from "../../assets/images/logo/logo.png";

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

    return (
      <>
        <section className="relative h-screen w-full bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] overflow-hidden">
          <div className="absolute inset-0">
              <img
                  className="w-full h-full object-cover transform -scale-x-100 filter blur-sm brightness-75"
                  src="/manufacturing-productio.gif"
                  alt="Background"
              />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-white/50">

              <div className="absolute -top-8 left-28">
                  <img src={logo} alt="Company Logo" className="h-52 w-auto" />
              </div>
              <h2 className="text-3xl pt-20 font-bold text-center text-sky-800 mb-8 font-serif">Create Your Account</h2>

              <form onSubmit={registerHandler} className="space-y-5">

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                          value={firstname}
                          required={true}
                          onChange={(e) => setFirstname(e.target.value)}
                          type="text"
                          placeholder="First Name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                          onChange={(e) => setLastname(e.target.value)}
                          value={lastname}
                          type="text"
                          placeholder="Last Name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                          required={true}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          placeholder="Email Address"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                          onChange={(e) => setPhone(e.target.value)}
                          value={phone}
                          required={true}
                          type="text"
                          placeholder="Phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          required={true}
                          type="password"
                          placeholder="Password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                  </div>


                  <button
                      type="submit"
                      className="w-full bg-sky-600 text-white font-semibold py-2 rounded-md hover:bg-sky-700 transition duration-200"
                  >
                      Sign Up
                  </button>

                  {/* Redirect to Sign In */}
                  <p className="text-sm text-center text-gray-600">
                      Already have an account?
                      <Link to="/login" className="text-blue-600 hover:underline ml-1">
                      Sign In
                      </Link>
                  </p>
              </form>
          </div>
        </section>
      </>
    )
        
}

export default RegisterComponent;