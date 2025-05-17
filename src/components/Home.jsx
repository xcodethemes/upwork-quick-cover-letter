//Home.jsx
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleAi, handleFillValue } from "../utils/helper";
import Dropdown from "./ui/Dropdown";
import Button from "./ui/Button";
import { AiOutlinePlus } from "react-icons/ai";

const Home = () => {
  const [url, setUrl] = useState("");

  const categories = useSelector((state) => state.category.savedCategories);
  const coverLetters = useSelector((state) => state.coverLetter.coverLetters);
  const { upwork } = useSelector((state) => state?.settings);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState("");

  // Initial fetch of URL and setup listener
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "get_tab_url" }, (response) => {
      if (response?.url) {
        console.log("Initial tab URL:", response.url);
        setUrl(response.url);
      }
    });

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

  useEffect(() => {
    if (url) {
      console.log("🔄 URL changed:", url);
    }
  }, [url]);

  const filteredCoverLetters = coverLetters.filter(
    (cl) => cl.categoryId === selectedCategoryId
  );
  const selectedCoverLetter = filteredCoverLetters.find(
    (cl) => cl.id === selectedCoverLetterId
  );
  useEffect(() => {
    if (selectedCoverLetter) {
      console.log("✉️ Selected Cover Letter:", selectedCoverLetter);
      setTimeout(() => {
        handleFillValue(selectedCoverLetter, upwork.coverLetter);
      }, 1500);
    }
  }, [selectedCoverLetter, upwork.coverLetter, url]);

  const handleClick = async () => {
    try {
      const aiData = await handleAi(upwork?.jobTitle, upwork?.jobDescription, upwork?.skills);
      console.log("AI Data:", aiData);
      // You can now use aiData.jobTitle and aiData.jobDescription here
    } catch (error) {
      console.error("Error generating AI data:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* <h1 className="text-2xl font-bold mb-4">View Cover Letter</h1> */}

      <div>

      </div>
      {/* Category Dropdown */}
      <Dropdown
        label="Select Category"
        options={categories}
        selectedId={selectedCategoryId}
        setSelectedId={(cat) => {
          setSelectedCategoryId(cat);
          setSelectedCoverLetterId(""); // Reset on category change
        }}
        placeholder="Select Category"
      />

      {/* Cover Letter Dropdown */}
      {selectedCategoryId && (
        <Dropdown
          label="Select Cover Letter"
          options={filteredCoverLetters}
          selectedId={selectedCoverLetterId}
          setSelectedId={setSelectedCoverLetterId}
          placeholder="Select Cover Letter"
        />
      )}

      {/* Cover Letter Preview */}
      {selectedCoverLetter && (
        <div className="p-4 border border-gray-300 rounded bg-white shadow-sm">
          <h2 className="text-lg font-semibold">{selectedCoverLetter.title}</h2>
          <div className="mt-2 text-sm text-gray-700 whitespace-pre-line max-h-60 overflow-auto pr-2">
            {selectedCoverLetter.description}
          </div>
        </div>
      )}

      <div className="mt-5">
        {/* <h1 className="text-base font-bold text-center mb-4">Create Ai Cover Letter</h1> */}
        <div>
          {/* <Button onClick={handleAi(upwork?.jobTitle, upwork?.jobDescription)}>
            <AiOutlinePlus />
            Add Ai
          </Button> */}
          <Button onClick={handleClick}>
            <AiOutlinePlus />
            Add Ai
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
