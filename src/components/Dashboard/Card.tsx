import React from "react";

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
  primaryColor
}) => {
  return (
    <div
      style={{ boxShadow: "0 0 20px 3px #96beee26" }}
      className="bg-white rounded-md text-center py-7"
    >
      <h1 className="text-xl border-b border-b-[#a9a9a9] pb-4 font-bold text-[#22075e]">
        {title}
      </h1>
      <div className="mt-4 font-bold text-[#595959]">
        <span style={{backgroundColor: primaryColor}} className="text-[#ffffff] rounded px-2 ml-1 py-1">
          {content}
        </span>
      </div>
    </div>
  );
};

export default Card;
