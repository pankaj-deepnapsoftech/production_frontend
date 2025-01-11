import { Box, Text, Stack, Icon, VStack, Badge, Card, CardBody, CardHeader } from "@chakra-ui/react";
import { FaCheckCircle, FaSpinner, FaStopCircle } from "react-icons/fa"; // Importing icons for each stage

const TrackProduction = () => {
  const stages = [
    {
      stage: "Production Start",
      status: "Completed",
      icon: FaCheckCircle,
      color: "green",
      subProcesses: [
        { name: "Initial Setup", status: "Completed" },
        { name: "Raw Material Procurement", status: "Completed" },
      ],
    },
    {
      stage: "Manufacturing",
      status: "In Progress",
      icon: FaSpinner,
      color: "yellow",
      subProcesses: [
        { name: "Machine Setup", status: "Completed" },
        { name: "Assembly Line 1", status: "In Progress" },
        { name: "Assembly Line 2", status: "Pending" },
      ],
    },
    {
      stage: "Quality Check",
      status: "Pending",
      icon: FaStopCircle,
      color: "gray",
      subProcesses: [
        { name: "Visual Inspection", status: "Pending" },
        { name: "Functionality Test", status: "Pending" },
      ],
    },
    {
      stage: "Packaging",
      status: "Pending",
      icon: FaStopCircle,
      color: "gray",
      subProcesses: [
        { name: "Packaging Design", status: "Pending" },
        { name: "Final Packaging", status: "Pending" },
      ],
    },
    {
      stage: "Shipping",
      status: "Pending",
      icon: FaStopCircle,
      color: "gray",
      subProcesses: [
        { name: "Labeling", status: "Pending" },
        { name: "Shipping Dispatch", status: "Pending" },
      ],
    },
  ];

  return (
    <div className="md:ml-80 sm:ml-0 overflow-x-hidden">
      <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black ">Track Production Process</h3>
      <VStack spacing={6}>
        {stages.map((item, index) => (
          <Card key={index} width="full" variant="outline" boxShadow="md" borderRadius="lg">
            <CardHeader>
              <Box display="flex" alignItems="center">
                <Icon
                  as={item.icon}
                  color={item.color === "green" ? "green.500" : item.color === "yellow" ? "yellow.500" : "gray.500"}
                  boxSize={8}
                  mr={4}
                />
                <Text fontSize="lg" fontWeight="bold">{item.stage}</Text>
              </Box>
            </CardHeader>
            <CardBody>
              <Text color={item.status === "Completed" ? "green.500" : item.status === "In Progress" ? "yellow.500" : "gray.500"}>
                {item.status}
              </Text>

              {/* Sub-processes */}
              <Box pl={8} mt={4}>
                {item.subProcesses.map((subProcess, subIndex) => (
                  <Box key={subIndex} display="flex" alignItems="center" mb={2}>
                    <Icon
                      as={subProcess.status === "Completed" ? FaCheckCircle : FaStopCircle}
                      color={subProcess.status === "Completed" ? "green.500" : "gray.500"}
                      boxSize={5}
                      mr={4}
                    />
                    <Text fontSize="md" fontWeight="medium" color={subProcess.status === "Completed" ? "green.500" : "gray.500"}>
                      {subProcess.name}
                    </Text>
                    <Badge ml={4} colorScheme={subProcess.status === "Completed" ? "green" : "gray"}>
                      {subProcess.status}
                    </Badge>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </div>
  );
};

export default TrackProduction;
