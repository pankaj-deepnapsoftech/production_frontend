import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  Spinner,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import TrackProduction from "./TrackProduction"; // Import the TrackProduction component

interface Purchase {
  createdAt: string;
  product_name: string;
  product_type: string;
  price: number;
  product_qty: number;
  supplyer: string;
  invoice_number: string;
  Status: string;
}

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["access_token"]);
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);

      const token = cookies.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get<{ data: Purchase[] }>(
        `${process.env.REACT_APP_BACKEND_URL}purchase/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPurchases(response.data.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch purchase data";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // Or use .toLocaleString() for full date/time
  };

  const handleTrackProductionClick = (productName: string) => {
    setSelectedProductName(productName);
    onOpen();
  };

  return (
    <div className="md:ml-80 sm:ml-0 overflow-x-hidden">
      <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black">
        Purchase History
      </h3>
      <Box overflowX="auto" w="full" maxW="1000px">
        {isLoading ? (
          <Box textAlign="center" py={6}>
            <Spinner size="xl" color="teal.500" />
          </Box>
        ) : purchases.length > 0 ? (
          <Table variant="simple" colorScheme="teal">
            <TableCaption>History of all recent purchases</TableCaption>
            <Thead className="bg-teal-500 text-white">
              <Tr>
                <Th>S.No.</Th>
                <Th>Date</Th>
                <Th>Product Name</Th>
                <Th>Product Type</Th>
                <Th isNumeric>Production Price</Th>
                <Th isNumeric>Quantity</Th>
                <Th>Supplier</Th>
                <Th>Invoice No.</Th>
                <Th isNumeric>Total Price</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {purchases.map((purchase, index) => {
                const totalPrice = purchase.price * purchase.product_qty;
                return (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{formatDate(purchase.createdAt)}</Td>
                    <Td>{purchase.product_name}</Td>
                    <Td>{purchase.product_type}</Td>
                    <Td>{purchase.price} /-</Td>
                    <Td>{purchase.product_qty}</Td>
                    <Td>{purchase.supplyer}</Td>
                    <Td>{purchase.invoice_number}</Td>
                    <Td isNumeric>{totalPrice.toFixed(2)} /-</Td>
                    <Td>
                      <Button variant="link" color="teal.500" onClick={() => handleTrackProductionClick(purchase.product_name)}>
                        Track Production
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        ) : (
          <Box textAlign="center" py={6}>
            <p>No purchase history available.</p>
          </Box>
        )}
      </Box>

      {/* Include the TrackProduction component */}
      {selectedProductName && (
        <TrackProduction
          productName={selectedProductName}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default PurchaseHistory;
