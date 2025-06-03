import { Button, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import BOMTable from "../components/Table/BOMTable";
import { useDeleteBomMutation, useLazyFetchBomsQuery } from "../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddBomDrawer,
  closeBomDetailsDrawer,
  closeUpdateBomDrawer,
  openAddBomDrawer,
  openBomDetailsDrawer,
  openUpdateBomDrawer,
} from "../redux/reducers/drawersSlice";
import AddBom from "../components/Drawers/BOM/AddBom";
import BomDetails from "../components/Drawers/BOM/BomDetails";
import UpdateBom from "../components/Drawers/BOM/UpdateBom";
import { MainColor } from "../constants/constants";
import { useLocation } from "react-router-dom";
import Pagination from "./Pagination";

const BOM: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("Production");
  const [cookies] = useCookies();
  const [bomId, setBomId] = useState<string | undefined>();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [isLoadingBoms, setIsLoadingBoms] = useState<boolean>(false);
  const [boms, setBoms] = useState<any[]>([]);
  const [filteredBoms, setFilteredBoms] = useState<any[]>([]);
  const location = useLocation();
  const [deleteBom] = useDeleteBomMutation();
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    isAddBomDrawerOpened,
    isUpdateBomDrawerOpened,
    isBomDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openAddBomDrawerHandler = () => {
    dispatch(openAddBomDrawer());
  };
  const closeAddBomDrawerHandler = () => {
    dispatch(closeAddBomDrawer());
  };
  const openUpdateBomDrawerHandler = (id: string) => {
    setBomId(id);
    dispatch(openUpdateBomDrawer());
  };
  const closeUpdateBomDrawerHandler = () => {
    dispatch(closeUpdateBomDrawer());
  };
  const openBomDetailsDrawerHandler = (id: string) => {
    setBomId(id);
    dispatch(openBomDetailsDrawer());
  };
  const closeBomDetailsDrawerHandler = () => {
    dispatch(closeBomDetailsDrawer());
  };

  const fetchBomsHandler = async () => {
    try {
      setIsLoadingBoms(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}bom/all?page=${pages}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      
      if (!data?.success) {
        throw new Error(data?.message);
      }
      setBoms(data?.boms);
      setFilteredBoms(data?.boms);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBoms(false);
    }
  };

  const deleteBomHandler = async (id: string) => {
    try {
      const response = await deleteBom(id).unwrap();
      toast.success(response?.message);
      fetchBomsHandler();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchBomsHandler();
  }, [pages, limit]);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = boms?.filter(
      (bom: any) =>
       bom?.bom_name?.toLowerCase()?.includes(searchTxt) ||
       bom?.parts_count?.toString()?.toLowerCase()?.includes(searchTxt) ||
       bom?.total_cost?.toString()?.toLowerCase()?.includes(searchTxt) ||
        (bom?.approved_by?.first_name + ' ' + bom?.approved_by?.last_name)?.toString()?.toLowerCase()?.includes(searchTxt || '') ||
        (bom?.createdAt &&
          new Date(bom?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (bom?.updatedAt &&
          new Date(bom?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredBoms(results);
  }, [searchKey]);

  

  return (
    <div>
      {/* Add BOM */}
      {isAddBomDrawerOpened && (
        <AddBom
          closeDrawerHandler={closeAddBomDrawerHandler}
          fetchBomsHandler={fetchBomsHandler}      
        />
      )}
      {/* BOM Details */}
      {isBomDetailsDrawerOpened && (
        <BomDetails
          bomId={bomId}
          closeDrawerHandler={closeBomDetailsDrawerHandler}
        />
      )}
      {/* Update BOM */}
      {isUpdateBomDrawerOpened && (
        <UpdateBom
          bomId={bomId}
          closeDrawerHandler={closeUpdateBomDrawerHandler}
          fetchBomsHandler={fetchBomsHandler}
        />
      )}
        
        
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
        Bill Of Materials (BOM)
      </div>

      {/* Employees Page */}
      <div className="w-full  flex justify-between gap-4">
        <div className="w-full">
          <textarea
              className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#14b8a6] hover:outline:[#14b8a6] border resize-none border-[#0d9488]"
              rows={1}
              placeholder="Search"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
        </div>
        <div className="flex  justify-between gap-4">
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 200 }}
            onClick={openAddBomDrawerHandler}
            color="#ffffff"
              backgroundColor={MainColor}
              _hover={{backgroundColor:"#14b8a6"}}
              className="py-3  text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          >
            Add New BOM
          </Button>
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchBomsHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
          >
            Refresh
          </Button>
          <Select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              width={{ base: "100%", sm: "80px" }}
            >
              {[10, 20, 50, 100, 100000].map((size) => (
                <option key={size} value={size}>
                  {size === 100000 ? "All" : size}
                </option>
              ))}
            </Select>
        </div>
        
      </div>

      <div>
        <BOMTable
          isLoadingBoms={isLoadingBoms}
          boms={filteredBoms}
          openBomDetailsDrawerHandler={openBomDetailsDrawerHandler}
          openUpdateBomDrawerHandler={openUpdateBomDrawerHandler}
          deleteBomHandler={deleteBomHandler}
        />

        <Pagination page={pages} setPage={setPages} length={filteredBoms.length} />
      </div>
    </div>
  );
};

export default BOM;
