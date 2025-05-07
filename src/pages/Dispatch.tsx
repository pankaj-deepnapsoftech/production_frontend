import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useColorModeValue,
  VStack,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import UploadInvoice from "./UploadInvoice";
import PaymentModal from "./PaymentModal";
import { TbTruckDelivery } from "react-icons/tb";
import DispatchData from "./DispatchData";
import { toast } from "react-toastify";
import DeliveryProof from "../components/UserDashboard/DeliveryProof";
const Dispatch = () => {
  const [cookies] = useCookies();
  const role = cookies?.role;
  const [data, setData] = useState([]);
  const [saleId, setSaleId] = useState("");
  const [trackId,setTrackId] = useState();
  const [trackLink,setTrackLink] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [purchaseId, setPurchaseId] = useState("");
  const DispatchDisclosure = useDisclosure();
  const [orderFile, setOrderFile] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(""); 
  const [selectedProductStatus, setSelectedProductStatus] = useState(""); 
  const [deliveryproofuser, setdeliveryproofuser] = useState(""); 
  
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}production-process/accountant-data`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      console.log(response.data?.data);    
      setData(response.data?.data);    
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateTotal = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstval = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstval;
    return totalPrice;
  };

  const handleDispatch = (id: any , trackId:any, link:any) => {
    setSaleId(id);
   setTrackId(trackId);
   setTrackLink(link);
    DispatchDisclosure.onOpen();
  };

  // Filter data based on selected dropdown values
  const filteredData = data?.filter((acc: any) => {
    const paymentStatus = acc?.bom?.sale_id[0]?.paymet_status || "";
    const productStatus = acc?.bom?.sale_id[0]?.product_status || "";

    return (
      (selectedPaymentStatus === "" ||
        paymentStatus === selectedPaymentStatus) &&
      (selectedProductStatus === "" || productStatus === selectedProductStatus)
    );
  });

  const {
      isOpen: isProofOpen,
      onOpen: onProofOpen,
      onClose: onProofClose,
    } = useDisclosure();

  const handleProof = (id: any, customerproof: any, dispatcherproof: any,) => {
    setPurchaseId(id);
    if (customerproof) {
      setOrderFile(customerproof);
      setdeliveryproofuser("Customer");
    } 
    if (dispatcherproof) {
      setOrderFile(dispatcherproof);
      setdeliveryproofuser("Dispatcher");
    }
    onProofOpen();
  };

  return (
    <div className="overflow-x-hidden">
      <Box p={5}>
        <Text className="text-lg font-bold">Completed Products</Text>
        <HStack className="flex justify-between items-center mb-5 mt-5">
          {/* filters */}
          <FormControl>
            <FormLabel fontSize="sm">Payment Status</FormLabel>
            <Select
              placeholder="All"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              size="sm"
            >
              <option value="Pending">Pending</option>
              <option value="Paied">Paid</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Product Status</FormLabel>
            <Select
              placeholder="All"
              value={selectedProductStatus}
              onChange={(e) => setSelectedProductStatus(e.target.value)}
              size="sm"
            >
              <option value="Dispatch">Dispatch</option>
              <option value="Delivered">Delivered</option>
            </Select>
          </FormControl>

          <HStack className="space-x-2">
            <Button
              fontSize={{ base: "14px", md: "14px" }}
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "0", md: "3px" }}
              width={{ base: "-webkit-fill-available", md: 100 }}
              leftIcon={<MdOutlineRefresh />}
              onClick={fetchData}
              color="#1640d6"
              borderColor="#1640d6"
              variant="outline"
              className="mt-6"
            >
              Refresh
            </Button>
          </HStack>
        </HStack>
      </Box>

      {filteredData?.map((acc: any) => (
        <Box
          key={acc?._id}
          maxW="100%"
          overflowX="auto"
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.200"
        >
          <Box
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
            p={4}
            w="100%"
            position="relative"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              h="100%"
              w={2}
              bg={
                acc?.bom?.sale_id[0]?.product_status === "Dispatch"
                  ? "orange"
                  : "green"
              }
              borderRadius="md"
            />

            <HStack justify="space-between" mb={3} flexWrap="wrap" gap={4}>
              {/* Left Section */}
              <VStack align="start" w={{ base: "100%", md: "48%" }}>
                <Text fontWeight="bold" fontSize="lg">
                  Sale By:{" "}
                  {acc?.bom?.sale_id[0]?.user_id[0]?.first_name || "N/A"}
                </Text>
                <Text fontWeight="bold" fontSize="sm" className="underline">
                  Date:{" "}
                  {new Date(
                    acc?.bom?.sale_id[0]?.createdAt
                  ).toLocaleDateString()}
                </Text>
              </VStack>

              {/* Right Section */}
              <VStack
                align={{ base: "start", md: "end" }}
                w={{ base: "100%", md: "48%" }}
              >
                {acc?.bom?.sale_id[0]?.paymet_status && (
                  <Badge
                    colorScheme={
                      acc?.bom?.sale_id[0]?.paymet_status === "Pending"
                        ? "orange"
                        : "green"
                    }
                    fontSize="sm"
                  >
                    Payment Status:{" "}
                    {acc?.bom?.sale_id[0]?.paymet_status === "Paied"
                      ? "Paid"
                      : acc?.bom?.sale_id[0]?.paymet_status}
                  </Badge>
                )}

                {acc?.bom?.sale_id[0]?.product_status && (
                  <Badge
                    colorScheme={
                      acc?.bom?.sale_id[0]?.product_status === "Dispatch"
                        ? "orange"
                        : "green"
                    }
                    fontSize="sm"
                  >
                    Product Status: {acc?.bom?.sale_id[0]?.product_status}
                  </Badge>
                )}
              </VStack>
            </HStack>

            <Divider />

            <HStack
              justify="space-between"
              spacing={3}
              mt={3}
              flexWrap="wrap"
              gap={4}
            >
              <VStack align="start" w={{ base: "100%", md: "48%" }}>
                <Text fontSize="sm">
                  <strong>Customer:</strong>{" "}
                  {acc?.bom?.sale_id[0]?.customer_id[0]?.full_name || "N/A"}
                </Text>
                <Text fontSize="sm">
                  <strong>Product Name:</strong>{" "}
                  {acc?.bom?.sale_id[0]?.product_id[0]?.name || "N/A"}
                </Text>
                <Text fontSize="sm">
                  <strong>Quantity:</strong>{" "}
                  {acc?.bom?.sale_id[0]?.product_qty || "N/A"}
                </Text>
              </VStack>

              <VStack
                align={{ base: "start", md: "end" }}
                w={{ base: "100%", md: "48%" }}
              >
                {(role == "Accountant" || role == "Sales" || role == "admin") ? (
                  <Text fontSize="sm">
                    <strong>Price:</strong>{" "}
                    {acc?.bom?.sale_id[0]?.price *
                      acc?.bom?.sale_id[0]?.product_qty || "N/A"}
                  </Text>
                ) : null}
                <Text fontSize="sm">
                  <strong>GST :</strong> {acc?.bom?.sale_id[0]?.GST}%
                </Text>
                {(acc?.bom?.sale_id[0]?.delivery_status_by_customer) ? (
                <Text fontSize="sm">
                  <strong>Delivery Status :</strong> {acc?.bom?.sale_id[0]?.delivery_status_by_customer}
                  <br />
                    {acc?.bom?.sale_id[0]?.delivery_status_comment_by_customer && (
                      <strong>Delivery Feedback :</strong>
                    )}
                    {acc?.bom?.sale_id[0]?.delivery_status_comment_by_customer}
                </Text>
                ) : null}

                {(role == "Accountant" || role == "Sales" || role == "admin") ? (
                  <Text fontSize="sm">
                    <strong>Total Price:</strong>{" "}
                    {calculateTotal(
                      acc?.bom?.sale_id[0]?.price,
                      acc?.bom?.sale_id[0]?.product_qty,
                      acc?.bom?.sale_id[0]?.GST
                    )}
                  </Text>
                ) : null}
              </VStack>
            </HStack>

            {/* Footer */}
            <Divider my={3} />
            <HStack
              justify={{ base: "center", sm: "space-between" }}
              mt={3}
              spacing={{ base: 3, sm: 4 }}
              flexWrap="wrap"
              className="sm:flex-col"
            >
              {acc?.bom?.sale_id[0]?.payment_verify === true && (
                <Button
                  bgColor="white"
                  leftIcon={<TbTruckDelivery />}
                  _hover={{ bgColor: "green.500" }}
                  className="border border-green-500 hover:text-white"
                  onClick={() => handleDispatch(acc?.bom?.sale_id[0]?._id, acc?.bom?.sale_id[0]?.tracking_id, acc?.bom?.sale_id[0]?.tracking_web)}
                  width={{ base: "full", sm: "auto" }}
                >
                  Dispatch
                </Button>
              )}
              {(acc?.bom?.sale_id[0]?.customer_order_ss || acc?.bom?.sale_id[0]?.dispatcher_order_ss) && (
                <Button
                  bgColor="white"
                  leftIcon={<IoEyeSharp />}
                  _hover={{ bgColor: "yellow.500" }}
                  className="border border-yellow-500 hover:text-white"
                  width={{ base: "full", sm: "auto" }}
                >
                  <a
                    href={acc?.bom?.sale_id[0]?.customer_order_ss || acc?.bom?.sale_id[0]?.dispatcher_order_ss}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Delivery Proof
                  </a>
                </Button>
              )}

              {acc?.bom?.sale_id[0]?.tracking_id && acc?.bom?.sale_id[0]?.tracking_web && (
                  <Button
                    size={{ base: "xs", sm: "sm" }}
                    leftIcon={<FaCloudUploadAlt />}
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      handleProof(acc?.bom?.sale_id[0]?._id, acc?.bom?.sale_id[0]?.customer_order_ss, acc?.bom?.sale_id[0]?.dispatcher_order_ss)
                    }
                  >
                    Attach Delivery Proof
                  </Button>
                )}
            </HStack>
          </Box>
        </Box>
      ))}

      {/*  dispatch */}

      <Modal
        isOpen={DispatchDisclosure.isOpen}
        onClose={DispatchDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dispatch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DispatchData
              sale_id={saleId}
              trackId = {trackId}
              trackLink = {trackLink}
              onClose={DispatchDisclosure.onClose}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              mr={3}
              onClick={() => DispatchDisclosure.onClose()}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* delivery proof modal */}
      <Modal isOpen={isProofOpen} onClose={onProofClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Delivery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {purchaseId && (
              <DeliveryProof
                id={purchaseId}
                orderfile={orderFile}
                userRole={role}
                deliveryproofupload={deliveryproofuser}
                onClose={onProofClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dispatch;
