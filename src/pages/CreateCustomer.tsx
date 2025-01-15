import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Box,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";

const CreateCustomer: React.FC = () => {
  const [customerType, setCustomerType] = useState("Individual");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [cookies] = useCookies();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      type: customerType,
      full_name: fullName,
      email,
      password,
      phone: phoneNo,
      ...(customerType === "company" && {
        company_name: companyName,
        GST_NO: gstNo,
      }),
    };

    try {
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}customer/create`,
        payload,
        
      );
      
      console.log(response);

      toast({
        title: "Customer Created",
        description: "Customer details have been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset the form
      setCustomerType("individual");
      setFullName("");
      setEmail("");
      setPassword("");
      setPhoneNo("");
      setCompanyName("");
      setGstNo("");
    } catch (error: any) {
      console.log(error);
      
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create customer.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className="w-full mx-auto ">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormControl id="type" isRequired>
          <FormLabel className="text-lg font-medium">Customer Type</FormLabel>
          <Select
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
            className="focus:ring-2 focus:ring-blue-500"
          >
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </Select>
        </FormControl>

        {/* Full Name Field */}
        <FormControl id="fullName" isRequired>
          <FormLabel className="text-lg font-medium">Full Name</FormLabel>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Enter full name"
            className="border-2 border-gray-300 rounded-md p-2"
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel className="text-lg font-medium">Email</FormLabel>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
            className="border-2 border-gray-300 rounded-md p-2"
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel className="text-lg font-medium">password</FormLabel>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter email"
            className="border-2 border-gray-300 rounded-md p-2"
          />
        </FormControl>

        {/* Phone Number Field */}
        <FormControl id="phoneNo" isRequired>
          <FormLabel className="text-lg font-medium">Phone Number</FormLabel>
          <Input
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            type="tel"
            placeholder="Enter phone number"
            className="border-2 border-gray-300 rounded-md p-2"
          />
        </FormControl>

        {/* Conditionally Render Company Name and GST No if Company is Selected */}
        {customerType === "company" && (
          <>
            <FormControl id="companyName" isRequired>
              <FormLabel className="text-lg font-medium">
                Company Name
              </FormLabel>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                type="text"
                placeholder="Enter company name"
                className="border-2 border-gray-300 rounded-md p-2"
              />
            </FormControl>

            <FormControl id="gstNo" isRequired>
              <FormLabel className="text-lg font-medium">GST No</FormLabel>
              <Input
                value={gstNo}
                onChange={(e) => setGstNo(e.target.value)}
                type="text"
                placeholder="Enter GST number"
                className="border-2 border-gray-300 rounded-md p-2"
              />
            </FormControl>
          </>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          colorScheme="teal.500"
          size="lg"
          width="full"
          className="bg-teal-600 text-white"
        >
          Create Customer
        </Button>
      </form>
    </Box>
  );
};

export default CreateCustomer;
