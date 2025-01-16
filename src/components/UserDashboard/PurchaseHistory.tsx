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
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { MdEdit } from "react-icons/md";
import TrackProduction from "./TrackProduction";

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
  product_name: { name: string; process?: any }[]; // Unified declaration
  product_qty: number;
  product_type: string;
  designFile: string;
  _id: string;
}


const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["access_token"]);
  const [selectedProcess, setSelectedProcess] = useState<any | null>(null);
  const [designProcess, setDesignProcess] = useState<any | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const token = cookies.access_token;
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.get<{ data: Purchase[] }>(
        `${process.env.REACT_APP_BACKEND_URL}purchase/customer-get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPurchases(response.data.data);
      console.log(response.data.data);
      
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to fetch purchase data"
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
        error.response?.data?.message || error.message || "Failed to approve purchase"
      );
    }
  };

  const calculateTotalPrice = (purchase: Purchase): number => {
    const { price, product_qty, GST } = purchase;
    const gstMultiplier = 1 + (GST.CGST + GST.SGST + GST.IGST) / 100;
    return price * product_qty * gstMultiplier;
  };

  const handleTrackProduction = (designProcess: any, prodProcess: any) => {
    setDesignProcess(designProcess);
    setSelectedProcess(prodProcess);
    onOpen();
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  console.log(purchases)

  return (
    <div className="md:ml-80 sm:ml-0 overflow-x-hidden">
      <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black">
        Purchase History
      </h3>

      <Box p={5}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
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
            >
              <Box
                className={`absolute top-0 left-0 h-full w-2 ${
                  purchase?.Status === "Pending" ? "bg-red-500" : "bg-green-500"
                }`}
              ></Box>
              <HStack justifyContent="space-between">
                <VStack align="flex-start" spacing={1}>
                  <Text fontSize="sm" fontWeight="bold">
                    Date: {new Date(purchase?.createdAt).toLocaleDateString()}
                  </Text>
                  <Text fontSize="sm" className="text-gray-500">
                    Time: {new Date(purchase?.createdAt).toLocaleTimeString()}
                  </Text>
                </VStack>
                <VStack>
                  {purchase?.Status === "Pending" ? (
                    <Button
                      size="sm"
                      bg="orange.400"
                      _hover={{ bg: "orange.500" }}
                      color="white"
                      onClick={() => handleApprove(purchase._id)}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Badge colorScheme="green" fontSize="sm">
                      Status: {purchase?.Status}
                    </Badge>
                  )}
                </VStack>
              </HStack>
              <Divider my={2} />
              <HStack justifyContent="space-between">
                <VStack align="flex-start" spacing={2}>
                  <Text fontSize="sm" fontWeight="bold">
                    Product Name:{" "}
                    <span className="font-normal">
                      {purchase?.product_id?.[0].name}
                    </span>
                  </Text>
                  
                  <Text fontSize="sm" fontWeight="bold">
                    Quantity: <span className="font-normal">{purchase?.product_qty}</span>
                  </Text>
                </VStack>
                <VStack align="flex-end" spacing={2}>
                  <Text fontSize="sm" fontWeight="bold">
                    Price: <span className="font-normal">{purchase?.price}</span>
                  </Text>
                 
                </VStack>
              </HStack>
              <Divider my={2} />
              <HStack justifyContent="space-between">
                {purchase.Status === "Approve" && (
                  <Button
                    size="sm"
                    bgColor="white"
                    _hover={{ bgColor: "green.500" }}
                    className="border border-green-500 hover:text-white"
                    onClick={() => handleTrackProduction(purchase?.empprocess, purchase?.product_id[0]?.process[0]?.processes)}
                  >
                    Track Production
                  </Button>
                )}
              </HStack>
            </Box>
          ))
        )}
      </Box>

      {/* Track Production Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Track Production</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TrackProduction design={designProcess} process = {selectedProcess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PurchaseHistory;
