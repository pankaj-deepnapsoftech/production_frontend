import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import SampleCSV from "../assets/csv/store-sample.csv";
import {
  closeAddStoreDrawer,
  closeStoreDetailsDrawer,
  closeUpdateStoreDrawer,
  openAddStoreDrawer,
  openStoreDetailsDrawer,
  openUpdateStoreDrawer,
} from "../redux/reducers/drawersSlice";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import StoreTable from "../components/Table/StoreTable";
import AddStore from "../components/Drawers/Store/AddStore";
import StoreDetails from "../components/Drawers/Store/StoreDetails";
import UpdateStore from "../components/Drawers/Store/UpdateStore";
import {
  useDeleteStoresMutation,
  useStoreBulKUploadMutation,
} from "../redux/api/api";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { MainColor } from "../constants/constants";

const Stores: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("store");
  const [isLoadingStores, setIsLoadingStores] = useState<boolean>(false);
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [storeId, setStoreId] = useState<string | undefined>(); // Store Id to be updated or deleted
  const [stores, setStores] = useState<any>([]);
  const [filteredStores, setFilteredStores] = useState<any>([]);
  const {
    isAddStoreDrawerOpened,
    isUpdateStoreDrawerOpened,
    isStoreDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();
  const [cookies] = useCookies();

  const [deleteStore] = useDeleteStoresMutation();
  const [bulkUpload] = useStoreBulKUploadMutation();

  const openAddStoreDrawerHandler = () => {
    dispatch(openAddStoreDrawer());
  };

  const closeAddStoreDrawerHandler = () => {
    dispatch(closeAddStoreDrawer());
  };

  const openUpdateStoreDrawerHandler = (id: string) => {
    setStoreId(id);
    dispatch(openUpdateStoreDrawer());
  };

  const closeUpdateStoreDrawerHandler = () => {
    dispatch(closeUpdateStoreDrawer());
  };

  const openStoreDetailsDrawerHandler = (id: string) => {
    setStoreId(id);
    dispatch(openStoreDetailsDrawer());
  };

  const closeStoreDetailsDrawerHandler = () => {
    dispatch(closeStoreDetailsDrawer());
  };

  const fetchStoresHandler = async () => {
    try {
      setIsLoadingStores(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "store/all",
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
      setStores(data.stores);
      setFilteredStores(data.stores);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const deleteStoreHandler = async (id: string) => {
    try {
      const response = await deleteStore(id).unwrap();
      toast.success(response.message);
      fetchStoresHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
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
    fetchStoresHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = stores.filter(
      (st: any) =>
        st.name?.toLowerCase()?.includes(searchTxt) ||
        st.gst_number?.toLowerCase()?.includes(searchTxt) ||
        st.address_line1
          ?.toString()
          ?.toLowerCase()
          ?.toString()
          .includes(searchTxt) ||
        st.address_line2?.toLowerCase()?.includes(searchTxt) ||
        st.pincode?.toString().toString().includes(searchTxt) ||
        st?.city?.toString()?.includes(searchTxt) ||
        st?.state?.toString()?.includes(searchTxt) ||
        (st?.createdAt &&
          new Date(st?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (st?.updatedAt &&
          new Date(st?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredStores(results);
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
      <div>
        {/* Add Store Drawer */}
        {isAddStoreDrawerOpened && (
          <AddStore
            fetchStoresHandler={fetchStoresHandler}
            closeDrawerHandler={closeAddStoreDrawerHandler}
          />
        )}
        {/* Update Store Drawer */}
        {isUpdateStoreDrawerOpened && (
          <UpdateStore
            storeId={storeId}
            fetchStoresHandler={fetchStoresHandler}
            closeDrawerHandler={closeUpdateStoreDrawerHandler}
          />
        )}
        {/* Store Details Drawer */}
        {isStoreDetailsDrawerOpened && (
          <StoreDetails
            storeId={storeId}
            closeDrawerHandler={closeStoreDetailsDrawerHandler}
          />
        )}
        {/* Stores Page */}
        <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between mb-2">
          <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
            Stores
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
              onClick={fetchStoresHandler}
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
              onClick={openAddStoreDrawerHandler}
              color="white"
              backgroundColor={MainColor}
            >
              Add New Store
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
                      <FormLabel fontWeight="bold">
                        Choose File (.csv)
                      </FormLabel>
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
          <StoreTable
            stores={filteredStores}
            isLoadingStores={isLoadingStores}
            deleteStoreHandler={deleteStoreHandler}
            openStoreDetailsDrawerHandler={openStoreDetailsDrawerHandler}
            openUpdateStoreDrawerHandler={openUpdateStoreDrawerHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Stores;
