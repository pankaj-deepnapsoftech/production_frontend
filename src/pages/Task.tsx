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
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Pagination from "./Pagination";

const Task = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [cookies] = useCookies();
  const [file, setFile] = useState(null);
  const [comment,setComment] = useState(null);
  const dropZoneBg = useColorModeValue("gray.100", "gray.700");
  const [page,setPage] = useState(1);

  const [filters, setFilters] = useState({
    status: "",
    date: "",
    manager: "",
    productName: "",
    search: "",
  });

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}assined/get-assined?page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${cookies?.access_token}`,
              },
            }
          );
      
      
          const tasks = response.data.data.map((task) => {
            // Ensure that sale_id, product_id, and user_id are valid and have values
            const sale = task?.sale_id?.[0];
            const product = task?.sale_id?.[0].product_id?.[0];
            const user = task?.sale_id?.[0].user_id?.[0];
      
            return {
              id: task?._id,
              date: new Date(task.createdAt).toLocaleDateString(),
              productName: product?.name || "No product name", 
              productQuantity: sale?.product_qty || 0,  
              productPrice: `${sale?.price || 0} /-`,
              assignedBy: `${user?.first_name || ""} ${user?.last_name || ""}`,  
              design_status: task?.isCompleted ? "Completed" : "Pending",
              design_approval: sale?.customer_approve || "Not Approved",  
              sale_id: sale?._id,
              designFile: sale?.designFile,
              assinedby_comment: task?.assinedby_comment
            };
          });
      
          setTasks(tasks);
          console.log(tasks);
        } catch (error) {
          console.log(error);
        }
      };
      
    fetchTasks(); 
  }, [cookies?.access_token,page]);

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
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
    console.log(task);
    
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

  
  console.log(tasks);
  

  return (
    <div className="overflow-x-hidden">
      <HStack className="flex justify-between items-center mb-5 mt-5">
        <Text className="text-lg font-bold">Tasks</Text>
        <HStack className="space-x-2">
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            leftIcon={<MdOutlineRefresh />}
            color="#1640d6"
            borderColor="#1640d6"
            onClick={fetchTasks}
            variant="outline"
          >
            Refresh
          </Button>
        </HStack>
      </HStack>

      <HStack spacing={4} mb={5} mt={5}>
        <FormControl>
          <FormLabel>Status</FormLabel>
          <Select
            placeholder="Select Status"
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Search</FormLabel>
          <Input
            placeholder="Search by Product Name or Manager"
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </FormControl>
      </HStack>

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
              bg={task.design_status === "Pending" ? "orange" : "green"}
              borderRadius="md"
            />

            {/* Header */}
            <HStack justify="space-between" mb={3}>
              <Text fontWeight="bold" fontSize="lg">
                {task.productName}
              </Text>
              <Badge
                colorScheme={
                  task.design_status === "Pending" ? "orange" : "green"
                }
                fontSize="sm"
              >
                {task.design_status}
              </Badge>
            </HStack>

            {/* Divider */}
            <Divider />

            {/* Task Details */}
            <HStack justify="space-between" spacing={3} mt={3}>
              <VStack align="start">
              <Text fontSize="sm">
                  <strong>Product Price:</strong> {task.productPrice}
                </Text>
                <Text fontSize="sm">
                  <strong>Quantity:</strong> {task.productQuantity}
                </Text>
              </VStack>
              <VStack align="start">               
                <Text fontSize="sm">
                  <strong>Assigned By:</strong> {task.assignedBy}
                </Text>
                <Text fontSize="sm">
                  <strong>Remarks:</strong> {task?.assinedby_comment}
                </Text>
              </VStack>
            </HStack>

            {/* Footer */}
            <Divider my={3} />
            <HStack justify="space-between" mt={3}>
              {task.design_approval === "rejected" ? (
                <>
                  <VStack align="start">
                    <Badge
                      colorScheme={
                        task.design_approval === "rejected" ? "orange" : "green"
                      }
                      fontSize="sm"
                    >
                      <strong>Customer Approval:</strong> {task.design_approval}
                    </Badge>
                    <Text fontSize="sm" color="red.500">
                      <strong>Feedback:</strong> {task.rejection_comment}
                    </Text>
                  </VStack>
                  <Button
                    leftIcon={<FaUpload />}
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleOpenModal(task)}
                  >
                    Re-upload Design
                  </Button>
                </>
              ) : task.design_status === "Pending" ? (
                <Button
                  leftIcon={<FaUpload />}
                  colorScheme="teal"
                  size="sm"
                  onClick={() => handleOpenModal(task)}
                >
                  Upload File
                </Button>
              ) : (
                <Text fontSize="sm">
                  <strong>Uploaded File: </strong> 
                    <a href={task.designFile} className="text-blue-500 underline" target="_blank">preview</a>
                </Text>
              )}

              <Text fontSize="sm">
                <strong>Date:</strong> {task.date}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>

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
                onChange={(e)=> setComment(e.target.value)}
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
