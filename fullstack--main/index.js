const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = 'https://www.cheapshark.com/api/1.0/deals?storeID=&upperPrice=15';
const filterOptions = {
  storeID: "",
  title: "",
}

fetch(proxyUrl + targetUrl)
  .then((response) => response.json())
  .then((data) => {

  })
  .catch((error) => console.log("error", error));

function getDeals() {
  filterOptions.storeID = document.getElementById("store").value;

  if (!storeID) {
    alert("Por favor, preencha o campo storeID.");
    return;
  }

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    mode: "no-cors",
  };

  fetch(
    `https://www.cheapshark.com/api/1.0/deals?storeID=${filterOptions.storeID}&upperPrice=15`,
    requestOptions
  )
    .then((response) => response.json())
    .then((response) => {
      if(response.status === 429) {
        setTimeout(getDeals, 1000);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      const dealsContainer = document.getElementById("deals");
      dealsContainer.innerHTML = "";

      data.forEach((deal) => {
        const dealElement = document.createElement("div");
        dealElement.classList.add("deal");

        dealElement.innerHTML = `
       <h2>${deal.title}</h2>
        <img src="${deal.thumb}">
        <p>Normal Price: $${deal.normalPrice}</p><p>${deal.saveInteger = parseInt(deal.savings)}%</p>
        <p>Sale Price: $${deal.salePrice}</p>
        <p>DealID: ${deal.dealID}</p> 
        <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank">View Deal</a>
      `;
        dealsContainer.appendChild(dealElement);
      });
    });
}

const storeSelect = document.getElementById("store");

storeSelect.addEventListener("change", getDeals);

fetch("https://www.cheapshark.com/api/1.0/stores")
  .then((response) => response.json())
  .then((data) => {
    const storeData = data;
    const storeSelect = document.getElementById("store");

    storeData.forEach((store) => {
      const option = document.createElement("option");
      option.value = store.storeID;
      option.text = store.storeName;
      storeSelect.appendChild(option);
    });

    getDeals();
  })

  .catch((error) => console.log("error", error));

function searchGame(event) {
  event.preventDefault();

  filterOptions.title = document.getElementById("search-input").value;

  fetch(`https://www.cheapshark.com/api/1.0/games?title=${filterOptions.title}&storeID=${filterOptions.storeID}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        data.forEach(game => {
          const dealId = game.cheapestDealID;
          dealLookup(dealId);
        });
      } else {
        console.log("No games found with that name");
      }
    });
}

function dealLookup(dealId) {

  fetch(`https://www.cheapshark.com/api/1.0/deals?id=${dealId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.gameInfo) {
        const gameInfo = data.gameInfo;
        const dealsContainer = document.getElementById("deals");


        const dealElement = document.createElement("div");
        dealElement.classList.add("deal");

        dealElement.innerHTML = `
          <h2>${gameInfo.name}</h2>
          <img src="${gameInfo.thumb}">
          <p>Normal Price: $${gameInfo.retailPrice}</p>
          <p>Sale Price: $${gameInfo.salePrice}</p>
          <p>Steam Rating: ${gameInfo.steamRatingText}</p>
          <p>Steam Reviews: ${gameInfo.steamRatingCount}</p>
          <p>DealID: ${dealId}</p>
          <a href="https://www.cheapshark.com/redirect?dealID=${dealId}" target="_blank">View Deal</a>
          `;
        dealsContainer.appendChild(dealElement);
      } else {
        console.log("No deal found with that ID");
      }
    })
    .catch((error) => console.log("error", error));
}

const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", searchGame);
