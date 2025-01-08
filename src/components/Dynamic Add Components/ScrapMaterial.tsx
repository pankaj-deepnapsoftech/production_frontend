import {
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Tbody,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { IoIosRemoveCircleOutline, IoMdAddCircleOutline } from "react-icons/io";
import Select from "react-select";
import { toast } from "react-toastify";

interface ScrapMaterialProps {
  inputs: any[];
  products: any[];
  productOptions: any[];
  setInputs: (inputs: any) => void;
}

const ScrapMaterial: React.FC<ScrapMaterialProps> = ({
  inputs,
  setInputs,
  products,
  productOptions,
}) => {
  const [cookies] = useCookies();
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const onChangeHandler = (name: string, value: string, ind: number) => {
    const inputsArr: any = [...inputs];
    inputsArr[ind][name] = value;

    if (name === "quantity") {
      const unit_cost = inputsArr[ind]["unit_cost"];
      if (unit_cost) {
        inputsArr[ind]["total_part_cost"] = +unit_cost * +value;
      }
    } else if (name === "item_name") {
      const item_id = inputsArr[ind]["item_name"].value;
      const product = products.filter((prd: any) => prd._id === item_id)[0];
      inputsArr[ind]["uom"] = product.uom;
      inputsArr[ind]["unit_cost"] = product.price;
    }

    setInputs(inputsArr);
  };

  const addInputHandler = () => {
    setInputs((prev: any) => [
      ...prev,
      {
        item_name: "",
        description: "",
        estimated_quantity: "",
        produced_quantity: "",
        uom: "",
        unit_cost: "",
        total_part_cost: "",
      },
    ]);
  };

  const deleteInputHandler = (ind: number) => {
    const inputsArr = [...inputs];
    inputsArr.splice(ind, 1);
    setInputs(inputsArr);
  };

  useEffect(() => {
    let prods = [];
    prods = inputs?.map((material: any) => ({
      value: material.item_id,
      label: material.item_name,
    }));
    setSelectedProducts(prods);
  }, [inputs]);

  const headings = [
    "Product Name",
    "Description",
    "Estimated Quantity",
    "Produced Quantity",
    "UOM",
    "Unit Cost",
    "Total Part Cost",
  ];

  return (
    <div>
      <FormControl>
        <FormLabel fontWeight="bold">Scrap Materials</FormLabel>
        <Table
          variant="striped"
          colorScheme="gray"
          size="sm"
          mt={4}
          sx={{ tableLayout: "auto" }}
        >
          <Thead>
            <Tr>
              {headings.map((heading, index) => (
                <th key={index}>
                  <Text
                    bg="teal.500"
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    textAlign="center"
                    whiteSpace="nowrap"
                    fontSize={"sm"}
                    p={4}
                  >
                    {heading}
                  </Text>
                </th>
              ))}
            </Tr>
          </Thead>
          <Tbody className="bg-gray-100">
            {inputs &&
              inputs.map((input, ind) => (
                <Tr key={ind} bg={ind % 2 === 0 ? "gray.100" : "white"}>
                  <Td>
                    <FormControl className="mb-5">
                      <Select
                        required
                        className="rounded mt-2 border border-[#a9a9a9]"
                        options={productOptions}
                        placeholder="Select"
                        value={selectedProducts[ind]?.label}
                        name="item_name"
                        onChange={(d) => {
                          onChangeHandler("item_name", d, ind);
                        }}
                      />
                    </FormControl>
                  </Td>

                  <Td>
                    <FormControl>
                      <Input
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) => {
                          onChangeHandler(e.target.name, e.target.value, ind);
                        }}
                        type="text"
                        name="description"
                        value={input.description}
                        backgroundColor={"white"}
                      ></Input>
                    </FormControl>
                  </Td>

                  <Td>
                    <FormControl>
                      <Input
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) => {
                          onChangeHandler(e.target.name, e.target.value, ind);
                        }}
                        type="number"
                        name="estimated_quantity"
                        value={input.estimated_quantity}
                        backgroundColor={"white"}
                      ></Input>
                    </FormControl>
                  </Td>

                  <Td>
                    <FormControl>
                      <Input
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) => {
                          onChangeHandler(e.target.name, e.target.value, ind);
                        }}
                        type="number"
                        name="produced_quantity"
                        value={input.produced_quantity}
                        backgroundColor={"white"}
                      ></Input>
                    </FormControl>
                  </Td>

                  <Td>
                    <FormControl>
                      <Input
                        isDisabled={true}
                        border="1px"
                        borderColor="#a9a9a9"
                        type="text"
                        name="uom"
                        value={input.uom}
                      ></Input>
                    </FormControl>
                  </Td>

                  <Td>
                    <FormControl>
                      <Input
                        isDisabled={true}
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) => {
                          onChangeHandler(e.target.name, e.target.value, ind);
                        }}
                        type="number"
                        name="unit_cost"
                        value={input.unit_cost}
                      ></Input>
                    </FormControl>
                  </Td>

                  <Td>
                    <FormControl>
                      <input
                        disabled={true}
                        onChange={(e) => {
                          onChangeHandler(e.target.name, e.target.value, ind);
                        }}
                        type="number"
                        name="total_part_cost"
                        value={input.total_part_cost}
                        className="rounded px-2 py-[6px] w-[300px] border-[1px] border-[#a9a9a9] disabled:cursor-not-allowed disabled:bg-white"
                      ></input>
                    </FormControl>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </FormControl>
      <div className="text-end my-3">
        {inputs && inputs.length > 1 && (
          <Button
            onClick={() => deleteInputHandler(inputs.length - 1)}
            leftIcon={<IoIosRemoveCircleOutline />}
            variant="outline"
            className="mr-2 border"
            color={"#ef4444"}
            borderColor={"#ef4444"}
            backgroundColor={"#ffffff"}
            _hover={{ backgroundColor: "#ef4444", color: "#ffffff" }}
          >
            Remove
          </Button>
        )}
        <Button
          onClick={addInputHandler}
          leftIcon={<IoMdAddCircleOutline />}
          variant="outline"
          className="border "
          color={"#16a34a"}
          borderColor={"#16a34a"}
          backgroundColor={"#ffffff"}
          _hover={{ backgroundColor: "#16a34a", color: "#ffffff" }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default ScrapMaterial;