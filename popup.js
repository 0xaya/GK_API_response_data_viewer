document
  .getElementById("fetchButton")
  .addEventListener("click", () => fetchData(document.getElementById("itemId").value));

const resultElement = document.getElementById("result");

function fetchData(itemId) {
  let url = "";
  if (itemId < 1000000003450) {
    url = `https://api01.genso.game/api/metadata/${itemId}`;
  } else {
    url = `https://api01.genso.game/api/genso_v2_metadata/${itemId}`;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // console.log("Fetched data:", JSON.stringify(data, null, 2));
      displayData(data, resultElement);
    })
    .catch(error => {
      console.error("Fetch error:", error);
      resultElement.textContent = `Error fetching data: ${error.message}`;
    });
}

// Log any unhandled errors
window.addEventListener("error", function (event) {
  console.error("Unhandled error:", event.error);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showPopup") {
    displayData(request.data);
  }
});
