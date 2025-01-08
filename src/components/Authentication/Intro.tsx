import logo from '../../assets/images/logo/logo.png';
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

const Intro: React.FC = () => {
  return (
    <div className="hidden xl:flex bg-[#e3e3e3] h-[100vh] w-[50%] flex-col justify-center items-center">
      <div className="mb-5">
        <Link to="/">
          <img className="w-[200px]" src={logo}></img>
        </Link>
      </div>
      <div>
        <h1 className="mb-5 text-2xl font-bold text-[#4f5d75]">
          Manage Your Company With:
        </h1>

        <div className="text-sm text-[#4f5d75] font-bold">
          <div className="mb-4 leading-7">
            <p className="flex items-center gap-x-2">
              <FaCheck />
              Run In One Tool
            </p>
            <p className="ml-6">Run And Scale Your Erp Crm Apps</p>
          </div>
          <div className="leading-7">
            <p className="flex items-center gap-x-2">
              <FaCheck />
              Easily Add And Manage Your Services
            </p>
            <p className="ml-6">
              It Brings Together Your Invoice Clients And Leads
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
