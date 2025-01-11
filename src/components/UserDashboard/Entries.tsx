// @ts-nocheck
import React, { useState } from "react";
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

interface Entry {
  id: string;
  type: "person" | "vehicle";
  details: string;
  phoneNo: string;
  address: string;
  purpose: string;
  whomToMeet: string;
  material: string;
  status: "in" | "out";
  createdAt: string;
}

const dummyEntries: Entry[] = [
  {
    id: "1",
    type: "person",
    details: "John Doe",
    phoneNo: "1234567890",
    address: "123 Elm Street, Springfield",
    purpose: "Delivery",
    whomToMeet: "Mr. Smith",
    material: "",
    status: "in",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "vehicle",
    details: "Toyota Corolla - AB123CD",
    phoneNo: "9876543210",
    address: "456 Oak Avenue, Shelbyville",
    purpose: "",
    whomToMeet: "",
    material: "Raw Material",
    status: "in",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    type: "person",
    details: "Jane Smith",
    phoneNo: "4561237890",
    address: "789 Maple Lane, Ogdenville",
    purpose: "Meeting",
    whomToMeet: "Mrs. Johnson",
    material: "",
    status: "out",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    type: "vehicle",
    details: "Ford F-150 - XY987ZY",
    phoneNo: "3216549870",
    address: "101 Birch Road, North Haverbrook",
    purpose: "",
    whomToMeet: "",
    material: "Finished Good",
    status: "out",
    createdAt: new Date().toISOString(),
  },
];

const Entries: React.FC = () => {
  const [inOutFilter, setInOutFilter] = useState<"all" | "in" | "out">("all");
  const [entries, setEntries] = useState<Entry[]>(dummyEntries);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const filteredEntries = entries.filter((entry) => {
    if (inOutFilter === "all") return true;
    return entry.status === inOutFilter;
  });

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    onOpen();
  };

  const handleUpdate = (updatedEntry: Entry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    toast({
      title: "Entry Updated",
      description: "The entry has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
    
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
    "Date/Time",
    "Actions",
  ];

  return (
    <ChakraProvider>
      <Box className="p-6 bg-gray-100 min-h-screen md:ml-80 sm:ml-0">
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
                    <Td>{entry.phoneNo}</Td>
                    <Td>{entry.address}</Td>
                    <Td>{entry.purpose}</Td>
                    <Td>{entry.whomToMeet}</Td>
                    <Td>{entry.material}</Td>
                    <Td>{entry.status}</Td>
                    <Td>{new Date(entry.createdAt).toLocaleString()}</Td>
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
