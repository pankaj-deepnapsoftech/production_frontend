import {
  Box,
  Text,
  VStack,
  Badge,
  Progress,
} from "@chakra-ui/react";

const TrackProduction = ({ designProcess, productionProcess }: any) => {
  console.log("designprocess", designProcess);
  
  
  return (
    <Box p={4}>
      {/* Design Process Section */}
      <Box mb={8}>
        <Text fontWeight="bold" fontSize="2xl" color="blue.600" mb={4}>
          Design Process
        </Text>
        {designProcess?.length === 0 ? (
          <Box>No design process data available.</Box>
        ) : (
          <VStack align="start" spacing={4} className="max-h-[20rem] overflow-y-scroll">
            {designProcess?.map((stage: any, index: number) => (
              <Box
                key={index}
                p={4}
                w="full"
                borderWidth="1px"
                borderRadius="lg"
                shadow="md"
                bg={stage?.isCompleted? "green.50" : "orange.50"}
                borderColor={stage?.isCompleted? "green.300" : "orange.300"}
              >
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color={stage?.isCompleted?  "green.700" : "red.700"}
                >
                  {stage?.assined_process}
                </Text>
                <Text mt={2} fontSize="md">
                  Status:
                  <Badge ml={2} colorScheme={stage?.isCompleted? "green" : "red"} variant="solid">
                    {stage?.isCompleted? "Completed" : "Pending"}
                  </Badge>
                </Text>
                <Box mt={2}>
                  <Text fontSize="sm" color="gray.500">
                    Progress:
                  </Text>
                  <Box mt={1} w="full">
                    <Progress
                      value={stage?.isCompleted? 100 : 50} 
                      size="sm"
                      colorScheme={stage?.isCompleted? "green" : "red"}
                      borderRadius="md"
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* Production Process Section */}
      <Box>
        <Text fontWeight="bold" fontSize="2xl" color="blue.600" mb={4}>
          Production Process
        </Text>
        {productionProcess?.length === 0 ? (
          <Box>No production process data available.</Box>
        ) : (
          <VStack align="start" spacing={4} className="max-h-[20rem] overflow-y-scroll">
            {productionProcess?.map((stage: any, index: number) => (
              <Box
                key={index}
                p={4}
                w="full"
                borderWidth="1px"
                borderRadius="lg"
                shadow="md"
                bg={stage?.done ? "green.50" : "red.50"}
                borderColor={stage?.done ? "green.300" : "red.300"}
              >
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color={stage?.done ? "green.700" : "red.700"}
                >
                  {stage?.process}
                </Text>
                <Text mt={2} fontSize="md">
                  Status:
                  <Badge ml={2} colorScheme={stage?.done ? "green" : "red"} variant="solid">
                    {stage?.done ? "Completed" : "Pending"}
                  </Badge>
                </Text>
                <Box mt={2}>
                  <Text fontSize="sm" color="gray.500">
                    Progress:
                  </Text>
                  <Box mt={1} w="full">
                    <Progress
                      value={stage?.done ? 100 : 50} // Assuming 50% for pending as a placeholder
                      size="sm"
                      colorScheme={stage?.done ? "green" : "red"}
                      borderRadius="md"
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default TrackProduction;
