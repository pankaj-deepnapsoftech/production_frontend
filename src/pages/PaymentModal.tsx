//@ts-nocheck
import { Button, HStack, Img, Text, Toast, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { IoMdCheckmarkCircle } from "react-icons/io";

const PaymentModal = ({sale_id, payment, verify, onClose}) => {
   // console.log("saleid: ", sale_id);
    //console.log("payment: ", payment);
    const [cookies] = useCookies(['access_token']);
    const toast = useToast();

    const handleVerify = async()=>{
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}purchase/verify-payement/${sale_id}`, 
                {payment_verify: true},
                {
                    headers:{
                        Authorization: `Bearer ${cookies?.access_token}`,
                    }
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
    }
    
  return (
    <div>
      <VStack>
        <Text className="text-green-600 font-bold">Payment has been uploaded by the customer</Text>
       
        <img src={payment} alt="payment proof"/>

        {verify === true ? (
            <Text className="text-green-600 space-x-2 flex items-center justify-center "><IoMdCheckmarkCircle />Verified</Text>
        ): (
            <>
            <Button 
            colorScheme="green"
            onClick={handleVerify}
            >
                Verify
            </Button>
             <Text className="text-sm text-orange-500">Please click on verify button to verify the payment</Text>
             </>
        )}
        

      </VStack>
    </div>
  );
};

export default PaymentModal;
