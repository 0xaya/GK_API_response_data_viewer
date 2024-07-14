importScripts("shared.js");

chrome.contextMenus.create({
  id: "checkEquipmentStats",
  title: "Check Equipment Stats",
  contexts: ["page"],
  documentUrlPatterns: ["https://market.genso.game/*marketplace/equipments/transaction-log*"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "checkEquipmentStats") {
    chrome.tabs.sendMessage(tab.id, { action: "showModal" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchData") {
    let url = "";
    if (request.itemId < 1000000003450) {
      url = `https://api01.genso.game/api/metadata/${request.itemId}`;
    } else {
      url = `https://api01.genso.game/api/genso_v2_metadata/${request.itemId}`;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        chrome.tabs.sendMessage(sender.tab.id, { action: "displayData", data: data });
      })
      .catch(error => {
        console.error("Fetch error:", error);
        chrome.tabs.sendMessage(sender.tab.id, { action: "fetchError", error: error.message });
      });
  }
});

chrome.webRequest.onCompleted.addListener(
  function (details) {
    fetch(details.url)
      .then(response => response.json())
      .then(data => {
        // Process the response data
        console.log("Response data:", data);

        // Send data to content script
        chrome.tabs.sendMessage(details.tabId, { action: "storeTransactionLogsData", data: data });
      });
  },
  { urls: ["https://api-market.genso.game/api/transactionLogs/equipment*"] }
);
