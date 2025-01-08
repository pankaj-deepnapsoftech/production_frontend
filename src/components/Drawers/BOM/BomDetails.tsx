import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import Loading from "../../../ui/Loading";

interface BomDetailsProps {
  bomId: string | undefined;
  closeDrawerHandler: () => void;
}

const BomDetails: React.FC<BomDetailsProps> = ({
  bomId,
  closeDrawerHandler,
}) => {
  const [cookies] = useCookies();
  const [isLoadingBom, setIsLoadingBom] = useState<boolean>(false);
  const [rawMaterials, setRawMaterials] = useState<any[] | []>([]);
  const [scrapMaterials, setScrapMaterials] = useState<any[] | []>([]);
  const [finishedGood, setFinishedGood] = useState<any | undefined>();
  const [processes, setProcesses] = useState<any | undefined>();
  const [bomName, setBomName] = useState<string | undefined>();
  const [partsCount, setPartsCount] = useState<number | undefined>();
  const [totalBomCost, setTotalBomCost] = useState<number | undefined>();
  const [otherCharges, setOtherCharges] = useState<any>();

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
      setFinishedGood(data.bom.finished_good);
      setRawMaterials(data.bom.raw_materials);
      setBomName(data.bom.bom_name);
      setTotalBomCost(data.bom.total_cost);
      setPartsCount(data.bom.parts_count);
      setProcesses(data.bom.processes);
      setScrapMaterials(data.bom?.scrap_materials);
      setOtherCharges(data.bom?.other_charges);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBom(false);
    }
  };

  useEffect(() => {
    fetchBomDetails();
  }, []);
  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
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
            BOM Details
          </h2>

          {isLoadingBom && <Loading />}
          {!isLoadingBom && (
            <div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">BOM Name</p>
                <p>{bomName}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Parts Count</p>
                <p>{partsCount}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Total Cost</p>
                <p>₹ {totalBomCost}/-</p>
              </div>
              <div>
                <p className="font-semibold">Raw Materials</p>
                {rawMaterials && (
                  <ul className="mt-3 mb-5 pl-5 list-decimal">
                    {rawMaterials.map((material) => (
                      <li>
                        <p>
                          <span className="font-semibold">Item ID</span>:{" "}
                          {material?.item?.product_id}
                        </p>
                        <p>
                          <span className="font-semibold">Item Name</span>:{" "}
                          {material?.item?.name}
                        </p>
                        <p>
                          <span className="font-semibold">Quantity</span>:{" "}
                          {material?.quantity}
                        </p>
                        <p>
                          <span className="font-semibold">UOM</span>:{" "}
                          {material?.item?.uom}
                        </p>
                        <p>
                          <span className="font-semibold">Total Part Cost</span>
                          : ₹ {material?.total_part_cost}/-
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p className="font-semibold">Processes</p>
                {processes && (
                  <ul className="mt-3 mb-5 pl-5 list-decimal">
                    {processes.map((process: string) => (
                      <li>{process}</li>
                    ))}
                  </ul>
                )}
              </div>

              {finishedGood && (
                <div className="mt-3 mb-5">
                  <p className="font-semibold">Finished Good</p>
                  <ul className="pl-5">
                    <li>
                      <span className="font-semibold">Item Id</span>:{" "}
                      {finishedGood?.item?.product_id}
                    </li>
                    <li>
                      <span className="font-semibold">Item Name</span>:{" "}
                      {finishedGood?.item?.name}
                    </li>
                    <li>
                      <span className="font-semibold">Quantity</span>:{" "}
                      {finishedGood.quantity}
                    </li>
                    <li>
                      <span className="font-semibold">UOM</span>:{" "}
                      {finishedGood?.item?.uom}
                    </li>
                    <li>
                      <span className="font-semibold">Category</span>:{" "}
                      {finishedGood?.item?.category}
                    </li>
                    <li>
                      <span className="font-semibold">Category</span>:{" "}
                      {finishedGood.category}
                    </li>
                    <li>
                      <span className="font-semibold">Cost</span>: ₹{" "}
                      {finishedGood.cost}/-
                    </li>
                    <li>
                      <span className="font-semibold">Supporting Document</span>
                      :{" "}
                      {finishedGood.supporting_doc ? (
                        <a href={finishedGood.supporting_doc} target="_blank">
                          <button className="underline">Open</button>
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </li>
                  </ul>
                </div>
              )}

              {scrapMaterials && (
                <div>
                  <p className="font-semibold">Scrap Materials</p>

                  <ul className="mt-3 mb-5 pl-5 list-decimal">
                    {scrapMaterials.map((material) => (
                      <li>
                        <p>
                          <span className="font-semibold">Item ID</span>:{" "}
                          {material?.item?.product_id}
                        </p>
                        <p>
                          <span className="font-semibold">Item Name</span>:{" "}
                          {material?.item?.name}
                        </p>
                        <p>
                          <span className="font-semibold">Quantity</span>:{" "}
                          {material?.quantity}
                        </p>
                        <p>
                          <span className="font-semibold">UOM</span>:{" "}
                          {material?.item?.uom}
                        </p>
                        <p>
                          <span className="font-semibold">Total Part Cost</span>
                          : ₹ {material?.total_part_cost}/-
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {otherCharges && (
                <div>
                  <p className="font-semibold">Other Charges</p>

                  <p>
                    <span className="font-semibold">Labour Charges</span>: ₹{" "}
                    {otherCharges?.labour_charges}/-
                  </p>
                  <p>
                    <span className="font-semibold">Machinery Charges</span>: ₹{" "}
                    {otherCharges?.machinery_charges}/-
                  </p>
                  <p>
                    <span className="font-semibold">Electricity Charges</span>: ₹{" "}
                    {otherCharges?.electricity_charges}/-
                  </p>
                  <p>
                    <span className="font-semibold">Other Charges</span>: ₹{" "}
                    {otherCharges?.other_charges}/-
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default BomDetails;
