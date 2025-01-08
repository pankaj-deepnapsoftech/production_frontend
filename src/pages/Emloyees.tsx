import { Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddEmployeeDrawer,
  closeEmployeeDetailsDrawer,
  closeUpdateEmployeeDrawer,
  openAddEmployeeDrawer,
  openEmployeeDetailsDrawer,
  openUpdateEmployeeDrawer,
} from "../redux/reducers/drawersSlice";
import EmployeeTable from "../components/Table/EmployeeTable";
import EmployeeDetails from "../components/Drawers/Employee/EmployeeDetails";
import UpdateEmployee from "../components/Drawers/Employee/UpdateEmployee";

const Employees: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("employee");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [employeeId, setEmployeeId] = useState<string | undefined>();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);

  const { isUpdateEmployeeDrawerOpened, isEmployeeDetailsDrawerOpened } =
    useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openUpdateEmployeeDrawerHandler = (id: string) => {
    setEmployeeId(id);
    dispatch(openUpdateEmployeeDrawer());
  };

  const closeUpdateEmployeeDrawerHandler = () => {
    dispatch(closeUpdateEmployeeDrawer());
  };

  const openEmployeeDetailsDrawerHandler = (id: string) => {
    setEmployeeId(id);
    dispatch(openEmployeeDetailsDrawer());
  };

  const closeEmployeeDetailsDrawerHandler = () => {
    dispatch(closeEmployeeDetailsDrawer());
  };

  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);

  const fetchEmployeesHandler = async () => {
    try {
      setIsLoadingEmployees(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "auth/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const results = await response.json();
      if (!results.success) {
        throw new Error(results?.message);
      }
      setData(results.users);
      setFilteredData(results.users);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployeesHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter(
      (emp: any) =>
        emp.first_name?.toLowerCase()?.includes(searchTxt) ||
        emp.last_name?.toLowerCase().includes(searchTxt) ||
        emp.email.toLowerCase()?.includes(searchTxt) ||
        emp.phone.toLowerCase().toString().includes(searchTxt) ||
        emp?.role?.role?.toLowerCase()?.includes(searchTxt) ||
        (emp?.createdAt &&
          new Date(emp?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (emp?.updatedAt &&
          new Date(emp?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
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
      {/* Update Employee Drawer */}
      {isUpdateEmployeeDrawerOpened && (
        <UpdateEmployee
          closeDrawerHandler={closeUpdateEmployeeDrawerHandler}
          employeeId={employeeId}
          fetchEmployeesHandler={fetchEmployeesHandler}
        />
      )}
      {/* Employee Details Drawer */}
      {isEmployeeDetailsDrawerOpened && (
        <EmployeeDetails
          closeDrawerHandler={closeEmployeeDetailsDrawerHandler}
          employeeId={employeeId}
        />
      )}

      {/* Employees Page */}
      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-2">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Employees
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
            onClick={fetchEmployeesHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#1640d6"
            borderColor="#1640d6"
            variant="outline"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div>
        <EmployeeTable
          employees={filteredData}
          openEmployeeDetailsDrawerHandler={openEmployeeDetailsDrawerHandler}
          openUpdateEmployeeDrawerHandler={openUpdateEmployeeDrawerHandler}
          isLoadingEmployees={isLoadingEmployees}
        />
      </div>
    </div>
  );
};

export default Employees;
