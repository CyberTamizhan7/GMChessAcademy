function buildLeaderboard(races) {

  const players = {};

  races.forEach((race) => {

    Object.keys(race).forEach((round) => {

      const roundData = race[round];

      Object.keys(roundData).forEach((name) => {

        if (name.toLowerCase().includes("unknown")) {
          return;
        }

        if (!players[name]) {
          players[name] = {
            total: 0,
            rounds: 0,
            raceSet: new Set()
          };
        }

        // total score
        players[name].total += roundData[name];

        // rounds attended
        players[name].rounds += 1;

        // track race participation (unique per race)
        players[name].raceSet.add(race);

      });

    });

  });

  // Convert to array
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

  // Sort descending by total score
  result.sort((a, b) => b.total - a.total);

  return result;
}

const races = [
  window.race1, window.race2, window.race3, window.race4, window.race5, 
  window.race6, window.race7, window.race8, window.race9, window.race10,
  window.race11, window.race12, window.race13, window.race14, window.race15,
  window.race16, window.race17, window.race18, window.race19, window.race20,
  window.race21, window.race22, window.race23, window.race24, window.race25,
  window.race26, window.race27, window.race28, window.race29, window.race30,
  window.race31, window.race32, window.race33, window.race34, window.race35,
  window.race36, window.race37, window.race38, window.race39, window.race40,
  window.race41, window.race42, window  .race43, window.race44, window.race45,
  window.race46, window.race47, window.race48, window.race49, window.race50,
  window.race51, window.race52, window.race53, window.race54, window.race55,
  window.race56, window.race57, window.race58
];

function renderTable(data) {

  const tbody = document.getElementById("leaderboard-body");

  tbody.innerHTML = "";

  data.forEach((p, index) => {

    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${p.name}</td>
        <td>${p.total}</td>
        <td>${p.raceAttended}</td>
        <td>${p.avg}</td>
      </tr>
    `;

    tbody.innerHTML += row;

  });

}

// RUN
const leaderboard = buildLeaderboard(races);
renderTable(leaderboard);

let sortDirection = {}; // remembers asc/desc per column

document.querySelectorAll("thead th").forEach(th => {
  th.style.cursor = "pointer";

  th.addEventListener("click", () => {
    const key = th.dataset.key;
    if (!key) return;

    sortDirection[key] = !sortDirection[key]; // toggle

    sortTable(key, sortDirection[key]);
  });
});

function sortTable(key, asc = true) {
  const tbody = document.getElementById("leaderboard-body");
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

        default:
          return 0;
      }
    };

    let valA = getVal(a);
    let valB = getVal(b);

    if (typeof valA === "string") {
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    return asc ? valA - valB : valB - valA;
  });

  // reattach rows
  rows.forEach(row => tbody.appendChild(row));

  // 🔥 FIX SNo after sorting (DO NOT SORT IT)
  rows.forEach((row, index) => {
    row.querySelector("td").innerText = index + 1;
  });
}