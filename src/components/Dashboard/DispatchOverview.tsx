//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Grid, GridItem, Img, Text } from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";

const DispatchOverview = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const [cookies] = useCookies(['access_token']);
  const [totalItems, setTotalItems] = useState();
  const [dispatchCount, setDispatchCount] = useState();
  const [deliveredCount, setDeliveredCount] = useState();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}production-process/accountant-data`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      setDispatchData(response.data.data);
      console.log("dispatch data",response.data.data);

     
      
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dispatchData) {
      const totalItems = dispatchData.reduce((acc, data) => {
        // Check if 'items' exists and is an array, then accumulate its length
        return acc + (data?.item?.length || 0);
      }, 0);
  
      setTotalItems(totalItems);

       let dispatchCount = 0;
      let deliveredCount = 0;

      dispatchData.forEach((data) => {
        if (data?.item) {
          data.item.forEach((ele) => {
            if (ele?.product_status === 'Dispatch') {
              dispatchCount += 1;
            } else if (ele?.product_status === 'Delivered') {
              deliveredCount += 1;
            }
          });
        }
      });

      setDispatchCount(dispatchCount);
      setDeliveredCount(deliveredCount);
    }
  }, [dispatchData]); 

  const data = {
    productsReady: 120,
    readyToDispatch: 80,
    delivered: 50,
  };

  return (
    <Box
      w="full"
      p={6}
      bg="gray.50"
      className=" flex items-center justify-center"
    >
   
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        className="w-full max-w-6xl"
      >
      
        <GridItem
          bg="white"
          shadow="md"
          rounded="lg"
          p={6}
          textAlign="center"
          placeItems="center"
          className="border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <Img src="/svg/box.svg" className=" w-20 h-20 filter-orange img-move-down" />
          <Text fontSize="2xl" fontWeight="bold" className="text-gray-700">
            {totalItems}
          </Text>
          <Text className="text-gray-500">Products Ready</Text>
        </GridItem>

      
        <GridItem
          bg="white"
          shadow="md"
          rounded="lg"
          p={6}
          textAlign="center"
          placeItems="center"
          className="border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <Img src="/svg/dispatch.svg" className=" w-20 h-20  filter-blue img-slide-in" />
          <Text fontSize="2xl" fontWeight="bold" className="text-gray-700">
            {dispatchCount}
          </Text>
          <Text className="text-gray-500">Out for delivery</Text>
        </GridItem>

        {/* Card 3: Products Delivered */}
        <GridItem
          bg="white"
          shadow="md"
          rounded="lg"
          p={6}
          textAlign="center"
          placeItems="center"
          className="border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <Img src="/svg/delivered.svg" className="  w-20 h-20 filter-green img-bounce-scale" />
          <Text fontSize="2xl" fontWeight="bold" className="text-gray-700">
            {deliveredCount}
          </Text>
          <Text className="text-gray-500">Products Delivered</Text>
        </GridItem>
      </Grid>
   

   </Box>
  );
};

export default DispatchOverview;
