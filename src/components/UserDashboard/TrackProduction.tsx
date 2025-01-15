import {
  Box,
  Text,
  VStack,
  Badge,
  Progress,
} from "@chakra-ui/react";

const TrackProduction = ({ process }: any) => {
  return (
    <Box p={4}>
      {/* Check if the process is empty */}
      {process.length === 0 ? (
        <Box>No production process data available.</Box>
      ) : (
        <Box>
          {/* Display Stages */}
          <VStack align="start" spacing={4} mb={6}>
            <Text fontWeight="bold" fontSize="xl" color="teal.600">
              Production Stages:
            </Text>
            {process.map((stage: any, index: number) => (
              <Box
                key={index}
                p={4}
                w="full"
                borderWidth="1px"
                borderRadius="lg"
                shadow="md"
                bg={stage.done ? "green.50" : "red.50"}
                borderColor={stage.done ? "green.300" : "red.300"}
              >
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color={stage.done ? "green.700" : "red.700"}
                >
                  {stage.process}
                </Text>
                <Text mt={2} fontSize="md">
                  Status:
                  <Badge ml={2} colorScheme={stage.done ? "green" : "red"} variant="solid">
                    {stage.done ? "Completed" : "Pending"}
                  </Badge>
                </Text>
                <Box mt={2}>
                  <Text fontSize="sm" color="gray.500">
                    Progress:
                  </Text>
                  <Box mt={1} w="full">
                    <Progress
                      value={stage.done ? 100 : 50} // Assuming 50% for pending as a placeholder
                      size="sm"
                      colorScheme={stage.done ? "green" : "red"}
                      borderRadius="md"
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default TrackProduction;
