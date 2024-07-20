document
  .getElementById("fetchButton")
  .addEventListener("click", () => fetchData(document.getElementById("itemId").value));

const resultElement = document.getElementById("result");

function fetchData(itemId) {
  const nftId = itemId.slice(0, 12);
  console.log(nftId);

  const url1 = `https://api01.genso.game/api/metadata/${itemId}`;
  const url2 = `https://api01.genso.game/api/genso_v2_metadata/${itemId}`;

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
      displayData({ itemId: itemId, ...data }, resultElement);
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