import React, { useState, useRef } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";

const TooltipWithCopy = ({ text }) => {
  const [show, setShow] = useState(false);
  const hideTimeout = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout.current);
    setShow(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShow(false);
    }, 200); // delay to allow moving into tooltip
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    // alert("Copied to clipboard!");
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BsInfoCircleFill className="text-gray-400 cursor-pointer" />
      {show && (
        <div className="absolute z-10 left-6 top-0 bg-white border border-gray-300 shadow-md rounded-md p-3 w-60 text-sm">
          <p className="text-gray-700 break-words">{text}</p>
          <button
            onClick={handleCopy}
            className="mt-2 flex items-center gap-2 text-teal-600 hover:text-teal-800 text-sm"
          >
            <IoCopyOutline size={16} />
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default TooltipWithCopy;
