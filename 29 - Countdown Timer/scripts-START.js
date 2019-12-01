let countdown;
let warning;
let timerUp;

const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const displayContainer = document.querySelector('.display');

// Grab Buttons
const buttons = document.querySelectorAll('[data-time');

// Custom Minutes
document.customForm.addEventListener('submit', function(e){
    e.preventDefault();
    const mins = this.minutes.value;
    console.log(mins)
    timer(mins * 60)
    this.reset();
})

function timer(seconds){
    // Clear Active Timers
    clearInterval(countdown);
    clearInterval(warning);
    clearInterval(timerUp);

    displayContainer.style.backgroundColor = 'transparent'

    const now = Date.now();
    const then = now + (seconds * 1000);
    displayTimeLeft(seconds);
    displayEndTime(then);

    let warnFlag = false;
    let completeFlag = false;
    
    // Display Countdown
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // Check if should display
        if(secondsLeft < 0){
            endTime.textContent = 'Times Up!';
            clearInterval(countdown)
            return;
        }

        // Display the Time Left
        displayTimeLeft(secondsLeft);
    }, 1000)

    // 15 Second Warning
    warning = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if(secondsLeft <= 15 && secondsLeft > 0){
            if (!warnFlag) {
                displayContainer.style.backgroundColor = '#f98948'
                warnFlag = true;
            } else{
                displayContainer.style.backgroundColor = '#fbb38a'
                warnFlag = false;
            }
        } else if(secondsLeft < 0){
            clearInterval(warning)
        }
    }, 500);

    // Timer up
    timerUp = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if(secondsLeft <= 0 && secondsLeft >= -15){
            if(!completeFlag){
                displayContainer.style.backgroundColor = '#b7222c'
                completeFlag = true;
            } else{
                displayContainer.style.backgroundColor = '#e44f59'
                completeFlag = false;
            }
        } else if(secondsLeft < -15){
            clearInterval(timerUp)
        }
    }, 500)
}

function displayTimeLeft(seconds){
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = `Time Left: ${display}`;
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp){
    const end = new Date(timestamp);
    const hour = end.getHours();
    const adjustdHour = hour > 12 ? hour - 12 : hour
    const minutes = end.getMinutes();
    endTime.textContent = `Be back at ${adjustdHour}:${minutes < 10 ? '0' : ''}${minutes}`
}

function startTimer(){
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));