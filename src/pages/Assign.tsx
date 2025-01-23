//@ts-nocheck

import {
  Box,
  Text,
  VStack,
  Badge,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useToast,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Assign = ({ empData, saleData, onClose }) => {
  const tasks = saleData?.assinedto;
  console.log("assign", tasks);

  const [formData, setFormData] = useState({
    sale_id: saleData?._id,
    assined_to: "",
    assined_process: "",
    assinedby_comment: "",
  });

  const [cookies] = useCookies(["access_token"]);
  const toast = useToast();
  const token = cookies?.access_token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleReassign = async (e) => {
    e.preventDefault();

    try {
     
      //console.log("token", token);

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}assined/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      toast({
        title: "Task Reassigned",
        description: "The task has been successfully reassigned.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        selectedTaskId: "",
        processName: "",
        additionalInfo: "",
      });

      onClose();
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const colorChange = (color: any) => {
    if (color === "Pending" || color === "UnderProcessing") {
      return "orange";
    } else if (color === "Design Rejected") {
      return "red";
    } else {
      return "green";
    }
  };

  const handleEdit = async(id, e) => {
    if(e){
      e.preventDefault();
    }
    /*
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}assined/update/${id}`,
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update assigned task.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }  */
  };

  const handleDelete = async (id, e:any) => {
    if(e){
      e.preventDefault();
    }
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}assined/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to remove assigned task.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={2}>
      {/* Task List */}
      {tasks?.length > 0 && (
        <Box mb={6} className="max-h-[10rem] overflow-y-scroll">
          <Text fontWeight="bold" fontSize="lg" color="teal.500" mb={4}>
            Assigned Tasks
          </Text>

          {tasks.map((task) => (
            <Box
              key={task?._id}
              p={4}
              mb={4}
              borderWidth="1px"
              borderRadius="lg"
              shadow="md"
              className="bg-orange-50 border border-orange-500"
            >
              <VStack align="start" spacing={2}>
                <Text>
                  <strong>Date:</strong>{" "}
                  {new Date(task?.createdAt).toLocaleDateString()}
                </Text>
                <Text>
                  <strong>Task:</strong> {task?.assined_process}
                </Text>
                <Text>
                  <strong>Assigned To:</strong> {task?.assinedto[0]?.first_name}
                  -{" "}
                  {task?.assinedto[0]?.role[0]?.role
                    ? task?.assinedto[0]?.role[0]?.role
                    : null}
                </Text>
                <Text>
                  <strong>Status:</strong>{" "}
                  <Badge colorScheme={colorChange(task?.isCompleted)}>
                    {task?.isCompleted}
                  </Badge>
                </Text>
                <HStack>
                  <Button
                    bgColor="blue.500"
                    _hover="blue.400"
                    onClick={(e) => handleEdit(task._id, e)}
                  >
                    <FaEdit className="text-white"/>{" "}
                  </Button>
                  <Button
                    bgColor="red.500"
                    _hover="red.400"
                    onClick={(e)=> handleDelete(task?._id, e)}
                  >
                    <MdDelete className="text-white"  />{" "}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </Box>
      )}

      {/* Reassignment Form */}
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        shadow="md"
        className="bg-blue-50 border border-blue-500"
      >
        <Text fontWeight="bold" fontSize="lg" color="teal.500" mb={4}>
          Assign Task
        </Text>
        <FormControl mb={4}>
          <FormLabel>Select Employee</FormLabel>
          <Select
            name="assined_to"
            placeholder="Select an employee"
            value={formData.assined_to}
            onChange={handleChange}
            bgColor="white"
          >
            {empData?.map((emp) => (
              <option key={emp?._id} value={emp?._id}>
                {emp?.first_name} - {emp?.role?.role}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Define Process</FormLabel>
          <Input
            name="assined_process"
            placeholder="Enter new process name"
            value={formData.assined_process}
            onChange={handleChange}
            bgColor="white"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Remarks</FormLabel>
          <Textarea
            name="assinedby_comment"
            placeholder="Enter further details (if any)"
            value={formData.assinedby_comment}
            onChange={handleChange}
            bgColor="white"
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleReassign} className="w-full">
          Assign
        </Button>
      </Box>
    </Box>
  );
};

export default Assign;
