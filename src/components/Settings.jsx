//Settings.jsx
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Title from "./Title";
import { inputFields } from "../constants";
import TooltipWithCopy from "./TooltipWithCopy";
import { useDispatch, useSelector } from "react-redux";
import { setValues } from "../features/settings/settingsSlice";
import { IoCopyOutline } from "react-icons/io5";
import Button from "./ui/Button";
import { AiOutlinePlus } from "react-icons/ai";
import Input from "./ui/Input";
// import { addCategory } from "../features/category/categorySlice";

const Settings = ({ setView }) => {
  const dispatch = useDispatch();
  // const [category, setCategory] = useState("");
  // const [titleError, setTitleError] = useState("");

  const { upwork } = useSelector((state) => state?.settings);
  console.log("upwork==>", upwork);

  const [formData, setFormData] = useState({
    coverLetter: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...upwork,
    }));
  }, [upwork]);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Handle copy to clipboard for any input field
  const handleCopy = (value, label) => {
    if (!value.trim()) {
      // alert(`${label} field is empty!`);
      return;
    }

    navigator.clipboard
      .writeText(value)
      .then(() => {
        // alert(`${label} copied to clipboard!`);
      })
      .catch((err) => {
        console.error(`Failed to copy ${label}: `, err);
      });
  };

  const handleSave = (value, id) => {
    console.log("handleSave value=>", value, id);
    const combinedValue = {
      value: value,
      id: id,
    };
    console.log("combinedValue=>", combinedValue);
    dispatch(setValues(combinedValue));
  };

  // const validateCategory = () => {
  //   if (!category.trim()) {
  //     setTitleError("Category is required.");
  //     return false;
  //   }
  //   return true;
  // };

  // const handleDefaultSettings = () => {
  //   console.log("In handleDefaultSettings");
  //   if (validateCategory()) {
  //     dispatch(addCategory(category));
  //     setCategory("");
  //     setTitleError("");
  //   }
  // };

  return (
    <div>
      <Title setView={setView} title="Settings" />

      {/* Selector */}
      <div className="flex flex-col items-center gap-4 w-full mb-5">
        {/* ////map */}
        {inputFields?.map(({ id, label, info }) => (
          <div key={id} className="flex flex-col gap-2 w-full">
            <label
              htmlFor={id}
              className="text-left text-base font-medium flex gap-2 items-center"
            >
              {label}
              {info && <TooltipWithCopy text={info} />}
            </label>
            <div className="flex items-center gap-2">
              {/* Input Field */}
              <input
                id={id}
                type="text"
                name={id}
                value={formData[id]}
                // onChange={(e) => setStateValue(e.target.value)}
                onChange={(e) => handleChange(id, e.target.value)}
                placeholder={`Enter ${label}...`}
                className="flex-1 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Copy Button */}
              <button
                // onClick={() => handleCopy(value, label)}

                onClick={() => handleCopy(formData[id], label)}
                className=" p-2 border border-teal-600 rounded-md text-teal-600 hover:bg-teal-50"
                title="Copy"
              >
                <IoCopyOutline size={20} />
              </button>

              {/* Save Button */}
              <button
                // onClick={() => handleSave(value, id)}
                onClick={() => handleSave(formData[id], id)}
                className="bg-teal-600 hover:bg-teal-700 text-white text-base font-medium px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        ))}
        {/* ////map */}
      </div>
      {/* Selector */}

      {/* Default Setting */}
      {/* <div>
        <h1 className="text-xl font-bold text-center mb-4">
          Category Settings
        </h1>
        <div>
          <Input
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (e.target.value.trim()) setTitleError("");
            }}
            placeholder="Write category title"
            error={titleError}
          />

          <div className="space-y-3">
            <Button onClick={handleDefaultSettings}>
              <AiOutlinePlus />
              Add Default Settings
            </Button>
          </div>
        </div>
      </div> */}
      {/* Default Setting End */}
    </div>
  );
};

export default Settings;
