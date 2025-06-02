import axios from 'axios';
import React, { FC, ReactElement, useState } from 'react'
import { BiUser } from 'react-icons/bi'
import { FaStarOfLife } from 'react-icons/fa'
import { toast } from 'react-toastify';

interface IResetCustomerPassword {
    setStep: (val: number) => void;
    email: string
}

const ResetCustomerPassword: FC<IResetCustomerPassword> = ({ setStep, email }): ReactElement => {
    const [showPassword,setShowPassword] = useState<boolean>(false)
    const [data, setData] = useState({
        otp: "",
        newPassword: ""
    })

    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}customer/reset-password`,{...data,email})
            toast.success(res.data.message)
            setStep(0)
        } catch (error:any) {
            toast.success(error.response.data.message || "something went wrong")
        }
    }
    return (
        <div className="w-[80%] md:w-[60%] flex items-center justify-center flex-col px-5">
            <h1 className="text-4xl text-black font-bold border-b pb-5">
                Create new Password
            </h1>

            <form
                onSubmit={resetPassword}
                className="mt-4 w-[90%] px-20 py-5 shadow-md "
            >
                <div className="flex flex-col items-start">
                    <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                        <span>
                            <FaStarOfLife size="6px" color="red" />
                        </span>
                        OTP
                    </label>
                    <div className="relative w-[100%]">
                        <div className="absolute top-[18px] left-[7px] text-base">
                            <BiUser />
                        </div>
                        <input

                            required
                            value={data.otp}
                            onChange={(e)=>setData({...data,otp:e.target.value})}
                            className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                            type="text"
                            placeholder="OTP"
                        />
                    </div>
                </div>

                <div className="flex flex-col items-start py-2">
                    <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
                        <span>
                            <FaStarOfLife size="6px" color="red" />
                        </span>
                        New Password
                    </label>
                    <div className="relative w-[100%]">
                        <div className="absolute top-[18px] left-[7px] text-base">
                            <BiUser />
                        </div>
                        <input
                            required
                            value={data.newPassword}
                            onChange={(e)=>setData({...data,newPassword:e.target.value})}
                            className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
                            type={showPassword ? "text" :"password"}
                            placeholder="Password"
                        />
                    </div>
                </div>
                
                <label className='select-none' onClick={()=>setShowPassword(!showPassword)}>
                    <input type='checkbox' /> show password
                </label>

                <button
                    style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
                    className="w-[100%] my-3 rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
                >
                    verify
                </button>
                <button onClick={() => setStep(0)} className='font-medium text-blue-500' >Back to login</button>
            </form>
        </div>
    )
}

export default ResetCustomerPassword
