//@ts-nocheck
import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Icon,
  Badge,
  SlideFade,
} from "@chakra-ui/react";
import { FaCheckCircle, FaHourglassHalf, FaCircle } from "react-icons/fa";

const Track = ({ sale }) => {

  const [processes, setProcesses] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchedProcesses = sale?.boms[0]?.production_processes[0]?.processes || [];
    setProcesses(fetchedProcesses);
  }, [sale]);


  return (
    <Box p={6} bg="gray.50" borderRadius="lg" boxShadow="md" className="mb-5">
      <Text className="text-2xl font-bold mb-6 text-center">
        Product Process{" "}
      </Text>

      {processes.length === 0 ? (
        <Text className="text-red-500 text-center">Porduction Process is not Registered yet!</Text>
      ) : (
         <VStack
         spacing={8}
         align="stretch"
         position="relative"
         className="timeline-container  max-h-[20rem] overflow-y-scroll"
       >
         {processes.map((process, index) => (
           <SlideFade key={process._id} in={true} offsetY={index * 10}>
             <HStack
               spacing={6}
               align="center"
               className="timeline-item"
               p={4}
               bg="white"
               borderRadius="lg"
               shadow="lg"
               borderLeftWidth="4px"
               borderLeftColor={process.done ? "green.400" : "orange.400"}
             >
               <Box className="timeline-icon" position="relative">
                 <Icon
                   as={process.done ? FaCheckCircle : FaHourglassHalf}
                   boxSize={6}
                   color={process.done ? "green.500" : "orange.500"}
                 />
                 {index !== processes.length - 1 && (
                   <Box
                     position="absolute"
                     left="50%"
                     top="100%"
                     width="2px"
                     height="40px"
                     bg="gray.200"
                     transform="translateX(-50%)"
                   />
                 )}
               </Box>
               <VStack align="start" spacing={2} flex="1">
                 <Text className="font-medium text-lg">{process.process}</Text>
                 <Badge
                   colorScheme={process.done ? "green" : "orange"}
                   fontSize="sm"
                   textTransform="uppercase"
                 >
                   {process.done ? "Completed" : "Pending"}
                 </Badge>
                 <Progress
                   value={process.done ? 100 : 50}
                   size="sm"
                   colorScheme={process.done ? "green" : "orange"}
                   className="w-full"
                 />
               </VStack>
             </HStack>
           </SlideFade>
         ))}
       </VStack>
      )}

     
    </Box>
  );
};

export default Track;
