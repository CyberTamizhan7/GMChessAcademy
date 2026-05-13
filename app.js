document.addEventListener("DOMContentLoaded", () => {

  fetch("components/sidebar.html")
    .then(res => res.text())
    .then(data => {

      document.getElementById("sidebar-container").innerHTML = data;

      const menuToggle = document.getElementById("menuToggle");
      const sidebar    = document.getElementById("sidebar");
      const overlay    = document.getElementById("overlay");

      if (!menuToggle || !sidebar || !overlay) return;

      function openSidebar() {
        sidebar.classList.add("active");
        overlay.classList.add("active");
      }

      function closeSidebar() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
      }

      function toggleSidebar() {
        sidebar.classList.contains("active") ? closeSidebar() : openSidebar();
      }

      // Toggle button
      menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSidebar();
      });

      // ✅ Overlay click closes sidebar
      overlay.addEventListener("click", closeSidebar);

      // Prevent clicks inside sidebar from bubbling to overlay
      sidebar.addEventListener("click", (e) => e.stopPropagation());

      // Close when a menu link is clicked
      document.querySelectorAll(".menu a").forEach(link => {
        link.addEventListener("click", closeSidebar);
      });

    })
    .catch(err => console.error("Sidebar load error:", err));

});