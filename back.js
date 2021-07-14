const resultList = document.querySelector("#card-results");
const headerResult = document.querySelector("#header-results");
const userInput = document.querySelector("#location");
const spanUserInput = document.querySelector(".user-input");
let listProperty = [];
const peripheralResultsList = [];
const dataToFetch = [{ city: "rio-de-janeiro", estate: "rj" }];
let totalCount = "";
let userData = "";
userInput.value = "Rio de Janeiro";
const amenities = {
  AIR_CONDITIONING: "Ar Condicionado",
  AMERICAN_KITCHEN: "Cozinha Americana",
  BARBECUE_GRILL: "Churrasqueira",
  BICYCLES_PLACE: "Bicicletário",
  CINEMA: "Cinema",
  ELECTRONIC_GATE: "Portaria Eletrônica",
  ELEVATOR: "Elevador",
  FIREPLACE: "Lareira",
  FURNISHED: "Mobiliado",
  GARDEN: "Jardim",
  GATED_COMMUNITY: "Condomínio Fechado",
  GYM: "Academia",
  LAUNDRY: "Lavanderia",
  PARTY_HALL: "Salão de Festas",
  PETS_ALLOWED: "Aceita Pets",
  PLAYGROUND: "Playground",
  POOL: "Piscina",
  SAUNA: "Sauna",
  SPORTS_COURT: "Quadra de Esportes",
  TENNIS_COURT: "Quadra de Tênis",
};

userInput.onchange = function () {
  switch (userInput.value) {
    case "Rio de Janeiro":
      userData = { city: "rio-de-janeiro", estate: "rj" };
      break;
    case "São Paulo":
      userData = { city: "sao-paulo", estate: "sp" };
      break;
    default:
      userData = { city: userInput.value, estate: "" };
      break;
  }
  dataToFetch.push(userData);
  dataToFetch.shift();
  reset();
  refreshData();
};

const refreshData = () => {
  dataToFetch.map(function (data) {
    const urlApartament = `https://private-9e061d-piweb.apiary-mock.com/venda?state=${data.estate}&city=${data.city}`;
    fetch(urlApartament)
      .then(function (response) {
        if (!response.ok) {
          console.log(response.status);
          resultList.innerHTML = `
          <div class='error-result'>
            <h1>OOOOPS!</h1>
            <h1>ALGO DEU ERRADO NA SUA BUSCA.</h1>
            <h3 class='error-status-result'>status ${response.status}</h3>
            <h1>POR FAVOR, TENTE NOVAMENTE.</h1>
          </div>
          `;
        }
        return response;
      })
      .then(function (response) {
        response.json().then(function (data) {
          const listings = data.search.result.listings;
          totalCount = data.search.totalCount;
          buildHtmlTitle(totalCount);
          const processedData = listings.map(function (apartament) {
            const apartamentData = {
              stateAcronym: apartament.listing.address.stateAcronym,
              city: apartament.listing.address.city,
              address: apartament.listing.address.street,
              addressNumber: apartament.listing.address.streetNumber,
              neighborhood: apartament.listing.address.neighborhood,
              title: apartament.link.name,
              usableAreas: apartament.listing.usableAreas[0],
              bedRooms: apartament.listing.bedrooms[0],
              bathRooms: apartament.listing.bathrooms[0],
              parkingSpace: apartament.listing.parkingSpaces[0],
              differentials: apartament.listing.amenities,
              propertyValue: formatter.format(
                apartament.listing.pricingInfos[0].price
              ),
              condominiumValue: formatter.format(
                apartament.listing.pricingInfos[0].monthlyCondoFee
              ),
              propertyPhoto: apartament.medias[0].url,
            };
            listProperty.push(apartamentData);
          });
          buildHtmlCard(listProperty);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};

const reset = () => {
  headerResult.innerHTML = "";
  resultList.innerHTML = "";
  listProperty = [];
};

const buildHtmlTitle = (counter) => {
  headerResult.innerHTML += `<div class='title-result'><h1><span>${counter}</span> Imóveis á venda em ${userInput.value}</h1></div>`;
};

const locationPill = (data) => {
  spanUserInput.innerHTML = `${userInput.value} - ${data.stateAcronym} X`;
};

const buildHtmlCard = (arrayApartament) => {
  arrayApartament.map(function (apartament) {
    const apartamentDifferentials = apartament.differentials.map(function (
      differential
    ) {
      return `<span class='property-amenities'>${amenities[differential]}</span>`;
    });
    resultList.innerHTML += `
        <div class='card-apartament-container'>
        <figure>
            <img src="${apartament.propertyPhoto}" class="property-photo" alt="Foto da propriedade">
        </figure>
        <div class="property-data">
            <span class="property-address">${apartament.address}, ${apartament.addressNumber} - ${apartament.neighborhood}, ${apartament.city} - ${apartament.stateAcronym}</span>
            <span class="property-title">${apartament.title}</span>
            <ul class="property-stat-list">
                <li><span class="property-stat-data">${apartament.usableAreas}</span><span class="property-stat">m²</span></li>
                <li><span class="property-stat-data">${apartament.bedRooms}</span><span class="property-stat">Quartos</span></li>
                <li><span class="property-stat-data">${apartament.bathRooms}</span><span class="property-stat">Banheiros</span></li>
                <li><span class="property-stat-data">${apartament.parkingSpace}</span><span class="property-stat">Vagas</span></li>
            </ul>
            <div class='property-amenities-container'>${apartamentDifferentials}</div>
            <span class="property-value">${apartament.propertyValue}</span>
            <span class="property-condominium"><span>Condomínio:</span><span class="property-condominium-data">${apartament.condominiumValue}</span></span>
        </div>
        </div>
        `;
  });
};

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

refreshData();
