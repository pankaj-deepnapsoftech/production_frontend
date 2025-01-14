import React, { useState } from "react";
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
import axios from "axios";
import { useCookies } from "react-cookie";

const NewEntry: React.FC = () => {
  const [type, setType] = useState<"person" | "vehicle">("person");
  const [details, setDetails] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [whomToMeet, setWhomToMeet] = useState<string>("");
  const [material, setMaterial] = useState<string>("");
  const [materialComment, setMaterialComment] = useState<string>("");
  const [status, setStatus] = useState<"in" | "out">("in");
  const [cookies] = useCookies(["access_token"]);

  const toast = useToast();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newEntry = {
        type,
        details,
        phone:phoneNo,
        address,
        purpose: type === "person" ? purpose : null,
        contact_persone:whomToMeet,
        material: type === "vehicle" ? (material === "Other" ? materialComment : material) : null,
        status,
      };
      
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}gard/create`,newEntry,{headers:{Authorization:`brr ${cookies.access_token}`}});
    
    
    toast({
      title: res.data.message,
      description: "The new entry has been successfully added!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setType("person");
    setDetails("");
    setPhoneNo("");
    setAddress("");
    setPurpose("");
    setWhomToMeet("");
    setMaterial("");
    setMaterialComment("");
    setStatus("in");

    } catch (error:any) {
      toast({
        title: error.response?.errors[0].message || error.response?.message || "something went wrong",
        description: "The new entry has been successfully added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }


  
   
  };

  return (
    <ChakraProvider>
      <Box className="p-6 bg-gray-100 min-h-screen md:ml-80 sm:ml-0 overflow-x-hidden">
        <Text className="text-2xl font-bold mb-6">Add New Entry</Text>

        <Box
          as="form"
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
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
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              placeholder="Enter phone number"
              bg="white"
              type="number"
              borderColor="gray.300"
              required
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
          )}

          <FormControl mb="4" isRequired>
            <FormLabel>Whom to Meet</FormLabel>
            <Input
              value={whomToMeet}
              onChange={(e) => setWhomToMeet(e.target.value)}
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

          <Button
            type="submit"
            colorScheme="teal"
            className="w-full"
            size="lg"
          >
            Add Entry
          </Button>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default NewEntry;
