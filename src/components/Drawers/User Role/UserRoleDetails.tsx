import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../../ui/Loading";
import Drawer from "../../../ui/Drawer";

interface UserRoleDetailsProps {
  closeDrawerHandler: () => void;
  roleId: string | undefined;
}

const UserRoleDetails: React.FC<UserRoleDetailsProps> = ({
  closeDrawerHandler,
  roleId,
}) => {
  const [cookies] = useCookies();
  const [isLoadinRole, setIsLoadingRole] = useState<boolean>(false);
  const [role, setRole] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [permissions, setPermissions] = useState<string[]>([]);

  const fetchRoleDetailsHandler = async () => {
    try {
      setIsLoadingRole(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `role/${roleId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setRole(data.userRole.role);
      setDescription(data.userRole?.description || "N/A");
      setPermissions(data.userRole?.permissions || []);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally{
      setIsLoadingRole(false);
    }
  };

  useEffect(() => {
    fetchRoleDetailsHandler();
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
          User Role
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            User Role Details
          </h2>

          {isLoadinRole && <Loading />}
          {!isLoadinRole && (
            <div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Role</p>
                <p>{role}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Description</p>
                <p>{description}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Permissions</p>
                <ul className="pl-5 list-decimal">
                    {permissions.map(permission => <li>{permission}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default UserRoleDetails;
