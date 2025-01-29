import { useSelector } from "react-redux";
import logo from "../../assets/images/logo/logo.png";
import { Avatar } from "@chakra-ui/react";
import { IoIosNotifications } from "react-icons/io";
import { useState } from "react";
import ClickMenu from "../../ui/ClickMenu";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import UserDetailsMenu from "../../ui/UserDetailsMenu";
import { IoReorderThreeOutline } from "react-icons/io5";

const Header: React.FC<{setShowSideBar:()=>void}> = ({setShowSideBar}) => {
  const navigate = useNavigate();
  const [cookie, _, removeCookie] = useCookies();
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const { firstname, lastname, email } = useSelector(
    (state: any) => state.auth
  );

  const logoutHandler = () => {
    try {
      removeCookie("access_token");
      removeCookie("role");
      removeCookie("name");
      removeCookie("email");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="relative flex justify-between items-center py-2 px-3">

      <div className="flex items-center justify-center gap-2">
        <span onClick={setShowSideBar} className="flex rounded-full px-1 hover:bg-gray-200 cursor-pointer md:hidden">
          <IoReorderThreeOutline className="h-10 w-8" />
        </span>
        <img src={logo} className="w-36 h-24"></img>

      </div>

      <div className="flex gap-x-5 items-center">
        <IoIosNotifications size={40} />

        <Avatar
          cursor="pointer"
          size="md"
          name={firstname ? firstname + " " + lastname : ""}
          onClick={() => setShowUserDetails((prev) => !prev)}
        ></Avatar>
        {showUserDetails && (
          <ClickMenu
            top={70}
            right={30}
            closeContextMenuHandler={() => setShowUserDetails(false)}
          >
            <UserDetailsMenu
              email={email}
              firstname={firstname}
              lastname={lastname}
              logoutHandler={logoutHandler}
              closeUserDetailsMenu={() => setShowUserDetails(false)}
            />
          </ClickMenu>
        )}
      </div>
    </div>
  );
};

export default Header;
