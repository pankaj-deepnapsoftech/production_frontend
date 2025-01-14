import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import axios from "axios";

interface Entry {
  _id: string;
  type: "person" | "vehicle";
  details: string;
  phone: string;
  address: string;
  purpose?: string;
  contact_persone: string;
  material?: string;
  status: "in" | "out";
  createdAt: string;
}

interface UpdateEntryProps {
  entry: Entry;
  onUpdate: (updatedEntry: Entry) => void;
  onCancel: () => void;
}

const UpdateEntry: React.FC<UpdateEntryProps> = ({ entry, onUpdate, onCancel }) => {
  const [type, setType] = useState<"person" | "vehicle">(entry.type);
  const [details, setDetails] = useState<string>(entry.details);
  const [phone, setPhone] = useState<string>(entry.phone);
  const [address, setAddress] = useState<string>(entry.address);
  const [purpose, setPurpose] = useState<string>(entry.purpose || "");
  const [contact_persone, setContact_persone] = useState<string>(entry.contact_persone);
  const [material, setMaterial] = useState<string>(entry.material || "");
  const [materialComment, setMaterialComment] = useState<string>(
    entry.material === "Other" ? entry.material : ""
  );
  const [status, setStatus] = useState<"in" | "out">(entry.status);
  const [cookies] = useCookies(["access_token"]);

  const toast = useToast();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // Creating the updated entry based on the form fields
    const updatedEntry: Entry = {
      ...entry,    
      type,
      details,
      phone,
      address,
      purpose,
      contact_persone,
      material,
      status,
    };

      onUpdate(updatedEntry); // Pass the updated data to the parent component
     
  };

  return (
    <ChakraProvider>
      <Box as="form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <FormControl mb="4" isRequired>
          <FormLabel>Type</FormLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as "person" | "vehicle")}
            bg="white"
            borderColor="gray.300"
          >
            <option value="person">Person</option>
            <option value="vehicle">Vehicle</option>
          </Select>
        </FormControl>

        <FormControl mb="4" isRequired>
          <FormLabel>Details</FormLabel>
          <Input
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Enter details (e.g., Name or Vehicle Info)"
            bg="white"
            borderColor="gray.300"
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Phone Number</FormLabel>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            bg="white"
            borderColor="gray.300"
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Address</FormLabel>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            bg="white"
            borderColor="gray.300"
          />
        </FormControl>

        {type === "person" && (
          <FormControl mb="4" isRequired>
            <FormLabel>Purpose of Visit</FormLabel>
            <Input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Enter purpose of visit"
              bg="white"
              borderColor="gray.300"
            />
          </FormControl>
        )}

        {type === "vehicle" && (
          <>
            <FormControl mb="4" isRequired>
              <FormLabel>Material</FormLabel>
              <Select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                bg="white"
                borderColor="gray.300"
              >
                <option value="">Select Material</option>
                <option value="Raw Material">Raw Material</option>
                <option value="Finished Goods">Finished Goods</option>
                <option value="Other">Other</option>
              </Select>

              {material === "Other" && (
                <Input
                  mt="4"
                  value={materialComment}
                  onChange={(e) => setMaterialComment(e.target.value)}
                  placeholder="Specify 'Other'"
                  bg="white"
                  borderColor="gray.300"
                />
              )}
            </FormControl>
          </>
        )}

        <FormControl mb="4" isRequired>
          <FormLabel>Whom to Meet</FormLabel>
          <Input
            value={contact_persone}
            onChange={(e) => setContact_persone(e.target.value)}
            placeholder="Enter name of person/department to meet"
            bg="white"
            borderColor="gray.300"
          />
        </FormControl>

        <FormControl mb="4" isRequired>
          <FormLabel>Status</FormLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as "in" | "out")}
            bg="white"
            borderColor="gray.300"
          >
            <option value="in">In</option>
            <option value="out">Out</option>
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="teal" className="w-full" size="lg">
          Update Entry
        </Button>
        <Button
          onClick={onCancel}
          mt="4"
          colorScheme="gray"
          className="w-full"
          size="lg"
        >
          Cancel
        </Button>
      </Box>
    </ChakraProvider>
  );
};

export default UpdateEntry;
