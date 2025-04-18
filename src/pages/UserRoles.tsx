import { Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddRoleDrawer,
  closeRoleDetailsDrawer,
  closeUpdateRoleDrawer,
  openAddRoleDrawer,
  openRoleDetailsDrawer,
  openUpdateRoleDrawer,
} from "../redux/reducers/drawersSlice";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import UserRoleTable from "../components/Table/UserRoleTable";
import AddUserRole from "../components/Drawers/User Role/AddUserRole";
import UserRoleDetails from "../components/Drawers/User Role/UserRoleDetails";
import UpdateUserRole from "../components/Drawers/User Role/UpdateUserRole";
import { MainColor } from "../constants/constants";

const UserRole: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("user role");
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [roles, setRoles] = useState<any[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<string | undefined>();

  const {
    isAddRoleDrawerOpened,
    isUpdateRoleDrawerOpened,
    isRoleDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openAddRoleDrawerHandler = () => {
    dispatch(openAddRoleDrawer());
  };
  const closeAddRoleDrawerHandler = () => {
    dispatch(closeAddRoleDrawer());
  };
  const openUpdateRoleDrawerHandler = (id: string) => {
    setRoleId(id);
    dispatch(openUpdateRoleDrawer());
  };
  const closeUpdateRoleDrawerHandler = () => {
    dispatch(closeUpdateRoleDrawer());
  };
  const openRoleDetailsDrawerHandler = (id: string) => {
    setRoleId(id);
    dispatch(openRoleDetailsDrawer());
  };
  const closeRoleDetailsDrawerHandler = () => {
    dispatch(closeRoleDetailsDrawer());
  };

  const fetchRolesHandler = async () => {
    try {
      setIsLoadingRoles(true);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "role/");
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setRoles(data.roles);
      setFilteredRoles(data.roles);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const deleteRoleHandler = async (id: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "role/",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: id,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      fetchRolesHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchRolesHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = roles.filter(
      (role: any) =>
        role.role?.toLowerCase()?.includes(searchTxt) ||
        role.description?.toLowerCase()?.includes(searchTxt) ||
        (role?.createdAt &&
          new Date(role?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (role?.updatedAt &&
          new Date(role?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredRoles(results);
  }, [searchKey]);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div>
      {/* Add User Role */}
      {isAddRoleDrawerOpened && (
        <AddUserRole
          fetchUserRolesHandler={fetchRolesHandler}
          closeDrawerHandler={closeAddRoleDrawerHandler}
        />
      )}
      {/* User Role Details */}
      {isRoleDetailsDrawerOpened && (
        <UserRoleDetails
          roleId={roleId}
          closeDrawerHandler={closeRoleDetailsDrawerHandler}
        />
      )}
      {/* Update User Role */}
      {isUpdateRoleDrawerOpened && (
        <UpdateUserRole
          roleId={roleId}
          closeDrawerHandler={closeUpdateRoleDrawerHandler}
          fetchUserRolesHandler={fetchRolesHandler}
        />
      )}

      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-2">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          User Roles
        </div>

        <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
          <textarea
            className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#1640d6] hover:outline:[#1640d6] border resize-none border-[#bbbbbb] bg-[#f9f9f9]"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchRolesHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#1640d6"
            borderColor="#1640d6"
            variant="outline"
          >
            Refresh
          </Button>
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 200 }}
            onClick={openAddRoleDrawerHandler}
            color="white"
            backgroundColor={MainColor}
          >
            Add New Role
          </Button>
        </div>
      </div>

      <div>
        <UserRoleTable
          roles={filteredRoles}
          isLoadingRoles={isLoadingRoles}
          deleteRoleHandler={deleteRoleHandler}
          openUpdateRoleDrawerHandler={openUpdateRoleDrawerHandler}
          openRoleDetailsDrawerHandler={openRoleDetailsDrawerHandler}
        />
      </div>
    </div>
  );
};

export default UserRole;
