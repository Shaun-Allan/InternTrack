function initialize() {
  const uploadBox = document.getElementById("uploadBox");
  const fileInput = document.getElementById("intern-doc");
  const uploadText = document.getElementById("uploadText");

  // Click to upload
  uploadBox.addEventListener("click", () => fileInput.click());

  // Handle file selection
  fileInput.addEventListener("change", (event) => {
    if (event.target.files.length > 0) {
      uploadText.textContent = event.target.files[0].name;
      uploadText.classList.add("file-name");
    }
  });

  // Drag & Drop functionality
  uploadBox.addEventListener("dragover", (event) => {
    event.preventDefault();
    uploadBox.classList.add("drag-over");
  });

  uploadBox.addEventListener("dragleave", () => {
    uploadBox.classList.remove("drag-over");
  });

  uploadBox.addEventListener("drop", (event) => {
    event.preventDefault();
    uploadBox.classList.remove("drag-over");

    if (event.dataTransfer.files.length > 0) {
      fileInput.files = event.dataTransfer.files;
      uploadText.textContent = event.dataTransfer.files[0].name;
      uploadText.classList.add("file-name");
    }
  });

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbw_3K5a0D_ILostm2py5ZG2iQ7KIGcJPHYaFVervjr9bdrAtB3l0DrFtRSfdH0dOBfQ/exec";
  const form = document.querySelector("#intern-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Convert FormData to an Object for logging
    let formData = new FormData(form);
    let formObject = Object.fromEntries(formData.entries());
    console.log("Form Data:", formObject);

    try {
      let response = await fetch(scriptURL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formObject).toString(),
      });

      let result = await response.text();
      console.log("Response from Server:", result);

      alert("Thanks! Your form has been submitted.");
    } catch (error) {
      console.error("Error:", error.message);
    }
  });
}

function logout() {
  window.location.href = "../index.html";
}
