// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Box,
  RadioGroup,
  Radio,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";

const CreateSale: React.FC = ({ onClose, refresh }) => {
  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    product_type: "finished goods",
    price: "",
    product_qty: "",
    GST: 0,
    comment: "",
    productFile: null, // New field for image
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies();
  const toast = useToast();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [customerRes, productRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}customer/get-all`, {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}product/all`, {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),
        ]);

        const filteredProducts = (productRes.data.products || []).filter(
          (product: any) => product.category == "finished goods"
        );

        setCustomers(customerRes.data.data || []);
        setProducts(filteredProducts || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data for dropdowns.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchDropdownData();
  }, [cookies.access_token, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prevData) => ({ ...prevData, productFile: file }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleGSTChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      GST: Number(value),
    }));
  };

  const handleDiscountChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      discount: Number(value),
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("customer_id", formData.customer_id);
    formDataToSend.append("product_id", formData.product_id);
    formDataToSend.append("product_type", formData.product_type);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("product_qty", formData.product_qty);
    formDataToSend.append("GST", formData.GST.toString());
    formDataToSend.append("discount", formData.discount);
    formDataToSend.append("comment", formData.comment);
    
    if (formData.productFile) {
      formDataToSend.append("productFile", formData.productFile);
    }

 

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}purchase/create`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData({
        customer_id: "",
        product_id: "",
        product_type: "finished goods",
        price: "",
        product_qty: "",
        GST: 0,
        comment: "",
        productFile: null,
      });

      toast({
        title: "Sale Created",
        description: "The sale has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
      refresh();
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to create the sale. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="full" maxW="md" mx="auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormControl id="customer_id" isRequired>
          <FormLabel>Customer</FormLabel>
          <Select
            name="customer_id"
            value={formData.customer_id}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select a customer</option>
            {customers.map((customer: any) => (
              <option key={customer?._id} value={customer?._id}>
                {customer?.full_name} {customer?.company_name ? ` - ${customer?.company_name}` : null}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="product_name" isRequired>
          <FormLabel>Product</FormLabel>
          <Select
            name="product_id"
            value={formData?.product_id}
            onChange={handleInputChange}
          >
            <option value="">Select a product</option>
            {products.map((product: any) => (
              <option key={product?._id} value={product?._id}>
                {product?.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="price" isRequired>
          <FormLabel>Price</FormLabel>
          <Input type="number" name="price" value={formData?.price} onChange={handleInputChange} />
        </FormControl>

        <FormControl id="product_qty" isRequired>
          <FormLabel>Product Quantity</FormLabel>
          <Input type="number" name="product_qty" value={formData?.product_qty} onChange={handleInputChange} />
        </FormControl>
          
        <FormControl>
          <FormLabel>Discount</FormLabel>
          <RadioGroup
          onChange={handleDiscountChange} 
            value={formData?.discount}
          >
            <Stack direction="row">
              <Radio value="50">50% OFF</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>


        <FormControl id="GST" isRequired>
          <FormLabel>GST Type</FormLabel>
          <RadioGroup onChange={handleGSTChange} value={formData?.GST?.toString()}>
            <Stack direction="row">
              <Radio value="18">GST (18%)</Radio>
              <Radio value="12">GST (12%)</Radio>
              <Radio value="5">GST (5%)</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl id="productFile">
          <FormLabel>Product Image</FormLabel>
          <Input type="file" accept="image/*" name="productFile" onChange={handleInputChange} />
        </FormControl>

        <FormControl id="comment">
          <FormLabel>Remarks</FormLabel>
          <Input type="text" name="comment" value={formData?.comment} onChange={handleInputChange} placeholder="Further Details (if any)" />
        </FormControl>

        <Button type="submit" colorScheme="teal" size="lg" width="full">
          Add Sale
        </Button>
      </form>
    </Box>
  );

};

export default CreateSale;
