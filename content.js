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
let equipmentList;
let priceSold = "";
let timeSold = "";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.data && request.action === "storeTransactionLogsData") {
    console.log("Received data:", request.data);
    transactionLogsData = request.data;
  } else if (request.action === "showModal") {
    if (transactionLogsData) {
      showEquipmentList(transactionLogsData.transactionLogs);
    } else {
      console.log("Transaction log data not available");
      showError(
        "トランザクションログデータが取得できませんでした。ページを再読み込みし、リストが完全に表示されてからクリックしてください。"
      );
    }
  } else if (request.action === "displayData") {
    modal.querySelector("#modalContent").innerHTML = "";
    displayData(request.data, document.getElementById("modalContent"), modal, priceSold, timeSold, equipmentList);
  } else if (request.action === "fetchError") {
    alert(`Error fetching data: ${request.error}`);
  }
});

function showEquipmentList(transactionLogs) {
  if (!modal) {
    modal = createModal();
  }
  modal.querySelector("#modalContent").innerHTML = "";

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
    const price = parseFloat(log.price) + " " + log.currencyCode;
    const time = formatTimestamp(log.timestamp * 1000);
    item.innerHTML = `
      <div><img src="${log.image}" /></div>
      <div style="line-height: 1.1">${log.name} ${log.extraMetadata.level ? "Lv" + log.extraMetadata.level : ""} <br>
      <span class="item_id font-xsmall">${log.tokenId}</span><br>
      <span class="font-purple font-xsmall">${price}</span><span class="font-xsmall"> ${time}</span>
      </div>
    `;
    item.onclick = () => fetchData(log.tokenId, price, time);
    list.appendChild(item);
  });

  listContainer.appendChild(list);
  listContainer.appendChild(title);
  modal.querySelector("#modalContent").appendChild(listContainer);
  equipmentList = listContainer;
  document.body.appendChild(modal);
}

function createModal() {
  priceSold = "";
  timeSold = "";
  const modalElem = document.createElement("div");
  modalElem.style.cssText = `
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

  const modalContainer = document.createElement("div");
  modalContainer.id = "modalContainer";
  modalContainer.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    min-width: 350px;
    max-width: 500px;
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
  closeButton.addEventListener("click", () => document.body.removeChild(modal));
  modalContainer.appendChild(closeButton);

  const modalContent = document.createElement("div");
  modalContent.id = "modalContent";
  modalContainer.appendChild(modalContent);

  modalElem.appendChild(modalContainer);
  return modalElem;
}

function showError(errorMessage) {
  if (!modal) {
    modal = createModal();
  }
  modal.querySelector("#modalContent").innerHTML = "";
  const errorElem = document.createElement("div");
  errorElem.innerText = errorMessage;
  const closeButton = document.createElement("button");
  closeButton.innerText = "閉じる";
  closeButton.style.cssText = `
    left: 50%;
    position: relative;
    margin-top: 10px;
    transform: translateX(-50%);
  `;
  closeButton.onclick = () => document.body.removeChild(modal);
  modal.querySelector("#modalContent").appendChild(errorElem);
  modal.querySelector("#modalContent").appendChild(closeButton);
  document.body.appendChild(modal);
}

function fetchData(itemId, price, time) {
  priceSold = price;
  timeSold = time;
  chrome.runtime.sendMessage({ action: "fetchData", itemId: itemId });
}
