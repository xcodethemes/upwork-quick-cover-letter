//background.js
/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// ✅ Respond to side panel asking for current tab URL
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "get_tab_url") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      sendResponse({ url: tab?.url || "" });
    });
    return true; // Allows async sendResponse
  }
});

// ✅ Send URL update to side panel when tab changes
function notifySidePanelWithTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      chrome.runtime.sendMessage({
        type: "tab_url_updated",
        url: activeTab.url,
      });
    }
  });
}

// 🔄 When user switches tabs
chrome.tabs.onActivated.addListener(() => {
  console.log("Tab activated");
  notifySidePanelWithTabUrl();
});

// 🔁 When URL or page content is reloaded/changed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    console.log("Tab updated:", tab.url);
    notifySidePanelWithTabUrl();
  }
});

// 🔃 Vite HMR (only for dev)
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    chrome.runtime.reload();
  });
}
