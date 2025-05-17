import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Title from "./Title";
import {
  addCoverLetter,
  deleteCoverLetter,
  updateCoverLetter,
} from "../features/coverLetter/coverLetterSlice";
import { FaSave, FaTimes } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import TextareaField from "./ui/TextareaField";
import Input from "./ui/Input";
import Dropdown from "./ui/Dropdown";
import Button from "./ui/Button";

const AddCoverLetter = ({ setView }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.savedCategories);
  const coverLetters = useSelector((state) => state.coverLetter.coverLetters);

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCategoryId, setEditedCategoryId] = useState("");

  const handleAdd = () => {
    if (!categoryId || !title.trim() || !description.trim()) return;

    dispatch(addCoverLetter({ title, description, categoryId }));
    setCategoryId("");
    setTitle("");
    setDescription("");
  };

  const handleUpdate = () => {
    if (!editedCategoryId || !editedTitle.trim() || !editedDescription.trim()) return;

    dispatch(
      updateCoverLetter({
        id: editId,
        title: editedTitle,
        description: editedDescription,
        categoryId: editedCategoryId,
      })
    );

    setEditId(null);
    setEditedTitle("");
    setEditedDescription("");
    setEditedCategoryId("");
  };

  return (
    <div>
      <Title setView={setView} title="Add Cover Letter" />

       {/* Add New */}
       <div className="space-y-3 mb-5"> 
        <Dropdown
          options={categories}
          selectedId={categoryId}
          setSelectedId={setCategoryId}
          placeholder="Select Category"
        />

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Cover Letter Title"
        />

        <TextareaField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Cover Letter Description"
          rows={4}
        />

        <Button onClick={handleAdd}>
          <AiOutlinePlus />
           Add Cover Letter
        </Button>
      </div>
        {/* Add New Ended */}

      <div className="mb-6 space-y-3">
        {coverLetters?.map((letter) => (
          <div
            key={letter.id}
            className="p-4 border border-gray-300 bg-white rounded relative shadow-sm"
          >
            {editId === letter.id ? (
              <div className="space-y-2 mt-5">
                <Dropdown
                  options={categories}
                  selectedId={editedCategoryId}
                  setSelectedId={setEditedCategoryId}
                  placeholder="Select Category"
                />
                <Input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Edit title"
                />
                <TextareaField
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={3}
                  placeholder="Edit description"
                />
              </div>
            ) : (
              <div className="mt-5">
                <p className="text-sm font-semibold">
                  {letter?.title} (
                  {
                    categories?.find((cat) => {
                      // console.log('cat.id===>', cat.id, 'letter==>', letter, 'letter.categoryId==>', letter.categoryId, '');
                      return String(cat.id) === String(letter.categoryId);
                    })?.title || "Unknown Category"
                  })
                </p>
                <p className="text-sm mt-1 text-gray-700 max-h-30 overflow-auto">
                  {letter?.description}
                </p>
              </div>
            )}

            <div className="absolute top-2 right-2 flex gap-2">
              {editId === letter.id ? (
                <>
                  <button onClick={handleUpdate} title="Save">
                    <FaSave className="text-sm text-green-600 hover:text-green-700" />
                  </button>
                  <button onClick={() => setEditId(null)} title="Cancel">
                    <FaTimes className="text-sm text-gray-500 hover:text-gray-600" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditId(letter.id);
                      setEditedTitle(letter.title);
                      setEditedDescription(letter.description);
                      setEditedCategoryId(letter.categoryId);
                    }}
                  >
                    <img
                      src="icons/edit.png"
                      alt="Edit"
                      className="w-[20px] h-[20px]"
                    />
                  </button>
                  <button
                    onClick={() => dispatch(deleteCoverLetter(letter.id))}
                  >
                    <img
                      src="icons/Delete.png"
                      alt="Delete"
                      className="w-[20px] h-[20px]"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default AddCoverLetter;
