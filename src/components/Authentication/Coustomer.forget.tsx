
import axios from 'axios';
import { FC, ReactElement, useState } from 'react'
import { BiUser } from 'react-icons/bi'
import { FaStarOfLife } from 'react-icons/fa'
import { toast } from 'react-toastify';
import logo from "../../assets/images/logo/logo.png";
interface ICustomerForgetProp {
    setStep: (val:number) => void;
    setForgetEmail:(value:string)=>void;
    forgetEmail:string

}

const CoustomerForget: FC<ICustomerForgetProp> = ({ setStep,forgetEmail,setForgetEmail }): ReactElement => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const verifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}customer/verify-email`,{email:forgetEmail});
            toast.success(res.data.message)
            setStep(2)
        } catch (error:any) {
            toast.error(error.response.data.message || "Something went Wrong")
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <>
         <section className="relative h-screen w-full bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] overflow-hidden">
 
       <div className="absolute inset-0">
         <img
              className="w-full h-full object-cover transform -scale-x-100 filter   brightness-75"
              src="/manufacturing-productio.gif"
              alt="Background"
          />
      </div>


      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-10  border border-white/50">


          <div className="flex justify-center mb-4">
              <img src={logo} alt="Company Logo" className="h-20 w-auto" />
          </div>


          <h2 className="text-3xl font-bold text-center text-sky-800 mb-6 font-serif"> Customer Forgot Password?</h2>
         
          <form
             onSubmit={verifyEmail}
             className="space-y-6"
           > 
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                      type="email"
                      placeholder="Email Address"
                      value={forgetEmail}
                    required
                    onChange={(e) => setForgetEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
              </div>

              <button
                 disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-sky-600 text-white font-semibold py-2 rounded-md hover:bg-sky-700 transition duration-200"
              >
                  verify
              </button>
           </form>

     
          <div className="text-center mt-6">
              <button onClick={()=>setStep(0)} className="text-sm text-blue-600 hover:underline">
                  Back to Sign In
              </button>
          </div>
      </div>
  </section>
        </>
        
    )
}

export default CoustomerForget
