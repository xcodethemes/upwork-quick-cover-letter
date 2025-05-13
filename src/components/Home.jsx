//Home.jsx
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleFillValue } from "../utils/helper";

const Home = () => {
  const [url, setUrl] = useState("");
  const categories = useSelector((state) => state.category.savedCategories);
  const coverLetters = useSelector((state) => state.coverLetter.coverLetters);
  const { upwork } = useSelector((state) => state?.settings);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState("");

  // Initial fetch of URL and setup listener
  useEffect(() => {
    // Get initial tab URL
    chrome.runtime.sendMessage({ type: "get_tab_url" }, (response) => {
      if (response?.url) {
        console.log("Initial tab URL:", response.url);
        setUrl(response.url);
      }
    });

    // Listener for tab URL updates
    const handleMessage = (message) => {
      if (message.type === "tab_url_updated") {
        console.log("Tab changed - New URL:", message.url);
        setUrl(message.url);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Handle when URL changes
  useEffect(() => {
    if (url) {
      console.log("🔄 URL changed:", url,);
      // You can do something like auto-select category or inject here
    }
  }, [url]);

  // useEffect(() => {
  //   console.log("🛠 Upwork setting:", upwork);
  // }, [upwork]);

  const filteredCoverLetters = coverLetters.filter(
    (cl) => cl.categoryId === selectedCategoryId
  );

  const selectedCoverLetter = filteredCoverLetters.find(
    (cl) => cl.id === selectedCoverLetterId
  );

  useEffect(() => {
    console.log("✉️ Selected Cover Letter:", selectedCoverLetter, 'check url too==>', url);
    if (selectedCoverLetter) {
      console.log('going to fill', 'upwork=>', upwork.coverLetter)
      const coverLetterSelector= upwork.coverLetter;
      setTimeout(() => {

        handleFillValue(selectedCoverLetter, coverLetterSelector);
      }, 1500);
    }
  }, [selectedCoverLetter, upwork.coverLetter, url]);

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">View Cover Letter</h1>

      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Select Category
        </label>
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

      {/* Cover Letter Dropdown */}
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

      {/* Cover Letter Preview */}
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
