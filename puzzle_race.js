/* =========================
   1. CONSTANTS / HELPERS
========================= */

const MAX_RACE = 60;


/* =========================
   2. RACE DATA FETCHER
========================= */

function getRaces(start, end) {
  const list = [];

  for (let i = start; i <= end; i++) {
    if (window["race" + i]) {
      list.push(window["race" + i]);
    }
  }

  return list;
}


/* =========================
   3. LEADERBOARD BUILDER
========================= */

function buildLeaderboard(races) {

  const players = {};

  races.forEach((race) => {

    Object.keys(race).forEach((round) => {

      const roundData = race[round];

      Object.keys(roundData).forEach((name) => {

        if (name.toLowerCase().includes("unknown")) return;

        if (!players[name]) {
          players[name] = {
            total: 0,
            rounds: 0,
            raceSet: new Set()
          };
        }

        players[name].total += roundData[name];
        players[name].rounds += 1;
        players[name].raceSet.add(race);

      });

    });

  });

  const result = Object.keys(players).map((name) => {
    const p = players[name];

    return {
      name,
      total: p.total,
      raceAttended: p.raceSet.size,
      roundsAttended: p.rounds,
      avg: (p.total / p.rounds).toFixed(2)
    };

  });

  result.sort((a, b) => b.total - a.total);

  return result;
}


/* =========================
   4. INPUT VALIDATION
========================= */

function getSafeRange() {

  let start = parseInt(document.getElementById("startRace")?.value || 1);
  let end = parseInt(document.getElementById("endRace")?.value || MAX_RACE);

  if (isNaN(start)) start = 1;
  if (isNaN(end)) end = MAX_RACE;

  start = Math.max(1, Math.min(start, MAX_RACE));
  end = Math.max(1, Math.min(end, MAX_RACE));

  if (end < start) end = start;

  return { start, end };
}


/* =========================
   5. CORE UPDATE FUNCTION
========================= */

function updateLeaderboard(start = 1, end = MAX_RACE, search = "") {

  const races = getRaces(start, end);
  let leaderboard = buildLeaderboard(races);

  // Use passed search parameter or get from input
  const searchInput = document.getElementById("searchName");
  const actualSearch = search || (searchInput ? searchInput.value : "");

  if (actualSearch) {
    leaderboard = leaderboard.filter(p =>
      p.name.toLowerCase().includes(actualSearch.toLowerCase())
    );
  }

  renderTable(leaderboard);
}


/* =========================
   6. RENDER TABLE
========================= */

function renderTable(data) {

  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) {
    console.error("leaderboard-body element not found!");
    return;
  }
  
  tbody.innerHTML = "";

  data.forEach((p, index) => {

    let rankCell = "";

    if (index === 0) {
      rankCell = "🥇";
    } else if (index === 1) {
      rankCell = "🥈";
    } else if (index === 2) {
      rankCell = "🥉";
    } else {
      rankCell = index + 1;
    }

    let rankClass = "";

    if (index === 0) rankClass = "gold";
    else if (index === 1) rankClass = "silver";
    else if (index === 2) rankClass = "bronze";

    const row = `
      <tr class="${rankClass}">
        <td>${rankCell}</td>
        <td>${p.name}</td>
        <td>${p.total}</td>
        <td>${p.raceAttended}</td>
        <td>${p.avg}</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });

}


/* =========================
   7. SORTING
========================= */

let sortDirection = {};

function initializeSorting() {
  document.querySelectorAll("thead th").forEach(th => {

    th.style.cursor = "pointer";

    th.addEventListener("click", () => {

      const key = th.dataset.key;
      if (!key) return;

      sortDirection[key] = !sortDirection[key];

      sortTable(key, sortDirection[key]);
    });

  });
}

function sortTable(key, asc = true) {

  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;
  
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {

    const getVal = (row) => {
      const cells = row.querySelectorAll("td");

      switch (key) {
        case "name":
          return cells[1].innerText.toLowerCase();
        case "total":
          return parseFloat(cells[2].innerText) || 0;
        case "attended":
          return parseInt(cells[3].innerText) || 0;
        case "average":
          return parseFloat(cells[4].innerText) || 0;
      }
    };

    let valA = getVal(a);
    let valB = getVal(b);

    if (typeof valA === "string") {
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    return asc ? valA - valB : valB - valA;
  });

  rows.forEach(row => tbody.appendChild(row));

  rows.forEach((row, index) => {

    const cell = row.querySelector("td");

    if (index === 0) cell.innerText = "🥇";
    else if (index === 1) cell.innerText = "🥈";
    else if (index === 2) cell.innerText = "🥉";
    else cell.innerText = index + 1;
  });
}


/* =========================
   8. EVENTS & INITIALIZATION
========================= */

document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM loaded - initializing puzzle race...");

  // Initialize sorting
  initializeSorting();

  // enter key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const { start, end } = getSafeRange();
      const search = document.getElementById("searchName")?.value || "";
      updateLeaderboard(start, end, search);
    }
  });

  // live input update
  const inputElements = document.querySelectorAll("#startRace, #endRace, #searchName");
  console.log("Found input elements:", inputElements.length);
  
  inputElements.forEach(el => {
    el.addEventListener("input", () => {
      const { start, end } = getSafeRange();
      const search = document.getElementById("searchName")?.value || "";
      updateLeaderboard(start, end, search);
    });
  });

  // enforce limits visually
  document.querySelectorAll("#startRace, #endRace")
    .forEach(el => {
      el.addEventListener("input", () => {
        let { start, end } = getSafeRange();
        const startInput = document.getElementById("startRace");
        const endInput = document.getElementById("endRace");
        
        if (startInput) startInput.value = start;
        if (endInput) endInput.value = end;
      });
    });

  // Initial render
  updateLeaderboard(1, MAX_RACE, "");
  
  console.log("Puzzle race initialized successfully!");

});