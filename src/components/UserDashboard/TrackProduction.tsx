import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Box,
  Text,
  VStack,
  Badge,
  Progress,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";

const TrackProduction = ({ productName, isOpen, onClose }: any) => {
  const [productionProcess, setProductionProcess] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProductionProcess = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}track/track-process`,
        {
          params: { name: productName },
        }
      );
      const data = response.data.data[0];
      setProductionProcess(data);
      console.log(productionProcess);
    } catch (error) {
      toast.error("Failed to fetch production data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && productName) {
      fetchProductionProcess();
    }
  }, [isOpen, productName]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Production Process for {productName}</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <Box textAlign="center" py={6}>
              <Spinner size="xl" color="teal.500" />
            </Box>
          ) : productionProcess ? (
            <Box>
              {/* Display Stages */}
              <VStack align="start" spacing={4} mb={6}>
                <Text fontWeight="bold" fontSize="xl" color="teal.600">
                  Production Stages:
                </Text>
                {productionProcess.processes.map(
                  (process: any, index: number) => (
                    <Box
                      key={index}
                      p={4}
                      w="full"
                      borderWidth="1px"
                      borderRadius="lg"
                      shadow="md"
                      bg={process.done ? "green.50" : "red.50"}
                      borderColor={process.done ? "green.300" : "red.300"}
                    >
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color={process.done ? "green.700" : "red.700"}
                      >
                        {process.process}
                      </Text>
                      <Text mt={2} fontSize="md">
                        Status:
                        <Badge
                          ml={2}
                          colorScheme={process.done ? "green" : "red"}
                          variant="solid"
                        >
                          {process.done ? "Completed" : "Pending"}
                        </Badge>
                      </Text>
                      <Box mt={2}>
                        <Text fontSize="sm" color="gray.500">
                          Progress:
                        </Text>
                        <Box mt={1} w="full">
                          <Progress
                            value={process.done ? 100 : 50} // Assuming 50% for pending as a placeholder
                            size="sm"
                            colorScheme={process.done ? "green" : "red"}
                            borderRadius="md"
                          />
                        </Box>
                      </Box>
                    </Box>
                  )
                )}
              </VStack>
            </Box>
          ) : (
            <Box>No production process data available.</Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TrackProduction;
