//@ts-nocheck
import React, { useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

const Pagination = ({page,setPage,length}) => {
 
  
  return (
    <VStack spacing={4} className="p-4">

      {/* Pagination Controls */}
      <Box className="flex justify-center items-center mt-4">
        <HStack spacing={2}>
          {/* Previous Button */}
          <Button
            size="sm"
            colorScheme="blue"
            isDisabled={page === 1}
            onClick={()=>setPage(page - 1)}
            className="rounded-md shadow-md"
          >
            Previous
          </Button>

         
            <Button
              key={page}
              size="sm"
              colorScheme={"gray"}
              className={`rounded-md shadow-md bg-green-500 text-white`}
            >
              {page}
            </Button>
          

          {/* Next Button */}
          <Button
            size="sm"
            colorScheme="blue"
            isDisabled={length < 5}
            onClick={()=>setPage(page + 1)}
            className="rounded-md shadow-md"
          >
            Next
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
};

export default Pagination;
