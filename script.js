const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownElBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeElBtn = document.getElementById("complete-button");

let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;

//  Set Date Input Minimum with Today's Date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

// Populate our Countdown / Complete UI
function updateDOM(title, date) {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const countdownValue = new Date(date).getTime();
    const distance = countdownValue - now;

    const days = Math.floor((distance % year) / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // Hide Input
    inputContainer.hidden = true;
    // If the countdown ended, show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${title} finished on ${date}`;
      completeEl.hidden = false;
    } else {
      // Else, show the countdown in progress
      countdownElTitle.textContent = `${title}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, 1000);
}

// Take values from Form Input
function updateCountdown(e) {
  e.preventDefault();
  const countdownTitle = e.srcElement[0].value;
  const countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate
  };
  localStorage.setItem("countdown", JSON.stringify(savedCountdown));

  // Check for valid date
  if (countdownDate === "") {
    alert("Please select a date for the countdown.");
  } else {
    updateDOM(countdownTitle, countdownDate);
  }
}

function restorePreviousCountdown() {
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    const countdownTitle = savedCountdown.title;
    const countdownDate = savedCountdown.date;

    updateDOM(countdownTitle, countdownDate);
  }
}

// Reset All Values
function reset() {
  // Stop the countdown
  clearInterval(countdownActive);
  // Show Input
  inputContainer.hidden = false;
  // Hide Countdown
  countdownEl.hidden = true;
  // Hide Complete
  completeEl.hidden = true;
  // Reset values
  localStorage.removeItem("countdown");
}

// On Load, check LocalStorage
restorePreviousCountdown();

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownElBtn.addEventListener("click", reset);
completeElBtn.addEventListener("click", reset);
