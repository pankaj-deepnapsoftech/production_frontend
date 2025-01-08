import React from "react";
import { IoIosArrowForward} from "react-icons/io";
import { NavLink } from "react-router-dom";

interface CardProps {
  title: string;
  content: string | number;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  link?: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  primaryColor,
  link
}) => {
  return (
    <NavLink to={{pathname : link}}
      style={{ boxShadow: "0 0 20px 3px #96beee26" }}
      className="bg-white rounded-md my-5 text-center w-full px-2 py-7  transition-all hover:scale-105"
    >
      <h1 className="text-xl border-b border-gray-300 flex items-center justify-around pb-4 font-bold text-[#22075e]">
        {title} <IoIosArrowForward />
      </h1>
      <div className=" flex items-center justify-center gap-1 mt-4 font-bold text-[#595959]">
      <p>All Time</p>
        <span style={{backgroundColor: primaryColor}} className="text-[#ffffff] rounded px-3 ml-1 py-1">
          {content}
        </span>
      </div>
    </NavLink>
  );
};

export default Card;