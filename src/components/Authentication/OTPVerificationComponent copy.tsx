import { useEffect, useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  useResendOTPMutation,
  useVerifyUserMutation,
} from "../../redux/api/api";
import { toast } from "react-toastify";
import { TbPasswordMobilePhone } from "react-icons/tb";

interface OTPVerificationComponentProps {
  email: string | undefined;
}

const OTPVerificationComponent: React.FC<OTPVerificationComponentProps> = ({
  email,
}) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string | undefined>();

  const [isVerifyingOTP, setIsVerifyingOTP] = useState<boolean>(false);
  const [isResendingOTP, setIsResendingOTP] = useState<boolean>(false);

  const [canResend, setCanResend] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);

  const [verify] = useVerifyUserMutation();
  const [resendOTP] = useResendOTPMutation();

  const verifyHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsVerifyingOTP(true);
      const data = await verify({
        email: email,
        otp: otp,
      }).unwrap();
      toast.success(data.message);
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const resendOTPHandler = async () => {
    try {
      const data = await resendOTP({email}).unwrap();
      toast.success(data.message);
      setCanResend(false);
      setSecondsLeft(30);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsResendingOTP(false);
    }
  };

  useEffect(() => {
    setSecondsLeft(30);
    setCanResend(false);
  }, []);

  useEffect(() => {
    if (!canResend) {
      const interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            setCanResend(true);
            clearInterval(interval);
          }

          return prevSeconds - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [canResend]);

  return (
    <div className="w-[80%] md:w-[60%]">
      <h1 className="flex gap-x-1 text-4xl text-black font-bold border-b pb-5">
        <IoMdArrowBack onClick={() => navigate(0)} />
        OTP Verification
      </h1>

      <form onSubmit={verifyHandler} className="mt-4 w-[100%]">
        <div className="flex flex-col items-start">
          <label className="flex gap-x-1 items-center font-bold text-sm text-[rgba(0, 0, 0, 0.88)]">
            <span>
              <FaStarOfLife size="6px" color="red" />
            </span>
            OTP
          </label>
          <div className="relative w-[100%]">
            <div className="absolute top-[18px] left-[7px] text-base">
              <TbPasswordMobilePhone />
            </div>
            <input
              value={otp}
              required
              onChange={(e) => setOtp(e.target.value)}
              className="w-[100%] outline-none text-base pl-7 pr-2 py-2 border mt-2 border-[#d9d9d9] rounded-[10px] hover:border-[#1640d6] cursor-pointer"
              type="text"
              placeholder="OTP"
            />
          </div>
        </div>
        <div className="flex items-center gap-x-1">
          <button
            type="button"
            onClick={resendOTPHandler}
            disabled={!canResend}
            style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
            className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
          >
            {canResend ? "Resend OTP" : `Resend (${secondsLeft}s)`}
          </button>
          <button
            disabled={isVerifyingOTP}
            style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
            className="mt-4 w-[100%] rounded-lg bg-[#1640d6] text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
          >
            {isVerifyingOTP ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerificationComponent;
