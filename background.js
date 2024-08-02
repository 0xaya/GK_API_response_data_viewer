importScripts("shared.js");

chrome.contextMenus.create({
  id: "checkEquipmentStats",
  title: "装備のステを見る",
  contexts: ["page"],
  documentUrlPatterns: ["https://market.genso.game/*marketplace/equipments/transaction-log*"],
});

let activeTabId = null;

chrome.contextMenus.onClicked.addListener((info, tab) => {
  activeTabId = tab.id;
  if (info.menuItemId === "checkEquipmentStats") {
    chrome.tabs.sendMessage(activeTabId, { action: "showModal" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchData") {
    const nftId = request.itemId.slice(0, 12);
    // console.log(nftId);

    const url1 = `https://api01.genso.game/api/metadata/${request.itemId}`;
    const url2 = `https://api01.genso.game/api/genso_v2_metadata/${request.itemId}`;

    // Start with the first URL based on the condition
    let primaryUrl = nftId < 100000000408 ? url1 : url2;
    let fallbackUrl = nftId < 100000000408 ? url2 : url1;

    function tryFetch(url, fallback) {
      return fetch(url).then(response => {
        if (!response.ok) {
          if (response.status === 404 && fallback) {
            console.log(`404 error on ${url}, trying fallback URL`);
            return tryFetch(fallback, null);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      });
    }

    tryFetch(primaryUrl, fallbackUrl)
      .then(data => {
        chrome.tabs.sendMessage(sender.tab.id, { action: "displayData", data: { ...data, itemId: request.itemId } });
      })
      .catch(error => {
        console.error("Fetch error:", error);
        chrome.tabs.sendMessage(sender.tab.id, { action: "fetchError", error: error.message });
      });
  }
});

let checkUrl = "";

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (checkUrl !== details.url) {
      checkUrl = details.url;
      fetch(details.url)
        .then(response => response.json())
        .then(data => {
          // Process the response data
          // console.log("Response data:", data);
          // Send data to content script
          chrome.tabs.sendMessage(activeTabId, { action: "storeTransactionLogsData", data: data }).catch(error => {
            // showError(error);
            console.log(error);
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  { urls: ["https://api-market.genso.game/api/transactionLogs/equipment?*"] }
);

// Listen for tab activation
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (isTargetUrl("onActivated", tab.url)) {
      activeTabId = activeInfo.tabId;
      console.log("tabId", activeTabId);
    }
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === "loading" && isTargetUrl(tab.url)) {
    checkUrl = "";
  } else if (isTargetUrl(tab.url)) {
    activeTabId = tabId;
  }
});

// Function to check if the URL matches your target
function isTargetUrl(url) {
  const targetPattern = /^https:\/\/market\.genso\.game\/*/;
  return url && targetPattern.test(url);
}