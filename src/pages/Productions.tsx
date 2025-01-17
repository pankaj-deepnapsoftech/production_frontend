import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const Production = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [purchases, setPurchases] = useState<[]>([]);
  const [pages, setPages] = useState(1);
  const [cookies] = useCookies(["access_token"]);

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const token = cookies.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}purchase/getAll?page=${pages}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("sales", response.data.data);
      setPurchases(response.data.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch purchase data";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect (()=>{
    fetchPurchases();
  }, []);

  return (
  <div>TrackProduction</div>
);
};

export default Production;
