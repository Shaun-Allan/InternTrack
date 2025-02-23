function initialize() {
    const uploadBoxes = document.querySelectorAll(".upload-box");
  
    uploadBoxes.forEach((uploadBox) => {
      const fileInput = uploadBox.querySelector("input[type='file']");
      const uploadText = uploadBox.querySelector(".upload-text");
  
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
    });
  }
  
  function logout() {
    window.location.href = "../index.html";
  }
  
  