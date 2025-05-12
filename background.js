/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  });
  

  
  // Auto-reload during development (Vite HMR)
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      chrome.runtime.reload();
    });
  }
