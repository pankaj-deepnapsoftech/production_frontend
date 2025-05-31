// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
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
  Input,
  Select,
} from "@chakra-ui/react";
import {
  useTable,
  useSortBy,
  usePagination,
} from "react-table";

import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import Loading from "../ui/Loading";
import { FcDatabase } from "react-icons/fc";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdEdit, MdOutlineRefresh } from "react-icons/md";
import UpdateCustomer from "./UpdateCustomer";
import CreateCustomer from "./CreateCustomer";
import { MainColor } from "../constants/constants";

const Customer: React.FC = () => {
  const [cookies] = useCookies();
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const initialPageSize = 10;

  const updateDisclosure = useDisclosure();
  const createDisclosure = useDisclosure();

  const columns = useMemo(
    () => [
      { Header: "Full Name", accessor: "full_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone Number", accessor: "phone" },
      { Header: "Customer Type", accessor: "type" },
      { Header: "Company Name", accessor: "company_name" },
      { Header: "GST No", accessor: "GST_NO" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state,
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredCustomers,
      manualPagination: true,
      initialState: { pageIndex: 0, pageSize: initialPageSize },
      pageCount: Math.ceil(total / initialPageSize),
    },
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  const fetchCustomers = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}customer/get-all?page=${page}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = response.data?.data || [];
      setCustomers(data);
      setFilteredCustomers(data);
      setTotal(response.data.total || data.length);
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers");
      toast.error(err.response?.data?.message || "Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    gotoPage(page - 1); // react-table is 0-based
  };

  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearch = customer?.full_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "" ||
        customer?.type?.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    });
    setFilteredCustomers(filtered);
  }, [searchQuery, filterType, customers]);

  const handleUpdate = (customer: any) => {
    setSelectedCustomer(customer);
    updateDisclosure.onOpen();
  };

  return (
    <>
      <Box className="max-w-7xl mx-auto">
        
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
        Customers
      </div>

      {/* Employees Page */}
      <div className="w-full  flex justify-between gap-4 pb-2">
        <div className="w-full">
          <Input
              className="w-full"
              placeholder="Search by customer name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              _focus={{
                borderColor: "#0d9488", // or any Chakra color like "teal.400"
                boxShadow: "0 0 0 1px #14b8a6" // optional for a ring-like effect
              }}
              transition="all 0.2s"
          />
        </div>
        <div className="flex  justify-between gap-4">
          <Select 
              width="150px"
              placeholder="Filter by type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              
              _hover={{
                borderColor: "#0d9488",
                backgroundColor: "white"
              }}
              _focus={{
                borderColor: "#0d9488",
                backgroundColor: "white",
                boxShadow: "0 0 0 1px #14b8a6"
              }}
              transition="all 0.2s"
              
            >
              <option  value="individual">Individual</option>
              <option  value="company">Company</option>
          </Select>
          <Button 
            onClick={createDisclosure.onOpen} 
            color="#ffffff"
            backgroundColor="#0d9488"
            _hover={{backgroundColor:"#14b8a6"}}
            className="py-3  text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          >
            New Customer
          </Button>
          <Button
            onClick={() => fetchCustomers(currentPage)}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
          >
            Refresh
          </Button>
          <Select
                value={pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setPageSize(newSize);
                  setCurrentPage(1);
                  gotoPage(0);
                }}
                width="80px"
              >
                {[10, 20, 50, 100, 100000].map((size) => (
                  <option key={size} value={size}>
                    {size === 100000 ? "All" : size}
                  </option>
                ))}
              </Select>
        </div>
        
      </div>



        {isLoading && <Loading />}

        {!isLoading && filteredCustomers.length === 0 && (
          <div className="mx-auto w-max text-center">
            <FcDatabase size={100} />
            <p className="text-lg">No Data Found</p>
          </div>
        )}

        {!isLoading && filteredCustomers.length > 0 && (
          <>
            <TableContainer maxHeight="600px" overflowY="auto">
              <Table variant="simple" {...getTableProps()}>
                <Thead>
                  {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <Th
                          key={column.id}
                          textTransform="capitalize"
                          fontSize="12px"
                          fontWeight="700"
                          color="white"
                          backgroundColor={MainColor}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <span className="flex items-center">
                            {column.render("Header")}
                            {column.isSorted && (
                              <span className="ml-1">
                                {column.isSortedDesc ? (
                                  <FaCaretDown />
                                ) : (
                                  <FaCaretUp />
                                )}
                              </span>
                            )}
                          </span>
                        </Th>
                      ))}
                      <Th
                        textTransform="capitalize"
                        fontSize="12px"
                        fontWeight="700"
                        color="white"
                        backgroundColor={MainColor}
                      >
                        Actions
                      </Th>
                    </Tr>
                  ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <Tr key={row.original._id} {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                        ))}
                        <Td>
                          <MdEdit
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() => handleUpdate(row.original)}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>

            <div className="w-[max-content] m-auto my-7">
              <button
                className="text-sm bg-table-color py-1 px-4 text-white border rounded-3xl disabled:bg-[#b2b2b2]"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="mx-3 text-sm">
                {currentPage} of {Math.ceil(total / pageSize)}
              </span>
              <button
                className="text-sm bg-table-color py-1 px-4 text-white border rounded-3xl disabled:bg-[#b2b2b2]"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(total / pageSize)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </Box>

      <Modal isOpen={updateDisclosure.isOpen} onClose={updateDisclosure.onClose}>
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

      <Modal isOpen={createDisclosure.isOpen} onClose={createDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create A New Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateCustomer
              onClose={createDisclosure.onClose}
              refresh={() => fetchCustomers(currentPage)}
            />
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
    </>
  );
};

export default Customer;
