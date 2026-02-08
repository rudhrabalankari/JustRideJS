"use strict";

async function setupAddressAutocomplete(inputId, callback) {
  const input = document.getElementById(inputId);
  if (!input) return;

  // 1. Request the 'places' library and wait for it to load
  const { PlaceAutocompleteElement } =
    await google.maps.importLibrary("places");

  const autocomplete = new PlaceAutocompleteElement();
  autocomplete.id = inputId;
  input.replaceWith(autocomplete);

  autocomplete.addEventListener("gmp-placeselect", async ({ place }) => {
    await place.fetchFields({ fields: ["formattedAddress", "location"] });

    callback({
      address: place.formattedAddress,
      lat: place.location.lat(),
      lng: place.location.lng(),
      placeId: place.id,
    });
  });
}

setupAddressAutocomplete("pickup", (loc) => {
  console.log("User selected:", loc);
});
const getCarModels = function () {
  return fetch("http://localhost:8080/models")
    .then((response) => response.json())
    .then((data) => {
      console.log("Car models fetched successfully: ", data);
      return data;
    })
    .catch((error) => console.error("Error fetching car models:", error));
};

const bodyTypesTemp = ["Sedan", "SUV", "Hatchback"];

document.addEventListener("DOMContentLoaded", () => {
  const containerCarCategories = document.querySelector(".category-grid");
  console.log("containerCarCategories: ", containerCarCategories);
  // Clear existing content
  containerCarCategories.innerHTML = "";

  bodyTypesTemp.forEach((bodyType) => {
    const categoryCard = document.createElement("div");
    categoryCard.classList.add("category-card");
    categoryCard.onclick = () => showPage("browse");
    categoryCard.innerHTML = `
      <div class="category-icon"><img src="img/red-suv-car-16695.png" alt="${bodyType} icon"></div>
      <h3>${bodyType}</h3>
      <p>From $39/day</p>
    `;
    containerCarCategories.appendChild(categoryCard);
  });

  //get All cars from the db
  fetch("http://localhost:8080/cars")
    .then((response) => response.json())
    .then((data) => {
      const firstCar = data.carList[0];
      console.log("First car fetched: ", firstCar);

      //set the car details in the home page
      const carGridEl = document.querySelector(".car-grid");
      carGridEl.innerHTML = "";
      const carCard = document.createElement("div");
      carCard.classList.add("car-card");
      carCard.innerHTML = `
        <img src="https://www.edmunds.com/assets/m/honda/cr-v-hybrid/2020/oem/2020_honda_cr-v-hybrid_4dr-suv_touring_fq_oem_1_815.jpg" alt="${firstCar.make} ${firstCar.model}">
        <h3>${firstCar.make} ${firstCar.model}</h3>
        <p>Body Type: ${firstCar.bodyType}</p>
      
      `;
      carGridEl.appendChild(carCard);
      //return data;
    })
    .catch((error) => {
      console.error("Got error ", error);
      return;
    });
});
