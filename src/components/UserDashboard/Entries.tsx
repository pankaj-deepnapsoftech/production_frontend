// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Select,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import UpdateEntry from "./UpdateEntry"; // Import the UpdateEntry component
import axios from "axios"; // Axios for API calls
import { useCookies } from "react-cookie";

interface Entry {
  _id: string;
  type: "person" | "vehicle";
  details: string;
  phone: string;
  address: string;
  purpose: string | null;
  contact_persone: string; // Changed to match the API response
  material: string | null;
  status: "in" | "out";
  createdAt: string | null; // Optional field for created date
}

const Entries: React.FC = () => {
  const [inOutFilter, setInOutFilter] = useState<"all" | "in" | "out">("all");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [cookies] = useCookies(["access_token"]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch entry logs from API
  useEffect(() => {
    const fetchEntries = async () => {
      const token = cookies.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}gard/get-all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEntries(response.data.data); // Assuming response data structure is { data: [] }
        console.log(response.data.data); // Log the fetched data for debugging
      } catch (error) {
        console.error("Error fetching entries:", error);
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
  }, []); // Empty dependency array means this will only run on component mount

  const filteredEntries = entries.filter((entry) => {
    if (inOutFilter === "all") return true;
    return entry.status === inOutFilter;
  });

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    onOpen();
  };

  const handleUpdate = async (updatedEntry: Entry) => {
    const token = cookies.access_token;

    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please login again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Send the update request to the backend
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}gard/update/${updatedEntry._id}`, 
        updatedEntry,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

       // Update the state with the updated entry
    if (response.data) {    
        toast({
          title: "Entry Updated",
          description: "The entry has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

         // Refresh the page to reload all data
      window.location.reload();

        onClose(); // Close the modal after the update
      }
    } catch (error) {
      console.error("Error updating entry:", error);
      toast({
        title: "Error",
        description: "Failed to update the entry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const headings = [
    "Type",
    "Details",
    "Phone No.",
    "Address",
    "Purpose",
    "Whom To Meet",
    "Material",
    "Status",
    "Actions",
  ];

  return (
    <ChakraProvider>
      <Box className="p-6 bg-gray-100 min-h-screen md:ml-80 sm:ml-0 mt-10 lg:mt-0">
        <Text className="text-2xl font-bold mb-4">
          Security Guard Dashboard
        </Text>

        <Box className="mb-4">
          <Text className="font-semibold mb-2">Filter by:</Text>
          <Select
            placeholder="Select Status"
            value={inOutFilter}
            onChange={(e) =>
              setInOutFilter(e.target.value as "all" | "in" | "out")
            }
          >
            <option value="all">All</option>
            <option value="in">In</option>
            <option value="out">Out</option>
          </Select>
        </Box>

        <Box className="mt-4">
          <Text className="text-xl font-semibold mb-4">Entry Logs</Text>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            bg="white"
          >
            <Table variant="striped" colorScheme="gray" size="sm">
              <Thead bg="teal.500">
                <Tr>
                  {headings.map((heading, index) => (
                    <Th key={index} color="white">
                      {heading}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {filteredEntries.map((entry) => (
                  <Tr key={entry.id}>
                    <Td>{entry.type}</Td>
                    <Td>{entry.details}</Td>
                    <Td>{entry.phone}</Td>
                    <Td>{entry.address}</Td>
                    <Td>{entry.purpose}</Td>
                    <Td>{entry.contact_persone}</Td>{" "}
                    {/* Changed to contact_persone */}
                    <Td>{entry.material}</Td>
                    <Td>{entry.status}</Td>
                    <Td>
                      <IconButton
                        icon={<MdEdit />}
                        aria-label="Edit Entry"
                        onClick={() => handleEdit(entry)}
                        colorScheme="blue"
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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
