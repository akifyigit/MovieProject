// got the modals from https://github.com/ArslanAmeer/Ui-Component-Basic-JS-PopUp-Modal
//Modal script Add
document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("modal");

  document.getElementById("linkModal").addEventListener(
    "click",
    function () {
      modal.classList.remove("offmodal");
      modal.classList.add("onmodal");
    },
    false
  );

  document.querySelector(".close").addEventListener(
    "click",
    function () {
      modal.classList.remove("onmodal");
      modal.classList.add("offmodal");
    },
    false
  );
});
//Modal script Update
document.addEventListener("DOMContentLoaded", function () {
  var modal2 = document.getElementById("modal2");

  //This part we carried into the button
  // document.getElementById("linkModal2").addEventListener(
  //   "click",
  //   function () {
  //     modal2.classList.remove("offmodal");
  //     modal2.classList.add("onmodal");
  //   },
  //   false
  // );

  document.querySelector(".close2").addEventListener(
    "click",
    function () {
      modal2.classList.remove("onmodal");
      modal2.classList.add("offmodal");
    },
    false
  );
});

let data;

async function fetchData() {
  const response = await fetch("http://localhost:3000/api/media", {
    method: "GET",
  });
  const fetchedData = await response.json();
  data = fetchedData;
  populateTable(data);
  populateYearFilter(data);
}
fetchData();

const yearFilter = document.getElementById("year-filter");

function populateYearFilter(data) {
  const uniqueYears = [...new Set(data?.map((movie) => movie.year))]; // filter for unique years
  //uniqueYears array
  uniqueYears.forEach((year) => {
    const option = document.createElement("option");
    option.setAttribute("value", year);
    option.textContent = year;
    yearFilter.appendChild(option);
  });
}
populateYearFilter();

yearFilter.addEventListener("change", function () {
  const yearFilterValue = parseInt(yearFilter.value);
  if (yearFilterValue === 0) {
    clearTable();
    populateTable(data);
  } else {
    const filteredData = data.filter(
      (movie) => parseInt(movie.year) === parseInt(yearFilterValue)
    );
    clearTable();
    populateTable(filteredData);
  }
});

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const posterValue = document.getElementById("poster").value;
  const nameValue = document.getElementById("name").value;
  const yearValue = document.getElementById("year").value;
  const genreValue = document.getElementById("genre").value;
  const descriptionValue = document.getElementById("description").value;

  const formData = {
    poster: posterValue,
    name: nameValue,
    year: yearValue,
    genre: genreValue,
    description: descriptionValue,
  };
  fetch("http://localhost:3000/api/media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).then(() => {
    fetchData();
    modal.classList.remove("onmodal");
    modal.classList.add("offmodal");

    document.getElementById("poster").value = "";
    document.getElementById("name").value = "";
    document.getElementById("year").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("description").value = "";
  });
});

const selectUpdate = document.getElementById("updateYear");
const selectAdd = document.getElementById("year");
for (var year = 1980; year <= 2024; year++) {
  var option = document.createElement("option");
  option.value = year;
  option.text = year;
  selectUpdate.appendChild(option);
}
for (var year = 1980; year <= 2024; year++) {
  var option = document.createElement("option");
  option.value = year;
  option.text = year;
  selectAdd.appendChild(option);
}

let id;
function handleUpdateButtonClick(index) {
  const movieToUpdate = data[index];
  id = movieToUpdate.id;
  document.getElementById("updatePoster").value = movieToUpdate.poster;
  document.getElementById("updateName").value = movieToUpdate.name;
  document.getElementById("updateYear").value = movieToUpdate.year;
  document.getElementById("updateGenre").value = movieToUpdate.genre;
  document.getElementById("updateDescription").value =
    movieToUpdate.description;

  // Open the update modal
  const modal2 = document.getElementById("modal2");
  modal2.classList.remove("offmodal");
  modal2.classList.add("onmodal");
}

function handleDeleteButtonClick(index) {
  const movieToUpdate = data[index];
  id = movieToUpdate.id;
  fetch(`http://localhost:3000/api/media/${id}`, {
    method: "DELETE",
  }).then(() => {
    fetchData();
  });
}

document
  .getElementById("updateForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const posterValue = document.getElementById("updatePoster").value;
    const nameValue = document.getElementById("updateName").value;
    const yearValue = document.getElementById("updateYear").value;
    const genreValue = document.getElementById("updateGenre").value;
    const descriptionValue = document.getElementById("updateDescription").value;

    const formData = {
      poster: posterValue,
      name: nameValue,
      year: yearValue,
      genre: genreValue,
      description: descriptionValue,
    };

    fetch(`http://localhost:3000/api/media/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(() => {
      fetchData();
      modal2.classList.remove("onmodal");
      modal2.classList.add("offmodal");

      document.getElementById("updatePoster").value = "";
      document.getElementById("updateName").value = "";
      document.getElementById("updateYear").value = "";
      document.getElementById("updateGenre").value = "";
      document.getElementById("updateDescription").value = "";
    });
  });

function populateTable(data) {
  const tableBody = document.getElementById("title");

  const dataRows = document.querySelectorAll("#title tr:not(:first-child)");
  dataRows.forEach((row) => row.remove());

  data.forEach((movie) => {
    const newRow = tableBody?.insertRow();

    const OperationsCell = newRow.insertCell(0); // function Column
    const updateButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    updateButton.className = "linkModal2";
    deleteButton.className = "deleteButton";

    updateButton.setAttribute("data-id", movie.id);
    deleteButton.setAttribute("data-id", movie.id);

    updateButton.textContent = "Update";
    deleteButton.textContent = "Delete";

    updateButton.addEventListener("click", () =>
      handleUpdateButtonClick(data.indexOf(movie))
    );
    deleteButton.addEventListener("click", () =>
      handleDeleteButtonClick(data.indexOf(movie))
    );

    OperationsCell.appendChild(updateButton);
    OperationsCell.appendChild(deleteButton);

    const posterCell = newRow.insertCell(1); //Image Column
    const posterFigure = document.createElement("figure");
    const posterImage = document.createElement("img");
    posterImage.classname = "posterImage";
    posterImage.setAttribute("src", movie.poster);
    posterImage.setAttribute("alt", movie.name);
    posterImage.setAttribute("width", 300);
    posterImage.setAttribute("height", 450);
    posterFigure.appendChild(posterImage);
    posterCell.appendChild(posterFigure);

    const nameCell = newRow.insertCell(2); //Name Column
    const nameUnorderedList = document.createElement("ul");
    const nameUnorderedListElement = document.createElement("li");
    nameUnorderedListElement.className = "bigger";
    nameUnorderedListElement.textContent = `${movie.name}`;
    nameUnorderedList.appendChild(nameUnorderedListElement);
    nameCell.appendChild(nameUnorderedList);

    const yearCell = newRow.insertCell(3); //Year Column
    const yearUnorderedList = document.createElement("ul");
    const yearUnorderedListElement = document.createElement("li");
    yearUnorderedListElement.className = "bigger";
    yearUnorderedListElement.textContent = `${movie.year}`;
    yearUnorderedList.appendChild(yearUnorderedListElement);
    yearCell.appendChild(yearUnorderedList);

    const genreCell = newRow.insertCell(4); //Genre Column
    const genreUnorderedList = document.createElement("ul");
    const genreUnorderedListElement = document.createElement("li");
    genreUnorderedListElement.className = "bigger";
    genreUnorderedListElement.textContent = `${movie.genre}`;
    genreUnorderedList.appendChild(genreUnorderedListElement);
    genreCell.appendChild(genreUnorderedList);

    const descriptionCell = newRow.insertCell(5); //Decription Column !!! Css must be checked
    const descriptionParagraph = document.createElement("div");
    descriptionParagraph.className = "paragraph";
    descriptionParagraph.textContent = `${movie.description}`;
    descriptionCell.appendChild(descriptionParagraph);
  });
}
function clearTable() {
  const tableBody = document.getElementById("title");
  tableBody.innerHTML = "";

  const headerRow = tableBody.insertRow(0);
  headerRow.innerHTML = `
    <th>Functions</th>
    <th>Poster</th>
    <th>Name</th>
    <th>Year</th>
    <th>Genre</th>
    <th>Description</th>
  `;
}

document.getElementById("button").addEventListener("click", function (event) {
  event.preventDefault();
  fetch("http://localhost:3000/api/media/reset", {
    method: "DELETE",
  }).then(() => {
    fetchData();
  });
});
