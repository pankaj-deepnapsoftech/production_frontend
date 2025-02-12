import { useSelector } from "react-redux";
import logo from "../../assets/images/logo/logo.png";
import {
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Badge,
  Checkbox,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ClickMenu from "../../ui/ClickMenu";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import UserDetailsMenu from "../../ui/UserDetailsMenu";
import { IoReorderThreeOutline, IoNotificationsOutline } from "react-icons/io5";
import axios from "axios";
import { AiOutlineBell } from "react-icons/ai";

const Header: React.FC<{ setShowSideBar: () => void }> = ({
  setShowSideBar,
}) => {
  const navigate = useNavigate();
  const [cookie, _, removeCookie] = useCookies();
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any>();
  const [markedAsRead, setMarkedAsRead] = useState(false);

  const { firstname, lastname, email } = useSelector(
    (state: any) => state.auth
  );

  const token = cookie?.access_token;
  // notification api
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}notification/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotification();
  }, []);

  const unreadCount = notifications?.filter((notif: any) => notif.view === false).length || 0;


  const handleCheckboxChange = async (id: any) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}notification/update/${id}`,
        { view: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

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
        <span
          onClick={setShowSideBar}
          className="flex rounded-full px-1 hover:bg-gray-200 cursor-pointer md:hidden"
        >
          <IoReorderThreeOutline className="h-10 w-8" />
        </span>
        <img src={logo} className="w-36 h-24" alt="Logo" />
      </div>

      <div className="flex gap-x-5 items-center">
        {/* Notification Icon with Badge */}
        <div
          className="relative cursor-pointer"
          onClick={() => setIsNotificationOpen(true)}
        >
          <IoNotificationsOutline className="text-2xl" />
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              position="absolute"
              top="-5px"
              right="-5px"
              fontSize="0.7rem"
              borderRadius="full"
              px={2}
            >
              {unreadCount}
            </Badge>
          )}
        </div>

        <Avatar
          cursor="pointer"
          size="md"
          name={firstname && lastname ? firstname + " " + lastname : firstname}
          onClick={() => setShowUserDetails((prev) => !prev)}
        />

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

      {/* Notification Modal */}
      <Modal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        size="lg"
        closeOnOverlayClick={false} // Prevent closing on overlay click for better control
        motionPreset="scale" // Smooth animation effect
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="xl" // Rounded corners
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.15)" // Soft shadow
          bg="white"
        >
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            display="flex"
            alignItems="center"
          >
            <AiOutlineBell size={24} className="mr-2" /> {/* Bell icon */}
            Notifications
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {unreadCount === 0 ? (
              <div className="flex justify-center items-center py-6">
                <p className="text-gray-500 text-lg">No new notifications.</p>
              </div>
            ) : (
              notifications.map((notif: any) => (
                <div
                  key={notif?._id}
                  className="flex items-center border-b py-4"
                >
                  <Checkbox
                  isChecked={notif?.view}
                    onChange={() => handleCheckboxChange(notif?._id)}
                    colorScheme="teal"
                    size="lg"
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(notif?.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p
                      className={`text-md ${
                        notif?.view
                          ? "text-gray-400 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {notif?.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Header;
