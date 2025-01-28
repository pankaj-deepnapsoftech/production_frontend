//@ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Input,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import CreateCustomer from "./CreateCustomer";
import { useCookies } from "react-cookie";
import { FaEdit } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import Pagination from "./Pagination";
import UpdateCustomer from "./UpdateCustomer";

const headings = [
  "Full Name",
  "Email",
  "Phone Number",
  "Customer Type",
  "Company Name",
  "GST No",
  "Actions",
];

const Customer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cookies] = useCookies();
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const createDisclosure = useDisclosure();
  const updateDisclosure = useDisclosure();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}customer/get-all?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      setCustomers(response.data.data);
      setFilteredCustomers(response.data.data); // Initialize filtered customers
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers");
      toast.error(err.response?.data?.message || "Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  // Filter customers based on search query and type
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.full_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "" || customer.type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    });

    setFilteredCustomers(filtered);
  }, [searchQuery, filterType, customers]);

  const handleUpdate = (customer) => {
    setSelectedCustomer(customer);
    updateDisclosure.onOpen();
  };

  return (
    <Box className="max-w-7xl mx-auto p-5">
      <HStack className="flex justify-between items-center mb-5 mt-5">
        <Text className="text-lg font-bold">Customers</Text>
        <HStack className="space-x-2 w-full justify-end">
          <Button
            width="auto"
            onClick={createDisclosure.onOpen}
            colorScheme="blue"
          >
            New Customer
          </Button>
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchCustomers}
            leftIcon={<MdOutlineRefresh />}
            color="#1640d6"
            borderColor="#1640d6"
            variant="outline"
          >
            Refresh
          </Button>
        </HStack>
      </HStack>

      <HStack spacing={4} mb={5}>
        <Input
          placeholder="Search by customer name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          placeholder="Filter by type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="individual">Individual</option>
          <option value="company">Company</option>
        </Select>
      </HStack>

      <TableContainer className="mt-10">
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <Spinner size="xl" />
          </Box>
        ) : error ? (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        ) : (
          <Table variant="simple" className="w-full">
            <Thead>
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
              {filteredCustomers.map((customer) => (
                <Tr key={customer._id}>
                  <Td>{customer.full_name}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{customer.phone}</Td>
                  <Td>{customer.type}</Td>
                  <Td>
                    {customer.type === "company" ? customer.company_name : "-"}
                  </Td>
                  <Td>
                    {customer.type === "company" ? customer.GST_NO : "-"}
                  </Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      onClick={() => handleUpdate(customer)}
                    >
                      <FaEdit />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </TableContainer>

      <Modal
        isOpen={createDisclosure.isOpen}
        onClose={createDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateCustomer onClose={createDisclosure.onClose} />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              mr={3}
              onClick={createDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={updateDisclosure.isOpen}
        onClose={updateDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UpdateCustomer
              onClose={updateDisclosure.onClose}
              customerData={selectedCustomer}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              mr={3}
              onClick={updateDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Pagination page={page} setPage={setPage} length={customers.length} />
    </Box>
  );
};

export default Customer;
