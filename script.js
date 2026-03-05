const SIZE = 20;
const TILE_CLASSES = ["grass", "road", "water"];
const TILE_NAMES = ["Tráva", "Cesta", "Voda"];

let currentMapName = null;
let mapData = createEmptyMap();
let selectedTile = 0; 

const menuView = document.getElementById("menuView");
const editorView = document.getElementById("editorView");
const viewHint = document.getElementById("viewHint");

const gridEl = document.getElementById("grid");
const currentNameEl = document.getElementById("currentName");

const brushNameEl = document.getElementById("brushName");
const brushButtons = document.querySelectorAll(".brush");

document.getElementById("btnNew").addEventListener("click", newMap);
document.getElementById("btnBack").addEventListener("click", showMenu);
document.getElementById("btnClear").addEventListener("click", clearCurrent);

document.getElementById("btnSave").addEventListener("click", () => alert("Ukládání bude až potom"));
document.getElementById("btnLoad").addEventListener("click", () => alert("Načítání bude až potom"));
document.getElementById("btnDelete").addEventListener("click", () => alert("Mazání bude až potom"));
document.getElementById("btnExport").addEventListener("click", () => alert("Export bude až potom"));
document.getElementById("btnImport").addEventListener("click", () => alert("Import bude až potom"));

brushButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedTile = Number(btn.dataset.tile);
    brushNameEl.textContent = TILE_NAMES[selectedTile];
  });
});

buildGrid();
renderGrid();
showMenu();

function createEmptyMap() {
  const arr = [];
  for (let y = 0; y < SIZE; y++) {
    const row = [];
    for (let x = 0; x < SIZE; x++) row.push(0);
    arr.push(row);
  }
  return arr;
}

function buildGrid() {
  gridEl.innerHTML = "";

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.className = "cell grass";
      cell.dataset.x = x;
      cell.dataset.y = y;

      cell.addEventListener("click", () => {
        const cx = Number(cell.dataset.x);
        const cy = Number(cell.dataset.y);

        mapData[cy][cx] = selectedTile;
        renderCell(cell, selectedTile);
      });

      gridEl.appendChild(cell);
    }
  }
}

function renderGrid() {
  const cells = gridEl.querySelectorAll(".cell");
  let i = 0;

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      renderCell(cells[i], mapData[y][x]);
      i++;
    }
  }
}

function renderCell(cell, tileValue) {
  cell.classList.remove("grass", "road", "water");
  cell.classList.add(TILE_CLASSES[tileValue]);
}

function showMenu() {
  menuView.classList.remove("hidden");
  editorView.classList.add("hidden");
  viewHint.textContent = "Menu";
}

function showEditor() {
  menuView.classList.add("hidden");
  editorView.classList.remove("hidden");
  viewHint.textContent = "Editor";
  currentNameEl.textContent = currentMapName || "---";
  renderGrid();
}

function newMap() {
  const name = prompt("Název mapy:");
  if (!name) return;

  currentMapName = name;
  mapData = createEmptyMap();
  showEditor();
}

function clearCurrent() {
  if (!confirm("Opravdu vymazat celou mapu?")) return;
  mapData = createEmptyMap();
  renderGrid();
}