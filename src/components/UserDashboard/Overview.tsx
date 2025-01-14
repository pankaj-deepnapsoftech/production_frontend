import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios"; // Axios for API calls
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
import { Box, Grid, Text } from "@chakra-ui/react";
import { useCookies } from "react-cookie";

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

// Define types for purchases
interface Purchase {
  createdAt: string;
  product_name: string;
}

interface GraphData {
  labels: string[];
  datasets: { label: string; data: number[]; borderColor: string; tension: number }[];
}

const Overview = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]); // Store purchase objects
  const [totalPurchases, setTotalPurchases] = useState<number>(0); // Store the total number of purchases
  const [graphData, setGraphData] = useState<GraphData>({
    labels: [],
    datasets: [],
  });
  const [cookies] = useCookies(["access_token"]);
  const { role } = useSelector((state: any) => state.auth);

  // Navigate based on role
  useEffect(() => {
    if (role === "Security Guard") {
      navigate("/entries");
    }
  }, [role, navigate]);

  // Fetch data for purchases and update state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = cookies.access_token;

        if (!token) {
          throw new Error("Authentication token not found");
        }
  
        const response = await axios.get<{ data: Purchase[] }>(
          `${process.env.REACT_APP_BACKEND_URL}purchase/getAll`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const fetchedPurchases = response.data.data;
        setPurchases(fetchedPurchases);

        // Process data for the graph
        const monthlyData = Array(12).fill(0); // Initialize array to store count for each month
        fetchedPurchases.forEach((purchase) => {
          const purchaseDate = new Date(purchase.createdAt);
          const month = purchaseDate.getMonth(); // Get the month (0-indexed)
          monthlyData[month] += 1; // Increment the count for the month
        });

        setGraphData({
          labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ],
          datasets: [
            {
              label: "Purchases",
              data: monthlyData,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        });

        // Set the total purchases count
        setTotalPurchases(fetchedPurchases.length);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    fetchData();
  }, [cookies.access_token]);

  // Production Status Data
  const productionStatus = {
    title: "Production Status",
    status: "In Progress",
    progress: 75,
  };

  return (
    <div className="md:ml-80 sm:ml-0 overflow-x-hidden mt-10 lg:mt-0">
      <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black">
        Overview
      </h3>

      <div className="mb-8 w-full max-w-4xl sm:max-w-full mx-auto">
        <div className="h-full">
          <Line data={graphData} options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Purchases Over the Year" },
            },
          }} />
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
          <TbProgressCheck className="text-9xl text-gray-200" />
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
            className="border-8 shadow-md"
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
              {totalPurchases}
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
