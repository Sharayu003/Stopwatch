let timer;
let millisecond = 0, seconds = 0, minutes = 0, hours = 0;
let isRunning = false;
let laps = [];

// Update stopwatch display
function updateDisplay() {
    let display = document.getElementById("display");
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = millisecond < 10 ? "0" + millisecond : millisecond;

    display.innerText = `${h}:${m}:${s}:${ms}`;
}

// Start stopwatch
function start() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            millisecond++;
            if (millisecond >= 100) {
                millisecond = 0;
                seconds++;
                if (seconds >= 60) {
                    seconds = 0;
                    minutes++;
                    if (minutes >= 60) {
                        minutes = 0;
                        hours++;
                    }
                }
            }
            updateDisplay();
        }, 10);
    }
}

// Stop stopwatch
function stop() {
    clearInterval(timer);
    isRunning = false;
}

// Reset stopwatch
function reset() {
    clearInterval(timer);
    isRunning = false;
    millisecond = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    laps = [];
    updateDisplay();
    document.getElementById("laps").innerHTML = "";
}

// Add lap
function lap() {
    if (isRunning) {
        let totalMs = hours * 3600000 + minutes * 60000 + seconds * 1000 + millisecond * 10;
        let lapTime = {
            text: document.getElementById("display").innerText,
            totalMs: totalMs
        };
        laps.push(lapTime);
        renderLaps();
    }
}

// Handle lap sorting
const sortSelect = document.getElementById("sortLaps");
sortSelect.addEventListener("change", renderLaps);

// Render laps with highlights
function renderLaps() {
    let sortedLaps = [...laps];

    if (sortSelect.value === "fastest") {
        sortedLaps.sort((a, b) => a.totalMs - b.totalMs);
    } else if (sortSelect.value === "slowest") {
        sortedLaps.sort((a, b) => b.totalMs - a.totalMs);
    }

    const lapsList = document.getElementById("laps");
    lapsList.innerHTML = "";

    if (sortedLaps.length > 0) {
        let fastest = Math.min(...laps.map(l => l.totalMs));
        let slowest = Math.max(...laps.map(l => l.totalMs));

        sortedLaps.forEach((lap, index) => {
            let li = document.createElement("li");
            li.textContent = `Lap ${index + 1}: ${lap.text}`;
            if (lap.totalMs === fastest) li.classList.add("fastest");
            if (lap.totalMs === slowest) li.classList.add("slowest");
            lapsList.appendChild(li);
        });
    }
}

// Dark/light theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeToggle.textContent = document.body.classList.contains("dark-theme") ? "🌞 Light" : "🌙 Dark";
});

// Initialize display
updateDisplay();
