import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useForgetPasswordMutation, useResetPasswordMutation } from "../../redux/api/api";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { TbPasswordMobilePhone } from "react-icons/tb";

interface ForgetPasswordComponentProps {
  email: string | undefined;
  setEmail: (email: string | undefined) => void;
  password: string | undefined;
  setPassword: (email: string | undefined) => void;
}

const ForgetPasswordComponent: React.FC<ForgetPasswordComponentProps> = ({
  email,
  setEmail,
}) => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [otp, setOtp] = useState<string | undefined>();
  const [gotOtp, setGotOtp] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const [isForgetPasswordLoading, setIsForgetPasswordLoading] = useState<boolean>(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState<boolean>(false);

  const [forgetPassword] = useForgetPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  const forgetPasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsForgetPasswordLoading(true);
      const data = await forgetPassword({
        email: email
      }).unwrap();
      setGotOtp(true);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally{
      setIsForgetPasswordLoading(false);
    }
  };

  const resetPasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsResetPasswordLoading(true);
      const data = await resetPassword({
        email: email,
        otp: otp,
        password: newPassword,
      }).unwrap();
      toast.success(data.message);
      navigate(0);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally{
      setIsResetPasswordLoading(false);
    }
  };

  return (
    <div className="w-[80%] md:w-[60%]">
      <h1 className="flex gap-x-1 text-4xl text-black font-bold border-b pb-5">
        <IoMdArrowBack onClick={() => navigate(0)} />
        Reset Password
      </h1>

      {!gotOtp && <form
        onSubmit={forgetPasswordHandler}
        className="mt-4 w-[100%]"
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
              type="email"
              placeholder="Email"
              required
            />
          </div>
        </div>

        <button
          disabled={isForgetPasswordLoading}
          style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
          className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
        >
          {isForgetPasswordLoading ? "Sending OTP..." : "Get OTP"}
        </button>
      </form>}

      {gotOtp && <form
        onSubmit={resetPasswordHandler}
        className="mt-4 w-[100%]"
      >
        <div className="flex flex-col items-start">
          <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
            <span>
              <FaStarOfLife size="6px" color="red" />
            </span>
            OTP
          </label>
          <div className="relative w-[100%]">
            <div className="absolute top-[20px] left-[7px] text-base">
              <TbPasswordMobilePhone size={18} />
            </div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
              type="otp"
              placeholder="OTP"
              required
            />
          </div>
        </div>
        <div className="mt-2 flex flex-col items-start">
          <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
            <span>
              <FaStarOfLife size="6px" color="red" />
            </span>
            New Password
          </label>
          <div className="relative w-[100%]">
            <div className="absolute top-[18px] left-[7px] text-base">
              <BiLockAlt />
            </div>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border rounded mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              required
            />
            {!showNewPassword ? (
              <IoEyeOffOutline
                onClick={() => setShowNewPassword(true)}
                size={20}
                className="absolute top-[20px] right-3"
              />
            ) : (
              <IoEyeOutline
                onClick={() => setShowNewPassword(false)}
                size={20}
                className="absolute top-[20px] right-3"
              />
            )}
          </div>
        </div>

        <button
          disabled={isResetPasswordLoading}
          style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
          className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
        >
          {isResetPasswordLoading ? "Updating password..." : "Update Password"}
        </button>
      </form>}
    </div>
  );
};

export default ForgetPasswordComponent;
