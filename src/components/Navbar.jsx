import React from "react";
import { COMPANY_NAME } from "../constants/info";



const Navbar = ({ setView }) => {
  return (
    <nav className="flex justify-between mb-2 border-b border-gray-100 pb-2">
      <div
        className="text-xl text-gray-800 font-bold cursor-pointer"
        onClick={() => setView("main")}
      >
        {COMPANY_NAME}
      </div>

      <div className="flex gap-2.5 items-center">
        <div className="bg-yellow-400  rounded-[12px] px-3 py-1 inline-block "><span className="text-[15px]">Free</span></div>
         <img
          src="icons/settings.png"
          alt="Settings"
          className="icon w-[20px] h-[20px] cursor-pointer"
          onClick={() => setView("settings")}
        />
         <img
          src="icons/category.png"
          alt="Category"
          className="icon w-[20px] h-[20px] cursor-pointer"
          onClick={() => setView("category")}
        />
       
        <img
          src="icons/letter.png"
          alt="Letter"
          className="icon w-[20px] h-[20px] cursor-pointer"
          onClick={() => setView("letter")}
        />  
      </div>
    </nav>
  );
};

export default Navbar;
