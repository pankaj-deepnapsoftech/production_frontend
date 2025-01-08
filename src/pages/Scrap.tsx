import {
  Button
} from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ScrapTable from "../components/Table/ScrapTable";
import { toast } from "react-toastify";

const Scrap: React.FC = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingScraps, setIsLoadingScraps] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string | undefined>();

  const fetchScrapHandler = async ()=>{
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'scrap/all', {
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      setData(data.scraps);
      setFilteredData(data.scraps);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  }

  useEffect(()=>{
    fetchScrapHandler();
  }, [])

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter(
      (scrap: any) =>
        scrap.bom.bom_name?.toLowerCase()?.includes(searchTxt) ||
        scrap.item.name?.toLowerCase()?.includes(searchTxt) ||
        scrap.produced_quantity.toString().toLowerCase().includes(searchTxt) ||
        scrap.estimated_quantity.toString().toLowerCase().includes(searchTxt) ||
        (scrap?.createdAt &&
          new Date(scrap?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (scrap?.updatedAt &&
          new Date(scrap?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  return (
    <div>
      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-2">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Scrap Management
        </div>

        <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
          <textarea
            className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#1640d6] hover:outline:[#1640d6] border resize-none border-[#bbbbbb] bg-[#f9f9f9]"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchScrapHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#1640d6"
            borderColor="#1640d6"
            variant="outline"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div>
        <ScrapTable scraps={filteredData} isLoadingScraps={isLoadingScraps} openScrapDetailsDrawerHandler={()=>{}} />
      </div>
    </div>
  );
};

export default Scrap;
