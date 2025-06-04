// background.js
console.log("YouTube Transcript Navigator background script loaded.");

// Listen for the extension being installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Transcript Navigator extension installed or updated.");
  // Here you could set up initial storage values if needed in the future.
  // For example:
  // chrome.storage.sync.set({ preferredShortcutKeys: { prev: 'A', replay: 'S', next: 'D' } });
});

// Example of a message listener if content.js needed to communicate with background.js
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("Message received in background:", message);
//   if (message.action === "getSettings") {
//     // chrome.storage.sync.get(['preferredShortcutKeys'], (result) => {
//     //   sendResponse({ settings: result.preferredShortcutKeys });
//     // });
//     // return true; // Indicates that the response is sent asynchronously
//   }
// });
