let timer;
let millisecond = 0,
    seconds = 0,
    minutes = 0,
    hours = 0;
let isRunning = false;
let laps = [];

// Play sound utility
function playSound(id) {
    const sound = document.getElementById(id);
    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
}

// Animate flip for each time unit
function animateFlip(element, newValue) {
    if (element.innerText !== newValue) {
        element.classList.add("flip");
        setTimeout(() => {
            element.innerText = newValue;
            element.classList.remove("flip");
        }, 150);
    }
}

// Update stopwatch display
function updateDisplay() {
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = millisecond < 10 ? "0" + millisecond : millisecond;

    animateFlip(document.getElementById("hours"), h);
    animateFlip(document.getElementById("minutes"), m);
    animateFlip(document.getElementById("seconds"), s);
    animateFlip(document.getElementById("milliseconds"), ms);
}

// Start stopwatch
function start() {
    if (!isRunning) {
        playSound("clickSound");
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
    playSound("clickSound");
    clearInterval(timer);
    isRunning = false;
}

// Reset stopwatch
function reset() {
    playSound("clickSound");
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
        playSound("beepSound");
        let totalMs = hours * 3600000 + minutes * 60000 + seconds * 1000 + millisecond * 10;
        let lapTime = {
            text: `${hours < 10 ? "0" + hours : hours}:${
                minutes < 10 ? "0" + minutes : minutes
            }:${seconds < 10 ? "0" + seconds : seconds}:${
                millisecond < 10 ? "0" + millisecond : millisecond
            }`,
            totalMs: totalMs
        };
        laps.push(lapTime);
        renderLaps();
        showMessage("Lap recorded!", "success");
    }
}

// Render laps with sorting and highlights
function renderLaps() {
    const sortSelect = document.getElementById("sortLaps");
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

// Handle lap sorting change
document.getElementById("sortLaps").addEventListener("change", renderLaps);

// Dark/light theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeToggle.textContent = document.body.classList.contains("dark-theme")
        ? "🌞 Light"
        : "🌙 Dark";
});

// Download laps as CSV
document.getElementById("downloadLaps").addEventListener("click", () => {
    if (laps.length === 0) return showMessage("No laps recorded!", "error");
    let csvContent = "data:text/csv;charset=utf-8,Lap,Time\n";
    laps.forEach((lap, index) => {
        csvContent += `${index + 1},${lap.text}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laps.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage("Laps downloaded!", "success");
});

// Copy laps to clipboard with message
document.getElementById("copyLaps").addEventListener("click", () => {
    if (laps.length === 0) return showMessage("No laps to copy!", "error");

    let text = laps.map((lap, i) => `Lap ${i + 1}: ${lap.text}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
        showMessage("Laps copied to clipboard!", "success");
    });
});

// Function to show temporary toast messages
function showMessage(msg, type) {
    let messageDiv = document.createElement("div");
    messageDiv.className = `toast ${type}`;
    messageDiv.innerText = msg;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.classList.add("fade-out");
    }, 2000); // show for 2 seconds

    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 2500); // remove after fade
}

// Initialize display on page load
updateDisplay();
