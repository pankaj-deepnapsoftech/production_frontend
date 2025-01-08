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

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [cookie, _, removeCookie] = useCookies();
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const { firstname, lastname, email } = useSelector(
    (state: any) => state.auth
  );

  const logoutHandler = () => {
    try {
      removeCookie("access_token");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="relative flex justify-between items-center py-2 px-3">
      <img src={logo} className="w-[150px]"></img>

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
