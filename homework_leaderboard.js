const tbody = document.getElementById("leaderboard-body");
const nameInput = document.getElementById("searchName");
const branchInput = document.getElementById("searchBranch");

let currentData = [...leaderboardData];

let sortDirection = {
  name: "asc",
  total: "desc"
};

function renderLeaderboard(data) {
  tbody.innerHTML = "";

  data.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.total}</td>
      <td>${student.branch}</td>
    `;

    tbody.appendChild(row);
  });
}

function sortTable(key) {

  const direction = sortDirection[key];

  currentData.sort((a, b) => {

    if (key === "name" || key === "branch") {

      return direction === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);

    } 

    else {

      return direction === "asc"
        ? a.total - b.total
        : b.total - a.total;
    }
  });

  sortDirection[key] =
    direction === "asc" ? "desc" : "asc";

  renderLeaderboard(currentData);
}

// Initial Sort (highest score first)
currentData.sort((a, b) => b.total - a.total);
renderLeaderboard(currentData);

// Search
nameInput.addEventListener("input", () => {

  const keyword = nameInput.value.toLowerCase();

  const filtered = currentData.filter(student =>
    student.name.toLowerCase().includes(keyword)
  );

  renderLeaderboard(filtered);
});

branchInput.addEventListener("input", () => {

  const keyword = branchInput.value.toLowerCase();

  const filtered = currentData.filter(student =>
    student.branch.toLowerCase().includes(keyword)
  );

  renderLeaderboard(filtered);
});

// Clickable Headers
document.querySelectorAll("th[data-key]").forEach(th => {

  th.style.cursor = "pointer";

  th.addEventListener("click", () => {

    const key = th.dataset.key;

    if (key === "name" || key === "total" || key === "branch") {
      sortTable(key);
    }

  });

});