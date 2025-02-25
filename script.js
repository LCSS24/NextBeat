let tableau = new Set([]);

async function getToken() {
  const clientId = "35d72b43f9c74d43a3ecd2c1044d9697";
  const clientSecret = "c5f71a30a6d74d1f870c19326122ac53";

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

async function getRapArtists() {
  const token = await getToken();
  const artists = new Map();

  while (artists.size < 50) {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=genre:rap&type=artist&limit=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (!data.artists || !data.artists.items) break;

    data.artists.items.forEach((artist) => {
      if (!artists.has(artist.id) && artists.size < 50) {
        artists.set(artist.id, {
          name: artist.name,
          image:
            artist.images.length > 0
              ? artist.images[0].url
              : "https://via.placeholder.com/150",
          genres: artist.genres.length > 0 ? artist.genres : ["Inconnu"],
        });
      }
    });
  }

  return [...artists.values()];
}

function generateCard(rappeurs, i) {
  if (i >= rappeurs.length) {
    console.log("Plus d'artistes à afficher !");
    return;
  }
  const main = document.querySelector(".jeu");
  main.innerHTML = ""; // Supprime les anciennes cartes

  const imgdefond = document.createElement("img");
  const carte = document.createElement("div");
  const layer = document.createElement("div");
  const img = document.createElement("img");
  const elements = document.createElement("div");
  const name = document.createElement("h2");
  const oui = document.createElement("i");
  const non = document.createElement("i");
  const scrollContainer = document.createElement("div");

  imgdefond.classList.add("imgdefond");
  carte.classList.add("carte");
  img.src = rappeurs[i].image;
  imgdefond.src = img.src;
  layer.classList.add("layer");
  elements.classList.add("elements");
  non.classList.add("fa-solid", "fa-xmark");
  non.id = "non";
  name.textContent = rappeurs[i].name;
  name.classList.add("scrolling-text");
  oui.classList.add("fa-solid", "fa-heart");
  oui.id = "oui";
  scrollContainer.classList.add("scroll-container");

  main.appendChild(imgdefond);
  main.appendChild(carte);
  carte.appendChild(img);
  carte.appendChild(layer);
  layer.appendChild(elements);
  elements.appendChild(non);
  elements.appendChild(scrollContainer);
  scrollContainer.appendChild(name);
  elements.appendChild(oui);

  applyScrollingEffect(name);
  clickBoutons(oui, non, carte, i, rappeurs);
}

function clickBoutons(oui, non, carte, i, rappeurs) {
  oui.addEventListener("click", () => {
    tableau.add(carte.innerText);
    carte.classList.add("swipe-right"); // Swipe à droite
    setTimeout(() => {
      generateCard(rappeurs, i + 1);
    }, 500);
  });

  non.addEventListener("click", () => {
    carte.classList.add("swipe-left"); // Swipe à gauche
    setTimeout(() => {
      generateCard(rappeurs, i + 1);
    }, 500);
  });
}

function applyScrollingEffect(nameElement) {
  const parent = nameElement.parentElement;
  const textWidth = nameElement.scrollWidth;
  const parentWidth = parent.offsetWidth;

  if (textWidth > parentWidth) {
    nameElement.style.animation = "scrollText 5s linear infinite";
  } else {
    nameElement.style.animation = "none";
  }
}

function menu() {
  const input = document.getElementById("menuburger");
  const list = document.querySelectorAll("#menu li");

  input.addEventListener("change", () => {
    if (input.checked) {
      list.forEach((li) => {
        li.style.display = "flex";
        setTimeout(() => {
          li.classList.add("lidescente");
        }, 10);
      });
    } else {
      list.forEach((li) => {
        li.classList.remove("lidescente");
        setTimeout(() => {
          li.style.display = "none";
        }, 500);
      });
    }
  });
  modales(list);
}

function modales(list) {
  const fond = document.querySelector(".modale_fond");
  const modale = document.querySelector(".modale_like");
  const croix = document.querySelector(".fa-xmark");
  let liste_like = document.querySelector(".liste_like");

  list.forEach((li) => {
    li.addEventListener("click", (e) => {
      if (e.target.id == "likes") {
        fond.style.display = "flex";
        setTimeout(() => {
          modale.classList.add("active");
        }, 50);

        liste_like.innerHTML = "";

        tableau.forEach((i) => {
          const element = document.createElement("li");
          element.innerHTML = i;
          liste_like.appendChild(element);
        });
      }
    });
  });

  croix.addEventListener("click", () => {
    modale.classList.remove("active");
    setTimeout(() => {
      fond.style.display = "none";
    }, 300);
  });
}

async function main() {
  const rappeurs = await getRapArtists();
  generateCard(rappeurs, 0);
  menu();
}

document.addEventListener("DOMContentLoaded", main);
