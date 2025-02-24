function logout() {
  window.location.href = "../index.html";
}

function initialize() {
  function addEventListenerForFilter(filter, content) {
    filter.addEventListener("click", (event) => {
      content.style.display = "flex"; // Show the popup
      positionFilterContainer(content, event.target); // Position it near the button clicked
    });
  }

  function addEventListenerForFilters() {
    var filters = document.querySelectorAll(".filter");
    for (var f of filters) {
      addEventListenerForFilter(
        f,
        document.getElementById(f.id + "-container")
      );
    }
  }

  function positionFilterContainer(container, button) {
    let rect = button.getBoundingClientRect(); // Get button position relative to viewport
    let topOffset = window.scrollY; // Position below button
    let leftOffset = window.scrollX; // Align with button

    let innerContent = container;
    innerContent.style.top = `${topOffset}px`;
    innerContent.style.left = `${leftOffset}px`;
    document.body.style.overflowY = "hidden";
  }

  // Close filter container on clicking close button
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".filter-container").style.display = "none";
      document.body.style.overflowY = "scroll";
    });
  });

  // Close popup when clicking outside of inner content
  document.querySelectorAll(".filter-container").forEach((container) => {
    container.addEventListener("click", function (e) {
      if (e.target === this) {
        this.style.display = "none";
        document.body.style.overflowY = "scroll";
      }
    });
  });

  addEventListenerForFilters();

  document.getElementById("report").addEventListener("click", function () {
    // Create an anchor element
    var link = document.createElement("a");
    link.href = "assets/report.pdf"; // Path to your PDF in the assets folder
    link.download = "report.pdf"; // Name of the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });


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
        console.log(allData);
        plot_pie(allData, "pie-company", 3);
        plot_pie(allData, "pie-thru", 5);
        plot_pie(allData, "pie-type", 6);
        plot_pie(allData, "pie-location", 7);
        plot_pie_stipend(allData, "pie-stipend", 4);
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
      row.slice(0, 10).forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      const td = document.createElement("td");
      const button = document.createElement("button");
      button.className = "edit-btn";
      button.innerHTML = "<i class='fa fa-pencil'>";
      button.style.outline = "none";
      button.style.border = "none";
      button.style.background = "transparent";
      button.style.marginLeft = "10px";
      button.style.fontSize = "18px ";
      const edit_after = document.createElement("span");
      edit_after.textContent = "Edit";
      edit_after.style.fontFamily = "Inter";
      td.style.display = "flex";
      td.style.alignItems = "center";
      // td.style.justifyContent = "center";
      td.style.alignContent = "center";
      td.style.gap = "10px";
      td.style.cursor = "pointer";

      td.addEventListener("click", editUser());

      td.appendChild(button);
      td.appendChild(edit_after);
      tr.appendChild(td);
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

function plot_pie(data, pie_chart, index) {
  var pieCanvas = document.getElementById(pie_chart);
  var pie = pieCanvas.getContext("2d");

  // Extract unique labels and their counts from the given index
  var counts = {};
  data.forEach((item) => {
    var label = item[index];
    counts[label] = (counts[label] || 0) + 1;
  });

  var labels = Object.keys(counts);
  var values = Object.values(counts);

  var backgroundColors = [
    "#ff6384",
    "#36a2eb",
    "#ffcd56",
    "#4bc0c0",
    "#9966ff",
    "#ff9f40",
  ];

  // Destroy existing chart instance if it exists
  if (pieCanvas.chartInstance) {
    pieCanvas.chartInstance.destroy();
  }

  // Create the Pie Chart
  pieCanvas.chartInstance = new Chart(pie, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors.slice(0, labels.length),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow full control over size

      plugins: {
        legend: {
          position: "left", // Keep the legend separate
        },
      },
    },
  });
}

function plot_pie_stipend(allData, canvasId, stipendColumnIndex) {
  let stipendRanges = {
    "Less than 15K": 0,
    "15K - 30K": 0,
    "30K - 50K": 0,
    "50K - 75K": 0,
    "75K - 1L": 0,
    "More than 1L": 0,
  };

  allData.forEach((row) => {
    let stipend = row[stipendColumnIndex].replace(/[^0-9]/g, "");
    stipend = parseInt(stipend, 10);

    if (!isNaN(stipend)) {
      if (stipend < 15000) stipendRanges["Less than 15K"]++;
      else if (stipend < 30000) stipendRanges["15K - 30K"]++;
      else if (stipend < 50000) stipendRanges["30K - 50K"]++;
      else if (stipend < 75000) stipendRanges["50K - 75K"]++;
      else if (stipend < 100000) stipendRanges["75K - 1L"]++;
      else stipendRanges["More than 1L"]++;
    }
  });

  const labels = Object.keys(stipendRanges);
  const data = Object.values(stipendRanges);
  const colors = [
    "#ff6384",
    "#36a2eb",
    "#ffcd56",
    "#4bc0c0",
    "#9966ff",
    "#ff9f40",
  ];

  var ctxCanvas = document.getElementById(canvasId);
  var ctx = ctxCanvas.getContext("2d");

  // Destroy existing chart instance if it exists
  if (ctxCanvas.chartInstance) {
    ctxCanvas.chartInstance.destroy();
  }

  // Create Pie Chart
  ctxCanvas.chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow full control over size

      plugins: {
        legend: {
          position: "left", // Keep the legend separate
        },
      },
    },
  });
}

function editUser() {}
