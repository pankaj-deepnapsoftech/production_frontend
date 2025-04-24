//@ts-nocheck

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Toast,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";

const UploadPayment = ({ id, orderfile, onClose, userRole, deliveryproofupload }) => {
  const [file, setFile] = useState(null);
  const dropZoneBg = useColorModeValue("gray.100", "gray.700");
  const [cookies] = useCookies(['access_token']);
  const Toast = useToast();

  
  const handleFileDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById("file-input");
    fileInput && fileInput.click();
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("delivery", file);
    formData.append("role", userRole)

    try {
      const token = cookies?.access_token
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/delivery/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

     

      Toast({
        title: "Success",
        description: "File Uploaded Successfully :) ",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose(); // Close the modal or perform any other action
    } catch (error) {
      console.error("Error uploading file:", error);
      Toast({
        title: "Error",
        description: "Failed to upload the File :( ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      onClose(); // Close the modal or perform any other action
    }
  };

  return (
    <div>
      <VStack spacing={4} align="stretch">
        {orderfile ? (
          <Text fontSize="sm" color="teal.500">
            <strong className="text-black">{deliveryproofupload} have already sended the proof : </strong>
            <a href={orderfile} target="_blank">
              Uploaded File
            </a>
          </Text>
        ) : (
          <>
            <FormControl>
              <FormLabel>Upload Delivery Proof Screenshort</FormLabel>
              <Box
                p={4}
                borderWidth="2px"
                borderColor={file ? "teal.500" : "gray.300"}
                borderRadius="md"
                bg={dropZoneBg}
                textAlign="center"
                onDrop={handleFileDrop}
                onDragOver={(event) => event.preventDefault()}
                onDragEnter={(event) => event.preventDefault()}
                onClick={triggerFileInput}
                cursor="pointer"
              >
                <Text fontSize="sm" color="gray.500">
                  Drag and drop a file here, or{" "}
                  <Text as="span" color="blue.500" cursor="pointer">
                    browse
                  </Text>
                </Text>
              </Box>
              <Input
                type="file"
                id="file-input"
                display="none"
                onChange={(event) =>
                  setFile(event.target.files ? event.target.files[0] : null)
                }
              />
            </FormControl>

            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleFileUpload}
              isDisabled={!file}
            >
              Upload
            </Button>
          </>
        )}
      </VStack>
    </div>
  );
};

export default UploadPayment;
