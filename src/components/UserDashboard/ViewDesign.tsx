import {
  Box,
  Button,
  HStack,
  Image,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { BiHappyHeartEyes, BiSad } from "react-icons/bi";

// Define prop type for the component
interface ViewDesignProps {
  designUrl: string;
  purchaseData: any;
  onClose:any;
}

const ViewDesign: React.FC<ViewDesignProps> = ({ designUrl, purchaseData, onClose }) => {
  const [status, setStatus] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [cookies] = useCookies(["access_token"]);
  const toast = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      customer_approve: status,
      customer_design_comment: comment,
      assined_to: purchaseData?.empprocess?.find((process: any) =>
        process.assined_process.includes("design")
      )?._id,
    };
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/image-status/${purchaseData?._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        }
      );
      //console.log("design form",response);
      toast({
        title: response.data.message,
        description: "Response added successfully :) ",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed",
        description: "error adding your response, try again :( ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Image src={designUrl} alt="Design File" mb={4} />

      <form onSubmit={handleSubmit}>
        <HStack align="center" justify="space-between" mb={4}>
          <RadioGroup onChange={setStatus} value={status}>
            <HStack spacing="24px">
              {/* Happy Option */}
              <Radio
                value="Approve"
                colorScheme="green"
                size="lg"
                _focus={{ boxShadow: "outline" }}
              >
                <HStack spacing={2}>
                  <Box
                    as={BiHappyHeartEyes}
                    color={status === "Approve" ? "green.500" : "gray.400"}
                    fontSize="1.5rem"
                  />
                  <Text
                    fontSize="md"
                    fontWeight={status === "Approve" ? "bold" : "normal"}
                    color={status === "Approve" ? "green.500" : "gray.700"}
                  >
                    Approve
                  </Text>
                </HStack>
              </Radio>

              {/* Sad Option */}
              <Radio
                value="Reject"
                colorScheme="red"
                size="lg"
                _focus={{ boxShadow: "outline" }}
              >
                <HStack spacing={2}>
                  <Box
                    as={BiSad}
                    color={status === "Reject" ? "red.500" : "gray.400"}
                    fontSize="1.5rem"
                  />
                  <Text
                    fontSize="md"
                    fontWeight={status === "Reject" ? "bold" : "normal"}
                    color={status === "Reject" ? "red.500" : "gray.700"}
                  >
                    Reject
                  </Text>
                </HStack>
              </Radio>
            </HStack>
          </RadioGroup>
        </HStack>

        {status === "Reject" && (
          <Textarea
            placeholder="Please provide feedback..."
            mt={2}
            resize="vertical"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            focusBorderColor="red.500"
          />
        )}

        <Button
          type="submit"
          size="sm"
          bgColor="white"
          _hover={{ bgColor: "blue.500" }}
          className="border border-blue-500 hover:text-white mt-2 w-full"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default ViewDesign;
