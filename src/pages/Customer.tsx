// @ts-nocheck
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
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import CreateCustomer from "./CreateCustomer";
import { useCookies } from "react-cookie";
import { FaEdit } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import Pagination from "./Pagination";

const headings = [
  "Full Name",
  "Email",
  "Phone Number",
  "Customer Type",
  "Company Name",
  "GST No",
];

const Customer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cookies] = useCookies();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page,setpage] = useState(1);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true); // Start loading
      setError(null); // Reset error
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}customer/get-all?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      setCustomers(response.data.data);
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

  return (
    <Box className="max-w-7xl mx-auto p-5">
      <HStack className="flex justify-between items-center mb-5 mt-5">
        <Text className="text-lg font-bold">Customers</Text>
        <HStack className="space-x-2">
        <Button
          bgColor="white"
          _hover={{ bgColor: "blue.500" }}
          className="border border-blue-500 hover:text-white"
          onClick={onOpen} // Open the modal
        >
          Add New Customer
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

      {/* Table to display customers */}
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
              {customers.map((customer) => (
                <Tr key={customer._id}>
                  <Td>{customer.full_name}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{customer.phone}</Td>
                  <Td>{customer.type}</Td>
                  <Td>
                    {customer.type === "company" ? customer.company_name : "-"}
                  </Td>
                  <Td>{customer.type === "company" ? customer.GST_NO : "-"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateCustomer />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Pagination page={page} setPage={setpage} length={customers.length} />
    </Box>
  );
};

export default Customer;
