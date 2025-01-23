import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useAddBomMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import RawMaterial from "../../Dynamic Add Components/RawMaterial";
import Process from "../../Dynamic Add Components/Process";
import { useCookies } from "react-cookie";
import ScrapMaterial from "../../Dynamic Add Components/ScrapMaterial";

interface AddBomProps {
  closeDrawerHandler: () => void;
  fetchBomsHandler: () => void;
}

const AddBom: React.FC<AddBomProps> = ({
  closeDrawerHandler,
  fetchBomsHandler,
}) => {
  const [cookies] = useCookies();
  const [bomName, setBomName] = useState<string | undefined>();
  const [partsCount, setPartsCount] = useState<number>(0);
  const [totalPartsCost, setTotalPartsCost] = useState<number>(0);
  const [finishedGood, setFinishedGood] = useState<
    { value: string; label: string } | undefined
  >();
  const [description, setDescription] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [uom, setUom] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const supportingDoc = useRef<HTMLInputElement | null>(null);
  const [comments, setComments] = useState<string | undefined>();
  const [cost, setCost] = useState<number | undefined>();
  const [unitCost, setUnitCost] = useState<string | undefined>();
  const [processes, setProcesses] = useState<string[]>([""]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productOptions, setProductOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [labourCharges, setLabourCharges] = useState<number | undefined>();
  const [machineryCharges, setMachineryCharges] = useState<
    number | undefined
  >();
  const [electricityCharges, setElectricityCharges] = useState<
    number | undefined
  >();
  const [otherCharges, setOtherCharges] = useState<number | undefined>();

  const [addBom] = useAddBomMutation();

  const [rawMaterials, setRawMaterials] = useState<any[]>([
    {
      item_name: "",
      description: "",
      quantity: "",
      uom: "",
      category: "",
      assembly_phase: "",
      supplier: "",
      supporting_doc: "",
      comments: "",
      unit_cost: "",
      total_part_cost: "",
    },
  ]);

  const [scrapMaterials, setScrapMaterials] = useState<any[]>([
    {
      item_name: "",
      description: "",
      quantity: "",
      uom: "",
      unit_cost: "",
      total_part_cost: "",
    },
  ]);

  const categoryOptions = [
    { value: "finished goods", label: "Finished Goods" },
    { value: "raw materials", label: "Raw Materials" },
    { value: "semi finished goods", label: "Semi Finished Goods" },
    { value: "consumables", label: "Consumables" },
    { value: "bought out parts", label: "Bought Out Parts" },
    { value: "trading goods", label: "Trading Goods" },
    { value: "service", label: "Service" },
  ];

  const uomOptions = [
    { value: "pcs", label: "pcs" },
    { value: "kgs", label: "kgs" },
    { value: "ltr", label: "ltr" },
    { value: "tonne", label: "tonne" },
    { value: "cm", label: "cm" },
    { value: "inch", label: "inch" },
    { value: "mtr", label: "mtr" },
  ];

  const addBomHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const fileInput = supportingDoc.current as HTMLInputElement;
    let pdfUrl;
    if (fileInput && fileInput?.files && fileInput.files.length > 0) {
      try {
        const formData = new FormData();

        formData.append("file", fileInput?.files && fileInput.files[0]);

        const uploadedFileResponse = await fetch(
          process.env.REACT_APP_FILE_UPLOAD_URL!,
          {
            method: "POST",
            body: formData as unknown as BodyInit,
          }
        );
        const uploadedFile: any = await uploadedFileResponse.json();

        if (uploadedFile?.error) {
          throw new Error(uploadedFile?.error);
        }

        pdfUrl = uploadedFile[0];
      } catch (err: any) {
        toast.error(err.message || "Something went wrong during file upload");
        return;
      }
    }

    let modifiedRawMaterials = rawMaterials.map((material) => ({
      item: material?.item_name?.value,
      description: material?.description,
      quantity: material?.quantity,
      assembly_phase: material?.assembly_phase?.value,
      supplier: material?.supplier?.value,
      supporting_doc: material?.supporting_doc,
      comments: material?.comments,
      total_part_cost: material?.total_part_cost,
    }));

    let modifiedScrapMaterials =
      scrapMaterials?.[0]?.item_name &&
      scrapMaterials.map((material) => ({
        item: material?.item_name?.value,
        description: material?.description,
        quantity: material?.quantity,
        total_part_cost: material?.total_part_cost,
      }));

    const body = {
      raw_materials: modifiedRawMaterials,
      scrap_materials: modifiedScrapMaterials,
      processes: processes,
      finished_good: {
        item: finishedGood?.value,
        description: description,
        quantity: quantity,
        supporting_doc: pdfUrl,
        comments: comments,
        cost: cost,
      },
      bom_name: bomName,
      parts_count: partsCount,
      total_cost: totalPartsCost,
      other_charges: {
        labour_charges: labourCharges || 0,
        machinery_charges: machineryCharges || 0,
        electricity_charges: electricityCharges || 0,
        other_charges: otherCharges || 0,
      },
    };

    try {
      const response = await addBom(body).unwrap();
      console.log(response);
      toast.success(response?.message);
      fetchBomsHandler();
      closeDrawerHandler();
    } catch (error: any) {
      console.log(error);
      if (error?.data?.message?.includes("Insufficient stock")) {
        fetchBomsHandler();
        closeDrawerHandler();
      }
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const fetchProductsHandler = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const results = await response.json();
      if (!results.success) {
        throw new Error(results?.message);
      }
      setProducts(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const onFinishedGoodChangeHandler = (d: any) => {
    setFinishedGood(d);
    const product: any = products.filter((prd: any) => prd._id === d.value)[0];
    setCategory(product.category);
    setUom(product.uom);
    setUnitCost(product.price);
    if (quantity) {
      setCost(product.price * +quantity);
    }
  };

  const onFinishedGoodQntyChangeHandler = (qty: number) => {
    setQuantity(qty);
    if (unitCost) {
      setCost(+unitCost * qty);
    }
  };

  useEffect(() => {
    if (
      rawMaterials[rawMaterials.length - 1].unit_cost !== "" &&
      rawMaterials[rawMaterials.length - 1].quantity !== ""
    ) {
      setPartsCount(rawMaterials.length);
      const cost = rawMaterials.reduce(
        (prev, current) => prev + +current?.unit_cost * +current?.quantity,
        0
      );
      setTotalPartsCost(cost);
    }
  }, [rawMaterials]);

  useEffect(() => {
    fetchProductsHandler();
  }, []);

  useEffect(() => {
    const modifiedProducts = products.map((prd) => ({
      value: prd._id,
      label: prd.name,
    }));
    setProductOptions(modifiedProducts);
  }, [products]);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[50vw] md:w-[90vw] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Bill Of Materials (BOM)
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
            Add New BOM
          </h2>

          <form onSubmit={addBomHandler}>
            <RawMaterial
              products={products}
              productOptions={productOptions}
              inputs={rawMaterials}
              setInputs={setRawMaterials}
            />

            <hr className="my-5" />

            <Process inputs={processes} setInputs={setProcesses} />

            <hr className="my-5" />

            <div className="py-3">
              <FormControl isRequired>
                <FormLabel fontWeight="bold">Finished Good</FormLabel>
                <Table
                  variant="simple"
                  size="sm"
                  mt={4}
                  sx={{ tableLayout: "auto" }}
                >
                  <Thead>
                    <Tr>
                      <Th
                        bg="teal.500"
                        color="white"
                        fontWeight="bold"
                        textTransform="uppercase"
                        textAlign="center"
                        whiteSpace="nowrap"
                        p={4}
                      >
                        Finished Goods
                      </Th>

                      <Th
                        bg="teal.500"
                        color="white"
                        fontWeight="bold"
                        textTransform="uppercase"
                        textAlign="center"
                        p={4}
                      >
                        Quantity
                      </Th>
                      <Th
                        bg="teal.500"
                        color="white"
                        fontWeight="bold"
                        textTransform="uppercase"
                        textAlign="center"
                        p={4}
                      >
                        UOM
                      </Th>
                      <Th
                        bg="teal.500"
                        color="white"
                        fontWeight="bold"
                        textTransform="uppercase"
                        textAlign="center"
                        p={4}
                      >
                        Category
                      </Th>

                      <Th
                        bg="teal.500"
                        color="white"
                        fontWeight="bold"
                        textTransform="uppercase"
                        textAlign="center"
                        p={4}
                      >
                        Comments
                      </Th>
                      <Th
                        bg="teal.500"
                        color="white"
                        fontWeight="bold"
                        textTransform="uppercase"
                        textAlign="center"
                        p={4}
                      >
                        Unit Cost
                      </Th>
                      <Th
                        bg="teal.500"
                        color="white"
                        fontWeight="bold"
                        textTransform="uppercase"
                        textAlign="center"
                        p={4}
                      >
                        Cost
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Td>
                      <FormControl isRequired>
                        <Select
                          className="rounded mt-2 border border-[#a9a9a9]"
                          options={productOptions}
                          placeholder="Select"
                          value={finishedGood}
                          name="assembly_phase"
                          onChange={onFinishedGoodChangeHandler}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl isRequired>
                        <Input
                          border="1px"
                          borderColor="#a9a9a9"
                          value={quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onFinishedGoodQntyChangeHandler(+e.target.value)
                          }
                          type="number"
                          placeholder="Quantity"
                        />
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl isRequired>
                        <Input
                          isDisabled={true}
                          border="1px"
                          borderColor="#a9a9a9"
                          value={uom}
                          type="text"
                        />
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl isRequired>
                        <Input
                          isDisabled={true}
                          border="1px"
                          borderColor="#a9a9a9"
                          value={category}
                          type="text"
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl>
                        <Input
                          border="1px"
                          borderColor="#a9a9a9"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          type="text"
                          placeholder="Comments"
                        />
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl isRequired>
                        <Input
                          isDisabled={true}
                          border="1px"
                          borderColor="#a9a9a9"
                          value={unitCost}
                          type="number"
                        />
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl isRequired>
                        <Input
                          isDisabled={true}
                          border="1px"
                          borderColor="#a9a9a9"
                          value={cost}
                          onChange={(e) => setCost(+e.target.value)}
                          type="number"
                          placeholder="Cost"
                        />
                      </FormControl>
                    </Td>
                  </Tbody>
                </Table>
              </FormControl>
            </div>

            <hr className="my-5" />

            <div>
              <ScrapMaterial
                products={products}
                productOptions={productOptions}
                inputs={scrapMaterials}
                setInputs={setScrapMaterials}
              />
            </div>

            <hr className="my-5" />

            <FormLabel fontSize="lg" fontWeight="bold">
              {" "}
              Charges
            </FormLabel>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold" color="teal.600">
                  Labour Charges
                </FormLabel>
                <Input
                  border="1px"
                  borderColor="#a9a9a9"
                  value={labourCharges}
                  onChange={(e) => setLabourCharges(+e.target.value)}
                  type="number"
                  placeholder="Labour Charges"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel fontWeight="bold" color="teal.600">
                  Machinery Charges
                </FormLabel>
                <Input
                  border="1px"
                  borderColor="#a9a9a9"
                  value={machineryCharges}
                  onChange={(e) => setMachineryCharges(+e.target.value)}
                  type="number"
                  placeholder="Machinery Charges"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel fontWeight="bold" color="teal.600">
                  Electricity Charges
                </FormLabel>
                <Input
                  border="1px"
                  borderColor="#a9a9a9"
                  value={electricityCharges}
                  onChange={(e) => setElectricityCharges(+e.target.value)}
                  type="number"
                  placeholder="Electricity Charges"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel fontWeight="bold" color="teal.600">
                  Other Charges
                </FormLabel>
                <Input
                  border="1px"
                  borderColor="#a9a9a9"
                  value={otherCharges}
                  onChange={(e) => setOtherCharges(+e.target.value)}
                  type="number"
                  placeholder="Other Charges"
                />
              </FormControl>
            </Grid>
            <hr className="my-5" />

            <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={5}>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold" color="teal.600">
                  BOM Name
                </FormLabel>
                <Input
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="lg"
                  focusBorderColor="teal.500"
                  value={bomName}
                  onChange={(e) => setBomName(e.target.value)}
                  type="text"
                  placeholder="Enter BOM Name"
                  _hover={{ borderColor: "teal.400" }}
                  _focus={{ borderColor: "teal.500" }}
                  transition="all 0.2s"
                />
              </FormControl>

              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold" color="teal.600">
                  Parts Count
                </FormLabel>
                <Input
                  isReadOnly
                  value={partsCount}
                  type="number"
                  placeholder="Parts Count"
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="lg"
                  _focus={{ borderColor: "teal.500" }}
                  _hover={{ borderColor: "teal.400" }}
                  transition="all 0.2s"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold" color="teal.600">
                  Total Parts Cost
                </FormLabel>
                <Input
                  isReadOnly
                  value={totalPartsCost}
                  type="number"
                  placeholder="Total Parts Cost"
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="lg"
                  _focus={{ borderColor: "teal.500" }}
                  _hover={{ borderColor: "teal.400" }}
                  transition="all 0.2s"
                  bg="gray.50"
                />
              </FormControl>
            </Grid>

            <Button
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#1640d6"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddBom;
