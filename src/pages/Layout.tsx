import { useCookies } from "react-cookie";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userExists } from "../redux/reducers/authSlice";
import Navigation from "../components/Navigation/Navigation";
import Container from "../components/Container/Container";

const Layout: React.FC = () => {
  const [cookies, setCookie] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSideBar,setShowSideBar] = useState<boolean>(false)

  const loginWithTokenHandler = async (token: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "auth/login",
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
      setCookie("access_token", data.token, { maxAge: 86400 });
      dispatch(userExists(data.user));
    } catch (err: any) {
      navigate('/login');
      toast.error(err?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!cookies?.access_token) {
      navigate("/home");
    } else {
      loginWithTokenHandler(cookies?.access_token);
    }
  }, []);

  return (
    <div>
      <Header setShowSideBar={()=>setShowSideBar(!showSideBar)} />

      <div className="h-[90vh] overflow-hidden flex gap-x-5">
        <div
          className={`h-[inherit] border overflow-x-hidden absolute  ${showSideBar ? "left-0" :"-left-72" }  md:static z-10  w-[260px] bg-white transition-all duration-500 `}
          style={{ boxShadow: "0 0 20px 3px #96beee26" }}
        >
          <Navigation setShowSideBar={()=>setShowSideBar(!showSideBar)} />
        </div>
        <div className="flex-1 pr-5 w-[80%] overflow-auto">
          <Container>
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Layout;
