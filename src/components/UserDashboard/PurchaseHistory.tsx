import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, Box } from "@chakra-ui/react";

const PurchaseHistory = () => {
  // Example data for the purchase history
  const purchases = [
    {
      date: "2025-01-01",
      productName: "Laptop",
      productType: "Electronics",
      productionPrice: 1200,
      quantity: 1,
      supplier: "ABC Electronics",
      invoiceNo: "INV12345",
      status: "Delivered",
    },
    {
      date: "2025-01-05",
      productName: "Headphones",
      productType: "Accessories",
      productionPrice: 75,
      quantity: 2,
      supplier: "XYZ Accessories",
      invoiceNo: "INV12346",
      status: "Shipped",
    },
    {
      date: "2025-01-10",
      productName: "Keyboard",
      productType: "Electronics",
      productionPrice: 50,
      quantity: 1,
      supplier: "Tech Supplies",
      invoiceNo: "INV12347",
      status: "Delivered",
    },
    {
      date: "2025-01-12",
      productName: "Monitor",
      productType: "Electronics",
      productionPrice: 300,
      quantity: 1,
      supplier: "Tech Supplies",
      invoiceNo: "INV12348",
      status: "Pending",
    },
    {
      date: "2025-01-15",
      productName: "Mouse",
      productType: "Accessories",
      productionPrice: 40,
      quantity: 2,
      supplier: "XYZ Accessories",
      invoiceNo: "INV12349",
      status: "Delivered",
    },
  ];

  return (
    <div className="md:ml-80 sm:ml-0 overflow-x-hidden">
      <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black ">Purchase History</h3>
      {/* Wrap table with Box to enable horizontal scrolling */}
      <Box overflowX="auto" w="full" maxW="1000px">
        <Table variant="simple" colorScheme="teal">
          <TableCaption>History of all recent purchases</TableCaption>
          <Thead className="bg-teal-500 text-white">
            <Tr>
              <Th>S.No.</Th>
              <Th>Date</Th>
              <Th>Product Name</Th>
              <Th>Product Type</Th>
              <Th isNumeric>Production Price</Th>
              <Th isNumeric>Quantity</Th>
              <Th>Supplier</Th>
              <Th>Invoice No.</Th>
              <Th isNumeric>Total Price</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {purchases.map((purchase, index) => {
              const totalPrice = purchase.productionPrice * purchase.quantity; // Calculate total price
              return (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{purchase.date}</Td>
                  <Td>{purchase.productName}</Td>
                  <Td>{purchase.productType}</Td>
                  <Td isNumeric>${purchase.productionPrice.toFixed(2)}</Td>
                  <Td isNumeric>{purchase.quantity}</Td>
                  <Td>{purchase.supplier}</Td>
                  <Td>{purchase.invoiceNo}</Td>
                  <Td isNumeric>${totalPrice.toFixed(2)}</Td>
                  <Td>{purchase.status}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </div>
  );
};

export default PurchaseHistory;
