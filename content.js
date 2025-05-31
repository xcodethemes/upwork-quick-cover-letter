/* eslint-disable no-undef */
console.log("Content script loaded!");

const getUrl = window.location.href;
console.log("check getUrl=>", getUrl);

const isApply = getUrl.includes("apply");
console.log("seee isApply==>", isApply);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "inject_prompt") {
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.value = message.prompt;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));

        setTimeout(() => {
          const button = document.querySelector("#composer-submit-button");

          if (button) {
            console.log("Button found:", button);
            // button.click(); // Click the button with the specified data-testid
          } else {
            console.error("Button not found with data-testid");
          }
        }, 500); // Slight delay to allow prompt to update
      }
    }, 1000); // Delay to ensure the page is fully loaded
  }

  if (message.type === "fetch_response") {
    try {
      const assistantMessages = Array.from(
        document.querySelectorAll('[data-testid="conversation-turn"]')
      ).filter(
        (el) =>
          el.innerText &&
          el.querySelector('[data-message-author-role="assistant"]')
      );

      const latest =
        assistantMessages[assistantMessages.length - 1]?.innerText || "";

      sendResponse({ content: latest });
    } catch (err) {
      console.error("Error fetching ChatGPT response:", err);
      sendResponse({ content: "" });
    }

    return true; // Keep port open for async response
  }
});
