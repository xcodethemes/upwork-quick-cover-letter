import React, { useState } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const categories = useSelector((state) => state.category.savedCategories);
  const coverLetters = useSelector((state) => state.coverLetter.coverLetters);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState("");

  const filteredCoverLetters = coverLetters.filter(
    (cl) => cl.categoryId === selectedCategoryId
  );

  const selectedCoverLetter = filteredCoverLetters.find(
    (cl) => cl.id === selectedCoverLetterId
  );

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">View Cover Letter</h1>

      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Select Category</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setSelectedCoverLetterId(""); // Reset on category change
          }}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Cover Letter Title Dropdown */}
      {selectedCategoryId && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Cover Letter
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedCoverLetterId}
            onChange={(e) => setSelectedCoverLetterId(e.target.value)}
          >
            <option value="">-- Select Cover Letter --</option>
            {filteredCoverLetters.map((cl) => (
              <option key={cl.id} value={cl.id}>
                {cl.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cover Letter Content */}
      {selectedCoverLetter && (
        <div className="p-4 border border-gray-300 rounded bg-white shadow-sm">
          <h2 className="text-lg font-semibold">{selectedCoverLetter.title}</h2>
          <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
            {selectedCoverLetter.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
