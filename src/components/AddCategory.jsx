import React, { useState } from "react";
import Title from "./Title";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { FaSave, FaTimes } from "react-icons/fa";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../features/category/categorySlice";
import Input from "./ui/Input";
import Button from "./ui/Button";


const AddCategory = ({ setView }) => {
  const dispatch = useDispatch();
  const savedCategories = useSelector((state) => state.category.savedCategories);
  const [category, setCategory] = useState("");
  const [titleError, setTitleError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editTitleError, setEditTitleError] = useState("");

  const validateCategory = () => {
    if (!category.trim()) {
      setTitleError("Category is required.");
      return false;
    }
    return true;
  };

  const validateEditNote = () => {
    if (!editedTitle.trim()) {
      setEditTitleError("Category cannot be empty.");
      return false;
    }
    return true;
  };

  const handleAddCategory = () => {
    if (validateCategory()) {
      dispatch(addCategory(category));
      setCategory("");
      setTitleError("");
    }
  };

  const handleUpdate = () => {
    if (validateEditNote()) {
      dispatch(updateCategory({ id: editId, title: editedTitle }));
      setEditId(null);
      setEditedTitle("");
      setEditTitleError("");
    }
  };

  return (
    <div>
      <Title setView={setView} title="Add Category" />

      {/* Categories List */}
      {savedCategories.length > 0 ? (
        <div className="space-y-3 mb-6">
          {savedCategories?.map((note) => (
            <div
              key={note.id}
              className="p-3 border relative border-gray-300 rounded bg-white flex justify-between items-start shadow-sm"
            >
              {editId === note.id ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => {
                    setEditedTitle(e.target.value);
                    if (e.target.value.trim()) setEditTitleError("");
                  }}
                  placeholder="Edit title"
                  error={editTitleError}
                  className="flex-1 pr-2 mt-5"
                />
              ) : (
                <div className="flex-1 pr-2">
                  <p className="font-medium text-sm">{note.title}</p>
                </div>
              )}

              <div className="flex gap-2 absolute right-3">
                {editId === note.id ? (
                  <>
                    <button onClick={handleUpdate} title="Save">
                      <FaSave className="text-green-600 hover:text-green-700 text-base" />
                    </button>
                    <button onClick={() => setEditId(null)} title="Cancel">
                      <FaTimes className="text-gray-500 hover:text-gray-600 text-base" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(note.id);
                        setEditedTitle(note.title);
                        setEditTitleError("");
                      }}
                      title="Edit"
                    >
                      <img
                        src="icons/edit.png"
                        alt="Edit"
                        className="icon w-[20px] h-[20px] cursor-pointer"
                      />
                    </button>
                    <button
                      onClick={() => dispatch(deleteCategory(note.id))}
                      title="Delete"
                    >
                      <img
                        src="icons/Delete.png"
                        alt="Delete"
                        className="icon w-[20px] h-[20px] cursor-pointer"
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mb-6">
          <p className="font-medium">No Category added yet.</p>
        </div>
      )}

      {/* Add New Category Input */}
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
        <Button onClick={handleAddCategory}>
          <AiOutlinePlus />
          Add Category
        </Button>
      </div>
    </div>
  );
};

export default AddCategory;
