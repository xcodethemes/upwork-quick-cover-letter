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

      <div className="mb-6 space-y-3">
        {coverLetters.map((letter) => (
          <div
            key={letter.id}
            className="p-4 border border-gray-300 bg-white rounded relative shadow-sm"
          >
            {editId === letter.id ? (
              <div className="space-y-2">
                <select
                  value={editedCategoryId}
                  onChange={(e) => setEditedCategoryId(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Edit title"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  rows={3}
                  placeholder="Edit description"
                />
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold">
                  {letter.title} ({categories.find((cat) => cat.id === letter.categoryId)?.title || "Unknown Category"})
                </p>
                <p className="text-sm mt-1 text-gray-700">{letter.description}</p>
              </div>
            )}

            <div className="absolute top-2 right-2 flex gap-2">
              {editId === letter.id ? (
                <>
                  <button onClick={handleUpdate} title="Save">
                    <FaSave className="text-green-600 hover:text-green-700" />
                  </button>
                  <button onClick={() => setEditId(null)} title="Cancel">
                    <FaTimes className="text-gray-500 hover:text-gray-600" />
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
                    <img src="icons/edit.png" alt="Edit" className="w-[20px] h-[20px]" />
                  </button>
                  <button onClick={() => dispatch(deleteCoverLetter(letter.id))}>
                    <img src="icons/Delete.png" alt="Delete" className="w-[20px] h-[20px]" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New */}
      <div className="space-y-3">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Cover Letter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        />
        <textarea
          placeholder="Cover Letter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded text-sm"
          rows={4}
        />
        <button
          onClick={handleAdd}
          className="w-full text-base bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2 font-semibold py-2 rounded"
        >
          <AiOutlinePlus />
          Add Cover Letter
        </button>
      </div>
    </div>
  );
};

export default AddCoverLetter;
