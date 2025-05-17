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

export const handleAi = (
  jobTitleSelector,
  jobDescriptionSelector,
  skillsSelector
) => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
          return reject("No active tab found.");
        }

        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            args: [jobTitleSelector, jobDescriptionSelector, skillsSelector],
            func: (
              jobTitleSelector,
              jobDescriptionSelector,
              skillsSelector
            ) => {
              const jobTitleElement = document.querySelector(jobTitleSelector);
              const jobDescriptionElement = document.querySelector(
                jobDescriptionSelector
              );

              const skillElement = document.querySelector(skillsSelector);

              const upworkSkills = Array.from(
                skillElement.querySelectorAll("li")
              ).map((li) => li.textContent.trim());

              console.log(upworkSkills);

              const upworkPrompt = {
                jobTitle: jobTitleElement?.innerText || "",
                jobDescription: jobDescriptionElement?.innerText || "",
                skillElement: upworkSkills,
              };

              return upworkPrompt;
            },
          },
          (injectionResults) => {
            if (chrome.runtime.lastError) {
              return reject(chrome.runtime.lastError.message);
            }

            if (
              injectionResults &&
              injectionResults[0] &&
              injectionResults[0].result
            ) {
              resolve(injectionResults[0].result);
            } else {
              reject("No result returned from content script");
            }
          }
        );
      });
    } else {
      reject("Chrome API is not available.");
    }
  });
};
