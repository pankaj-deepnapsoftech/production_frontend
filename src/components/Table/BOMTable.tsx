import React from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Spinner,
  IconButton,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { FcApproval, FcDatabase } from "react-icons/fc";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import moment from "moment";

interface BOMCardProps {
  boms: Array<{
    _id: string; // Added
    bom_name: string;
    parts_count: string;
    total_cost: string;
    approval_date?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  isLoadingBoms: boolean;
  openUpdateBomDrawerHandler?: (id: string) => void;
  openBomDetailsDrawerHandler?: (id: string) => void;
  deleteBomHandler?: (id: string) => void;
  approveBomHandler?: (id: string) => void;
}

const BOMTable: React.FC<BOMCardProps> = ({
  boms,
  isLoadingBoms,
  openUpdateBomDrawerHandler,
  openBomDetailsDrawerHandler,
  deleteBomHandler,
  approveBomHandler,
}) => {
  return (
    <Box>
      {isLoadingBoms && (
        <Box textAlign="center" mt={10}>
          <Spinner size="lg" />
          <Text mt={4}>Loading...</Text>
        </Box>
      )}
      {!isLoadingBoms && boms.length === 0 && (
        <Box textAlign="center" mt={10}>
          <FcDatabase size={100} />
          <Text fontSize="lg">No Data Found</Text>
        </Box>
      )}
      {!isLoadingBoms && boms.length > 0 && (
        <div className="mt-5">
          {boms.map((bom) => (
            <Box
              key={bom._id}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="lg"
              bg="white"
              p={4}
              w="100%"
              position="relative"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                h="100%"
                w={2}
                bg="blue"
                borderRadius="md"
              />

              <HStack justify="space-between" mb={3}>
                <Text fontWeight="bold" fontSize="lg">
                  {bom.bom_name}
                </Text>
              </HStack>

              <Divider />

              <HStack justify="space-between" spacing={3} mt={3}>
                <VStack align="start">
                  <Text fontSize="sm">
                    <strong>Parts Count:</strong> {bom.parts_count}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Total Cost:</strong> {bom.total_cost} /-
                  </Text>
                </VStack>
                <VStack align="start">
                  <Text fontSize="sm">
                    <strong>Created On:</strong>{" "}
                    {moment(bom.createdAt).format("DD/MM/YYYY")}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Last Updated:</strong>{" "}
                    {moment(bom.updatedAt).format("DD/MM/YYYY")}
                  </Text>
                </VStack>
              </HStack>

              <Divider my={3} />
              <HStack justify="start  " mt={3}>
                {openBomDetailsDrawerHandler && (
                  <IconButton
                    icon={<MdOutlineVisibility />}
                    aria-label="View"
                    onClick={() =>
                      openBomDetailsDrawerHandler(bom._id)
                    }
                    colorScheme="blue"
                  />
                )}

                {openUpdateBomDrawerHandler && (
                  <IconButton
                    icon={<MdEdit />}
                    aria-label="Edit"
                    onClick={() =>
                      openUpdateBomDrawerHandler(bom._id)
                    }
                    colorScheme="yellow"
                  />
                )}
                {deleteBomHandler && (
                  <IconButton
                    icon={<MdDeleteOutline />}
                    aria-label="Delete"
                    onClick={() => deleteBomHandler(bom._id)}
                    colorScheme="red"
                  />
                )}
                {approveBomHandler && (
                  <IconButton
                    icon={<FcApproval />}
                    aria-label="Approve"
                    onClick={() => approveBomHandler(bom._id)}
                  />
                )}
              </HStack>
            </Box>
          ))}
        </div>
      )}
    </Box>
  );
};

export default BOMTable;
