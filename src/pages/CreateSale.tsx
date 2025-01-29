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

const CreateSale: React.FC = ({ onClose }) => {
  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    product_type: "finished goods",
    price: "",
    product_qty: "",
    GST: 0,
    comment: "",
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies();
  const toast = useToast();

  useEffect(() => {
    // Fetch data for dropdowns
    const fetchDropdownData = async () => {
      try {
        const [customerRes, productRes, userRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}customer/get-all`, {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}product/all`, {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),

          axios.get(`${process.env.REACT_APP_BACKEND_URL}auth/all`, {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),
        ]);

        const filteredUsers = (userRes.data.users || []).filter(
          (user: any) => user.role
        );

        const filteredProducts = (productRes.data.products || []).filter(
          (product: any) => product.category == "finished goods"
        );

        setCustomers(customerRes.data.data || []);
        setProducts(filteredProducts || []);
        setUsers(filteredUsers || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
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
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleGSTChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      GST: Number(value), // Update GST as a number in the formData
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}purchase/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );

      setFormData({
        customer_id: "",
        product_id: "",
        product_type: "finished goods",
        price: "",
        product_qty: "",
        GST: { CGST: 0, SGST: 0, IGST: 0 },
        customer_approve: "Pending",
        comment: "",
      });

      toast({
        title: "Purchase Created",
        description: "The purchase has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
      //console.log(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create the purchase. Please try again.",
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
            <option value="" disabled>
              Select a customer
            </option>
            {customers.map((customer: any) => (
              <option key={customer?._id} value={customer?._id}>
                {customer?.full_name}{" "}
                {customer?.company_name ? ` - ${customer?.company_name}` : null}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="product_name" isRequired>
          <FormLabel>Product</FormLabel>
          <Select
            name="product_name"
            value={formData.product_name}
            onChange={(e) => {
              const selectedProductId = e.target.value;
              const selectedProduct = products.find(
                (product) => product._id === selectedProductId
              );

              setFormData((prevData) => ({
                ...prevData,
                product_id: selectedProductId,
                price: selectedProduct ? selectedProduct.price : "",
              }));
            }}
          >
            <option value="">Select a product</option>
            {products.map((product: any) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="price" isRequired>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl id="product_qty" isRequired>
          <FormLabel>Product Quantity</FormLabel>
          <Input
            type="number"
            name="product_qty"
            value={formData.product_qty}
            onChange={handleInputChange}
            placeholder="Enter quantity"
          />
        </FormControl>

        <FormControl id="GST" isRequired>
          <FormLabel>GST Type</FormLabel>
          <RadioGroup
            onChange={handleGSTChange}
            value={formData.GST.toString()}
          >
            <Stack direction="row">
              <Radio value="18">GST (18%)</Radio>
              <Radio value="12">GST (12%)</Radio>
              <Radio value="5">GST (5%)</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl id="comment">
          <FormLabel>Remarks</FormLabel>
          <Input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Further Details (if any)"
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" size="lg" width="full">
          Add Sale
        </Button>
      </form>
    </Box>
  );
};

export default CreateSale;
