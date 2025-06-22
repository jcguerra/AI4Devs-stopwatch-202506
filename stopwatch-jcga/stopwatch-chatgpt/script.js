// script.js

// Screen selectors
const homeScreen = document.getElementById("home-screen");
const stopwatchScreen = document.getElementById("stopwatch-screen");
const countdownScreen = document.getElementById("countdown-screen");

// Stopwatch display
const swDisplay = document.getElementById("stopwatch-display");
const swMs = document.getElementById("stopwatch-ms");

// Countdown display
const cdDisplay = document.getElementById("countdown-display");
const cdMs = document.getElementById("countdown-ms");

// UI transitions
function showScreen(screen) {
  homeScreen.classList.add("hidden");
  stopwatchScreen.classList.add("hidden");
  countdownScreen.classList.add("hidden");
  screen.classList.remove("hidden");
  console.log(`Switched to ${screen.id}`);
}

// Navigation events
stopwatchSelect.onclick = () => showScreen(stopwatchScreen);
countdownSelect.onclick = () => showScreen(countdownScreen);
backFromStopwatch.onclick = () => showScreen(homeScreen);
backFromCountdown.onclick = () => showScreen(homeScreen);

// Shared utility
function formatTime(ms) {
  const milliseconds = ms % 1000;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, "0");
  return {
    time: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    ms: `.${String(milliseconds).padStart(3, "0")}`,
  };
}

/**
 * Stopwatch Logic
 */
let swInterval, swStart, swElapsed = 0;
const swStartBtn = document.getElementById("stopwatch-start");
const swPauseBtn = document.getElementById("stopwatch-pause");
const swContBtn = document.getElementById("stopwatch-continue");
const swClearBtn = document.getElementById("stopwatch-clear");

function updateStopwatch() {
  const now = Date.now();
  const elapsed = now - swStart + swElapsed;
  const { time, ms } = formatTime(elapsed);
  swDisplay.textContent = time;
  swMs.textContent = ms;
}

swStartBtn.onclick = () => {
  swStart = Date.now();
  swInterval = setInterval(updateStopwatch, 50);
  swStartBtn.classList.add("hidden");
  swPauseBtn.classList.remove("hidden");
  console.log("Stopwatch started");
};

swPauseBtn.onclick = () => {
  clearInterval(swInterval);
  swElapsed += Date.now() - swStart;
  swPauseBtn.classList.add("hidden");
  swContBtn.classList.remove("hidden");
  console.log("Stopwatch paused");
};

swContBtn.onclick = () => {
  swStart = Date.now();
  swInterval = setInterval(updateStopwatch, 50);
  swContBtn.classList.add("hidden");
  swPauseBtn.classList.remove("hidden");
  console.log("Stopwatch resumed");
};

swClearBtn.onclick = () => {
  clearInterval(swInterval);
  swDisplay.textContent = "00:00:00";
  swMs.textContent = ".000";
  swElapsed = 0;
  swStartBtn.classList.remove("hidden");
  swPauseBtn.classList.add("hidden");
  swContBtn.classList.add("hidden");
  console.log("Stopwatch cleared");
};

/**
 * Countdown Logic
 */
let cdDigits = "";
let cdMilliseconds = 0;
let cdInterval, cdEnd;

const cdSetBtn = document.getElementById("countdown-set");
const cdClearInputBtn = document.getElementById("countdown-clear-input");
const cdStartBtn = document.getElementById("countdown-start");
const cdPauseBtn = document.getElementById("countdown-pause");
const cdContBtn = document.getElementById("countdown-continue");
const cdClearBtn = document.getElementById("countdown-clear");
const cdControls = document.getElementById("countdown-controls");
const cdInputControls = document.getElementById("countdown-input-controls");

// Generate buttons 0-9
for (let i = 0; i <= 9; i++) {
  const btn = document.createElement("button");
  btn.className = "bg-gray-300 text-xl p-2 rounded";
  btn.textContent = i;
  btn.onclick = () => {
    if (cdDigits.length >= 6) return;
    cdDigits += i;
    updateCountdownDisplay();
    console.log("Digit entered:", i);
  };
  cdInputControls.appendChild(btn);
}

function updateCountdownDisplay() {
  const padded = cdDigits.padStart(6, "0");
  const hours = padded.slice(0, 2);
  const minutes = padded.slice(2, 4);
  const seconds = padded.slice(4, 6);
  cdDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  cdMs.textContent = ".000";
}

function getCountdownMilliseconds() {
  const padded = cdDigits.padStart(6, "0");
  const h = parseInt(padded.slice(0, 2), 10);
  const m = parseInt(padded.slice(2, 4), 10);
  const s = parseInt(padded.slice(4, 6), 10);
  return ((h * 3600 + m * 60 + s) * 1000);
}

cdSetBtn.onclick = () => {
  cdMilliseconds = getCountdownMilliseconds();
  if (cdMilliseconds === 0) return alert("Set a valid time.");
  cdInputControls.classList.add("hidden");
  cdSetBtn.classList.add("hidden");
  cdClearInputBtn.classList.add("hidden");
  cdControls.classList.remove("hidden");
  console.log("Countdown set:", cdMilliseconds);
};

function runCountdown() {
  const now = Date.now();
  const remaining = Math.max(0, cdEnd - now);
  const { time, ms } = formatTime(remaining);
  cdDisplay.textContent = time;
  cdMs.textContent = ms;
  if (remaining <= 0) {
    clearInterval(cdInterval);
    alert("Time's up!");
    console.log("Countdown expired");
  }
}

cdStartBtn.onclick = () => {
  cdEnd = Date.now() + cdMilliseconds;
  cdInterval = setInterval(runCountdown, 50);
  cdStartBtn.classList.add("hidden");
  cdPauseBtn.classList.remove("hidden");
  console.log("Countdown started");
};

cdPauseBtn.onclick = () => {
  clearInterval(cdInterval);
  cdMilliseconds = Math.max(0, cdEnd - Date.now());
  cdPauseBtn.classList.add("hidden");
  cdContBtn.classList.remove("hidden");
  console.log("Countdown paused");
};

cdContBtn.onclick = () => {
  cdEnd = Date.now() + cdMilliseconds;
  cdInterval = setInterval(runCountdown, 50);
  cdContBtn.classList.add("hidden");
  cdPauseBtn.classList.remove("hidden");
  console.log("Countdown resumed");
};

cdClearBtn.onclick = () => {
  clearInterval(cdInterval);
  cdDigits = "";
  cdMilliseconds = 0;
  cdDisplay.textContent = "00:00:00";
  cdMs.textContent = ".000";
  cdControls.classList.add("hidden");
  cdInputControls.classList.remove("hidden");
  cdSetBtn.classList.remove("hidden");
  cdClearInputBtn.classList.remove("hidden");
  cdStartBtn.classList.remove("hidden");
  cdPauseBtn.classList.add("hidden");
  cdContBtn.classList.add("hidden");
  console.log("Countdown cleared");
};

cdClearInputBtn.onclick = () => {
  cdDigits = "";
  updateCountdownDisplay();
  console.log("Countdown input cleared");
};

// Ensure all elements are selected before use
const stopwatchSelect = document.getElementById("stopwatch-select");
const countdownSelect = document.getElementById("countdown-select");
const backFromStopwatch = document.getElementById("back-from-stopwatch");
const backFromCountdown = document.getElementById("back-from-countdown");

// Now ensure the showScreen function is defined
function showScreen(screen) {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("stopwatch-screen").classList.add("hidden");
  document.getElementById("countdown-screen").classList.add("hidden");
  screen.classList.remove("hidden");
  console.log(`Switched to ${screen.id}`);
}

// Assign event listeners after DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  stopwatchSelect.onclick = () => showScreen(document.getElementById("stopwatch-screen"));
  countdownSelect.onclick = () => showScreen(document.getElementById("countdown-screen"));
  backFromStopwatch.onclick = () => showScreen(document.getElementById("home-screen"));
  backFromCountdown.onclick = () => showScreen(document.getElementById("home-screen"));
});
