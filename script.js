let alarmTime = null;
let alarmInterval = null;
let timerInterval = null;
let alarmSound = null;
let timerTimeLeft = 0;
let is24HourFormat = false; 
let isDarkTheme = false;
let alarmTimeout; 
window.onload = function () {
    setInterval(updateWorldClock, 60000); // Update world clock every minute
};
// Toggle between 12-hour and 24-hour format
function toggleFormat() {
    is24HourFormat = !is24HourFormat;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    isDarkTheme = savedTheme === 'dark';
    if (!isDarkTheme) {
        document.body.classList.add('light-theme');
        document.querySelector(".sidebar").classList.add('light-theme');
        document.querySelector(".content").classList.add('light-theme');
    }
    updateClock();
    updateWorldClock();
    setInterval(updateWorldClock, 60000)
    updateClock();
}
// Load saved theme preference
window.onload = function () {;
};
// Clock: Update the time and the circular animation (clock, timer, and stopwatch)
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    let displayHours = hours;
    let ampm = "";
    if (!is24HourFormat) 
    {
        if (hours >= 12) 
        {
            ampm = "PM";
            displayHours = hours % 12 || 12; 
        } 
        else 
        {
            ampm = "AM";
            displayHours = hours || 12; 
        }
    }
    document.getElementById("hours").textContent = formatTime(displayHours);
    document.getElementById("minutes").textContent = formatTime(minutes);
    document.getElementById("seconds").textContent = formatTime(seconds);
    document.getElementById("ampm").textContent = ampm; 
    updateCircle("#hh", hours, 24);
    updateCircle("#mm", minutes, 60);
    updateCircle("#ss", seconds, 60);
    const dayText = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    document.getElementById("dayText").textContent = dayText[now.getDay()];
}
function formatTime(value) {
    return value < 10 ? "0" + value : value;
}
// Update circular animation based on time
function updateCircle(circleId, value, max) {
    const circle = document.querySelector(circleId);
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / max) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
}
// Set Alarm using Timeout
function setAlarm() {
    let alarmInputValue = document.getElementById('alarmTime').value;
    if (alarmInputValue) {
        let [hours, minutes] = alarmInputValue.split(':').map(num => parseInt(num));
        const now = new Date();
        const alarmDate = new Date(now);
        alarmDate.setHours(hours);
        alarmDate.setMinutes(minutes);
        alarmDate.setSeconds(0);
        alarmDate.setMilliseconds(0);
        if (alarmDate <= now) 
        {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }
        const timeDifference = alarmDate.getTime() - now.getTime();
        clearTimeout(alarmTimeout);
        alarmTimeout = setTimeout(function() {
            playAlarm();
            alert('Alarm Time Reached!');
        }, timeDifference);
        alert('Alarm set for ' + formatDate(alarmDate));
    } 
    else 
    {
        alert('Please set a valid alarm time.');
    }
}
function formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}
function checkAlarm() {
    const now = new Date();
    if (alarmTime) {
        if (
            now.getHours() === alarmTime.getHours() &&
            now.getMinutes() === alarmTime.getMinutes() &&
            now.getSeconds() === alarmTime.getSeconds()
        ) {
            clearInterval(alarmInterval);
            playAlarm();
            alert("Alarm time reached!");
        }
    }
}
// Start Timer
function startTimer() {
    const hours = parseInt(document.getElementById("inputHours").value) || 0;
    const minutes = parseInt(document.getElementById("inputMinutes").value) || 0;
    const seconds = parseInt(document.getElementById("inputSeconds").value) || 0;
    timerTimeLeft = hours * 3600 + minutes * 60 + seconds; 
    if (timerTimeLeft <= 0) {
        alert("Please enter a valid time.");
        return;
    }
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    alert("Timer started!");
}
// Update Timer
function updateTimer() {
    if (timerTimeLeft <= 0) 
        {
        clearInterval(timerInterval);
        playAlarm();
        alert("Timer finished!");
        return;
    }
    timerTimeLeft--;
    const hours = Math.floor(timerTimeLeft / 3600);
    const minutes = Math.floor((timerTimeLeft % 3600) / 60);
    const seconds = timerTimeLeft % 60;
    document.getElementById("timerDisplay").textContent = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
    const totalTime = parseInt(document.getElementById("inputHours").value) * 3600 +
                      parseInt(document.getElementById("inputMinutes").value) * 60 +
                      parseInt(document.getElementById("inputSeconds").value);
    updateCircle("#timerCircle", totalTime - timerTimeLeft, totalTime); 
}
// Pause Timer
function pauseTimer() {
    clearInterval(timerInterval);
    alert("Timer paused.");
}
// Reset Timer
function resetTimer() {
    clearInterval(timerInterval);
    timerTimeLeft = 0;
    document.getElementById("timerDisplay").textContent = "00:00:00";
    document.getElementById("inputHours").value = "";
    document.getElementById("inputMinutes").value = "";
    document.getElementById("inputSeconds").value = "";
    updateCircle("#timerCircle", 0, 1);
    alert("Timer reset.");
}
// Update World Clock
function updateWorldClock() {
    const now = new Date();
    const indiaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    document.getElementById("indiaTime").textContent = indiaTime.toLocaleTimeString();
    const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    document.getElementById("nyTime").textContent = nyTime.toLocaleTimeString();
    const londonTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
    document.getElementById("londonTime").textContent = londonTime.toLocaleTimeString();
    const tokyoTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    document.getElementById("tokyoTime").textContent = tokyoTime.toLocaleTimeString();
}
// Update clock every second
setInterval(updateClock, 1000);
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
        section.classList.remove("active");
    });
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) 
        {
        selectedSection.classList.add("active");
    }
}
function resetAlarm() {
    clearTimeout(alarmTimeout);
    alert('Alarm has been reset.');
    document.getElementById('alarmTime').value = ''; 
}
function formatTime(value) {
    return value < 10 ? "0" + value : value.toString();
}
let stopwatchInterval = null;
let stopwatchStartTime = 0;
let stopwatchElapsed = 0;
let lapCount = 0;
function formatStopwatchTime(ms) {
  const date = new Date(ms);
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
}
function updateStopwatchDisplay() {
  const display = document.getElementById('sw-time'); 
  display.textContent = formatStopwatchTime(stopwatchElapsed);
}
function startStopwatch() {
  if (stopwatchInterval) return;
  stopwatchStartTime = Date.now() - stopwatchElapsed;
  stopwatchInterval = setInterval(() => {
    stopwatchElapsed = Date.now() - stopwatchStartTime;
    updateStopwatchDisplay();
  }, 10);
}
function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}
function resetStopwatch() {
  stopStopwatch();
  stopwatchElapsed = 0;
  lapCount = 0;
  updateStopwatchDisplay();
  document.getElementById('lapList').innerHTML = '';
}