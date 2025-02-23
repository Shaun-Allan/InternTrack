function logout() {
  window.location.href = "../index.html";
}

function initialize() {
  var sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmaKeN2y5IpuYcWpbmWCh3xoNscexAGPNATZFnUg6wTVUtA28oiyYUxDmrWknxRUNQkfrg6FeOJFBM/pub?output=csv";

  let allData = []; // Store all fetched data
  let currentPage = 1;
  const rowsPerPage = 50;

  async function fetchData() {
    try {
      const response = await fetch(sheetURL);
      const data = await response.text();
      const rows = data.split("\n").map((row) => row.split(","));

      if (rows.length > 1) {
        allData = rows.slice(1); // Exclude headers
        displayTable(currentPage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function displayTable(page) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear previous content

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = allData.slice(start, end);

    paginatedItems.forEach((row) => {
      const tr = document.createElement("tr");
      row.slice(0, 9).forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });

    updatePaginationControls();
  }

  function updatePaginationControls() {
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    document.getElementById(
      "page-info"
    ).textContent = `Page ${currentPage} of ${totalPages}`;

    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = currentPage === totalPages;
  }

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayTable(currentPage);
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    if (currentPage < Math.ceil(allData.length / rowsPerPage)) {
      currentPage++;
      displayTable(currentPage);
    }
  });

  fetchData(); // Fetch data when the script runs
}
