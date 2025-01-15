import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import routes from "../../routes/routes";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Fragment, useState } from "react";

const Navigation: React.FC<{setShowSideBar:()=>void}> = ({setShowSideBar}) => {
  const { allowedroutes, isSuper } = useSelector((state: any) => state.auth);
  console.log(allowedroutes)

  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSubMenusHandler = (path: string) => {
    setOpenSubMenus((prev: { [key: string]: boolean }) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <div className="h-[inherit] px-3 py-3  bg-[#fbfbfb]">
      <ul>
        {routes.map((route, ind) => {
          const isAllowed =
            isSuper || allowedroutes.includes(route.path.replaceAll("/", ""));

          if (route.isSublink) {
            return (
              <Fragment key={ind} >
              <div  >
                <li
                  className="flex border-b  gap-x-2 pl-3 pr-9 py-5 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold"
                  onClick={() => toggleSubMenusHandler(route.path)}
                  style={{
                    cursor: isAllowed  ? "pointer" : "not-allowed",
                    opacity: isAllowed ? 1 : 0.5,
                    pointerEvents: isAllowed ? "auto" : "none", // Disable click interaction
                  }}
                >
                  <span>{route.icon}</span>
                  <span>{route.name}</span>
                  <span className="pt-1">
                    {openSubMenus[route.path] ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                </li>
                {openSubMenus[route.path] &&
                  route.sublink &&
                  route.sublink.map((sublink, index) => (
                    <NavLink
                    onClick={setShowSideBar}
                    key={index}
                      style={{
                        cursor: isAllowed ? "pointer" : "not-allowed",
                        opacity: isAllowed ? 1 : 0.5,
                        pointerEvents: isAllowed ? "auto" : "none", // Disable click interaction
                      }}
                      to={route.path + "/" + sublink.path}
                    >
                      <li
                        
                        className="flex gap-x-2 pl-5 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold"
                      >
                        <span>{sublink.icon}</span>
                        <span className="">{sublink.name}</span>
                      </li>
                    </NavLink>
                  ))}
              </div>
              </Fragment>
            );
          }
          else if(route.name === "Approval" && isSuper){
            return (
              <NavLink  key={ind} 
              style={{
                cursor: isAllowed  ? "pointer" : "not-allowed",
                opacity: isAllowed ? 1 : 0.5,
                pointerEvents: isAllowed ? "auto" : "none",
              }} 
              onClick={setShowSideBar}
              to={route.path || ""}>
                <li
                 
                  className="flex border-b gap-x-2 pl-3 pr-9 py-5 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold"
                >
                  <span >{route.icon}</span>
                  <span >{route.name}</span>
                </li>
              </NavLink>
            );
          }
          else if(route.name !== "Approval") {
            return (
              <NavLink key={ind} 
              onClick={setShowSideBar}
              style={{
                cursor: ind === 0 || isAllowed ? "pointer" : "not-allowed",
                opacity: ind === 0 || isAllowed ? 1 : 0.5,
                pointerEvents: ind === 0 || isAllowed ? "auto" : "none", // Disable click interaction
              }} 
              to={route.path || ""}>
                <li
                  
                  className="flex border-b gap-x-2 pl-3 pr-9 py-5 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold"
                >
                  <span className="text-xl">{route.icon}</span>
                  <span className="tezt-xl">{route.name}</span>
                </li>
              </NavLink>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Navigation;