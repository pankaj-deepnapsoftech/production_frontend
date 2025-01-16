//@ts-nocheck
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
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import CreateSale from "./CreateSale";
import UpdateSale from "./UpdateSale";
import { MdOutlineRefresh } from "react-icons/md";
import Assign from "./Assign";

const Sales = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale");
  const createDisclosure = useDisclosure();
  const updateDisclosure = useDisclosure();
  const assignDisclosure = useDisclosure();
  const [purchases, setPurchases] = useState<[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["access_token"]);

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const token = cookies.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}purchase/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setPurchases(response.data.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch purchase data";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = cookies.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const userRes = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}auth/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredEmployees = (userRes.data.users || []).filter(
        (user: any) => user.role
      );

      setEmployees(filteredEmployees); // Set the filtered employees
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch employees";
      toast.error(errorMessage);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchEmployees();
  }, []);

  const headings = [
    "Date",
    "Customer",
    "Product Name",
    "Product Type",
    "Product Quantity",
    "Product Price",
    "Customer_Approval",
    "Actions",
  ];

  const handleEditClick = (sale: any) => {
    setSelectedSale(sale);
    updateDisclosure.onOpen();
  };

  const handleAssignClick = (purchase: any) => {
    setSelectedSale(purchase);
    assignDisclosure.onOpen();
  };

  return (
    <div className="overflow-x-hidden">
      <Box p={5}>
        <HStack className="flex justify-between items-center mb-5 mt-5">
          <Text className="text-lg font-bold">Sales</Text>
          <HStack className="space-x-2">
            <Button
              bgColor="white"
              _hover={{ bgColor: "blue.500" }}
              className="border border-blue-500 hover:text-white px-5"
              onClick={createDisclosure.onOpen}
            >
              Add New Sale
            </Button>
            <Button
              fontSize={{ base: "14px", md: "14px" }}
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "0", md: "3px" }}
              width={{ base: "-webkit-fill-available", md: 100 }}
              onClick={fetchPurchases}
              leftIcon={<MdOutlineRefresh />}
              color="#1640d6"
              borderColor="#1640d6"
              variant="outline"
            >
              Refresh
            </Button>
          </HStack>
        </HStack>

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
          <Box
            maxW="100%"
            overflowX="auto"
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.200"
          >
            <Table variant="simple" className="w-full">
              <TableCaption>All Sales Data</TableCaption>
              <Thead className="text-sm font-semibold ">
                <Tr>
                  {headings.map((name, index) => (
                    <Th
                      className="bg-table-color"
                      textTransform="capitalize"
                      fontSize="12px"
                      fontWeight="700"
                      color="white"
                      borderLeft="1px solid #d7d7d7"
                      borderRight="1px solid #d7d7d7"
                      key={index}
                    >
                      {name}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {purchases?.map((purchase: any) => (
                  <Tr key={purchase?._id}>
                    <Td>{new Date(purchase?.createdAt).toLocaleDateString()}</Td>
                    <Td>{purchase?.customer_id[0]?.full_name || "N/A"}</Td>
                    <Td>{purchase?.product_id[0]?.name || "N/A"}</Td>
                    <Td>{purchase?.product_type || "N/A"}</Td>
                    <Td>{purchase?.product_qty}</Td>
                    <Td>{purchase?.price}</Td>

                    <Td
                      style={{
                        color: purchase?.Status === "Pending" ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {purchase?.Status}
                    </Td>

                    <Td className="flex gap-2 items-center justify-center">
                      <Button
                         bgColor="white"
                         _hover={{ bgColor: "blue.500" }}
                         className="border border-blue-500 hover:text-white"
                        onClick={() => handleEditClick(purchase)}
                      >Edit </Button>
                      <Button
                          bgColor="white"
                          _hover={{ bgColor: "orange.500" }}
                          className="border border-orange-500 hover:text-white"
                          onClick={() => handleAssignClick(purchase)}
                        >
                          Assign
                        </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Create Sale Modal */}
      <Modal isOpen={createDisclosure.isOpen} onClose={createDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new Sale</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateSale />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              onClick={createDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Sale Modal */}
      <Modal isOpen={updateDisclosure.isOpen} onClose={updateDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Sale</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UpdateSale sale={selectedSale} />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              onClick={updateDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Assign Employee Modal */}
      <Modal isOpen={assignDisclosure.isOpen} onClose={assignDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Assign empData = {employees} saleData = {purchases}/>
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              onClick={assignDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Sales;
