import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../../ui/Loading";
import Drawer from "../../../ui/Drawer";

interface EmployeeDetailsProps {
  closeDrawerHandler: () => void;
  employeeId: string | undefined;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  closeDrawerHandler,
  employeeId,
}) => {
  const [cookies] = useCookies();
  const [isLoadingEmployee, setIsLoadingEmployee] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string | undefined>();
  const [lastname, setLastname] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [role, setRole] = useState<any | undefined>();
  const [isSuper, setIsSuper] = useState<boolean | undefined>();
  const [isVerified, setIsVerified] = useState<string | undefined>();

  const fetchUserDetailsHandler = async () => {
    try {
      setIsLoadingEmployee(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `auth/user/${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          }
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setFirstname(data.user.first_name);
      setLastname(data.user?.last_name);
      setEmail(data.user.email);
      setPhone(data.user.phone);
      setRole(data.user?.role);
      setIsVerified(data.user.isVerified);
      setIsSuper(data.user.isSuper);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally{
      setIsLoadingEmployee(false);
    }
  };

  useEffect(() => {
    fetchUserDetailsHandler();
  }, []);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Employee
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            Employee Details
          </h2>

          {isLoadingEmployee && <Loading />}
          {!isLoadingEmployee && (
            <div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">First Name</p>
                <p>{firstname}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Last Name</p>
                <p>{lastname}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Email</p>
                <p>{email}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Phone</p>
                <p>{phone}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Is Verified</p>
                <p>{isVerified ? 'Verified' : 'Not Verified'}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Role</p>
                <p>{(isSuper && 'Super Admin') || role?.role || 'N/A'}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Permissions</p>
                {!role?.permissions && <p>N/A</p>}
                {role?.permissions && <ul className="pl-5">
                    {role.permissions.map((permission: any) => <li>{permission}</li>)}
                </ul>}
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default EmployeeDetails;
