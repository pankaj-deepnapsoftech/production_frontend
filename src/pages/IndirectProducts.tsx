import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Select from "react-select";
import { MdOutlineRefresh } from "react-icons/md";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import SampleCSV from '../assets/csv/product-sample.csv';
import React, { useEffect, useRef, useState } from "react";
import {
  useDeleteProductMutation,
  useProductBulKUploadMutation,
} from "../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import ProductTable from "../components/Table/ProductTable";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddProductDrawer,
  closeProductDetailsDrawer,
  closeUpdateProductDrawer,
  openAddProductDrawer,
  openProductDetailsDrawer,
  openUpdateProductDrawer,
} from "../redux/reducers/drawersSlice";
import AddProduct from "../components/Drawers/Product/AddProduct";
import UpdateProduct from "../components/Drawers/Product/UpdateProduct";
import ProductDetails from "../components/Drawers/Product/ProductDetails";
import { MainColor } from "../constants/constants";

const IndirectProducts: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("inventory");
  const [cookies] = useCookies();
  
  const [data, setData] = useState([]);
  const [productId, setProductId] = useState<string | undefined>(); // Product Id to be updated or deleted
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Bulk upload menu
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);

  // Filters
  const [productServiceFilter, setProductServiceFilter] = useState<string>("");
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [storeFilter, setStoreFilter] = useState<
    { value: string; label: string } | undefined
  >();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);

  const [bulkUpload] = useProductBulKUploadMutation();

  const {
    isAddProductDrawerOpened,
    isUpdateProductDrawerOpened,
    isProductDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const [deleteProduct] = useDeleteProductMutation();

  const openAddProductDrawerHandler = () => {
    dispatch(openAddProductDrawer());
  };

  const closeProductDrawerHandler = () => {
    dispatch(closeAddProductDrawer());
  };

  const openUpdateProductDrawerHandler = (id: string) => {
    setProductId(id);
    dispatch(openUpdateProductDrawer());
  };

  const closeUpdateProductDrawerHandler = () => {
    dispatch(closeUpdateProductDrawer());
  };

  const openProductDetailsDrawerHandler = (id: string) => {
    setProductId(id);
    dispatch(openProductDetailsDrawer());
  };

  const closeProductDetailsDrawerHandler = () => {
    dispatch(closeProductDetailsDrawer());
  };

  const deleteProductHandler = async (id: string) => {
    try {
      const response: any = await deleteProduct({ _id: id }).unwrap();
      toast.success(response.message);
      fetchProductsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  const deletebulkProductHandler = async (ids: string[]) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}product/bulkdelete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({ ids }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete products");
      }
  
      const result = await response.json();
      console.log(result.message);
      toast.success(result.message);
      fetchProductsHandler()
      // Optional: refetch or update table state here
    } catch (error:any) {
      toast.error(error || "Something went wrong");
      console.error("Bulk delete failed", error);
    }
  };
  

  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  const fetchProductsHandler = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all?category=indirect",
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
      setData(results.products);
      setFilteredData(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchAllStores = async () => {
    try {
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
      let modifiedStores = [{ value: "", label: "All" }];
      modifiedStores.push(
        ...data.stores.map((store: any) => ({
          value: store._id,
          label: store.name,
        }))
      );
      setStoreOptions(modifiedStores);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleExport = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
  
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}product/exportindirectcsv`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
  
      if (!response.ok) {
        // Throw a custom error to be caught in catch block
        throw new Error(`Failed to export: ${response.statusText}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Optionally release the memory
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong during export.");
    } finally {
      setIsSubmitting(false);
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
      fetchProductsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setBulkUploading(false);
    }
  };

  useEffect(() => {
    fetchProductsHandler();
    fetchAllStores();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    // @ts-ignore
    const results = data.filter(
      (prod: any) =>
        (prod.product_or_service?.toLowerCase().includes(productServiceFilter) &&
        (storeFilter &&
        (storeFilter?.value === "" ||
          prod?.store?._id === storeFilter?.value))) &&
        (prod.name?.toLowerCase()?.includes(searchTxt) ||
          prod.product_id?.toLowerCase()?.includes(searchTxt) ||
          prod.category?.toLowerCase()?.includes(searchTxt) ||
          prod.price
            ?.toString()
            ?.toLowerCase()
            ?.toString()
            .includes(searchTxt) ||
          prod.uom?.toLowerCase()?.includes(searchTxt) ||
          prod.current_stock?.toString().toString().includes(searchTxt) ||
          prod?.min_stock?.toString()?.includes(searchTxt) ||
          prod?.max_stock?.toString()?.includes(searchTxt) ||
          prod?.hsn?.includes(searchTxt) ||
          (prod?.createdAt &&
            new Date(prod?.createdAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
          (prod?.updatedAt &&
            new Date(prod?.updatedAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              ?.reverse()
              ?.join("")
              ?.includes(searchTxt?.replaceAll("/", "") || "")))
    );
    setFilteredData(searchTxt ?  results : data);
  }, [searchKey, productServiceFilter, storeFilter]);

  if(!isAllowed){
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div>
      {/* Add Product Drawer */}
      {isAddProductDrawerOpened && (
        <AddProduct
          closeDrawerHandler={closeProductDrawerHandler}
          fetchProductsHandler={fetchProductsHandler}
        />
      )}
      {/* Update Product Drawer */}
      {isUpdateProductDrawerOpened && (
        <UpdateProduct
          closeDrawerHandler={closeUpdateProductDrawerHandler}
          productId={productId}
          fetchProductsHandler={fetchProductsHandler}
        />
      )}
      {/* Product Details Drawer */}
      {isProductDetailsDrawerOpened && (
        <ProductDetails
          closeDrawerHandler={closeProductDetailsDrawerHandler}
          productId={productId}
        />
      )}

      {/* Products Page */}
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
        Inventory
      </div>

      {/* Products Page */}
      <div className="w-full  flex justify-between gap-4 pb-2">
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
          <FormControl width={"-webkit-max-content"}>
            <select
              value={productServiceFilter}
              onChange={(e: any) => setProductServiceFilter(e.target.value)}
              className="w-[200px] rounded border border-[#a9a9a9] py-2 px-2"
            >
              <option value="">All Products/Services</option>
              <option value="product">Products</option>
              <option value="service">Services</option>
            </select>
          </FormControl>
          <FormControl width={"-webkit-max-content"}>
            <Select
              className="w-[200px] rounded border border-[#a9a9a9]"
              options={storeOptions}
              value={storeFilter}
              onChange={(d: any) => setStoreFilter(d)}
            />
          </FormControl>


          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            onClick={openAddProductDrawerHandler}
            color="#ffffff"
            backgroundColor={MainColor}
            _hover={{backgroundColor:"#14b8a6"}}
            className="py-3  text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          >
            Add New Product
          </Button>
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchProductsHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
          >
            Refresh
          </Button>
        </div>
        
        
        
             
      </div>
      <div className="w-full  flex gap-4">
        <Button
          fontSize={{ base: "14px", md: "14px" }}
          paddingY={{ base: "0", md: "3px" }}
          color="#ffffff"
          backgroundColor={MainColor}
          _hover={{backgroundColor:"#14b8a6"}}
          className="py-3  text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          onClick={handleExport} disabled={isSubmitting}
        >
          Export CSV
        </Button>
        <div className="w-[200px]">
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 200 }}
            onClick={() => setShowBulkUploadMenu(true)}
            color="#ffffff"
          backgroundColor={MainColor}
          _hover={{backgroundColor:"#14b8a6"}}
          className="py-3  text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
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

      <div>
        <ProductTable
          isLoadingProducts={isLoadingProducts}
          products={filteredData}
          openUpdateProductDrawerHandler={openUpdateProductDrawerHandler}
          openProductDetailsDrawerHandler={openProductDetailsDrawerHandler}
          deleteProductHandler={deleteProductHandler}
          deletebulkProductHandler={deletebulkProductHandler}
        />
      </div>
    </div>
  );
};

export default IndirectProducts;
