/* eslint-disable no-undef */
export const handleFillValue = (selectedCoverLetter, coverLetterSelector) => {
  console.log("In handleFillValue", selectedCoverLetter?.description);
  const coverLetter = selectedCoverLetter?.description;

  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error("No active tab found.");
        // reject("No active tab found");
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        args: [coverLetter, coverLetterSelector],
        function: (coverLetter, coverLetterSelector) => {
          console.log("coverLetter in chrome==>", coverLetter);

          let coverLetterInput = document.querySelector(coverLetterSelector);
          console.log("coverLetterInput==>", coverLetterInput);

          coverLetterInput.value = coverLetter;

          console.log("Filled Values! 321");
        },
      });
    });
  } else {
    console.warn(
      "Chrome API handleFill is not available. Run this as a Chrome extension."
    );
  }
};

//new
// utils/helper.js
// export const handleFillValue = (coverLetter) => {
//   if (!coverLetter?.description) return;

//   const tryInject = () => {
//     const textarea = document.querySelector("textarea[name='coverLetter']"); // <- Replace with correct selector
//     if (textarea) {
//       textarea.focus();
//       textarea.value = coverLetter.description;
//       textarea.dispatchEvent(new Event("input", { bubbles: true }));
//       console.log("✅ Cover letter filled");
//       return true;
//     }
//     return false;
//   };

//   // Try immediately
//   if (tryInject()) return;

//   // Fallback: observe if not found
//   const observer = new MutationObserver((mutations, obs) => {
//     if (tryInject()) obs.disconnect();
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//   });
// };
