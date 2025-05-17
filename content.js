/* eslint-disable no-undef */
console.log("Content script loaded!");

const getUrl = window.location.href;
console.log("check getUrl=>", getUrl);

const isApply = getUrl.includes("apply");
console.log("seee isApply==>", isApply);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "inject_prompt") {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.value = message.prompt;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
  
        setTimeout(() => {
          const button = textarea.closest("form")?.querySelector("button");
          button?.click(); // Trigger ChatGPT to respond
        }, 500);
      }
    }
  
    if (message.type === "fetch_response") {
      try {
        const assistantMessages = Array.from(
          document.querySelectorAll('[data-testid="conversation-turn"]')
        ).filter((el) => el.innerText && el.querySelector('[data-message-author-role="assistant"]'));
  
        const latest = assistantMessages[assistantMessages.length - 1]?.innerText || "";
  
        sendResponse({ content: latest });
      } catch (err) {
        console.error("Error fetching ChatGPT response:", err);
        sendResponse({ content: "" });
      }
  
      return true; // Keep port open for async response
    }
  });
  

