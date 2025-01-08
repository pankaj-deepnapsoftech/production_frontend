import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Card from "../components/Dashboard/Card";
import Loading from "../ui/Loading";
import { IoIosDocument, IoMdCart } from "react-icons/io";
import { FaRupeeSign, FaStoreAlt, FaUser } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { IoPeople } from "react-icons/io5";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

const Dashboard: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [cookies] = useCookies();
  const { firstname } = useSelector((state: any) => state.auth);
  const [approvalsPending, setApprovalsPending] = useState<
    | {
        unapproved_product_count: number;
        unapproved_store_count: number;
        unapproved_merchant_count: number;
        unapproved_bom_count: number;
      }
    | undefined
  >();
  const [scrap, setScrap] = useState<
    | {
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [inventory, setInventory] = useState<
    | {
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [directInventory, setDirectInventory] = useState<
    | {
        total_low_stock: number;
        total_excess_stock: number;
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [indirectInventory, setIndirectInventory] = useState<
    | {
        total_low_stock: number;
        total_excess_stock: number;
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [stores, setStores] = useState<
    | {
        total_store_count: number;
      }
    | undefined
  >();
  const [boms, setBoms] = useState<
    | {
        total_bom_count: number;
      }
    | undefined
  >();
  const [merchants, setMerchants] = useState<
    | {
        total_supplier_count: number;
        total_buyer_count: number;
      }
    | undefined
  >();
  const [employees, setEmployees] = useState<
    | {
        _id: string;
        total_employee_count: number;
      }[]
    | undefined
  >();
  const [processes, setProcesses] = useState<
    | {
        ["raw material approval pending"]?: number;
        ["raw materials approved"]?: number;
        completed?: number;
        "work in progress"?: number;
      }
    | undefined
  >();
  const [totalProformaInvoices, setTotalProformaInvoices] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);

  const fetchSummaryHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify({
            from,
            to,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setDirectInventory(
        data.products?.[0]?._id === "direct"
          ? data.products?.[0]
          : data.products?.[1]
      );
      setIndirectInventory(
        data.products?.[0]?._id === "indirect"
          ? data.products?.[0]
          : data.products?.[1]
      );
      setScrap(data.scrap[0]);
      setInventory(data.wip_inventory[0]);
      setStores(data.stores);
      setMerchants(data.merchants);
      setBoms(data.boms);
      setApprovalsPending(data.approvals_pending);
      setEmployees(data.employees);
      setProcesses(data.processes);
      setTotalProformaInvoices(data.proforma_invoices);
      setTotalInvoices(data.invoices);
      setTotalPayments(data.payments);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilterHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (from && to) {
      fetchSummaryHandler();
    }
  };

  const resetFilterHandler = (e: React.FormEvent) => {
    e.preventDefault();

    setFrom("");
    setTo("");

    fetchSummaryHandler();
  };

  useEffect(() => {
    fetchSummaryHandler();
  }, []);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="text-3xl font-bold text-[#22075e]">
          Hi {firstname || ""},
        </div>

        <div>
          <form
            onSubmit={applyFilterHandler}
            className="flex items-end justify-between gap-2"
          >
            <FormControl>
              <FormLabel>From</FormLabel>
              <Input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                backgroundColor="white"
                type="date"
              />
            </FormControl>
            <FormControl>
              <FormLabel>To</FormLabel>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                backgroundColor="white"
                type="date"
              />
            </FormControl>
            <Button
              type="submit"
              fontSize={{ base: "14px", md: "14px" }}
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "0", md: "3px" }}
              width={{ base: "-webkit-fill-available", md: 150 }}
              color="white"
              backgroundColor="#319795"
            >
              Apply
            </Button>
            <Button
              type="submit"
              fontSize={{ base: "14px", md: "14px" }}
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "0", md: "3px" }}
              width={{ base: "-webkit-fill-available", md: 150 }}
              onClick={resetFilterHandler}
              color="white"
              backgroundColor="#319795"
            >
              Reset
            </Button>
          </form>
        </div>
      </div>

      {isLoading && <Loading />}
      {!isLoading && (
        <div>
          <div className="mb-2 mt-6 font-semibold text-xl">
            Employee Insights
          </div>
          {employees && employees.length === 0 && (
            <div className="text-center mb-2">No data found.</div>
          )}
          {employees && (
            <div className="grid grid-cols-4 gap-2">
              {employees.map((emp, ind) => {
                return (
                  <Card
                    primaryColor="#A83D9B"
                    secondaryColor="#A82298"
                    textColor="white"
                    title={emp?._id}
                    content={emp?.total_employee_count}
                    link="employee"
                    icon={<IoPeople color="#ffffff" size={28} />}
                  />
                );
              })}
            </div>
          )}
          <div className="mb-2 mt-6 font-semibold text-xl">
            Sales & Purchase Insights
          </div>
          {approvalsPending && (
            <div className="grid grid-cols-4 gap-2">
              <Card
                primaryColor="#A948E7"
                secondaryColor="#1E387B"
                textColor="white"
                title="Proforma Invoices"
                content={totalProformaInvoices}
                link="approval"
                icon={<IoMdCart color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="#A948E7"
                secondaryColor="#1E387B"
                textColor="white"
                title="Invoices"
                content={totalInvoices}
                link="approval"
                icon={<FaStoreAlt color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="#A948E7"
                secondaryColor="#1E387B"
                textColor="white"
                title="Payments"
                content={totalPayments}
                link="approval"
                icon={<FaUser color="#ffffff" size={28} />}
              />
            </div>
          )}
          <div className="mb-2 mt-6 font-semibold text-xl">
            Approvals Pending
          </div>
          {approvalsPending && (
            <div className="grid grid-cols-4 gap-2">
              <Card
                primaryColor="#273F7C"
                secondaryColor="#1E387B"
                textColor="white"
                title="Inventory"
                content={approvalsPending?.unapproved_product_count}
                link="approval"
                icon={<IoMdCart color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="#273F7C"
                secondaryColor="#1E387B"
                textColor="white"
                title="Stores"
                content={approvalsPending?.unapproved_store_count}
                link="approval"
                icon={<FaStoreAlt color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="#273F7C"
                secondaryColor="#1E387B"
                textColor="white"
                title="Merchants"
                content={approvalsPending?.unapproved_merchant_count}
                link="approval"
                icon={<FaUser color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="#273F7C"
                secondaryColor="#1E387B"
                textColor="white"
                title="BOMs"
                content={approvalsPending?.unapproved_bom_count}
                link="approval"
                icon={<IoIosDocument color="#ffffff" size={28} />}
              />
            </div>
          )}
          <div className="mb-2 mt-5 font-semibold text-xl">
            Inventory Insights
          </div>
          {directInventory && (
            <div className="grid grid-cols-4 gap-2 mt-4 mb-2">
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Direct Inventory"
                content={directInventory?.total_product_count}
                link="product"
                icon={<IoMdCart color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Stock Value"
                content={"₹ " + directInventory?.total_stock_price + "/-"}
                icon={<FaRupeeSign color="#ffffff" size={24} />}
                link="product"
              />
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Excess Stock"
                content={directInventory?.total_excess_stock}
                link="product"
                icon={<AiFillProduct color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Low Stock"
                content={directInventory?.total_low_stock}
                link="product"
                icon={<AiFillProduct color="#ffffff" size={28} />}
              />
            </div>
          )}
          {indirectInventory && (
            <div className="grid grid-cols-4 gap-2 mt-4 mb-2">
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Indirect Inventory"
                content={indirectInventory?.total_product_count}
                link="product"
                icon={<IoMdCart color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Stock Value"
                content={"₹ " + indirectInventory?.total_stock_price + "/-"}
                icon={<FaRupeeSign color="#ffffff" size={24} />}
                link="product"
              />
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Excess Stock"
                content={indirectInventory?.total_excess_stock}
                link="product"
                icon={<AiFillProduct color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Low Stock"
                content={indirectInventory?.total_low_stock}
                link="product"
                icon={<AiFillProduct color="#ffffff" size={28} />}
              />
            </div>
          )}
          <div className="grid grid-cols-4 gap-2 mt-4 mb-2">
            <Card
              primaryColor="#4CAAE4"
              secondaryColor="#32A1E7"
              textColor="white"
              title="Scrap Materials"
              content={scrap?.total_product_count?.toString() || ""}
              link="product"
              icon={<IoMdCart color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="#4CAAE4"
              secondaryColor="#32A1E7"
              textColor="white"
              title="Scrap Value"
              content={"₹ " + scrap?.total_stock_price + "/-"}
              icon={<FaRupeeSign color="#ffffff" size={24} />}
              link="product"
            />
            <Card
              primaryColor="#4CAAE4"
              secondaryColor="#32A1E7"
              textColor="white"
              title="WIP Inventory"
              content={inventory?.total_product_count?.toString() || ""}
              link="product"
              icon={<IoMdCart color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="#4CAAE4"
              secondaryColor="#32A1E7"
              textColor="white"
              title="WIP Inventory Value"
              content={"₹ " + inventory?.total_stock_price + "/-"}
              icon={<FaRupeeSign color="#ffffff" size={24} />}
              link="product"
            />
          </div>
          <div className="mb-2 mt-5 font-semibold text-xl">
            Store & Merchant Insights
          </div>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {stores && (
              <div>
                <Card
                  primaryColor="#E57E3D"
                  secondaryColor="#E56F27"
                  textColor="white"
                  title="Stores"
                  content={stores?.total_store_count}
                  link="store"
                  icon={<FaStoreAlt color="#ffffff" size={28} />}
                />
              </div>
            )}
            {merchants && (
              <Card
                primaryColor="#A948E7"
                secondaryColor="#A231E8"
                textColor="white"
                title="Buyers"
                content={merchants?.total_buyer_count}
                link="merchant/buyer"
                icon={<FaUser color="#ffffff" size={24} />}
              />
            )}
            {merchants && (
              <Card
                primaryColor="#A948E7"
                secondaryColor="#A231E8"
                textColor="white"
                title="Suppliers"
                content={merchants?.total_supplier_count}
                link="merchant/supplier"
                icon={<FaUser color="#ffffff" size={24} />}
              />
            )}
          </div>

          <div className="mb-2 mt-5 font-semibold text-xl">
            Production Insights
          </div>
          <div className="grid grid-cols-4 gap-2">
            {boms && (
              <Card
                primaryColor="#37A775"
                secondaryColor="#21A86C"
                textColor="white"
                title="BOMs"
                content={boms?.total_bom_count}
                link="bom"
                icon={<IoIosDocument color="#ffffff" size={28} />}
              />
            )}
            <Card
              primaryColor="#F03E3E"
              secondaryColor="#E56F27"
              textColor="white"
              title="Inventory Approval Pending"
              content={processes?.["raw material approval pending"] || 0}
              link="production/production-process"
              icon={<FaStoreAlt color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="#3392F8"
              secondaryColor="#E56F27"
              textColor="white"
              title="Inventory Approved"
              content={processes?.["raw materials approved"] || 0}
              link="production/production-process"
              icon={<FaStoreAlt color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="#E48C27"
              secondaryColor="#E56F27"
              textColor="white"
              title="Work In Progress"
              content={processes?.["work in progress"] || 0}
              link="production/production-process"
              icon={<FaStoreAlt color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="#409503"
              secondaryColor="#E56F27"
              textColor="white"
              title="Completed"
              content={processes?.completed || 0}
              link="production/production-process"
              icon={<FaStoreAlt color="#ffffff" size={28} />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
