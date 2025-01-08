import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  useAddProductMutation,
  useCreateProcessMutation,
  useCreateProformaInvoiceMutation,
  useUpdateProcessMutation,
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddItems from "../../Dynamic Add Components/AddItems";
import Process from "../../Dynamic Add Components/ProductionProcess";
import RawMaterial from "../../Dynamic Add Components/ProcessRawMaterial";
import ScrapMaterial from "../../Dynamic Add Components/ScrapMaterial";
import ProcessScrapMaterial from "../../Dynamic Add Components/ProcessScrapMaterial";

interface UpdateProcess {
  closeDrawerHandler: () => void;
  fetchProcessHandler: () => void;
  id: string | undefined;
}

const UpdateProcess: React.FC<UpdateProcess> = ({
  closeDrawerHandler,
  fetchProcessHandler,
  id,
}) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [bomName, setBomName] = useState<string | undefined>();
  const [totalCost, setTotalCost] = useState<string | undefined>();
  const [createdBy, setCreatedBy] = useState<string | undefined>();
  const [processes, setProcesses] = useState<string[] | []>([]);

  const [products, setProducts] = useState<any[]>([]);
  const [productOptions, setProductOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([
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
      estimated_quantity: "",
      used_quantity: "",
    },
  ]);

  const [bomId, setBomId] = useState<string | undefined>();
  const [productionProcessId, setProductionProcessId] = useState<
    string | undefined
  >();
  const [finishedGood, setFinishedGood] = useState<
    { value: string; label: string } | undefined
  >();
  const [finishedGoodDescription, setFinishedGoodDescription] = useState<
    string | undefined
  >();
  const [finishedGoodQuantity, setFinishedGoodQuantity] = useState<
    number | undefined
  >();
  const [finishedGoodProducedQuantity, setFinishedGoodProducedQuantity] =
    useState<number | undefined>();
  const [finishedGoodUom, setFinishedGoodUom] = useState<string | undefined>();
  const [finishedGoodCategory, setFinishedGoodCategory] = useState<
    string | undefined
  >();
  const finishedGoodSupportingDoc = useRef<HTMLInputElement | null>(null);
  const [finishedGoodComments, setFinishedGoodComments] = useState<
    string | undefined
  >();
  const [finishedGoodCost, setFinishedGoodCost] = useState<
    number | undefined
  >();
  const [finishedGoodUnitCost, setFinishedGoodUnitCost] = useState<
    string | undefined
  >();
  const [submitBtnText, setSubmitBtnText] = useState<string>("Update");
  const [processStatus, setProcessStatus] = useState<string | undefined>();
  const [rawMaterialApprovalPending, setRawMaterialApprovalPending] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [scrapMaterials, setScrapMaterials] = useState<any[]>([
    {
      _id: "",
      item_name: "",
      description: "",
      estimated_quantity: "",
      produced_quantity: "",
      uom: "",
      unit_cost: "",
      total_part_cost: "",
    },
  ]);

  const [updateProcess] = useUpdateProcessMutation();

  const onFinishedGoodChangeHandler = (d: any) => {
    setFinishedGood(d);
    const product: any = products.filter((prd: any) => prd._id === d.value)[0];
    setFinishedGoodCategory(product.category);
    setFinishedGoodUom(product.uom);
    setFinishedGoodUnitCost(product.price);
    if (finishedGoodQuantity) {
      setFinishedGoodCost(product.price * +finishedGoodQuantity);
    }
  };

  const onFinishedGoodQntyChangeHandler = (qty: number) => {
    setFinishedGoodQuantity(qty);
    if (finishedGoodUnitCost) {
      setFinishedGoodCost(+finishedGoodUnitCost * qty);
    }
  };

  const updateProcessHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    let modifiedScrapMaterials =
      scrapMaterials?.[0]?.item_name &&
      scrapMaterials?.map((material) => ({
        _id: material?._id,
        item: material?.item_name?.value,
        description: material?.description,
        estimated_quantity: material?.estimated_quantity,
        produced_quantity: material?.produced_quantity,
        total_part_cost: material?.total_part_cost,
      }));

    const data = {
      // BOM
      bom: {
        _id: bomId,
        raw_materials: selectedProducts,
        scrap_materials: modifiedScrapMaterials,
        processes: processes,
        finished_good: {
          item: finishedGood?.value,
          description: finishedGoodDescription,
          estimated_quantity: finishedGoodQuantity,
          produced_quantity: finishedGoodProducedQuantity,
          comments: finishedGoodComments,
          cost: finishedGoodCost,
        },
        bom_name: bomName,
        total_cost: totalCost,
      },
      // Production Process
      status: processStatus,
      _id: productionProcessId,
    };

    try {
      setIsUpdating(true);
      const response = await updateProcess(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      closeDrawerHandler();
      fetchProcessHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const markProcessDoneHandler = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `production-process/done/${productionProcessId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      closeDrawerHandler();
      fetchProcessHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchProcessDetailsHandler = async (id: string) => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `production-process/${id}`,
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

      setProductionProcessId(data.production_process._id);
      setBomId(data.production_process.bom._id);
      setBomName(data.production_process.bom.bom_name);
      setTotalCost(data.production_process.bom.total_cost);
      setCreatedBy(
        (data.production_process.bom?.creator?.first_name || "") +
          " " +
          (data.production_process.bom?.creator?.last_name || "")
      );

      const modifiedRawMaterials =
        data.production_process.bom.raw_materials.map((material: any) => {
          const prod = data.production_process.raw_materials.find(
            (p: any) => p.item._id === material.item._id
          );

          return {
            _id: material._id,
            item: material.item._id,
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
            estimated_quantity: prod.estimated_quantity,
            used_quantity: prod.used_quantity,
          };
        });

      setSelectedProducts(modifiedRawMaterials);

      const scrap: any = [];
      data.production_process?.bom?.scrap_materials?.forEach(
        (material: any) => {
          const sc = data.production_process.scrap_materials.find(
            (p: any) => p.item === material.item._id
          );

          scrap.push({
            _id: material._id,
            item_name: { value: material.item._id, label: material.item.name },
            description: material.description,
            estimated_quantity: sc.estimated_quantity,
            produced_quantity: sc.produced_quantity,
            uom: material.item.uom,
            unit_cost: material.item.price,
            total_part_cost: material.total_part_cost,
          });
        }
      );
      setScrapMaterials(scrap);

      setProcesses(data.production_process.processes);

      setFinishedGood({
        value: data.production_process.bom.finished_good.item._id,
        label: data.production_process.bom.finished_good.item.name,
      });
      setFinishedGoodDescription(
        data.production_process.bom.finished_good?.description
      );
      setFinishedGoodQuantity(
        data.production_process.bom.finished_good.quantity
      );
      setFinishedGoodUom(data.production_process.bom.finished_good.item.uom);
      setFinishedGoodUnitCost(
        data.production_process.bom.finished_good.item.price
      );
      setFinishedGoodCost(data.production_process.bom.finished_good.cost);
      setFinishedGoodCategory(
        data.production_process.bom.finished_good.item.category
      );
      setFinishedGoodComments(
        data.production_process.bom.finished_good.comments
      );
      setFinishedGoodProducedQuantity(
        data.production_process.finished_good.produced_quantity
      );

     if (data.production_process.status === "raw materials approved") {
        setSubmitBtnText("Start Production");
        setProcessStatus("work in progress");
      } else if (data.production_process.status === "work in progress") {
        setSubmitBtnText("Update");
        setProcessStatus("work in progress");
      } else if(data.production_process.status === "completed"){
        setIsCompleted(true);
      } else if(data.production_process.status === "raw material approval pending"){
        setRawMaterialApprovalPending(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all",
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
      setProducts(data.products);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProcessDetailsHandler(id || "");
  }, [id]);

  useEffect(() => {
    const options = products.map((prod) => ({
      value: prod._id,
      label: prod.name,
    }));
    setProductOptions(options);
  }, [products]);

  useEffect(() => {
    fetchProductsHandler();
  }, []);

  useEffect(() => {
    if (
      selectedProducts[selectedProducts.length - 1].unit_cost !== "" &&
      selectedProducts[selectedProducts.length - 1].quantity !== ""
    ) {
      const cost = selectedProducts.reduce(
        (prev, current) => prev + +current.unit_cost * +current.quantity,
        0
      );
      setTotalCost(cost);
    }
  }, [selectedProducts]);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[90vw] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Production Process
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            Update Production Process
          </h2>

          <form onSubmit={updateProcessHandler}>
            <div className="grid grid-cols-3 gap-2">
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">BOM Name</FormLabel>
                <Input
                  isDisabled
                  value={bomName}
                  onChange={(e) => setBomName(e.target.value)}
                  type="text"
                  placeholder="BOM Name"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Total Cost</FormLabel>
                <Input
                  isDisabled
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  type="number"
                  placeholder="Total Cost"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Created By</FormLabel>
                <Input
                  isDisabled
                  value={createdBy}
                  className="no-scrollbar"
                  onChange={(e) => setCreatedBy(e.target.value)}
                  type="text"
                  placeholder="Created By"
                />
              </FormControl>
            </div>
            <div>
              <RawMaterial
                inputs={selectedProducts}
                setInputs={setSelectedProducts}
                products={products}
                productOptions={productOptions}
              />
            </div>
            <div>
              <Process inputs={processes} setInputs={setProcesses} />
            </div>
            <div className="mt-4">
              <FormLabel fontWeight="bold">Finished Good</FormLabel>
              <div className="grid grid-cols-4 gap-2">
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Finished Good</FormLabel>
                  <Select
                    isDisabled
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
                    isDisabled
                    border="1px"
                    borderColor="#a9a9a9"
                    value={finishedGoodDescription}
                    onChange={(e) => setFinishedGoodDescription(e.target.value)}
                    type="text"
                    placeholder="Description"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Estimated Quantity</FormLabel>
                  <Input
                    disabled
                    border="1px"
                    borderColor="#a9a9a9"
                    value={finishedGoodQuantity}
                    onChange={(e) =>
                      onFinishedGoodQntyChangeHandler(+e.target.value)
                    }
                    type="number"
                    placeholder="Quantity"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Produced Quantity</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={finishedGoodProducedQuantity}
                    onChange={(e) =>
                      setFinishedGoodProducedQuantity(+e.target.value)
                    }
                    type="number"
                    placeholder="Produced Quantity"
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
                    value={finishedGoodUom}
                    type="text"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Category</FormLabel>
                  <Input
                    isDisabled={true}
                    border="1px"
                    borderColor="#a9a9a9"
                    value={finishedGoodCategory}
                    type="text"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5">
                  <FormLabel fontWeight="bold">Supporting Doc</FormLabel>
                  <input
                    disabled
                    type="file"
                    placeholder="Choose a file"
                    accept=".pdf"
                    className="p-1 border border-[#a9a9a9] w-[267px] rounded"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5">
                  <FormLabel fontWeight="bold">Comments</FormLabel>
                  <Input
                    isDisabled
                    border="1px"
                    borderColor="#a9a9a9"
                    value={finishedGoodComments}
                    onChange={(e) => setFinishedGoodComments(e.target.value)}
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
                    value={finishedGoodUnitCost}
                    type="number"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Cost</FormLabel>
                  <Input
                    isDisabled={true}
                    border="1px"
                    borderColor="#a9a9a9"
                    value={finishedGoodCost}
                    type="number"
                    placeholder="Cost"
                  />
                </FormControl>
              </div>
            </div>
            <div>
              <ProcessScrapMaterial
                products={products}
                productOptions={productOptions}
                inputs={scrapMaterials}
                setInputs={setScrapMaterials}
              />
            </div>
            <div>
              <Button
                disabled={isCompleted || rawMaterialApprovalPending}
                marginRight={2}
                isLoading={isUpdating}
                type="submit"
                className="mt-1"
                color="white"
                backgroundColor="#1640d6"
              >
                {submitBtnText}
              </Button>
              {submitBtnText === "Update" && (
                <Button
                  disabled={isCompleted || rawMaterialApprovalPending}
                  isLoading={isUpdating}
                  type="button"
                  className="mt-1"
                  color="white"
                  backgroundColor="#1640d6"
                  onClick={markProcessDoneHandler}
                >
                  Mark as Done
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default UpdateProcess;
