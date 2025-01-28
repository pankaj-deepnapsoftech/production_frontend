//@ts-nocheck
import { useState } from "react";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Stack,
  Box,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";

const DispatchData = ({ sale_id, onClose }) => {
  const [formData, setFormData] = useState({
    tracking_id: "",
    tracking_web: "",
  });
  const toast = useToast();
  const [cookies] = useCookies(["access_token"]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/dispatch/${sale_id}`,
         formData ,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      console.log(response);

      toast({
        title: "Success",
        description: "Tracking data sended to the customer successfully :) ",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to send the data ,  Please try again :( ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    onClose();
  };

  const formWidth = useBreakpointValue({ base: "100%", md: "50%" });

  return (
    <Box className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-orange-500 mb-4 text-center">
        Please provide the website link and the tracking id of the Delivery
      </h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="dispatchDate" isRequired>
            <FormLabel> Delivery Website Link</FormLabel>
            <Input
              type="text"
              name="tracking_web"
              value={formData.tracking_web}
              onChange={handleChange}
              placeholder="Enter website link..."
              className="border border-gray-300 rounded-md p-2"
            />
          </FormControl>

          <FormControl id="trackingNumber" isRequired>
            <FormLabel>Tracking Number</FormLabel>
            <Input
              type="text"
              name="tracking_id"
              value={formData.tracking_id}
              onChange={handleChange}
              placeholder="Enter tracking number"
              className="border border-gray-300 rounded-md p-2"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            className="transition-all duration-300 hover:bg-blue-600"
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default DispatchData;
