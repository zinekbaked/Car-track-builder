const SIZE = 20;
const TILE_CLASSES = ["grass", "road", "water"];
const TILE_NAMES = ["Tráva", "Cesta", "Voda"];
const STORAGE_KEY = "ctb_maps";

let currentMapName = null;
let mapData = createEmptyMap();
let selectedTile = 0;

const menuView = document.getElementById("menuView");
const editorView = document.getElementById("editorView");
const viewHint = document.getElementById("viewHint");

const gridEl = document.getElementById("grid");
const currentNameEl = document.getElementById("currentName");

const savedSelect = document.getElementById("savedSelect");
const ioArea = document.getElementById("ioArea");

const brushNameEl = document.getElementById("brushName");
const brushButtons = document.querySelectorAll(".brush");

document.getElementById("btnNew").addEventListener("click", newMap);
document.getElementById("btnLoad").addEventListener("click", loadSelected);
document.getElementById("btnDelete").addEventListener("click", deleteSelected);

document.getElementById("btnExport").addEventListener("click", exportSelected);
document.getElementById("btnImport").addEventListener("click", importFromTextarea);

document.getElementById("btnBack").addEventListener("click", showMenu);
document.getElementById("btnSave").addEventListener("click", saveCurrent);
document.getElementById("btnClear").addEventListener("click", clearCurrent);

brushButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedTile = Number(btn.dataset.tile);
    brushNameEl.textContent = TILE_NAMES[selectedTile];
  });
});

refreshSavedSelect();
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
  refreshSavedSelect();
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
  if (!confirm("Opravdu vymazat celou mapu")) return;
  mapData = createEmptyMap();
  renderGrid();
}

function getAllMaps() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  return JSON.parse(raw);
}

function setAllMaps(mapsObj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mapsObj));
}

function refreshSavedSelect() {
  const maps = getAllMaps();
  const names = Object.keys(maps);

  savedSelect.innerHTML = "";
  if (names.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "(žádné uložené mapy)";
    savedSelect.appendChild(opt);
    return;
  }

  for (const n of names) {
    const opt = document.createElement("option");
    opt.value = n;
    opt.textContent = n;
    savedSelect.appendChild(opt);
  }
}

function saveCurrent() {
  if (!currentMapName) {
    alert("Nemáš název mapy");
    return;
  }

  const maps = getAllMaps();
  maps[currentMapName] = { name: currentMapName, size: SIZE, data: mapData };
  setAllMaps(maps);

  alert("Uloženo!");
}

function loadSelected() {
  const name = savedSelect.value;
  if (!name) return;

  const maps = getAllMaps();
  const item = maps[name];
  if (!item) return;

  currentMapName = item.name;
  mapData = item.data;
  showEditor();
}

function deleteSelected() {
  const name = savedSelect.value;
  if (!name) return;
  if (!confirm(`Smazat mapu '${name}'?`)) return;

  const maps = getAllMaps();
  delete maps[name];
  setAllMaps(maps);
  refreshSavedSelect();
}

function exportSelected() {
  const name = savedSelect.value;
  if (!name) return alert("Vyber mapu v menu.");

  const maps = getAllMaps();
  ioArea.value = JSON.stringify(maps[name], null, 2);
}

function importFromTextarea() {
  const text = ioArea.value.trim();
  if (!text) return alert("Vlož JSON do textarea");

  try {
    const obj = JSON.parse(text);

    if (!obj.name || !obj.data) {
      alert("JSON nevypadá jako export mapy");
      return;
    }

    const maps = getAllMaps();
    maps[obj.name] = obj;
    setAllMaps(maps);

    alert("Import hotový");
    refreshSavedSelect();
  } catch {
    alert("Špatný JSON");
  }
}