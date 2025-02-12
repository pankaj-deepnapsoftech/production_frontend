//@ts-nocheck
import {
  Button,
  HStack,
  Img,
  Text,
  Toast,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { IoMdCheckmarkCircle } from "react-icons/io";

const PaymentModal = ({ sale_id, payment, verify, assign, payfor, onClose }) => {
  console.log(payfor)
  const [cookies] = useCookies(["access_token"]);
  const toast = useToast();

  const verifyToken = async () => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/verifyToken/${sale_id}`,
        {assignId: assign },
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Token Amount Verified successfully :) ",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to verify the token,  Please try again :( ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/verify-payement/${sale_id}`,
        { payment_verify: true, assignId: assign },
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Payment Verified successfully :) ",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to verify the payment,  Please try again :( ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
  
      <VStack>
        <Text className="text-green-600 font-bold text-center">
         {payfor === "token" ? "Token Amount has been uploaded by the customer" : " Payment has been uploaded by the customer"}
        </Text>

        <img src={payment} alt="payment proof" />

        {verify === true ? (
          <Text className="text-green-600 space-x-2 flex items-center justify-center ">
            <IoMdCheckmarkCircle />
            Verified
          </Text>
        ) : (
          <>
            <Button colorScheme="green" onClick={payfor === "token" ? verifyToken : handleVerify }>
              Verify
            </Button>
            <Text className="text-sm text-orange-500">
              Please click on verify button to verify the payment
            </Text>
          </>
        )}
      </VStack>
    </div>
  );
};

export default PaymentModal;
