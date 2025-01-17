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
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";

const Assign = ({ empData, saleData }) => {
  const tasks = saleData?.assinedto;
  console.log("sales", saleData);

  const [formData, setFormData] = useState({
    sale_id: saleData?._id,
    assined_to: "",
    assined_process: "",
    assinedby_comment: "",
  });

  const [cookies] = useCookies(["access_token"]);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleReassign = async (e) => {
    e.preventDefault();

    try {
      const token = cookies?.access_token;
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
      

      console.log(formData);
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
            >
              <VStack align="start" spacing={2}>
                <Text>
                  <strong>Task:</strong> {task?.assined_process}
                </Text>
                <Text>
                  <strong>Assigned To:</strong> {task?.assinedto[0]?.first_name}
                </Text>
                <Text>
                  <strong>Status:</strong>{" "}
                  <Badge colorScheme={task?.isCompleted ? "green" : "red"}>
                    {task?.isCompleted ? "Completed" : "Pending"}
                  </Badge>
                </Text>
              </VStack>
            </Box>
          ))}
        </Box>
      )}

      {/* Reassignment Form */}
      <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
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
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Remarks</FormLabel>
          <Textarea
            name="assinedby_comment"
            placeholder="Enter further details (if any)"
            value={formData.assinedby_comment}
            onChange={handleChange}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleReassign}>
          Assign
        </Button>
      </Box>
    </Box>
  );
};

export default Assign;
