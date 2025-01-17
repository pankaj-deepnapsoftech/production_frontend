import {
  Box,
  Button,
  HStack,
  Image,
  Radio,
  RadioGroup,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiHappyHeartEyes, BiSad } from "react-icons/bi";

// Define prop type for the component
interface ViewDesignProps {
  designUrl: string; // Type designUrl properly
  purchaseData: any;
}

const ViewDesign: React.FC<ViewDesignProps> = ({ designUrl, purchaseData }) => {
  const [status, setStatus] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const data = purchaseData;
  console.log("data", data);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("data", {
      customer_approve: status,
      customer_design_comment: comment,
      assined_to: purchaseData?._id,
    });
  };

  return (
    <Box>
      {/* Display Design Image */}
      <Image src={designUrl} alt="Design File" mb={4} />

      {/* Radio Buttons for Approve/Reject */}
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

        {/* Feedback Textarea for Rejection */}
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
