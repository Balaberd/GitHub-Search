const form = document.querySelector(".search__form");
const input = document.querySelector(".search__input");
const button = document.querySelector(".search__button");
const resultsList = document.querySelector(".search__results-list");
const notFoundBlock = document.querySelector(".search__nothing-found");

const API = "https://api.nomoreparties.co/github-search?q=";

function createAndMountResultItem(name, author, description, date, url) {
  const wrapper = document.createElement("li");
  wrapper.classList.add("search__result-item");

  const title = document.createElement("h4");
  title.classList.add("search__result-title");
  title.innerText = `${name} by ${author}`;

  const link = document.createElement("a");
  link.classList.add("search__result-link");
  link.setAttribute("target", "_blanck");
  link.setAttribute("href", url);
  link.appendChild(title);

  const paragraph = document.createElement("p");
  paragraph.classList.add("search__description-result");
  paragraph.innerText = description;

  const updated = document.createElement("span");
  updated.classList.add("search__description-updateted");
  updated.innerText = `${new Date(date).toLocaleDateString("ru-RU")} updated`;

  wrapper.appendChild(link);
  wrapper.appendChild(paragraph);
  wrapper.appendChild(updated);

  resultsList.appendChild(wrapper);
}

function clearResult() {
  while (resultsList.firstChild) {
    resultsList.removeChild(resultsList.firstChild);
  }
}

async function onSubmit(event) {
  event.preventDefault();

  notFoundBlock.classList.add("search__nothing-found_unvisible");

  if (!event.target.input.value.trim()) {
    input.classList.add("search__input_error");
    input.value = "";
    input.setAttribute("placeholder", "Поле не должно быть пустым");
  } else {
    clearResult();

    await fetch(API + event.target.input.value + `&per_page=10`)
      .then((res) => res.json())
      .then((res) => {
        const { total_count, items } = res;

        if (total_count == 0) {
          notFoundBlock.classList.remove("search__nothing-found_unvisible");
        } else {
          items.forEach((repo) => {
            createAndMountResultItem(
              repo.name,
              repo.owner.login,
              repo.description,
              repo.updated_at,
              repo.html_url
            );
          });
          input.value = "";
        }
      })
      .catch((err) => alert(err));
  }
}

input.addEventListener("focus", () => {
  input.classList.remove("search__input_error");
  input.setAttribute("placeholder", "Введите данные");
});

form.addEventListener("submit", onSubmit);
