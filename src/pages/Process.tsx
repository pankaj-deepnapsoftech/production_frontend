import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import ProcessTable from "../components/Table/ProcessTable";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddProcessDrawer,
  closeProcessDetailsDrawer,
  closeUpdateProcessDrawer,
  openAddProcessDrawer,
  openProcessDetailsDrawer,
  openUpdateProcessDrawer,
} from "../redux/reducers/drawersSlice";
import AddProcess from "../components/Drawers/Process/AddProcess";
import ProcessDetails from "../components/Drawers/Process/ProcessDetails";
import UpdateProcess from "../components/Drawers/Process/UpdateProcess";
import { useDeleteProcessMutation } from "../redux/api/api";
import { MainColor } from "../constants/constants";

const Process: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("production");
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cookies] = useCookies();
  const [id, setId] = useState<string | undefined>();

  const fetchProcessHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "production-process/all",
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

      setData(data.production_processes);
      setFilteredData(data.production_processes);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    isAddProcessDrawerOpened,
    isUpdateProcessDrawerOpened,
    isProcessDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const [deleteProcess] = useDeleteProcessMutation();

  const openAddProcessDrawerHandler = () => {
    dispatch(openAddProcessDrawer());
  };
  const closeAddProcessDrawerHandler = () => {
    dispatch(closeAddProcessDrawer());
  };
  const openProcessDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openProcessDetailsDrawer());
  };
  const closeProcessDetailsDrawerHandler = () => {
    dispatch(closeProcessDetailsDrawer());
  };
  const openUpdateProcessDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdateProcessDrawer());
  };
  const closeUpdateProcessDrawerHandler = () => {
    dispatch(closeUpdateProcessDrawer());
  };

  const deleteProcessHandler = async (id: string) => {
    try {
      const response = await deleteProcess(id).unwrap();
      toast.success(response.message);
      fetchProcessHandler();
    } catch (error: any) {
      console.log(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProcessHandler();
  }, []);

  useEffect(() => {
    const searchText = searchKey?.toLowerCase();
    const results = data.filter(
      (p: any) =>
        p.creator?.first_name?.toLowerCase()?.includes(searchText) ||
        p?.creator?.last_name?.toLowerCase()?.includes(searchText) ||
        p?.item?.name?.toLowerCase()?.includes(searchText) ||
        p?.status?.toLowerCase()?.includes(searchText) ||
        p?.em_store?.name?.toLowerCase()?.includes(searchText) ||
        p?.fg_store?.name?.toLowerCase()?.includes(searchText) ||
        p?.scrap_store?.name?.toLowerCase()?.includes(searchText) ||
        (p?.createdAt &&
          new Date(p?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchText?.replaceAll("/", "") || "")) ||
        (p?.updatedAt &&
          new Date(p?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchText?.replaceAll("/", "") || ""))
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
      {isAddProcessDrawerOpened && (
        <AddProcess
          fetchProcessHandler={fetchProcessHandler}
          closeDrawerHandler={closeAddProcessDrawerHandler}
        />
      )}
      {isProcessDetailsDrawerOpened && (
        <ProcessDetails
          id={id}
          closeDrawerHandler={closeProcessDetailsDrawerHandler}
        />
      )}
      {isUpdateProcessDrawerOpened && (
        <UpdateProcess
          id={id}
          closeDrawerHandler={closeUpdateProcessDrawerHandler}
          fetchProcessHandler={fetchProcessHandler}
        />
      )}

      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-2">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Production Process
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
            onClick={fetchProcessHandler}
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
            width={{ base: "-webkit-fill-available", md: 230 }}
            onClick={openAddProcessDrawerHandler}
            color="white"
            backgroundColor={MainColor}
          >
            Add New Production Process
          </Button>
        </div>
      </div>

      <div>
        <ProcessTable
          isLoadingProcess={isLoading}
          process={filteredData}
          deleteProcessHandler={deleteProcessHandler}
          openUpdateProcessDrawerHandler={openUpdateProcessDrawerHandler}
        />
      </div>
    </div>
  );
};

export default Process;
