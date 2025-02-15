import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import AgentTable from "../components/Table/AgentTable";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddBuyerDrawer,
  closeBuyerDetailsDrawer,
  closeUpdateBuyerDrawer,
  openAddBuyerDrawer,
  openBuyerDetailsDrawer,
  openUpdateBuyerDrawer,
} from "../redux/reducers/drawersSlice";
import SampleCSV from "../assets/csv/agent-sample.csv";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddBuyer from "../components/Drawers/Buyer/AddBuyer";
import UpdateBuyer from "../components/Drawers/Buyer/UpdateBuyer";
import {
  useAgentBulKUploadMutation,
  useDeleteAgentMutation,
} from "../redux/api/api";
import BuyerDetails from "../components/Drawers/Buyer/BuyerDetails";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { MainColor } from "../constants/constants";

const Buyers: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("agent");
  const [cookies] = useCookies();
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [buyerId, setBuyerId] = useState<string | undefined>();
  const [isLoadingBuyers, setIsLoadingBuyers] = useState<boolean>(false);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<any[]>([]);

  const {
    isAddBuyerDrawerOpened,
    isUpdateBuyerDrawerOpened,
    isBuyerDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const [deleteBuyer] = useDeleteAgentMutation();
  const [bulkUpload] = useAgentBulKUploadMutation();

  const openAddBuyerDrawerHandler = () => {
    dispatch(openAddBuyerDrawer());
  };
  const closeAddBuyerDrawerHandler = () => {
    dispatch(closeAddBuyerDrawer());
  };
  const openUpdateBuyerDrawerHandler = (id: string) => {
    setBuyerId(id);
    dispatch(openUpdateBuyerDrawer());
  };
  const closeUpdateBuyerDrawerHandler = () => {
    dispatch(closeUpdateBuyerDrawer());
  };
  const openBuyerDetailsDrawerHandler = (id: string) => {
    setBuyerId(id);
    dispatch(openBuyerDetailsDrawer());
  };
  const closeBuyerDetailsDrawerHandler = () => {
    dispatch(closeBuyerDetailsDrawer());
  };

  const fetchBuyersHandler = async () => {
    try {
      setIsLoadingBuyers(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/buyers",
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
      setBuyers(data?.agents);
      setFilteredBuyers(data?.agents);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBuyers(false);
    }
  };

  const deleteBuyerHandler = async (id: string) => {
    try {
      const response = await deleteBuyer(id).unwrap();
      toast.success(response.message);
      fetchBuyersHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBuyers(false);
    }
  };

  const bulkUploadHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const file = fileRef?.current?.files?.[0];
    if (!file) {
      toast.error("CSV file not selected");
      return;
    }

    try {
      setBulkUploading(true);
      const formData = new FormData();
      formData?.append("excel", file);

      const response = await bulkUpload(formData).unwrap();
      toast.success(response?.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setBulkUploading(false);
    }
  };

  useEffect(() => {
    fetchBuyersHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = buyers.filter(
      (buyer: any) =>
        buyer?.name?.toLowerCase()?.includes(searchTxt) ||
        buyer?.email?.toLowerCase()?.includes(searchTxt) ||
        buyer?.phone?.toLowerCase()?.includes(searchTxt) ||
        buyer?.gst_number?.toLowerCase()?.includes(searchTxt) ||
        buyer?.company_name?.toLowerCase().includes(searchTxt) ||
        buyer?.company_email?.toLowerCase().includes(searchTxt) ||
        buyer?.company_phone?.toLowerCase().includes(searchTxt) ||
        buyer?.address_line1?.toLowerCase().includes(searchTxt) ||
        buyer?.address_line2?.toLowerCase()?.includes(searchTxt) ||
        buyer?.pincode?.toLowerCase()?.includes(searchTxt) ||
        buyer?.city?.toLowerCase().includes(searchTxt) ||
        buyer?.state?.toLowerCase().includes(searchTxt) ||
        (buyer?.createdAt &&
          new Date(buyer?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (buyer?.updatedAt &&
          new Date(buyer?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredBuyers(results);
  }, [searchKey]);
  
  if(!isAllowed){
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div>
      {/* Add Buyer Drawer */}
      {isAddBuyerDrawerOpened && (
        <AddBuyer
          fetchBuyersHandler={fetchBuyersHandler}
          closeDrawerHandler={closeAddBuyerDrawerHandler}
        />
      )}
      {/* Update Buyer Drawer */}
      {isUpdateBuyerDrawerOpened && (
        <UpdateBuyer
          buyerId={buyerId}
          closeDrawerHandler={closeUpdateBuyerDrawerHandler}
          fetchBuyersHandler={fetchBuyersHandler}
        />
      )}
      {/* Buyer Details Drawer */}
      {isBuyerDetailsDrawerOpened && (
        <BuyerDetails
          buyerId={buyerId}
          closeDrawerHandler={closeBuyerDetailsDrawerHandler}
        />
      )}
      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-2">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Buyers
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
            onClick={fetchBuyersHandler}
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
            onClick={openAddBuyerDrawerHandler}
            color="white"
            backgroundColor={MainColor}
          >
            Add New Buyer
          </Button>
          <div className="w-[200px]">
            <Button
              fontSize={{ base: "14px", md: "14px" }}
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "0", md: "3px" }}
              width={{ base: "-webkit-fill-available", md: 200 }}
              onClick={() => setShowBulkUploadMenu(true)}
              color="white"
              backgroundColor={MainColor}
              rightIcon={<AiFillFileExcel size={22} />}
            >
              Bulk Upload
            </Button>
            {showBulkUploadMenu && (
              <div className="mt-1 border border-[#a9a9a9] rounded p-1">
                <form>
                  <FormControl>
                    <FormLabel fontWeight="bold">Choose File (.csv)</FormLabel>
                    <Input
                      ref={fileRef}
                      borderWidth={1}
                      borderColor={"#a9a9a9"}
                      paddingTop={1}
                      type="file"
                      accept=".csv, .xlsx"
                    />
                  </FormControl>
                  <div className="flex gap-1">
                    <Button
                      type="submit"
                      fontSize={{ base: "14px", md: "14px" }}
                      onClick={bulkUploadHandler}
                      color="white"
                      backgroundColor={MainColor}
                      className="mt-1"
                      rightIcon={<AiFillFileExcel size={22} />}
                      isLoading={bulkUploading}
                    >
                      Upload
                    </Button>
                    <Button
                      type="button"
                      fontSize={{ base: "14px", md: "14px" }}
                      onClick={() => setShowBulkUploadMenu(false)}
                      color="white"
                      backgroundColor={MainColor}
                      className="mt-1"
                      rightIcon={<RxCross2 size={22} />}
                    >
                      Close
                    </Button>
                  </div>
                  <a href={SampleCSV}>
                    <Button
                      type="button"
                      fontSize={{ base: "14px", md: "14px" }}
                      width={{ base: "-webkit-fill-available", md: 190 }}
                      color="white"
                      backgroundColor={MainColor}
                      className="mt-1"
                      rightIcon={<AiFillFileExcel size={22} />}
                    >
                      Sample CSV
                    </Button>
                  </a>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <AgentTable
          agents={filteredBuyers}
          openUpdateAgentDrawerHandler={openUpdateBuyerDrawerHandler}
          openAgentDetailsDrawerHandler={openBuyerDetailsDrawerHandler}
          isLoadingAgents={isLoadingBuyers}
          deleteAgentHandler={deleteBuyerHandler}
        />
      </div>
    </div>
  );
};

export default Buyers;
