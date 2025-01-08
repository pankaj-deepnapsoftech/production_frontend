import { useEffect, useState } from "react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useUpdateAgentMutation } from "../../../redux/api/api";
import { useCookies } from "react-cookie";
import Loading from "../../../ui/Loading";

interface UpdateBuyerProps {
  closeDrawerHandler: () => void;
  fetchBuyersHandler: () => void;
  buyerId: string | undefined;
}

const UpdateBuyer: React.FC<UpdateBuyerProps> = ({
  closeDrawerHandler,
  fetchBuyersHandler,
  buyerId,
}) => {
  const [cookies] = useCookies();
  const [isUpdatingBuyer, setIsUpdatingBuyer] = useState<boolean>(false);
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

  const [updateBuyer] = useUpdateAgentMutation();

  const updateBuyerHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !phone ||
      !companyName ||
      !companyEmail ||
      !companyPhone ||
      !addressLine1 ||
      !city ||
      !state ||
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      phone.trim().length === 0 ||
      companyName.trim().length === 0 ||
      companyEmail.trim().length === 0 ||
      companyPhone.trim().length === 0 ||
      addressLine1.trim().length === 0 ||
      city.trim().length === 0 ||
      state.trim().length === 0
    ) {
      toast.error("Please provide all the fields");
      return;
    }

    try {
      setIsUpdatingBuyer(true);
      const response = await updateBuyer({
        _id: buyerId,
        agent_type: "buyer",
        name,
        email,
        phone,
        gst_number: gst,
        company_name: companyName,
        company_email: companyEmail,
        company_phone: companyPhone,
        address_line1: addressLine1,
        address_line2: addressLine2,
        pincode: pincode,
        city,
        state,
      }).unwrap();
      toast.success(response.message);
      fetchBuyersHandler();
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsUpdatingBuyer(false);
    }
  };

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
      setGst(data.agent?.gst_number);
      setCompanyName(data.agent.company_name);
      setCompanyEmail(data.agent.company_email);
      setCompanyPhone(data.agent.company_phone);
      setAddressLine1(data.agent.address_line1);
      setAddressLine2(data.agent?.address_line2);
      setPincode(data.agent?.pincode);
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

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
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
            Update Buyer
          </h2>

          {isLoadingBuyer && <Loading />}
          {!isLoadingBuyer && <form onSubmit={updateBuyerHandler}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Name"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Phone</FormLabel>
              <Input
                value={phone}
                className="no-scrollbar"
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                placeholder="Phone"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">GST Number</FormLabel>
              <Input
                value={gst}
                className="no-scrollbar"
                onChange={(e) => setGst(e.target.value)}
                type="text"
                placeholder="GST Number"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Company Name</FormLabel>
              <Input
                className="no-scrollbar"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                type="text"
                placeholder="Company Name"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Current Email</FormLabel>
              <Input
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                type="email"
                placeholder="Company Email"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Company Phone</FormLabel>
              <Input
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                type="number"
                placeholder="Company Phone"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Address Line 1</FormLabel>
              <Input
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                type="text"
                placeholder="Address Line 1"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Address Line 2</FormLabel>
              <Input
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                type="text"
                placeholder="Address Line 2"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Pincode</FormLabel>
              <Input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                type="text"
                placeholder="Pincode"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">City</FormLabel>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                placeholder="City"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">State</FormLabel>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                type="text"
                placeholder="State"
              />
            </FormControl>
            <Button
              isLoading={isUpdatingBuyer}
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#1640d6"
            >
              Submit
            </Button>
          </form>}
        </div>
      </div>
    </Drawer>
  );
};

export default UpdateBuyer;
