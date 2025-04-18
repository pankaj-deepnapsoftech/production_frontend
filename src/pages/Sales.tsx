//@ts-nocheck
import { useEffect, useState } from "react";
import Salestatus from "./Salestatus";
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
  Select,
  Img,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import CreateSale from "./CreateSale";
import UpdateSale from "./UpdateSale";
import { MdOutlineRefresh } from "react-icons/md";
import Assign from "./Assign";
import Pagination from "./Pagination";
import TokenAmount from "./TokenAmount";
import SampleModal from "./SampleModal";

import ViewDesign from "./ViewDesign";

const Sales = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale");
  const createDisclosure = useDisclosure();
  const updateDisclosure = useDisclosure();
  const assignDisclosure = useDisclosure();
  const remarksDisclosure = useDisclosure();
  const tokenDisclosure = useDisclosure();
  const sampleDisclosure = useDisclosure();
  const [purchases, setPurchases] = useState<[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedSale, setSelectedSale] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["access_token", "role"]);
  const [pages, setPages] = useState(1);
  const [comment, setComment] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);
  const [tokenAmount, setTokenAmount] = useState();
  const [productionStatus, setProductionStatus] = useState("");
  const [approveStatus, setApproveStatus] = useState<boolean>();

  const {
    isOpen: isImageModalOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();

  
  const [customerApprove, setCustomerApprove] = useState("");
  const [selectedData, setSelectedData] = useState<any>([]);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  const openSalestatusModal = (
    designFile: string,
    purchase: object,
    approve: string
  ) => {
    setSelectedDesign(designFile);
    setSelectedData(purchase);
    setCustomerApprove(approve);
    onImageOpen();
  };

  const openAccountModal = (
    designFile: string,
    purchase: object,
    approve: string
  ) => {
    setSelectedData(purchase);
    onAccountpreviewOpen();
  };


  const openDesignModal = (
    designFile: string,
    purchase: object,
    approve: string
  ) => {
    setSelectedDesign(designFile);
    setSelectedData(purchase);
    setCustomerApprove(approve);
    onDesignerOpen();
  };

  const {
    isOpen: isAccountpreviewOpen,
    onOpen: onAccountpreviewOpen,
    onClose: onAccountpreviewClose,
  } = useDisclosure();

  // designer preview
  const {
    isOpen: isDesignModalOpen,
    onOpen: onDesignerOpen,
    onClose: onDesignerClose,
  } = useDisclosure();

  const role = cookies?.role;
  const token = cookies.access_token;

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);

      if (!token) {
        throw new Error("Authentication token not found");
      }

      let url = "";
      if (role === "admin") {
        url = `${process.env.REACT_APP_BACKEND_URL}purchase/getAll?page=${pages}`;
      } else {
        url = `${process.env.REACT_APP_BACKEND_URL}purchase/getOne?page=${pages}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchases(response.data.data);
      console.log(response.data.data);
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
      const matchesText =
        !filterText ||
        [
          purchase?.user_id?.[0]?.first_name,
          purchase?.product_id?.[0]?.name,
          purchase?.customer_id[0]?.full_name,
        ]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(filterText.toLowerCase())
          );

      const matchesDate =
        !filterDate ||
        new Date(purchase?.createdAt).toISOString().split("T")[0] ===
          filterDate;

      const matchesStatus =
        !filterStatus ||
        purchase?.Status?.toLowerCase() === filterStatus.toLowerCase();

      return matchesText && matchesDate && matchesStatus;
    });

    setFilteredPurchases(filteredData);
  }, [filterText, filterDate, filterStatus, purchases]);

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

  const calculateTotalPrice = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstVal = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstVal;
    return totalPrice;
  };

  const handleSample = (id: any, approve: boolean) => {
    setSelectedSale(id);
    setApproveStatus(approve);
    sampleDisclosure.onOpen();
  };

  return (
    <div className="overflow-x-hidden">
      <Box p={5}>
        <Text className="text-lg font-bold">Sales</Text>
        <HStack className="flex-wrap justify-between items-center mb-5 mt-5 space-y-4 md:space-y-0">
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
            gap={4}
            width="100%"
          >
            <Input
              type="text"
              placeholder="Search Sale..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full md:w-auto"
            />
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full md:w-auto"
            />
            <Select
              placeholder="Filter by Sale Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </Select>
          </Box>

          <HStack className="space-x-2 w-full md:w-auto justify-end">
            <Button
              bgColor="white"
              _hover={{ bgColor: "blue.500" }}
              className="border border-blue-500 hover:text-white px-5 w-full md:w-auto"
              onClick={createDisclosure.onOpen}
            >
              Add New Sale
            </Button>
            <Button
              fontSize={{ base: "14px", md: "14px" }}
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "0", md: "3px" }}
              width={{ base: "full", md: 100 }}
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
        ) : filteredPurchases.length === 0 ? (
          <Text className="text-red-500 text-center">
            No Sale Data to show...
          </Text>
        ) : (
          <Box
            maxW="100%"
            overflowX="auto"
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.200"
            p={4}
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
                mb={4}
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
                <HStack justify="space-between" mb={3} flexWrap="wrap" gap={3}>
                  <VStack align="start" w={{ base: "100%", md: "auto" }}>
                    <Text fontWeight="bold" fontSize="lg">
                      Created By: {purchase?.user_id[0]?.first_name || "N/A"}
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" className="underline">
                      Date: {new Date(purchase?.createdAt).toLocaleDateString()}
                    </Text>
                  </VStack>

                  <VStack align="start" w={{ base: "100%", md: "auto" }}>
                    <Badge
                      colorScheme={
                        purchase?.Status === "Pending" ? "orange" : "green"
                      }
                      fontSize="sm"
                    >
                      Sale Approval: {purchase?.Status}
                    </Badge>

                    {purchase?.Status === "Approved" &&
                      purchase?.customer_approve &&
                      purchase?.designFile && (
                        <Badge
                          colorScheme={
                            purchase?.customer_approve === "Approve"
                              ? "green"
                              : "red"
                          }
                          fontSize="sm"
                        >
                          Design Approval: {purchase?.customer_approve}
                        </Badge>
                      )}

                    {purchase?.token_amt && purchase?.token_status === false ? (
                      <Badge colorScheme="orange" fontSize="sm">
                        Token Amount : Pending
                      </Badge>
                    ) : null}

                    {purchase?.salestatus == "Reject" ? (
                      <Badge colorScheme="red" fontSize="sm">
                        Sales Department : Rejected
                        <p>
                          Feedback : {purchase?.salestatus_comment}
                        </p>
                      </Badge>
                    ) : null}

                    {purchase?.salestatus == "Approve" ? (
                      <Badge colorScheme="green" fontSize="sm">
                        Sales Department : Approved
                      </Badge>
                    ) : null}

                    {purchase?.token_status ? (
                      <Badge colorScheme="green" fontSize="sm">
                        Token Amount :{" "}
                        {purchase?.token_status ? "Paid" : "Pending"}
                      </Badge>
                    ) : null}

                    {purchase?.isSampleApprove ? (
                      <Badge colorScheme="green" fontSize="sm">
                        Sample Status: Approved
                      </Badge>
                    ) : null}

                    {purchase?.paymet_status && (
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
                    )}

                    {purchase?.product_status && (
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
                    )}
                  </VStack>
                </HStack>

                {/* Divider */}
                <Divider />

                {/* Task Details */}
                <HStack
                  justify="space-between"
                  spacing={3}
                  mt={3}
                  flexWrap="wrap"
                  gap={3}
                >
                  <VStack align="start" w={{ base: "100%", md: "auto" }}>
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
                    <Text fontSize="sm">
                      <strong>Price:</strong>{" "}
                      {purchase?.price * purchase?.product_qty}
                    </Text>
                  </VStack>
                  <VStack align="start" w={{ base: "100%", md: "auto" }}>
                    <Text fontSize="sm">
                      <strong>GST :</strong> {purchase?.GST}%
                    </Text>
                    <Text fontSize="sm">
                      <strong>Total Price :</strong>{" "}
                      {calculateTotalPrice(
                        purchase?.price,
                        purchase?.product_qty,
                        purchase?.GST
                      ).toFixed(2)}
                    </Text>

                    {purchase?.comment && (
                      <Text
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() => handleRemarksClick(purchase?.comment)}
                      >
                        Remarks{" "}
                      </Text>
                    )}
                    {purchase?.designFile ? (
                      <a
                        href={purchase?.designFile}
                        target="_blank"
                        className="text-blue-500 underline text-sm"
                      >
                        Uploded Design File
                      </a>
                    ) : null}

                    {purchase?.token_ss ? (
                      <a
                        href={purchase?.token_ss}
                        target="_blank"
                        className="text-blue-500 underline text-sm"
                      >
                        {" "}
                        View Token Proof{" "}
                      </a>
                    ) : null}
                  </VStack>
                </HStack>

                {/* Footer */}
                <Divider my={3} />
                <HStack justify="space-between" mt={3} flexWrap="wrap" gap={3}>
                  <Button
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white"
                    w={{ base: "100%", md: "auto" }}
                    onClick={() => handleEditClick(purchase)}
                  >
                    Edit{" "}
                  </Button>

                  {purchase?.token_ss &&
                  purchase?.boms[0]?.production_processes?.every(
                    (processGroup) =>
                      processGroup?.processes?.every(
                        (process) => process?.done === true
                      )
                  ) ? (
                    <Button
                      bgColor="white"
                      _hover={{ bgColor: "red.500" }}
                      className="border border-red-500 hover:text-white"
                      w={{ base: "100%", md: "auto" }}
                      onClick={() =>
                        handleSample(purchase?._id, purchase?.isSampleApprove)
                      }
                    >
                      Approve Sample
                    </Button>
                  ) : null}

                  {purchase?.token_status ? (
                  <Button
                    bgColor="white"
                    _hover={{ bgColor: "green.500" }}
                    className="border border-green-500 hover:text-white"
                    w={{ base: "100%", md: "auto" }}
                    onClick={() => {
                      openAccountModal(
                        purchase?.designFile,
                        purchase,
                        purchase?.customer_approve
                      )
                    }}
                  >
                    Preview
                  </Button>
                  ) : null}
                  
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
                  
                  {role === 'Sales' && (
                    <Button
                      bgColor="white"
                      _hover={{ bgColor: "orange.500" }}
                      className="border border-red-500 hover:text-white"
                      w={{ base: "100%", md: "auto" }}
                      onClick={() =>
                        openSalestatusModal(
                          purchase?.designFile,
                          purchase,
                          purchase?.salestatus
                        )
                      }
                    >
                      Status
                    </Button>
                  )}

                  
                  <Button
                    bgColor="white"
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white"
                    w={{ base: "100%", md: "auto" }}
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
            <CreateSale
              onClose={createDisclosure.onClose}
              refresh={fetchPurchases}
            />
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
            <UpdateSale
              sale={selectedSale}
              onClose={updateDisclosure.onClose}
            />
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
            <Assign
              empData={employees}
              saleData={selectedSale}
              onClose={assignDisclosure.onClose}
            />
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

      {/* sample modal */}
      <Modal
        isOpen={sampleDisclosure.isOpen}
        onClose={sampleDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Approve Sample</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SampleModal
              sale={selectedSale}
              onClose={sampleDisclosure.onClose}
              refresh={fetchPurchases}
              approveStatus={approveStatus}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              onClick={sampleDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* sales status Modal */}
      <Modal isOpen={isImageModalOpen} onClose={onImageClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sales Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* {selectedDesign && selectedData && ( */}
              <Salestatus
                designUrl={selectedDesign}
                purchaseData={selectedData}
                approve={customerApprove}
                onClose={onImageClose}
              />
            {/* )} */}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* View Design Modal */}
      <Modal isOpen={isDesignModalOpen} onClose={onDesignerClose}>
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
                onClose={onDesignerClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* account payment preview */}
      <Modal isOpen={isAccountpreviewOpen} onClose={onAccountpreviewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Img src={selectedData?.token_ss} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Pagination page={pages} setPage={setPages} length={purchases.length} />
    </div>
  );
};

export default Sales;
