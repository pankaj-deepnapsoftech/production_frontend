// @ts-nocheck
import { Line } from "react-chartjs-2";
import { TbProgressCheck } from "react-icons/tb";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Flex, Progress, Text, Grid, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useState } from "react";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Overview = () => {
  // Data for the Purchase History graph
  const purchaseHistoryData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Purchase History",
        data: [100, 150, 120, 180, 130, 170, 200, 220, 180, 160, 190, 210], // Example data
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Options for the Purchase History graph
  const purchaseHistoryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Purchase History Over The Year",
      },
    },
  };
 
  // Production Status Data (Card)
  const productionStatus = {
    title: "Production Status",
    status: "In Progress",
    progress: 75, // Example progress percentage
    progressColor: "bg-teal-500", // Can be dynamic based on the status
  };

  const [purchases, setPurchases] = useState(100);

  return (
    <div className="md:ml-80 sm:ml-0 overflow-x-hidden">
      <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black ">
        Overview
      </h3>

      <div className="mb-8 w-full max-w-4xl sm:max-w-full mx-auto">
        <div className="h-full">
          {" "}
          <Line data={purchaseHistoryData} options={purchaseHistoryOptions} />
        </div>
      </div>
      <hr className="bg-gray-800 border" />

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={3}
        className="p-4 mt-5"
      >
        {/* Production Status Card */}
        <Box
          bg="blue.400"
          p={6}
          color="white"
          borderRadius="lg"
          className="flex items-center justify-center flex-col"
          boxShadow="md"
          width="80%"
          height="100%"
          textAlign="center"
        >
          <TbProgressCheck className="text-9xl text-gray-200"/>
         
          <Text fontSize="xl" mb={4} mt={4}>
            Production Status: <span className="font-semibold">{productionStatus.status}</span>
          </Text>
          
        </Box>

        {/* Purchases Card */}
        <Box
          bg="green.400"
          p={6}
          color="white"
          borderRadius="lg"
          boxShadow="md"
          width="80%"
          height="100%"
          textAlign="center"
        >
          <Box
            borderColor="gray-200"
            className="border-8 shadow-md "
            color="white"
            borderRadius="100%"
            width="8em"
            height="8em"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            mb={4} 
          >
            <Text fontSize="3xl" fontWeight="bold">
              {purchases}
            </Text>
          </Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Purchases
          </Text>
        </Box>
      </Grid>
    </div>
  );
};

export default Overview;
