// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Select,
  Box,
  Text,
  Badge,
  Divider,
  Button,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Input,
} from "@chakra-ui/react";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import axios from "axios";
import { useCookies } from "react-cookie";
import UpdateEntry from "./UpdateEntry"; // Import your update entry component

interface Entry {
  _id: string;
  type: "person" | "vehicle";
  name: string;
  details: string;
  phone: string;
  address: string;
  purpose: string;
  contact_persone: string;
  material: string;
  comment: string;
  status: "in" | "out";
  createdAt: string;
  updatedAt:string;
}

const Entries: React.FC = () => {
  const [inOutFilter, setInOutFilter] = useState<"all" | "in" | "out">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "person" | "vehicle">("all");
  const [dateFilter, setDateFilter] = useState<string>(""); 
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [cookies] = useCookies(["access_token"]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch entries from the backend
  useEffect(() => {
    const fetchEntries = async () => {
      const token = cookies.access_token;
      if (!token) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}gard/get-all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEntries(response.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch entries.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchEntries();
  }, [cookies.access_token, toast]);

  // Filter entries based on selected filters
  const filteredEntries = entries.filter((entry) => {
    const matchesInOutFilter = inOutFilter === "all" || entry.status === inOutFilter;
    const matchesTypeFilter = typeFilter === "all" || entry.type === typeFilter;
    const matchesDateFilter =
      !dateFilter || new Date(entry.createdAt).toDateString() === new Date(dateFilter).toDateString();

    return matchesInOutFilter && matchesTypeFilter && matchesDateFilter;
  });

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    onOpen();
  };

  const handleUpdate = async (updatedEntry: Entry) => {
    const token = cookies.access_token;
    if (!token) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}gard/update/${updatedEntry._id}`,
        updatedEntry,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Entry updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh data
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry._id === updatedEntry._id ? updatedEntry : entry
        )
      );
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update entry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const handleDelete = async (entry: Entry) => {
    const token = cookies.access_token;
    if (!token) return;
  
    try {
      // Send DELETE request to the backend to delete the entry
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}gard/delete/${entry._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast({
        title: "Success",
        description: "Entry deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      setEntries((prevEntries) =>
        prevEntries.filter((e) => e._id !== entry._id)
      );

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Render a person card
  const renderPersonCard = (entry: Entry) => (
    <Box
      key={entry._id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg="white"
      className=" relative p-4 mt-3"
    >
      <Box className="absolute top-0 left-0 h-full w-2 bg-green-500"></Box>
      <HStack justifyContent="space-between">
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            Date: {new Date(entry.createdAt).toLocaleDateString()}
          </Text>
          <Text fontSize="xs" className="text-gray-500">
            Time: {new Date(entry.createdAt).toLocaleTimeString()}
          </Text>
        </VStack>
        <Badge colorScheme={entry.status === "in" ? "green" : "red"} fontSize="xs">
          Status: {entry.status.toUpperCase()}
        </Badge>
      </HStack>
      <Divider my={2} />
      <HStack justifyContent="space-between">
        <VStack align="flex-start" spacing={2}>
          <Text fontSize="xs">Name: {entry.name}</Text>
          <Text fontSize="xs">Address: {entry.address}</Text>
          <Text fontSize="xs">Phone: {entry.phone}</Text>
        </VStack>
        <VStack align="flex-end" spacing={2}>
          <Text fontSize="xs">Whom To Meet: {entry.contact_persone}</Text>
          <Text fontSize="xs">Purpose: {entry.purpose}</Text>
        </VStack>
      </HStack>
      <Divider my={2} />
      <HStack justifyContent="space-between">
      
      <VStack>
          <HStack>
        <Button size="sm" bgColor="white" _hover={{"bgColor": "blue.500"}} className=" border border-blue-500  hover:text-white" onClick={() => handleEdit(entry)}>
          Edit
        </Button>
        <Button size="sm" bgColor="white" _hover={{"bgColor": "red.500"}} className=" border border-red-500  hover:text-white"   onClick={() => handleDelete(entry)}>
          Delete
        </Button>
        </HStack>
        </VStack>
        <Text fontSize="xs" className="text-gray-500">
            Exit Time: {new Date(entry.updatedAt).toLocaleTimeString()}
          </Text>
        <FaPersonWalkingArrowRight className="text-orange-700 text-2xl" />
      </HStack>
    </Box>
  );

  // Render a vehicle card
  const renderVehicleCard = (entry: Entry) => (
    <Box
      key={entry._id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg="white"
      className="relative p-4 mt-3"
    >
      <Box className="absolute top-0 left-0 h-full w-2 bg-blue-500"></Box>
      <HStack justifyContent="space-between">
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            Date: {new Date(entry.createdAt).toLocaleDateString()}
          </Text>
          <Text fontSize="xs" className="text-gray-500">
            Entry Time: {new Date(entry.updatedAt).toLocaleTimeString()}
          </Text>
        </VStack>
        <Badge colorScheme={entry.status === "in" ? "green" : "red"} fontSize="xs">
          Status: {entry.status.toUpperCase()}
        </Badge>
        
      </HStack>
      <Divider my={2} />
      <HStack justifyContent="space-between">
        <VStack align="flex-start" spacing={2}>
          <Text fontSize="xs">Name: {entry.name}</Text>
          <Text fontSize="xs">Address: {entry.address}</Text>
          <Text fontSize="xs">Phone: {entry.phone}</Text>
        </VStack>
        <VStack align="flex-end" spacing={2}>
          <Text fontSize="xs">Vehicle Details: {entry.details}</Text>
          <Text fontSize="xs">Material: {entry.material}</Text>
          <Text fontSize="xs">Comment: {entry.comment}</Text>
        </VStack>
      </HStack>
      <Divider my={2} />
      <HStack justifyContent="space-between">
        <VStack>
          <HStack>
        <Button size="sm" bgColor="white" _hover={{"bgColor": "blue.500"}} className=" border border-blue-500  hover:text-white" onClick={() => handleEdit(entry)}>
          Edit
        </Button>
        <Button size="sm" bgColor="white" _hover={{"bgColor": "red.500"}} className=" border border-red-500  hover:text-white"   onClick={() => handleDelete(entry)}>
          Delete
        </Button>
        </HStack>
        </VStack>
        <Text fontSize="xs" className="text-gray-500">
            Exit Time: {new Date(entry.createdAt).toLocaleTimeString()}
          </Text>
        <TbTruckDelivery className="text-orange-700 text-2xl" />
      </HStack>
    </Box>
  );

  return (
    <ChakraProvider>
      <Box className="p-6  max-h-screen  md:ml-80 sm:ml-0   overflow-x-hidden overflow-y-hidden mt-10 lg:mt-0">       
        <HStack spacing={4} mb={4}>
          <Select
            placeholder="Filter by status"
            value={inOutFilter}
            onChange={(e) => setInOutFilter(e.target.value as "all" | "in" | "out")}
          >
            <option value="all">All</option>
            <option value="in">In</option>
            <option value="out">Out</option>
          </Select>

          <Select
            placeholder="Filter by type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | "person" | "vehicle")}
          >
            <option value="all">All</option>
            <option value="person">Person</option>
            <option value="vehicle">Vehicle</option>
          </Select>

          <Input
            type="date"
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </HStack>



        <Box className="relative max-h-[45rem]">
        <Text className="text-xl font-bold mb-4"> Entries</Text>
        <Box className="max-h-[45rem] overflow-y-scroll">
          {filteredEntries.map((entry) =>
            entry.type === "person"
              ? renderPersonCard(entry)
              : renderVehicleCard(entry)
          )}
          </Box>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingEntry && (
              <UpdateEntry
                entry={editingEntry}
                onUpdate={handleUpdate}
                onCancel={onClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default Entries;
