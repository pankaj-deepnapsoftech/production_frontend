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

interface GSTFields {
  CGST?: number;
  SGST?: number;
  IGST?: number;
}

const UpdateSale: React.FC = ({sale}) => {
  
  const [formData, setFormData] = useState({
    customer_id: sale?.customer_id?._id || "",
    product_name: sale?.product_name?._id || "",
    product_type: sale?.product_type || "finished goods",
    price: sale?.price || "",
    product_qty: sale?.product_qty || "",
    GST: sale?.GST || { CGST: 0, SGST: 0, IGST: 0 },
    Status: sale?.Status || "Pending",
    assined_to: sale?.assined_to?._id || "",
    customer_approve: sale?.customer_approve || "Pending",
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
    if (value === "IGST") {
      setFormData((prevData) => ({
        ...prevData,
        GST: { IGST: 18, CGST: 0, SGST: 0 },
      }));
    } else if (value === "CGST_SGST") {
      setFormData((prevData) => ({
        ...prevData,
        GST: { IGST: 0, CGST: 9, SGST: 9 },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}purchase/update/${sale._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      
     
      
      setFormData({
        customer_id: "",
        product_name: "",
        product_type: "finished goods",
        price: "",
        product_qty: "",
        GST: { CGST: 0, SGST: 0, IGST: 0 },
        Status: "Pending",
        assined_to: "",
        customer_approve: "Pending",
      })

      toast({
        title: "Purchase Created",
        description: "The purchase has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // console.log(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create the purchase. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      console.error(error);
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
              <option key={customer._id} value={customer._id}>
                {customer.full_name}
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
                product_name: selectedProductId,
                price: selectedProduct ? selectedProduct.price : "",
              }));
            }}
          >
            <option value="" disabled>
              Select a product
            </option>
            {products.map((product: any) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="price" isRequired>
          <FormLabel>Price</FormLabel>
          <Input type="number" name="price" value={formData.price} isReadOnly />
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
          <RadioGroup onChange={handleGSTChange}>
            <Stack direction="row">
              <Radio value="IGST">IGST (18%)</Radio>
              <Radio value="CGST_SGST">CGST (9%) & SGST (9%)</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl id="assined_to" isRequired>
          <FormLabel>Assigned To</FormLabel>
          <Select
            name="assined_to"
            value={formData.assined_to}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Select a user
            </option>
            {users.map((user: any) => (
              <option key={user._id} value={user._id}>
                {user.first_name} - {user.role ? user.role.role : "No Role"}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="teal" size="lg" width="full">
          Update Sale
        </Button>
      </form>
    </Box>
  );
};

export default UpdateSale;
