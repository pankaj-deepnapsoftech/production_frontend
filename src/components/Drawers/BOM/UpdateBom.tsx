import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  useUpdateBOMMutation,
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import RawMaterial from "../../Dynamic Add Components/RawMaterial";
import Process from "../../Dynamic Add Components/Process";
import { useCookies } from "react-cookie";
import FormData from "form-data";
import ScrapMaterial from "../../Dynamic Add Components/ScrapMaterial";

interface UpdateBomProps {
  closeDrawerHandler: () => void;
  fetchBomsHandler: () => void;
  bomId: string | undefined;
}

const UpdateBom: React.FC<UpdateBomProps> = ({
  closeDrawerHandler,
  fetchBomsHandler,
  bomId,
}) => {
  const [cookies] = useCookies();
  const [isLoadingBom, setIsLoadingBom] = useState<boolean>(false);
  const [bomName, setBomName] = useState<string | undefined>();
  const [partsCount, setPartsCount] = useState<number>(0);
  const [totalPartsCost, setTotalPartsCost] = useState<number>(0);
  const [finishedGood, setFinishedGood] = useState<
    { value: string; label: string } | undefined
  >();
  const [unitCost, setUnitCost] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [uom, setUom] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const supportingDoc = useRef<HTMLInputElement | null>(null);
  const [comments, setComments] = useState<string | undefined>();
  const [cost, setCost] = useState<number | undefined>();

  const [processes, setProcesses] = useState<string[]>([""]);
  const [products, setProducts] = useState<any[]>([]);
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [updateBom] = useUpdateBOMMutation();
  const [labourCharges, setLabourCharges] = useState<number | undefined>();
  const [machineryCharges, setMachineryCharges] = useState<
    number | undefined
  >();
  const [electricityCharges, setElectricityCharges] = useState<
    number | undefined
  >();
  const [otherCharges, setOtherCharges] = useState<number | undefined>();

  const [rawMaterials, setRawMaterials] = useState<any[]>([
    {
      _id: "",
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
      _id: "",
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

  const updateBomHandler = async (e: React.FormEvent) => {
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
      _id: material?._id,
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
      scrapMaterials?.map((material) => ({
        _id: material?._id,
        item: material?.item_name?.value,
        description: material?.description,
        quantity: material?.quantity,
        total_part_cost: material?.total_part_cost,
      }));

    const body = {
      _id: bomId,
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
      const response = await updateBom(body).unwrap();
      toast.success(response?.message);
      fetchBomsHandler();
      closeDrawerHandler();
    } catch (error: any) {
      if (error?.data?.message?.includes('Insufficient stock')) {
        fetchBomsHandler();
        closeDrawerHandler();
      }
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const fetchBomDetails = async () => {
    try {
      setIsLoadingBom(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `bom/${bomId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setBomName(data.bom.bom_name);
      setPartsCount(data.bom.parts_count);
      setTotalPartsCost(data.bom.total_cost);
      setFinishedGood({
        value: data.bom.finished_good.item._id,
        label: data.bom.finished_good.item.name,
      });
      setDescription(data.bom.finished_good.description);
      setQuantity(data.bom.finished_good.quantity);
      setCost(data.bom.finished_good.cost);
      setUnitCost(data.bom.finished_good.item.price);
      setUom(data.bom.finished_good.item.uom);
      setCategory(data.bom.finished_good.item.category);
      setComments(data.bom.finished_good.comments);

      setProcesses(data.bom.processes);

      const inputs: any = [];
      data.bom.raw_materials.forEach((material: any) => {
        inputs.push({
          _id: material._id,
          item_name: { value: material.item._id, label: material.item.name },
          description: material.description,
          quantity: material.quantity,
          uom: material.item.uom,
          category: material.item.category,
          assembly_phase: {
            value: material?.assembly_phase,
            label: material?.assembly_phase,
          },
          supplier: {
            value: material?.supplier?._id,
            label: material?.supplier?.name,
          },
          supporting_doc: "",
          comments: material?.comments,
          unit_cost: material.item.price,
          total_part_cost: material.total_part_cost,
        });
      });
      setRawMaterials(inputs);

      const scrap: any = [];
      data.bom?.scrap_materials?.forEach((material: any) => {
        scrap.push({
          _id: material._id,
          item_name: { value: material.item._id, label: material.item.name },
          description: material.description,
          quantity: material.quantity,
          uom: material.item.uom,
          unit_cost: material.item.price,
          total_part_cost: material.total_part_cost,
        });
      });
      setScrapMaterials(scrap);

      setLabourCharges(data.bom?.other_charges?.labour_charges);
      setMachineryCharges(data.bom?.other_charges?.machinery_charges);
      setElectricityCharges(data.bom?.other_charges?.electricity_charges);
      setOtherCharges(data.bom?.other_charges?.other_charges);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBom(false);
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
    fetchBomDetails();
    fetchProductsHandler();
  }, []);

  useEffect(() => {
    const modifiedProducts = products.map((prd) => ({
      value: prd._id,
      label: prd.name,
    }));
    setProductOptions(modifiedProducts);
  }, [products]);

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
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            Update BOM
          </h2>

          <form onSubmit={updateBomHandler}>
            <RawMaterial
              products={products}
              productOptions={productOptions}
              inputs={rawMaterials}
              setInputs={setRawMaterials}
            />
            <Process inputs={processes} setInputs={setProcesses} />
            <div>
              <FormLabel fontWeight="bold">Finished Good</FormLabel>
              <div className="grid grid-cols-4 gap-2">
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Finished Good</FormLabel>
                  <Select
                    className="rounded mt-2 border border-[#a9a9a9]"
                    options={productOptions}
                    placeholder="Select"
                    value={finishedGood}
                    name="assembly_phase"
                    onChange={onFinishedGoodChangeHandler}
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5">
                  <FormLabel fontWeight="bold">Description</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    placeholder="Description"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Quantity</FormLabel>
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
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">
                    Unit Of Measurement (UOM)
                  </FormLabel>
                  <Input
                    isDisabled={true}
                    border="1px"
                    borderColor="#a9a9a9"
                    value={uom}
                    type="text"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Category</FormLabel>
                  <Input
                    isDisabled={true}
                    border="1px"
                    borderColor="#a9a9a9"
                    value={category}
                    type="text"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5">
                  <FormLabel fontWeight="bold">Supporting Doc</FormLabel>
                  <input
                    type="file"
                    placeholder="Choose a file"
                    accept=".pdf"
                    className="p-1 border border-[#a9a9a9] w-[267px] rounded"
                    ref={supportingDoc}
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5">
                  <FormLabel fontWeight="bold">Comments</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    type="text"
                    placeholder="Comments"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Unit Cost</FormLabel>
                  <Input
                    isDisabled={true}
                    border="1px"
                    borderColor="#a9a9a9"
                    value={unitCost}
                    type="number"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Cost</FormLabel>
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
              </div>
            </div>
            <div>
              <ScrapMaterial
                products={products}
                productOptions={productOptions}
                inputs={scrapMaterials}
                setInputs={setScrapMaterials}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mt-4 mb-2">Other Charges</h2>
              <div className="grid grid-cols-4 gap-2">
                <FormControl>
                  <FormLabel fontWeight="bold">Labour Charges</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={labourCharges}
                    onChange={(e) => setLabourCharges(+e.target.value)}
                    type="number"
                    placeholder="Labour Charges"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="bold">Machinery Charges</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={machineryCharges}
                    onChange={(e) => setMachineryCharges(+e.target.value)}
                    type="number"
                    placeholder="Machinery Charges"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="bold">Electricity Charges</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={electricityCharges}
                    onChange={(e) => setElectricityCharges(+e.target.value)}
                    type="number"
                    placeholder="Electricity Charges"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="bold">Other Charges</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={otherCharges}
                    onChange={(e) => setOtherCharges(+e.target.value)}
                    type="number"
                    placeholder="Other Charges"
                  />
                </FormControl>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">BOM Name</FormLabel>
                <Input
                  border="1px"
                  borderColor="#a9a9a9"
                  value={bomName}
                  onChange={(e) => setBomName(e.target.value)}
                  type="text"
                  placeholder="BOM Name"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Parts Count</FormLabel>
                <input
                  disabled={true}
                  value={partsCount}
                  type="number"
                  placeholder="Parts Count"
                  className="rounded px-2 py-[6px] w-[267px] border-[1px] border-[#a9a9a9] disabled:cursor-not-allowed disabled:bg-white"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Total Parts Cost</FormLabel>
                <input
                  disabled={true}
                  value={totalPartsCost}
                  type="number"
                  placeholder="Total Parts Cost"
                  className="rounded px-2 py-[6px] w-[267px] border-[1px] border-[#a9a9a9] disabled:cursor-not-allowed disabled:bg-white"
                />
              </FormControl>
            </div>

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

export default UpdateBom;
