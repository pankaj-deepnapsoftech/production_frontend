import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AgentTable from "../components/Table/AgentTable";
import {
  closeAddSellerDrawer,
  closeSellerDetailsDrawer,
  closeUpdateSellerDrawer,
  openAddSellerDrawer,
  openSellerDetailsDrawer,
  openUpdateSellerDrawer,
} from "../redux/reducers/drawersSlice";
import SampleCSV from "../assets/csv/agent-sample.csv";
import AddSeller from "../components/Drawers/Seller/AddSeller";
import UpdateSeller from "../components/Drawers/Seller/UpdateSeller";
import {
  useAgentBulKUploadMutation,
  useDeleteAgentMutation,
} from "../redux/api/api";
import SellerDetails from "../components/Drawers/Seller/SellerDetails";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { MainColor } from "../constants/constants";

const Sellers: React.FC = () => {
  const [sellerId, setSellerId] = useState<string | undefined>();
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isSellersLoading, setIsSellersLoading] = useState<boolean>(false);
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [sellers, setSellers] = useState<any[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<any[]>([]);

  const dispatch = useDispatch();
  const {
    isAddSellerDrawerOpened,
    isUpdateSellerDrawerOpened,
    isSellerDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);

  const [deleteSeller] = useDeleteAgentMutation();
  const [bulkUpload] = useAgentBulKUploadMutation();

  const openAddSellerDrawerHandler = () => {
    dispatch(openAddSellerDrawer());
  };
  const closeAddSellerDrawerHandler = () => {
    dispatch(closeAddSellerDrawer());
  };
  const openUpdateSellerDrawerHandler = (id: string) => {
    setSellerId(id);
    dispatch(openUpdateSellerDrawer());
  };
  const closeUpdateSellerDrawerHandler = () => {
    dispatch(closeUpdateSellerDrawer());
  };
  const openSellerDetailsDrawerHandler = (id: string) => {
    setSellerId(id);
    dispatch(openSellerDetailsDrawer());
  };
  const closeSellerDetailsDrawerHandler = () => {
    dispatch(closeSellerDetailsDrawer());
  };

  const deleteSellerHandler = async (id: string) => {
    try {
      const response = await deleteSeller(id).unwrap();
      toast.success(response.message);
      fetchSellersHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchSellersHandler = async () => {
    try {
      setIsSellersLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/suppliers",
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
      setSellers(data.agents);
      setFilteredSellers(data.agents);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsSellersLoading(false);
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
      formData.append("excel", file);

      const response = await bulkUpload(formData).unwrap();
      toast.success(response.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setBulkUploading(false);
    }
  };

  useEffect(() => {
    fetchSellersHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = sellers.filter(
      (seller: any) =>
        seller.name?.toLowerCase()?.includes(searchTxt) ||
        seller.email?.toLowerCase()?.includes(searchTxt) ||
        seller.phone?.toLowerCase()?.includes(searchTxt) ||
        seller?.gst_number?.toLowerCase()?.includes(searchTxt) ||
        seller.company_name.toLowerCase().includes(searchTxt) ||
        seller.company_email.toLowerCase().includes(searchTxt) ||
        seller.company_phone.toLowerCase().includes(searchTxt) ||
        seller.address_line1.toLowerCase().includes(searchTxt) ||
        seller?.address_line2?.toLowerCase()?.includes(searchTxt) ||
        seller?.pincode?.toLowerCase()?.includes(searchTxt) ||
        seller.city.toLowerCase().includes(searchTxt) ||
        seller.state.toLowerCase().includes(searchTxt) ||
        (seller?.createdAt &&
          new Date(seller?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (seller?.updatedAt &&
          new Date(seller?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredSellers(results);
  }, [searchKey]);

  return (
    <div>
      {/* Add Seller */}
      {isAddSellerDrawerOpened && (
        <AddSeller
          closeDrawerHandler={closeAddSellerDrawerHandler}
          fetchSellersHandler={fetchSellersHandler}
        />
      )}
      {/* Update Seller */}
      {isUpdateSellerDrawerOpened && (
        <UpdateSeller
          closeDrawerHandler={closeUpdateSellerDrawerHandler}
          sellerId={sellerId}
          fetchSellersHandler={fetchSellersHandler}
        />
      )}
      {/* Seller Details */}
      {isSellerDetailsDrawerOpened && (
        <SellerDetails
          sellerId={sellerId}
          closeDrawerHandler={closeSellerDetailsDrawerHandler}
        />
      )}

      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between mb-2">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Suppliers
        </div>

        <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 items-start gap-x-2 w-full md:w-fit">
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
            onClick={fetchSellersHandler}
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
            onClick={openAddSellerDrawerHandler}
            color="white"
            backgroundColor={MainColor}
          >
            Add New Supplier
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
          agents={filteredSellers}
          openUpdateAgentDrawerHandler={openUpdateSellerDrawerHandler}
          openAgentDetailsDrawerHandler={openSellerDetailsDrawerHandler}
          isLoadingAgents={isSellersLoading}
          deleteAgentHandler={deleteSellerHandler}
        />
      </div>
    </div>
  );
};

export default Sellers;
