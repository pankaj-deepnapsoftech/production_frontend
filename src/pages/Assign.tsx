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
import { useState } from "react";

const Assign = ({ empData, saleData }) => {
  console.log("saleData:", saleData);

  const tasks = saleData[0]?.assinedto;
  console.log("taskst", tasks);

  // State for reassignment form
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const toast = useToast();

  const handleReassign = () => {
    if (!selectedTaskId || !newAssignee.trim()) {
      toast({
        title: "Error",
        description: "Please select a task and a new assignee.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Update task in the tasks array
    const updatedTasks = tasks.map((task) =>
      task.id === parseInt(selectedTaskId)
        ? { ...task, assignedTo: newAssignee, completed: false }
        : task
    );
    setTasks(updatedTasks);

    // Clear the form
    setSelectedTaskId("");
    setNewAssignee("");

    toast({
      title: "Task Reassigned",
      description: "The task has been successfully reassigned.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={2}>
      {/* Task List */}
      <Box mb={6} className="max-h-[10rem] overflow-y-scroll">
        <Text fontWeight="bold" fontSize="lg" color="teal.500" mb={4}>
          Assigned Tasks
        </Text>
        {tasks?.map((task) => (
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

      {/* Reassignment Form */}
      <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
        <Text fontWeight="bold" fontSize="lg" color="teal.500" mb={4}>
          Reassign Task
        </Text>
        <FormControl mb={4}>
          <FormLabel>Select Employee</FormLabel>
          <Select
            placeholder="Select an employee"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            {empData?.map((emp) => (
              <option key={emp?._id} value={emp?._id}>
                {emp?.first_name} - {emp?.role?.role}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Define Porcess</FormLabel>
          <Input
            placeholder="Enter new process name"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Additional Information</FormLabel>
          <Textarea
            placeholder="Enter further details (if any)"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleReassign}>
          Reassign Task
        </Button>
      </Box>
    </Box>
  );
};

export default Assign;
