import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import Loading from "../../../ui/Loading";

interface BuyerDetailsProps{
    buyerId: string | undefined,
    closeDrawerHandler: ()=>void
}

const BuyerDetails: React.FC<BuyerDetailsProps> = ({buyerId, closeDrawerHandler})=>{
    const [cookies] = useCookies();
    const [isLoadingBuyer, setIsLoadingBuyer] = useState<boolean>(false);
    const [name, setName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [phone, setPhone] = useState<string | undefined>();
    const [gst, setGst] = useState<string | undefined>();
    const [companyName, setCompanyName] = useState<string | undefined>();
    const [companyEmail, setCompanyEmail] = useState<string | undefined>();
    const [companyPhone, setCompanyPhone] = useState<string | undefined>();
    const [addressLine1, setAddressLine1] = useState<string | undefined>();
    const [addressLine2, setAddressLine2] = useState<string | undefined>();
    const [pincode, setPincode] = useState<string | undefined>();
    const [city, setCity] = useState<string | undefined>();
    const [state, setState] = useState<string | undefined>();
    
  const fetchBuyerDetails = async () => {
    try {
      setIsLoadingBuyer(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `agent/${buyerId}`,
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
      setName(data.agent.name);
      setEmail(data.agent.email);
      setPhone(data.agent.phone);
      setGst(data.agent?.gst_number || 'N/A');
      setCompanyName(data.agent.company_name);
      setCompanyEmail(data.agent.company_email);
      setCompanyPhone(data.agent.company_phone);
      setAddressLine1(data.agent.address_line1);
      setAddressLine2(data.agent?.address_line2 || 'N/A');
      setPincode(data.agent?.pincode || 'N/A');
      setCity(data.agent.city);
      setState(data.agent.state);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBuyer(false);
    }
  };

  useEffect(() => {
    fetchBuyerDetails();
  }, []);
    return <Drawer closeDrawerHandler={closeDrawerHandler}>
    <div
      className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Buyer
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Buyer Details
        </h2>

        {isLoadingBuyer && <Loading />}
        {!isLoadingBuyer && (
          <div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">Name</p>
              <p>{name}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">Email</p>
              <p>{email}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">Phone</p>
              <p>{phone}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">GST Number</p>
              <p>{gst}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">Company Name</p>
              <p>{companyName}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">Company Email</p>
              <p>{companyEmail}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">Company Phone</p>
              <p>{companyPhone}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">Address Line 1</p>
              <p>{addressLine1}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">Address Line 2</p>
              <p>{addressLine2}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">Pincode</p>
              <p>{pincode}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">City</p>
              <p>{city}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-semibold">State</p>
              <p>{state}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </Drawer>
}

export default BuyerDetails;