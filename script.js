// 1. Display Today's Date in Western Armenian
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById("date-display").innerText = new Date().toLocaleDateString('hy-AM', dateOptions);

// 2. Daily Puzzles Dictionary (Keyed by YYYY-MM-DD)
const dailyPuzzles = {
  "2026-09-01": [
    { category: "Պտուղներ (Fruits)", words: ["Խնձոր", "Տանձ", "Ելակ", "Կեռաս"], level: 0 },
    { category: "Գոյներ (Colors)", words: ["Կարմիր", "Կապոյտ", "Կանաչ", "Դեղին"], level: 1 },
    { category: "Քաղաքներ (Cities)", words: ["Երեւան", "Գիւմրի", "Պէյրութ", "Պոլիս"], level: 2 },
    { category: "Կենդանիներ (Animals)", words: ["Շուն", "Կատու", "Արջ", "Աղուէս"], level: 3 }
  ],
  "2026-09-02": [
    { category: "Ուտելիքներ (Foods)", words: ["Հաց", "Պանիր", "Միս", "Ապուր"], level: 0 },
    { category: "Օրեր (Days)", words: ["Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի"], level: 1 },
    { category: "Ծառեր (Trees)", words: ["Կաղնի", "Հացի", "Նոճի", "Բարդի"], level: 2 },
    { category: "Զգեստներ (Clothes)", words: ["Շապիկ", "Տաբատ", "Վերարկու", "Գուլպայ"], level: 3 }
  ]
};

// 3. Automatically Load Today's Puzzle
const todayKey = new Date().toISOString().split('T')[0];
// Fallback to day 1 if date doesn't exist
const puzzleData = dailyPuzzles[todayKey] || dailyPuzzles["2026-09-01"]; 

let remainingWords = puzzleData.flatMap(item => item.words);
remainingWords.sort(() => Math.random() - 0.5);

let selectedTiles = [];
let mistakesLeft = 4;

const gridElement = document.getElementById("grid");
const submitBtn = document.getElementById("submit-btn");
const deselectBtn = document.getElementById("deselect-btn");
const shuffleBtn = document.getElementById("shuffle-btn");

function renderGrid() {
  gridElement.innerHTML = "";
  remainingWords.forEach(word => {
    const tile = document.createElement("button");
    tile.classList.add("tile");
    tile.innerText = word;

    if (selectedTiles.includes(word)) {
      tile.classList.add("selected");
    }

    tile.addEventListener("click", () => handleSelect(word));
    gridElement.appendChild(tile);
  });

  submitBtn.disabled = selectedTiles.length !== 4;
}

function handleSelect(word) {
  if (selectedTiles.includes(word)) {
    selectedTiles = selectedTiles.filter(w => w !== word);
  } else if (selectedTiles.length < 4) {
    selectedTiles.push(word);
  }
  renderGrid();
}

deselectBtn.addEventListener("click", () => {
  selectedTiles = [];
  renderGrid();
});

shuffleBtn.addEventListener("click", () => {
  remainingWords.sort(() => Math.random() - 0.5);
  renderGrid();
});

submitBtn.addEventListener("click", () => {
  if (selectedTiles.length !== 4) return;

  const matchedCategory = puzzleData.find(cat => 
    selectedTiles.every(word => cat.words.includes(word))
  );

  if (matchedCategory) {
    const solvedContainer = document.getElementById("solved-container");
    const categoryBox = document.createElement("div");
    categoryBox.classList.add("solved-category", "cat-" + matchedCategory.level);
    categoryBox.innerHTML = "<h3>" + matchedCategory.category + "</h3><p>" + matchedCategory.words.join(", ") + "</p>";
    solvedContainer.appendChild(categoryBox);

    remainingWords = remainingWords.filter(word => !selectedTiles.includes(word));
    selectedTiles = [];
    renderGrid();

    if (remainingWords.length === 0) {
      setTimeout(() => alert("Շնորհաւոր ըլլայ: (Congratulations! You won!)"), 200);
    }
  } else {
    mistakesLeft--;
    const dots = document.querySelectorAll(".dot");
    if (dots[mistakesLeft]) {
      dots[mistakesLeft].classList.add("lost");
    }

    gridElement.classList.add("shake");
    setTimeout(() => gridElement.classList.remove("shake"), 300);

    if (mistakesLeft === 0) {
      setTimeout(() => alert("Խաղը աւարտեցաւ: (Game Over!)"), 200);
      submitBtn.disabled = true;
    }
  }
});

renderGrid();