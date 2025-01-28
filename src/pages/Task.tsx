//@ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Divider,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useDisclosure,
  useColorModeValue,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { FaCheck, FaUpload } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import axios, { Axios } from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
import { NavLink, useNavigate } from "react-router-dom";

const Task = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [cookies] = useCookies();
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState(null);
  const dropZoneBg = useColorModeValue("gray.100", "gray.700");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const role = cookies?.role;
  const navigate = useNavigate();
 // console.log(role);
  

  const [filters, setFilters] = useState({
    status: "",
    date: "",
    manager: "",
    productName: "",
    search: "",
  });

  const fetchTasks = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}assined/get-assined?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      console.log("task", response.data.data);

      const tasks = response.data.data.map((task) => {
        // Ensure that sale_id, product_id, and user_id are valid and have values
        const sale = task?.sale_id?.[0];
        const product = task?.sale_id?.[0].product_id?.[0];
        const assign = task?.assined_by?.[0];

        return {
          id: task?._id,
          date: new Date(task.createdAt).toLocaleDateString(),
          productName: product?.name || "No product name",
          productQuantity: sale?.product_qty || 0,
          productPrice: `${sale?.price || 0} /-`,
          assignedBy: `${assign?.first_name}`,
          role: `${assign?.role}`,
          design_status: task?.isCompleted,
          design_approval: sale?.customer_approve,
          customer_design_comment: sale?.customer_design_comment,
          sale_id: sale?._id,
          designFile: sale?.designFile,
          assinedby_comment: task?.assinedby_comment,
          assined_process: task?.assined_process,
          bom: sale?.bom
         
        };
      });

      setTasks(tasks);
      console.log("new",tasks);           
    } catch (error) {
      console.log(error);
    }finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [cookies?.access_token, page]);

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const colorChange = (color) => {
    if (color === "Pending") {
      return "orange";
    } else if (color === "Reject") {
      return "red";
    } else {
      return "green";
    }
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    return (
      (!filters.status || task.design_status === filters.status) &&
      (!filters.date || task.date === filters.date) &&
      (!filters.search ||
        task.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignedBy.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const handleOpenModal = (task) => {
    //console.log(task);

    setSelectedTask(task);
    setFile(null);
    onOpen();
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById("file-input");
    fileInput && fileInput.click();
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    // Validate that the file is an image
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, GIF).");
      return;
    }

    // Form data for uploading
    const formData = new FormData();
    formData.append("image", file);
    formData.append("assined_to", selectedTask.id);
    formData.append("assinedto_comment", comment);

    try {
      // Upload the image to the backend
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/upload-image/${selectedTask?.sale_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("File uploaded successfully.");
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);

      onClose();
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}assined/update-status/${id}`,
        { isCompleted: "UnderProcessing" },
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      //console.log(response);

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);

      toast.error(error);
    }
  };

  const handleDone =  async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}assined/update-status/${id}`,
        { isCompleted: "Completed" },
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      //console.log(response);

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);

      toast.error(error);
    }
  };

  const handleBOM = (id)=>{
    //console.log(id);
    navigate('/production/bom', {state: {id}});

  }
  //console.log(tasks);

  return (
    <div className="overflow-x-hidden">
      <HStack className="flex justify-between items-center mb-5 mt-5">
        <Text className="text-lg font-bold">Tasks</Text>
        <HStack className="space-x-2">
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "full", md: 100 }}
            onClick={fetchTasks}
            leftIcon={<MdOutlineRefresh />}
            color="#1640d6"
            borderColor="#1640d6"
            variant="outline"
          >
            Refresh
          </Button>
        </HStack>
      </HStack>

      <HStack spacing={4} mb={5} mt={5} flexWrap="wrap" align="start" gap={4}>
        <FormControl w={{ base: "100%", md: "30%" }}>
          <FormLabel>Status</FormLabel>
          <Select
            placeholder="Select Status"
            fontSize="sm"
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
        </FormControl>

        <FormControl w={{ base: "100%", md: "30%" }}>
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            fontSize="sm"
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
        </FormControl>

        <FormControl w={{ base: "100%", md: "30%" }}>
          <FormLabel>Search</FormLabel>
          <Input
            placeholder="Search by Product or Manager"
            fontSize="sm"
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </FormControl>
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
        <VStack spacing={5}>
          {tasks.map((task) => (
          
            <Box
              key={task._id}
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
                bg={colorChange(task.design_status)}
                borderRadius="md"
              />

              {/* Header */}
              <HStack
                justify="space-between"
                mb={3}
                flexWrap="wrap"
                align="start"
              >
                <Text fontWeight="bold" fontSize="lg">
                  {task.productName}
                </Text>
                <Badge
                  colorScheme={colorChange(task.design_status)}
                  fontSize="sm"
                >
                  <strong>Task:</strong> {task?.design_status}
                </Badge>
              </HStack>

              {/* Divider */}
              <Divider />

              {/* Task Details */}
              <HStack
                justify="space-between"
                spacing={3}
                mt={3}
                flexWrap="wrap"
                align="start"
                gap={4}
              >
                <VStack align="start" w={{ base: "100%", md: "48%" }}>
                  <Text fontSize="sm">
                    <strong>Product Price:</strong> {task.productPrice}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Quantity:</strong> {task.productQuantity}
                  </Text>
                </VStack>
                <VStack
                  align={{ base: "start", md: "end" }}
                  w={{ base: "100%", md: "48%" }}
                >
                  <Text fontSize="sm">
                    <strong>Assigned By:</strong> {task.assignedBy}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Assigned Process:</strong> {task?.assined_process}
                  </Text>
                  {task?.assinedby_comment ? (
                    <Text fontSize="sm">
                      <strong>Remarks:</strong> {task?.assinedby_comment}
                    </Text>
                  ) : null}
                </VStack>
              </HStack>

              {/* Footer */}
              <Divider my={3} />
                  {role.toLowerCase().includes('prod') ? (
                   <HStack className="space-x-3">
                   {task?.design_status === "Pending" ? (
                     <Button                   
                     colorScheme="teal"
                     size="sm"                    
                     onClick={() => handleAccept(task?.id)}>
                      Accept Task
                     </Button>
                   ) : null}
                   
                   {task?.design_status === "UnderProcessing" ? (
                    <>
                    {task?.bom.length > 0 ? (
                       <Badge
                       colorScheme="green"
                       fontSize="sm"
                     >
                       <strong>BOM:</strong> Created
                     </Badge>
                    ) : (
                       <Button                   
                       colorScheme="teal"
                       size="sm"
                       onClick={()=>handleBOM(task?.sale_id)}
                       >
                       Create BOM
                       </Button>  
                    )}
                     
                   
                    {task?.design_status != "Completed" ? (
                      <Button                   
                      colorScheme="orange"
                      leftIcon={<FaCheck />}
                      size="sm"                    
                      onClick={() => handleDone(task?.id)}>
                      Task Done
                      </Button>
                    ) : null}
                    
                    </>

                  ) : null}              
                   
                    
                    </HStack>
                
                    
                  ) : (
                    <HStack
                    justify="space-between"
                    mt={3}
                    flexWrap="wrap"
                    align="center"
                    gap={4}
                  >
                    {task?.design_status === "Pending" ? (
                      <Button
                        leftIcon={<FaCheck />}
                        colorScheme="teal"
                        size="sm"
                        onClick={() => handleAccept(task?.id)}
                      >
                        Accept Task
                      </Button>
                    ) : task?.design_status === "UnderProcessing" ? (
                      <Button
                        leftIcon={<FaUpload />}
                        colorScheme="teal"
                        size="sm"
                        onClick={() => handleOpenModal(task)}
                      >
                        Upload File
                      </Button>
                    ) : task?.design_approval === "Approve" ? (
                      <Badge colorScheme="green" fontSize="sm">
                        Customer Approval: {task.design_approval}
                      </Badge>
                    ) : task?.design_approval === "Reject" ? (
                      <VStack align="start">
                        <Badge colorScheme="red" fontSize="sm">
                          Customer Approval: {task.design_approval}
                        </Badge>
                        <Text className="text-red-500">
                          Feedback: {task.customer_design_comment}
                        </Text>
                        <Button
                          leftIcon={<FaUpload />}
                          colorScheme="teal"
                          size="sm"
                          onClick={() => handleOpenModal(task)}
                        >
                          Re-Upload File
                        </Button>
                      </VStack>
                    ) : (
                      <Text fontSize="sm">
                        <strong>Uploaded File:</strong>{" "}
                        <a
                          href={task.designFile}
                          className="text-blue-500 underline"
                          target="_blank"
                        >
                          preview
                        </a>
                      </Text>
                    )}
    
                    <Text fontSize="sm">
                      <strong>Date:</strong> {task.date}
                    </Text>
                  </HStack>
                  )}
              
            </Box>
          ))}
        </VStack>
      )}

      {/* Modal for File Upload */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Task</FormLabel>
                <Text fontWeight="bold">{selectedTask?.productName}</Text>
              </FormControl>
              <FormControl>
                <FormLabel>Upload File</FormLabel>
                <Box
                  p={4}
                  borderWidth="2px"
                  borderColor={file ? "teal.500" : "gray.300"}
                  borderRadius="md"
                  bg={dropZoneBg}
                  textAlign="center"
                  onDrop={handleFileDrop}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnter={(event) => event.preventDefault()}
                  onClick={triggerFileInput}
                  cursor="pointer"
                >
                  {file ? (
                    <Text fontSize="sm" color="teal.500">
                      {file.name}
                    </Text>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      Drag and drop a file here, or{" "}
                      <Text as="span" color="blue.500" cursor="pointer">
                        browse
                      </Text>
                    </Text>
                  )}
                </Box>
                <Input
                  type="file"
                  id="file-input"
                  display="none"
                  onChange={(event) =>
                    setFile(event.target.files ? event.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Remarks:</FormLabel>
                <Input
                  type="text"
                  id="assinedto_comment"
                  placeholder="Add Details (if any)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleFileUpload}
              isDisabled={!file}
            >
              Upload
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Pagination page={page} setPage={setPage} length={tasks.length} />
    </div>
  );
};

export default Task;
