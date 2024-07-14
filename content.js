function injectStyles() {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("style.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  (document.head || document.documentElement).appendChild(link);
}

// Call this function when your content script loads
injectStyles();

let modal;
let transactionLogsData = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.data && request.action === "storeTransactionLogsData") {
    console.log("Received data:", request.data);
    transactionLogsData = request.data;
  } else if (request.action === "showModal") {
    if (transactionLogsData) {
      showEquipmentList(transactionLogsData.transactionLogs);
    } else {
      console.log("Transaction log data not available");
    }
  } else if (request.action === "displayData") {
    console.log("request.action is displayData");
    displayData(request.data, document.getElementById("modalContent"), modal);
  } else if (request.action === "fetchError") {
    alert(`Error fetching data: ${request.error}`);
  }
});

function showEquipmentList(transactionLogs) {
  modal = createModal();
  const listContainer = document.createElement("div");
  listContainer.style.cssText = `
    max-height: 500px;
    overflow-y: auto;
    margin-top: 35px;
  `;

  const title = document.createElement("h1");
  title.textContent = "ステを見たい装備を選択してください";
  title.style.cssText = `
    position: absolute;
    top:20px;
    left: 28px; 
  `;
  const list = document.createElement("ul");
  list.style.cssText = `
    list-style-type: none;
    padding: 0;
  `;

  transactionLogs.forEach(log => {
    const item = document.createElement("li");

    // const date = new Date(log.createdAt).toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const price = parseFloat(log.price);
    item.innerHTML = `
      <div><img src="${log.image}" /></div>
      <div>${log.name} ${
      log.extraMetadata.level ? "Lv" + log.extraMetadata.level : ""
    } <br><span class="text-purple">${price} ${log.currencyCode}</span></div>
    `;
    item.onclick = () => fetchData(log.tokenId);
    list.appendChild(item);
  });

  listContainer.appendChild(list);
  modal.querySelector("#modalContent").appendChild(listContainer);
  modal.querySelector("#modalContent").appendChild(title);
  document.body.appendChild(modal);
}

function createModal() {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  const modalContent = document.createElement("div");
  modalContent.id = "modalContent";
  modalContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    min-width: 350px;
    max-width: 400px;
    max-height: 80%;
    overflow: visible;
  `;

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.style.cssText = `
    position: absolute;
    top: -15px;
    right: -15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #a417fa;
    color: white;
    font-size: 23px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0 4px 2px;
  `;
  closeButton.onclick = () => document.body.removeChild(modal);
  modalContent.appendChild(closeButton);

  modal.appendChild(modalContent);
  return modal;
}

function fetchData(itemId) {
  chrome.runtime.sendMessage({ action: "fetchData", itemId: itemId });
}
