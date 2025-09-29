let timer;
let millisecond = 0, seconds =0, minutes=0, hours =0;
let isRunning = false;

function updateDisplay(){
    let display = document.getElementById("display");
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = millisecond < 10 ? "0" + millisecond : millisecond;

    display.innerText = `${h}:${m}:${s}:${ms}`;
}

function start(){
    if(!isRunning){
        isRunning = true;
        timer = setInterval(() => {
            millisecond++;
            if(millisecond >= 100){
                millisecond = 0;
                seconds++;
                if(second >= 60){
                    seconds = 0;
                    minutes++;
                    if(minutes >= 60){
                        minutes = 0;
                        hours++;
                    }
                }
            }
            updateDisplay();
        }, 10);
    }
}

function stop(){
    clearInterval(timer);
    isRunning = false;
}

function reset(){
    clearInterval(timer);
    isRunning = false;
    millisecond = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    updateDisplay();
    document.getElementById("laps").innerHTML = "";
}

function lap(){
    if(isRunning){
        let lapTime = document.createElement("li");
        lapTime.innerText = document.getElementById("display").innerText;
        document.getElementById("laps").appendChild(lapTime);

    }
}

updateDisplay();