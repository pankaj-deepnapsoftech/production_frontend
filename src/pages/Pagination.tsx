//@ts-nocheck
import React, { useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

const Pagination = () => {
  // Dummy data
  const dummyData = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  const itemsPerPage = 5;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  // Get current items to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = dummyData.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <VStack spacing={4} className="p-4">

      {/* Pagination Controls */}
      <Box className="flex justify-center items-center mt-4">
        <HStack spacing={2}>
          {/* Previous Button */}
          <Button
            size="sm"
            colorScheme="blue"
            isDisabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="rounded-md shadow-md"
          >
            Previous
          </Button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              size="sm"
              colorScheme={page === currentPage ? "green" : "gray"}
              onClick={() => handlePageChange(page)}
              className={`rounded-md shadow-md ${
                page === currentPage ? "bg-green-500 text-white" : ""
              }`}
            >
              {page}
            </Button>
          ))}

          {/* Next Button */}
          <Button
            size="sm"
            colorScheme="blue"
            isDisabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
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
