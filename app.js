document.addEventListener("DOMContentLoaded", () => {

  fetch("components/sidebar.html")
    .then(res => res.text())
    .then(data => {

      document.getElementById("sidebar-container").innerHTML = data;

      // ✅ NOW sidebar exists in DOM
      const menuToggle = document.getElementById("menuToggle");
      const sidebar = document.getElementById("sidebar");

      console.log("Sidebar injected");
      console.log(menuToggle, sidebar);

      if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
          console.log("Toggle clicked");
          sidebar.classList.toggle("active");
        });
      }

    })
    .catch(err => console.log("Sidebar load error:", err));

});