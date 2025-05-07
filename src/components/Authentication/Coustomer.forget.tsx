
import axios from 'axios';
import { FC, ReactElement, useState } from 'react'
import { BiUser } from 'react-icons/bi'
import { FaStarOfLife } from 'react-icons/fa'
import { toast } from 'react-toastify';

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
        <div className="w-[80%] md:w-[60%] flex items-center justify-center flex-col px-5">
            <h1 className="text-4xl text-black font-bold border-b pb-5">
                Customer Forget Password
            </h1>

            <form
                onSubmit={verifyEmail}
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
                            value={forgetEmail}
                            required
                            onChange={(e) => setForgetEmail(e.target.value)}
                            className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                            type="email"
                            placeholder="Email"
                        />
                    </div>
                </div>



                <button
                    style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                    className="w-[100%] my-3 rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
                    disabled={isSubmitting}
                >
                    verify
                </button>
                <button onClick={()=>setStep(0)} className='font-medium text-blue-500' >Back to login</button>
            </form>
        </div>
    )
}

export default CoustomerForget
