/* eslint-disable no-undef */
export const handleFillValue =(selectedCoverLetter)=>{
    console.log('In handleFillValue', selectedCoverLetter?.description);
    const coverLetter= selectedCoverLetter?.description;

    if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length === 0) {
            console.error("No active tab found.");
            // reject("No active tab found");
            return;
          }
    
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            args: [coverLetter],
            function: (coverLetter) => {
              console.log("coverLetter in chrome==>", coverLetter);
              
              let coverLetterInput = document.querySelector('#main > div.container > div:nth-child(4) > div > div > div:nth-child(3) > div.fe-proposal-additional-details.additional-details > div > section > div.cover-letter-area.mt-6x.mt-md-10x > div.form-group.mb-8x > div > textarea')
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
}