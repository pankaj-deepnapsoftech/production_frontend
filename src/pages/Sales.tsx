//@ts-nocheck
import { useEffect, useState } from "react";
import {
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
  Badge,
  Divider,
  Input,
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
import Pagination from "./Pagination";

const Sales = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale");
  const createDisclosure = useDisclosure();
  const updateDisclosure = useDisclosure();
  const assignDisclosure = useDisclosure();
  const remarksDisclosure = useDisclosure();
  const [purchases, setPurchases] = useState<[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedSale, setSelectedSale] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["access_token"]);
  const [pages, setPages] = useState(1);
  const [comment, setComment] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const token = cookies.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}purchase/getAll?page=${pages}`,
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
      //console.log(error);
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchEmployees();
  }, [pages]);

  useEffect(() => {
    if (!purchases.length) {
      setFilteredPurchases([]);
      return;
    }
  
    const filteredData = purchases.filter((purchase) => {
      const matchesText = !filterText || [
        purchase?.user_id?.[0]?.first_name,
        purchase?.product_id?.[0]?.name,
        purchase?.customer_id[0]?.full_name,
      ]
        .filter(Boolean) // Filter out undefined/null values
        .some((field) => field.toLowerCase().includes(filterText.toLowerCase()));
  
      const matchesDate =
        !filterDate ||
        new Date(purchase?.createdAt).toISOString().split("T")[0] === filterDate;
  
      return matchesText && matchesDate;
    });
  
    setFilteredPurchases(filteredData);
  }, [filterText, filterDate, purchases]);

  const handleEditClick = (sale: any) => {
    setSelectedSale(sale);
    updateDisclosure.onOpen();
  };

  const handleAssignClick = (purchase: any) => {
    assignDisclosure.onOpen();
  };

  const handleRemarksClick = (comment: string) => {
    setComment(comment);
    remarksDisclosure.onOpen();
  };
  return (
    <div className="overflow-x-hidden">
      <Box p={5}>
      <Text className="text-lg font-bold">Sales</Text>
        <HStack className="flex justify-between items-center mb-5 mt-5">
          <Input
            type="text"
            placeholder="Search Sale..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
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
            {filteredPurchases?.map((purchase: any) => (
              <Box
                key={purchase?._id}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="lg"
                bg="white"
                p={4}
                w="100%"
                position="relative"
              >
                {/* Left colored bar */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  h="100%"
                  w={2}
                  bg={purchase?.Status === "Pending" ? "orange" : "green"}
                  borderRadius="md"
                />

                {/* Header */}
                <HStack justify="space-between" mb={3}>
                  <VStack align="start">
                    <Text fontWeight="bold" fontSize="lg">
                      Created By: {purchase?.user_id[0]?.first_name || "N/A"}
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" className="underline">
                      Date: {new Date(purchase?.createdAt).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <Badge
                    colorScheme={
                      purchase?.Status === "Pending" ? "orange" : "green"
                    }
                    fontSize="sm"
                  >
                    Customer Sale Approval: {purchase?.Status}
                  </Badge>
                </HStack>

                {/* Divider */}
                <Divider />

                {/* Task Details */}
                <HStack justify="space-between" spacing={3} mt={3}>
                  <VStack align="start">
                    <Text fontSize="sm">
                      <strong>Customer:</strong>{" "}
                      {purchase?.customer_id[0]?.full_name || "N/A"}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Product Name:</strong>{" "}
                      {purchase?.product_id[0]?.name || "N/A"}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Quantity:</strong> {purchase?.product_qty}
                    </Text>
                  </VStack>
                  <VStack align="start">
                    <Text fontSize="sm">
                      <strong>Price:</strong> {purchase?.price}
                    </Text>
                    {purchase?.comment ? (
                       <Text
                       className="text-blue-500 underline cursor-pointer"
                       onClick={() => handleRemarksClick(purchase?.comment)}
                     >
                       Remarks{" "}
                     </Text>
                    ) : null}
                   
                  </VStack>
                </HStack>

                {/* Footer */}
                <Divider my={3} />
                <HStack justify="space-between" mt={3}>
                  <Button
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white"
                    onClick={() => handleEditClick(purchase)}
                  >
                    Edit{" "}
                  </Button>
                  <Button
                    bgColor="white"
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white"
                    onClick={() => {
                      handleAssignClick();
                      setSelectedSale(purchase);
                    }}
                  >
                    Assign
                  </Button>
                </HStack>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Create Sale Modal */}
      <Modal
        isOpen={createDisclosure.isOpen}
        onClose={createDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new Sale</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateSale onClose={createDisclosure.onClose}/>
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
      <Modal
        isOpen={updateDisclosure.isOpen}
        onClose={updateDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Sale</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UpdateSale sale={selectedSale} onClose={updateDisclosure.onClose} />
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
      <Modal
        isOpen={assignDisclosure.isOpen}
        onClose={assignDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Assign empData={employees} saleData={selectedSale} onClose={assignDisclosure.onClose}/>
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

      {/* Remarks Modal */}
      <Modal
        isOpen={remarksDisclosure.isOpen}
        onClose={remarksDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remarks</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text className="p-3 bg-orange-100 mb-5">{comment}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Pagination page={pages} setPage={setPages} length={purchases.length} />
    </div>
  );
};

export default Sales;
