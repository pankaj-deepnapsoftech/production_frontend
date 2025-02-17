//@ts-nocheck
import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Divider,
  Button,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Image,
  Textarea,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh, MdOutlineTaskAlt } from "react-icons/md";
import TrackProduction from "./TrackProduction";
import Pagination from "../../pages/Pagination";
import { BiHappyHeartEyes, BiSad } from "react-icons/bi";
import ViewDesign from "./ViewDesign";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import UploadPayment from "./UploadPayment";
import DeliveryProof from "./DeliveryProof";
import moment from "moment";
import TokenProof from "./TokenProof";

interface Purchase {
  GST: {
    CGST: number;
    SGST: number;
    IGST: number;
  };
  Status: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  product_name: { name: string; process?: any };
  product_qty: number;
  product_type: string;
  designFile: string;
  _id: string;
}

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["access_token"]);
  const [selectedProcess, setSelectedProcess] = useState<any>([]);
  const [payment, setPayment] = useState("");
  const [purchaseId, setPurchaseId] = useState("");
  const [selectedData, setSelectedData] = useState<any>([]);
  const [designProcess, setDesignProcess] = useState<any>([]);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState("");
  const [orderFile, setOrderFile] = useState("");
  const [webLink, setWebLink] = useState("");
  const [pages, setPages] = useState(1);
  const [assignedData, setAssignedData] = useState([]);
  const [customerApprove, setCustomerApprove] = useState("");
  const [tokenFile, setTokenFile] = useState("");
  const [amount, setAmount] = useState();
  const {
    isOpen: isProductionModalOpen,
    onOpen: onProductionOpen,
    onClose: onProductionClose,
  } = useDisclosure();
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();
  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();

  const {
    isOpen: isDeliveryOpen,
    onOpen: onDeliveryOpen,
    onClose: onDeliveryClose,
  } = useDisclosure();

  const {
    isOpen: isProofOpen,
    onOpen: onProofOpen,
    onClose: onProofClose,
  } = useDisclosure();

  const {
    isOpen: isTokenOpen,
    onOpen: onTokenOpen,
    onClose: onTokenClose,
  } = useDisclosure();

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const token = cookies.access_token;
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}purchase/customer-get?page=${pages}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPurchases(response.data?.data);
      console.log(response.data.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch purchase data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (purchaseId: string) => {
    try {
      const token = cookies.access_token;
      if (!token) throw new Error("Authentication token not found");

      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/approve-status/${purchaseId}`,
        { Status: "Approved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Purchase approved successfully!");
      fetchPurchases(); // Refresh data
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve purchase"
      );
    }
  };

  const openDesignModal = (
    designFile: string,
    purchase: object,
    approve: string
  ) => {
    setSelectedDesign(designFile);
    setSelectedData(purchase);
    setCustomerApprove(approve);
    onImageOpen();
  };

  const handlePayment = (id: any, payment_ss: string) => {
    setPurchaseId(id);
    setPayment(payment_ss);
    onPaymentOpen();
  };

  const handleDelivery = (trackingId: string, link: string) => {
    setTrackingId(trackingId);
    setWebLink(link);
    onDeliveryOpen();
  };

  const handleProof = (id: any, file: any) => {
    setPurchaseId(id);
    setOrderFile(file);
    onProofOpen();
  };

  const calculateTotalPrice = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstVal = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstVal;
    return totalPrice;
  };

  const handleToken = (id: any, amount: number, tokenFile: any) => {
    setPurchaseId(id);
    setTokenFile(tokenFile);
    setAmount(amount);
    onTokenOpen();
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="md:ml-80 sm:ml-0 overflow-x-hidden">
      <HStack align="center" justify="space-between">
        <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black">
          Purchase History
        </h3>
        <Button
          fontSize="14px"
          paddingX="12px"
          paddingY="3px"
          width="100px"
          onClick={fetchPurchases}
          leftIcon={<MdOutlineRefresh />}
          color="#1640d6"
          borderColor="#1640d6"
          variant="outline"
        >
          Refresh
        </Button>
      </HStack>

      <Box p={5}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <Spinner size="xl" />
          </Box>
        ) : (
          purchases.map((purchase) => (
            <Box
              key={purchase?._id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
              bg="white"
              className="relative p-4 mt-3"
              w={{ base: "100%", md: "auto" }} // Full width on smaller screens, auto on medium screens
            >
              <Box
                className={`absolute top-0 left-0 h-full w-2 ${
                  purchase?.Status === "Pending" ? "bg-red-500" : "bg-green-500"
                }`}
              ></Box>

              <HStack justify="space-between" mb={3} flexWrap="wrap" gap={4}>
                <VStack align="start" w={{ base: "100%", md: "48%" }}>
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Date: {new Date(purchase?.createdAt).toLocaleDateString()}
                  </Text>
                  <Text
                    fontSize={{ base: "xs", sm: "sm" }}
                    className="text-gray-500"
                  >
                    Time: {new Date(purchase?.createdAt).toLocaleTimeString()}
                  </Text>
                </VStack>
                <VStack
                  align={{ base: "start", md: "end" }}
                  w={{ base: "100%", md: "48%" }}
                >
                  {purchase?.Status === "Pending" ? (
                    <Button
                      size="sm"
                      bg="orange.400"
                      _hover={{ bg: "orange.500" }}
                      color="white"
                      onClick={() => handleApprove(purchase?._id)}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Badge colorScheme="green" fontSize="sm">
                      Sale: {purchase?.Status}
                    </Badge>
                  )}

                  {purchase?.customer_approve === "Reject" ? (
                    <>
                      <Badge colorScheme="red" fontSize="sm">
                        Design: {purchase?.customer_approve}
                      </Badge>

                      <Text className="text-red-500">
                        <strong>Feedback:</strong>{" "}
                        {purchase?.customer_design_comment}
                      </Text>
                    </>
                  ) : purchase?.customer_approve === "Approve" ? (
                    <Badge colorScheme="green" fontSize="sm">
                      Design: {purchase?.customer_approve}
                    </Badge>
                  ) : null}

                  {purchase?.token_status ? (
                    <Badge colorScheme="green" fontSize="sm">
                      Token Amount: Paid
                    </Badge>
                  ) : null}

                  {purchase?.isSampleApprove ? (
                    <Badge colorScheme="green" fontSize="sm">
                      Sample Product: Approved
                    </Badge>
                  ) : null}

                  {purchase && purchase?.paymet_status ? (
                    <Badge
                      colorScheme={
                        purchase?.paymet_status === "Pending"
                          ? "orange"
                          : "green"
                      }
                      fontSize="sm"
                    >
                      Payment:{" "}
                      {purchase?.paymet_status === "Paied"
                        ? "Paid"
                        : purchase?.paymet_status}
                    </Badge>
                  ) : null}
                  

                  {purchase?.product_status ? (
                    <Badge
                      colorScheme={
                        purchase?.product_status === "Dispatch"
                          ? "orange"
                          : "green"
                      }
                      fontSize="sm"
                    >
                      Product Status: {purchase?.product_status}
                    </Badge>
                  ) : null}
                </VStack>
              </HStack>

              <Divider my={2} />
              <HStack
                justify="space-between"
                spacing={3}
                mt={3}
                flexWrap="wrap"
                gap={4}
              >
                <VStack align="start" w={{ base: "100%", md: "48%" }}>
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Product Name:{" "}
                    <span className="font-normal">
                      {purchase?.product_id?.[0]?.name}
                    </span>
                  </Text>

                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Quantity:{" "}
                    <span className="font-normal">{purchase?.product_qty}</span>
                  </Text>
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Price:{" "}
                    <span className="font-normal">
                      {purchase?.price * purchase?.product_qty}
                    </span>
                  </Text>

                  {purchase?.tracking_id && purchase?.tracking_web ? (
                    <Text
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() =>
                        handleDelivery(
                          purchase?.tracking_id,
                          purchase?.tracking_web
                        )
                      }
                    >
                      Track Delivery
                    </Text>
                  ) : null}
                </VStack>

                <VStack
                  align={{ base: "start", md: "end" }}
                  w={{ base: "100%", md: "48%" }}
                >
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    GST: <span className="font-normal">{purchase?.GST} %</span>
                  </Text>
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Total Price:{" "}
                    <span className="font-normal">
                      {calculateTotalPrice(
                        purchase?.price,
                        purchase?.product_qty,
                        purchase?.GST
                      ).toFixed(2)}
                    </span>
                  </Text>
                  {purchase?.productFile ? (
                    <a
                      href={purchase?.productFile}
                      target="_blank"
                      className="text-blue-500 font-semibold underline "
                    >
                      Product Image
                    </a>
                  ) : null}

                  {purchase?.token_amt ? (
                    <Text
                      className="text-blue-500 underline font-semibold cursor-pointer"
                      onClick={() =>
                        handleToken(
                          purchase?._id,
                          purchase?.token_amt,
                          purchase?.token_ss
                        )
                      }
                    >
                      {purchase?.token_status
                        ? "See Token Amount"
                        : "Pay Now For Sample"}
                    </Text>
                  ) : null}
                </VStack>
              </HStack>

              <Divider my={2} />
              <div className="flex flex-wrap gap-3">
                {purchase.Status === "Approved" && (
                  <Button
                    size={{ base: "xs", sm: "sm" }} // Smaller size for mobile
                    bgColor="white"
                    leftIcon={<MdOutlineTaskAlt />}
                    _hover={{ bgColor: "green.500" }}
                    className="border border-green-500 hover:text-white w-full sm:w-auto"
                    onClick={() => {
                      onProductionOpen();
                      setDesignProcess(purchase?.empprocess);

                      // Check if boms[1] exists, otherwise use boms[0]
                      const selectedBom =
                        purchase?.boms[1] || purchase?.boms[0];
                      const selectedProcess =
                        selectedBom?.production_processes[0]?.processes;

                      setSelectedProcess(selectedProcess);
                    }}
                  >
                    Track Production
                  </Button>
                )}

                {purchase?.designFile && (
                  <Button
                    size={{ base: "xs", sm: "sm" }} // Smaller size for mobile
                    leftIcon={<IoEyeSharp />}
                    bgColor="white"
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      openDesignModal(
                        purchase?.designFile,
                        purchase,
                        purchase?.customer_approve
                      )
                    }
                  >
                    View Design
                  </Button>
                )}

                {purchase?.invoice && (
                  <>
                    <Button
                      size={{ base: "xs", sm: "sm" }}
                      leftIcon={<IoEyeSharp />}
                      bgColor="white"
                      _hover={{ bgColor: "blue.500" }}
                      className="border border-blue-500 hover:text-white w-full sm:w-auto"
                    >
                      <a
                        href={purchase?.invoice}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Invoice
                      </a>
                    </Button>

                    <Button
                      size={{ base: "xs", sm: "sm" }}
                      leftIcon={<FaCloudUploadAlt />}
                      bgColor="white"
                      _hover={{ bgColor: "blue.500" }}
                      className="border border-blue-500 hover:text-white w-full sm:w-auto"
                      onClick={() =>
                        handlePayment(
                          purchase?._id,
                          purchase?.customer_pyement_ss
                        )
                      }
                    >
                      Attach Payment
                    </Button>
                  </>
                )}

                {purchase?.tracking_id && purchase?.tracking_web && (
                  <Button
                    size={{ base: "xs", sm: "sm" }}
                    leftIcon={<FaCloudUploadAlt />}
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      handleProof(purchase?._id, purchase?.customer_order_ss)
                    }
                  >
                    Attach Delivery Proof
                  </Button>
                )}
              </div>
            </Box>
          ))
        )}
      </Box>

      {/* Track Production Modal */}
      <Modal isOpen={isProductionModalOpen} onClose={onProductionClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Track Production</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TrackProduction
              designProcess={designProcess}
              productionProcess={selectedProcess}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* View Design Modal */}
      <Modal isOpen={isImageModalOpen} onClose={onImageClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Design</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDesign && selectedData && (
              <ViewDesign
                designUrl={selectedDesign}
                purchaseData={selectedData}
                approve={customerApprove}
                onClose={onImageClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* payment modal */}
      <Modal isOpen={isPaymentOpen} onClose={onPaymentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {purchaseId && (
              <UploadPayment
                id={purchaseId}
                paymentFile={payment}
                onClose={onPaymentClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* delivery modal */}
      <Modal isOpen={isDeliveryOpen} onClose={onDeliveryClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Track Delivery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              align="start"
              spacing={4}
              p={4}
              bg="white"
              rounded="md"
              boxShadow="lg"
              maxWidth="lg"
              w="full"
              className="border border-gray-300"
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="orange.500"
                className="text-center"
              >
                Here is the link and tracking ID of the delivery
              </Text>

              <Text
                color="red.600"
                className=" flex items-start w-full justify-start flex-col"
              >
                <strong className="text-black">Website Link:</strong>
                <a href={webLink} className=" w-full " target="_blank">
                  {webLink}
                </a>
              </Text>

              <Text color="red.600">
                <strong className="text-black">Tracking ID:</strong>{" "}
                {trackingId}
              </Text>
            </VStack>
          </ModalBody>
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
                onClose={onProofClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* token proof modal */}
      <Modal isOpen={isTokenOpen} onClose={onTokenClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {purchaseId && (
              <TokenProof
                id={purchaseId}
                tokenFile={tokenFile}
                amount={amount}
                onClose={onTokenClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Pagination page={pages} setPage={setPages} length={purchases.length} />
    </div>
  );
};

export default PurchaseHistory;
