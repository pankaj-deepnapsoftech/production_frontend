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

const UploadInvoice = ({ sale_id, invoicefile, onClose }) => {
  const [file, setFile] = useState(null);
  const dropZoneBg = useColorModeValue("gray.100", "gray.700");
  const [cookies] = useCookies();
  const Toast = useToast();

  console.log("invoice", invoicefile);

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
    formData.append("invoice", file);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/upload-invoice/${sale_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

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
        {invoicefile ? (
          <Text fontSize="sm" color="teal.500">
            <strong className="text-black">You have already uploaded the file : </strong>
            <a href={invoicefile} target="_blank">
              Uploaded File
            </a>
          </Text>
        ) : (
          <>
            <FormControl>
              <FormLabel>Upload File</FormLabel>
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

export default UploadInvoice;
