function initialize() {
  var submit = document.querySelector("#submit");
  var form = document.querySelector("form");

  submit.addEventListener("click", (event) => {
    var username = document.querySelector("#username").value;
    var password = document.querySelector("#password").value;
    if (
      (username === "faculty" && password === "faculty") ||
      (username === "student" && password === "student") ||
      (username === "coordinator" && password === "coordinator")
    ) {
      form.action = username + "/" + username + ".html";
    } else {
      event.preventDefault();
    }
  });
}
