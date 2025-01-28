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

const Dispatch = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [saleId, setSaleId] = useState("");
  const [paymentfile, setPaymentFile] = useState("");
  const [invoiceFile, setInvoiceFile] = useState("");
  const [verifystatus, setVerifyStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const invoiceDisclosure = useDisclosure();
  const paymentDisclosure = useDisclosure();
  const DispatchDisclosure = useDisclosure();

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
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateTotal = (
    price: number,
    qty: number,
    gst: number,
   
  ) => {
    const basePrice = price * qty;
    const gstval = (basePrice * gst)/100;
    const totalPrice = basePrice + gstval;
    return totalPrice;
  };

  const handleInvoiceUpload = (id: any, file: any) => {
    setSaleId(id);
    setInvoiceFile(file);
    invoiceDisclosure.onOpen();
  };

  const handlePayment = (id: any, payment: string, verify: boolean) => {
    setSaleId(id);
    setPaymentFile(payment);
    setVerifyStatus(verify);
    paymentDisclosure.onOpen();
  };

  const handleDispatch = (id: any) => {
    setSaleId(id);
    DispatchDisclosure.onOpen();
  };

  // Filtered data based on search query
  const filteredData = data?.filter((acc: any) =>
    acc?.item.some((sale: any) => {
      const customerName = sale?.customer_id[0]?.full_name.toLowerCase();
      const productName = sale?.product_id[0]?.name.toLowerCase();
      const saleBy = sale?.user_id[0]?.first_name.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      return (
        customerName.includes(searchLower) ||
        productName.includes(searchLower) ||
        saleBy.includes(searchLower)
      );
    })
  );

  return (
    <div className="overflow-x-hidden">
      <Box p={5}>
        <Text className="text-lg font-bold">Completed Products</Text>
        <HStack className="flex justify-between items-center mb-5 mt-5">
          <Input
            type="text"
            placeholder="Search by product, customer or saler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
          />

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
            >
              Refresh
            </Button>
          </HStack>
        </HStack>
      </Box>
      {filteredData?.map((acc: any) =>
        acc?.item.map((sale: any) => (
          <Box
            key={sale?._id}
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
                bg={sale?.product_status === "Dispatch" ? "orange" : "green"}
                borderRadius="md"
              />

              <HStack justify="space-between" mb={3} flexWrap="wrap" gap={4}>
                {/* Left Section */}
                <VStack align="start" w={{ base: "100%", md: "48%" }}>
                  <Text fontWeight="bold" fontSize="lg">
                    Sale By: {sale?.user_id[0]?.first_name || "N/A"}
                  </Text>
                  <Text fontWeight="bold" fontSize="sm" className="underline">
                    Date: {new Date(sale?.createdAt).toLocaleDateString()}
                  </Text>
                </VStack>

                {/* Right Section */}
                <VStack
                  align={{ base: "start", md: "end" }}
                  w={{ base: "100%", md: "48%" }}
                >
                  {sale?.paymet_status && (
                    <Badge
                      colorScheme={
                        sale?.paymet_status === "Pending" ? "orange" : "green"
                      }
                      fontSize="sm"
                    >
                      Payment Status:{" "}
                      {sale?.paymet_status === "Paied"
                        ? "Paid"
                        : sale?.paymet_status}
                    </Badge>
                  )}

                  {sale?.product_status && (
                    <Badge
                      colorScheme={
                        sale?.product_status === "Dispatch" ? "orange" : "green"
                      }
                      fontSize="sm"
                    >
                      Product Status: {sale?.product_status}
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
                    {sale?.customer_id[0]?.full_name || "N/A"}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Product Name:</strong>{" "}
                    {sale?.product_id[0]?.name || "N/A"}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Quantity:</strong> {sale?.product_qty || "N/A"}
                  </Text>
                
                </VStack>

                <VStack
                  align={{ base: "start", md: "end" }}
                  w={{ base: "100%", md: "48%" }}
                >
                  <Text fontSize="sm">
                    <strong>Price:</strong> {sale?.price * sale?.product_qty || "N/A"}
                  </Text>
                  <Text fontSize="sm">
                      <strong>GST :</strong> {sale?.GST}%
                    </Text>
                  <Text fontSize="sm">
                    <strong>Total Price:</strong>{" "}
                    {calculateTotal(
                      sale?.price,
                      sale?.product_qty,
                      sale?.GST
                    )}
                  </Text>
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
                <Button
                  bgColor="white"
                  leftIcon={<FaCloudUploadAlt />}
                  _hover={{ bgColor: "blue.500" }}
                  className="border border-blue-500 hover:text-white"
                  onClick={() => handleInvoiceUpload(sale?._id, sale?.invoice)}
                  width={{ base: "full", sm: "auto" }}
                >
                  Upload Invoice
                </Button>

                {sale?.customer_pyement_ss && (
                  <Button
                    bgColor="white"
                    leftIcon={<IoEyeSharp />}
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white"
                    onClick={() =>
                      handlePayment(
                        sale?._id,
                        sale?.customer_pyement_ss,
                        sale?.payment_verify
                      )
                    }
                    width={{ base: "full", sm: "auto" }}
                  >
                    View Payment
                  </Button>
                )}

                {sale?.payment_verify === true && (
                  <Button
                    bgColor="white"
                    leftIcon={<TbTruckDelivery />}
                    _hover={{ bgColor: "green.500" }}
                    className="border border-green-500 hover:text-white"
                    onClick={() => handleDispatch(sale?._id)}
                    width={{ base: "full", sm: "auto" }}
                  >
                    Dispatch
                  </Button>
                )}

                {sale?.customer_order_ss && (
                  <Button
                    bgColor="white"
                    leftIcon={<IoEyeSharp />}
                    _hover={{ bgColor: "yellow.500" }}
                    className="border border-yellow-500 hover:text-white"
                    width={{ base: "full", sm: "auto" }}
                  >
                    <a
                      href={sale?.customer_order_ss}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Delivery Proof
                    </a>
                  </Button>
                )}
              </HStack>
            </Box>
          </Box>
        ))
      )}

      {/* Modal for invoice upload, payment and dispatch */}
      <Modal
        isOpen={invoiceDisclosure.isOpen}
        onClose={invoiceDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UploadInvoice
              sale_id={saleId}
              invoicefile={invoiceFile}
              onClose={invoiceDisclosure.onClose}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              mr={3}
              onClick={() => invoiceDisclosure.onClose()}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={paymentDisclosure.isOpen}
        onClose={paymentDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PaymentModal
              sale_id={saleId}
              payment={paymentfile}
              verify={verifystatus}
              onClose={paymentDisclosure.onClose}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              mr={3}
              onClick={() => paymentDisclosure.onClose()}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
    </div>
  );
};

export default Dispatch;
