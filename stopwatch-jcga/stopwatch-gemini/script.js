/**
 * TimerBase Class
 * Provides common functionalities for both Stopwatch and Countdown,
 * including time formatting, display updates, and basic logging.
 * Adheres to Single Responsibility Principle for display and logging.
 */
class TimerBase {
    constructor(displayElementId) {
        // Get the DOM element where the time will be displayed
        this.displayElement = document.getElementById(displayElementId);
        // Interval ID for `setInterval` calls, used to clear the timer
        this.timerInterval = null;
        // Boolean flag to track if the timer is currently running
        this.isRunning = false;
    }

    /**
     * Formats a given number of milliseconds into HH:MM:SS.ms string format.
     * @param {number} ms - The time in milliseconds.
     * @returns {string} Formatted time string (e.g., "01:23:45.678").
     */
    formatTime(ms) {
        // Ensure milliseconds are non-negative
        ms = Math.max(0, ms);

        // Calculate hours, minutes, seconds, and remaining milliseconds
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;

        /**
         * Helper function to pad numbers with leading zeros.
         * @param {number} num - The number to pad.
         * @param {number} len - The desired length of the string.
         * @returns {string} Padded string.
         */
        const pad = (num, len = 2) => String(num).padStart(len, '0');

        // Return the formatted string
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${String(milliseconds).padStart(3, '0')}`;
    }

    /**
     * Updates the specified display element with the formatted time.
     * Separates main time (HH:MM:SS) and milliseconds for distinct styling.
     * @param {number} timeInMs - The time in milliseconds to display.
     */
    updateDisplay(timeInMs) {
        // Split the formatted time into main part and milliseconds part
        const [mainTime, ms] = this.formatTime(timeInMs).split('.');
        // Update the inner HTML of the display element with styled spans
        this.displayElement.innerHTML = `
            <span class="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900">${mainTime}</span>
            <span class="text-xl md:text-2xl lg:text-3xl opacity-70 ml-2 align-bottom text-gray-600">${ms}</span>
        `;
    }

    /**
     * Logs messages to the console with a timestamp and type.
     * @param {string} message - The message to log.
     * @param {string} type - The type of log (e.g., 'info', 'warn', 'error').
     */
    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        // Use different console methods based on log type
        switch (type) {
            case 'info': console.log(`[${timestamp}] INFO: ${message}`); break;
            case 'warn': console.warn(`[${timestamp}] WARN: ${message}`); break;
            case 'error': console.error(`[${timestamp}] ERROR: ${message}`); break;
            default: console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
        }
    }
}

/**
 * Stopwatch Class
 * Extends TimerBase to implement stopwatch-specific logic.
 * Manages start, pause, continue, and clear operations for a stopwatch.
 */
class Stopwatch extends TimerBase {
    constructor(displayElementId, startBtnId, pauseBtnId, continueBtnId, clearBtnId) {
        super(displayElementId); // Call parent constructor
        this.startTime = 0;      // Timestamp when the stopwatch last started or continued
        this.elapsedTime = 0;    // Total elapsed time in milliseconds

        // Get references to stopwatch control buttons
        this.startBtn = document.getElementById(startBtnId);
        this.pauseBtn = document.getElementById(pauseBtnId);
        this.continueBtn = document.getElementById(continueBtnId);
        this.clearBtn = document.getElementById(clearBtnId);

        // Initialize event listeners for buttons
        this.initEvents();
        // Set initial state of the stopwatch
        this.reset();
    }

    /**
     * Sets up event listeners for the stopwatch control buttons.
     */
    initEvents() {
        this.startBtn.addEventListener('click', () => {
            try {
                this.start();
            } catch (e) {
                this.log(`Error starting stopwatch: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while starting the stopwatch.');
            }
        });
        this.pauseBtn.addEventListener('click', () => {
            try {
                this.pause();
            } catch (e) {
                this.log(`Error pausing stopwatch: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while pausing the stopwatch.');
            }
        });
        this.continueBtn.addEventListener('click', () => {
            try {
                this.continue();
            } catch (e) {
                this.log(`Error continuing stopwatch: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while continuing the stopwatch.');
            }
        });
        this.clearBtn.addEventListener('click', () => {
            try {
                this.reset();
            } catch (e) {
                this.log(`Error clearing stopwatch: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while clearing the stopwatch.');
            }
        });
    }

    /**
     * Starts the stopwatch.
     * Hides the Start button and shows the Pause button.
     */
    start() {
        if (this.isRunning) return; // Prevent starting if already running
        this.log('Stopwatch started.');
        this.isRunning = true;
        // Calculate startTime to account for previously elapsed time (for continuation)
        this.startTime = Date.now() - this.elapsedTime;
        // Set interval to update display every 10 milliseconds
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime; // Update elapsed time
            this.updateDisplay(this.elapsedTime);           // Update UI
        }, 10);
        this.updateButtonVisibility('running'); // Update button states
    }

    /**
     * Pauses the stopwatch.
     * Hides the Pause button and shows the Continue button.
     */
    pause() {
        if (!this.isRunning) return; // Prevent pausing if not running
        this.log('Stopwatch paused.');
        this.isRunning = false;
        clearInterval(this.timerInterval); // Stop the interval
        this.updateButtonVisibility('paused'); // Update button states
    }

    /**
     * Continues the stopwatch from its paused state.
     * Essentially restarts the `start` logic, retaining elapsed time.
     */
    continue() {
        this.log('Stopwatch continued.');
        this.start(); // Reuse the start method to resume the timer
    }

    /**
     * Resets the stopwatch to its initial state (00:00:00.000).
     * Stops the timer, clears elapsed time, and shows the Start button.
     */
    reset() {
        this.log('Stopwatch reset.');
        this.isRunning = false;
        clearInterval(this.timerInterval); // Clear any active interval
        this.startTime = 0;                // Reset start time
        this.elapsedTime = 0;              // Reset elapsed time
        this.updateDisplay(0);             // Update display to zero
        this.updateButtonVisibility('initial'); // Show initial buttons
    }

    /**
     * Manages the visibility of the stopwatch control buttons based on its state.
     * @param {'initial' | 'running' | 'paused'} state - The current state of the stopwatch.
     */
    updateButtonVisibility(state) {
        // Hide all action buttons by default
        this.startBtn.classList.add('hidden');
        this.pauseBtn.classList.add('hidden');
        this.continueBtn.classList.add('hidden');
        // The Clear button is always visible when in the stopwatch screen
        this.clearBtn.classList.remove('hidden');

        // Show specific buttons based on the state
        if (state === 'initial') {
            this.startBtn.classList.remove('hidden');
        } else if (state === 'running') {
            this.pauseBtn.classList.remove('hidden');
        } else if (state === 'paused') {
            this.continueBtn.classList.remove('hidden');
        }
    }
}

/**
 * Countdown Class
 * Extends TimerBase to implement countdown-specific logic.
 * Handles time input, setting, starting, pausing, continuing, and clearing the countdown.
 * Manages visibility of input controls vs. timer controls.
 */
class Countdown extends TimerBase {
    constructor(displayElementId, inputControlsId, timerControlsId, setBtnId, clearInputBtnId, startBtnId, pauseBtnId, continueBtnId, clearTimerBtnId) {
        super(displayElementId); // Call parent constructor
        this.initialTime = 0;      // The total time initially set for the countdown in ms
        this.remainingTime = 0;    // The current remaining time in milliseconds
        this.inputBuffer = [];     // Array to store digits entered by the user (e.g., ['1', '2', '3'])
        // Maximum allowed countdown time: 99 hours, 59 minutes, 59 seconds in milliseconds
        this.maxTimeMs = 99 * 3600000 + 59 * 60000 + 59 * 1000;

        // Get references to various control groups and buttons
        this.inputControls = document.getElementById(inputControlsId);
        this.timerControls = document.getElementById(timerControlsId);
        this.setBtn = document.getElementById(setBtnId);
        this.clearInputBtn = document.getElementById(clearInputBtnId);
        this.startBtn = document.getElementById(startBtnId);
        this.pauseBtn = document.getElementById(pauseBtnId);
        this.continueBtn = document.getElementById(continueBtnId);
        this.clearTimerBtn = document.getElementById(clearTimerBtnId);

        // Initialize event listeners
        this.initEvents();
        // Set initial state for countdown (input mode)
        this.resetInput();
    }

    /**
     * Sets up event listeners for all countdown control buttons (number, set, clear, start, pause, continue).
     */
    initEvents() {
        // Attach event listeners to all digit buttons
        document.querySelectorAll('#countdown-input-controls .digit-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                try {
                    this.appendDigit(event.target.textContent);
                } catch (e) {
                    this.log(`Error appending digit: ${e.message}`, 'error');
                    ViewManager.showAlert('An error occurred while entering time.');
                }
            });
        });

        // Attach event listeners for Set and Clear (input mode) buttons
        this.setBtn.addEventListener('click', () => {
            try {
                this.setTime();
            } catch (e) {
                this.log(`Error setting countdown time: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while setting the time.');
            }
        });
        this.clearInputBtn.addEventListener('click', () => {
            try {
                this.resetInput();
            } catch (e) {
                this.log(`Error clearing countdown input: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while clearing input.');
            }
        });

        // Attach event listeners for Start, Pause, Continue, and Clear (timer mode) buttons
        this.startBtn.addEventListener('click', () => {
            try {
                this.start();
            } catch (e) {
                this.log(`Error starting countdown: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while starting the countdown.');
            }
        });
        this.pauseBtn.addEventListener('click', () => {
            try {
                this.pause();
            } catch (e) {
                this.log(`Error pausing countdown: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while pausing the countdown.');
            }
        });
        this.continueBtn.addEventListener('click', () => {
            try {
                this.continue();
            } catch (e) {
                this.log(`Error continuing countdown: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while continuing the countdown.');
            }
        });
        this.clearTimerBtn.addEventListener('click', () => {
            try {
                this.resetTimer();
            } catch (e) {
                this.log(`Error clearing countdown timer: ${e.message}`, 'error');
                ViewManager.showAlert('An error occurred while clearing the timer.');
            }
        });
    }

    /**
     * Appends a digit to the input buffer and updates the display.
     * Implements the shifting logic for time input (e.g., 1 -> 12 -> 123).
     * @param {string} digit - The digit (0-9) to append.
     */
    appendDigit(digit) {
        // Limit input buffer to 6 digits (HHMMSS)
        if (this.inputBuffer.length >= 6) {
            this.inputBuffer.shift(); // Remove the oldest digit if buffer is full
        }
        this.inputBuffer.push(digit); // Add the new digit
        this.updateInputDisplay();    // Update the visual display of the entered time
        this.log(`Digit '${digit}' appended. Buffer: [${this.inputBuffer.join('')}]`);
    }

    /**
     * Updates the countdown display based on the current state of the input buffer.
     * This function is responsible for showing the "shifting" time input.
     */
    updateInputDisplay() {
        // Convert input buffer to a string and pad with leading zeros to ensure 6 digits
        let rawTime = this.inputBuffer.join('');
        let paddedTime = rawTime.padStart(6, '0');

        // If input exceeds 6 digits (e.g., '1234567'), take only the last 6
        if (rawTime.length > 6) {
            paddedTime = rawTime.slice(-6);
        }

        // Parse hours, minutes, and seconds from the 6-digit string
        const hours = parseInt(paddedTime.substring(0, 2), 10);
        const minutes = parseInt(paddedTime.substring(2, 4), 10);
        const seconds = parseInt(paddedTime.substring(4, 6), 10);

        // Calculate the total milliseconds represented by the current input
        const currentInputMs = hours * 3600000 + minutes * 60000 + seconds * 1000;

        // Update remainingTime to reflect what's currently being input by the user
        this.remainingTime = currentInputMs;

        // Update the UI display with the current input time
        this.updateDisplay(this.remainingTime);
        this.log(`Input display updated to: ${this.formatTime(this.remainingTime)}`);
    }


    /**
     * Confirms the entered time, sets it as the initial countdown time,
     * and switches to timer control buttons.
     */
    setTime() {
        try {
            // Check if any time has been entered
            if (this.inputBuffer.length === 0 || this.remainingTime === 0) {
                this.log('Cannot set countdown to 0. Please enter a valid time.', 'warn');
                ViewManager.showAlert('Please enter a time greater than zero.');
                return;
            }

            // Validate against maximum allowed time
            if (this.remainingTime > this.maxTimeMs) {
                this.log(`Entered time (${this.formatTime(this.remainingTime)}) exceeds maximum allowed (99:59:59).`, 'warn');
                ViewManager.showAlert('Maximum time allowed is 99:59:59.');
                this.resetInput(); // Reset input if invalid
                return;
            }

            this.initialTime = this.remainingTime; // Store the validated time as initial
            this.log(`Countdown initial time set to: ${this.formatTime(this.initialTime)}`);
            this.updateControlVisibility('timer'); // Switch to timer controls view
            this.updateButtonVisibility('initial'); // Show Start button initially
        } catch (e) {
            this.log(`Error in setTime: ${e.message}`, 'error');
            throw new Error('Failed to set countdown time.'); // Re-throw for parent handler
        }
    }

    /**
     * Starts the countdown timer.
     * Hides the Start button and shows the Pause button.
     */
    start() {
        if (this.isRunning) return; // Do nothing if already running
        // Prevent starting if time is zero or less
        if (this.remainingTime <= 0) {
            this.log('Cannot start countdown, time is zero or less.', 'warn');
            ViewManager.showAlert('Countdown is zero. Please set a time.');
            this.resetInput(); // Reset to input mode if timer expired or invalid
            return;
        }
        this.log('Countdown started.');
        this.isRunning = true;
        // Record the current time to calculate elapsed time accurately
        this.startTime = Date.now();
        // Set interval to update display and decrement time every 10 milliseconds
        this.timerInterval = setInterval(() => {
            const now = Date.now();
            const elapsedSinceLastUpdate = now - this.startTime; // Time passed since last interval check
            this.startTime = now; // Reset startTime for the next interval to ensure accuracy
            this.remainingTime -= elapsedSinceLastUpdate; // Deduct elapsed time from remaining

            if (this.remainingTime <= 0) {
                // If countdown reaches zero or goes below
                this.remainingTime = 0; // Ensure it doesn't show negative time
                clearInterval(this.timerInterval); // Stop the timer
                this.isRunning = false;
                this.updateDisplay(0); // Update display to show 00:00:00.000
                ViewManager.showAlert('Countdown Expired!'); // Alert the user
                this.updateControlVisibility('input'); // Switch back to input mode
                this.resetInput(); // Reset input buffer
                this.log('Countdown expired.');
            } else {
                this.updateDisplay(this.remainingTime); // Update UI with remaining time
            }
        }, 10);
        this.updateButtonVisibility('running'); // Update button states
    }

    /**
     * Pauses the countdown timer.
     * Hides the Pause button and shows the Continue button.
     */
    pause() {
        if (!this.isRunning) return; // Do nothing if not running
        this.log('Countdown paused.');
        this.isRunning = false;
        clearInterval(this.timerInterval); // Stop the interval
        this.updateButtonVisibility('paused'); // Update button states
    }

    /**
     * Continues the countdown from its paused state.
     * Essentially restarts the `start` logic, retaining remaining time.
     */
    continue() {
        this.log('Countdown continued.');
        this.start(); // Reuse the start method to resume the timer
    }

    /**
     * Resets the countdown input, clearing the buffer and display,
     * and returning to the input mode.
     */
    resetInput() {
        this.log('Countdown input reset.');
        clearInterval(this.timerInterval); // Clear any active interval
        this.isRunning = false;
        this.inputBuffer = [];             // Clear the digit input buffer
        this.initialTime = 0;              // Reset initial time
        this.remainingTime = 0;            // Reset remaining time
        this.updateDisplay(0);             // Update display to 00:00:00.000
        this.updateControlVisibility('input'); // Switch back to input mode
        this.updateButtonVisibility('initial'); // Show Start button (though it will be hidden by set)
    }

    /**
     * Resets the countdown timer (full reset), clearing the timer,
     * and returning to the input mode.
     */
    resetTimer() {
        this.log('Countdown timer full reset.');
        clearInterval(this.timerInterval); // Clear any active interval
        this.isRunning = false;
        this.initialTime = 0;              // Reset initial time
        this.remainingTime = 0;            // Reset remaining time
        this.updateDisplay(0);             // Update display to 00:00:00.000
        this.updateControlVisibility('input'); // Switch back to input mode
        this.updateButtonVisibility('initial'); // Show Start button
        this.inputBuffer = [];             // Clear the digit input buffer
    }

    /**
     * Manages the visibility of the countdown's input controls vs. timer controls.
     * @param {'input' | 'timer'} state - The current control mode.
     */
    updateControlVisibility(state) {
        // Hide both control sections initially
        this.inputControls.classList.add('hidden');
        this.timerControls.classList.add('hidden');

        // Show the appropriate control section based on the state
        if (state === 'input') {
            this.inputControls.classList.remove('hidden');
            // When in input mode, the timer buttons should be reset to initial state
            this.updateButtonVisibility('initial');
        } else if (state === 'timer') {
            this.timerControls.classList.remove('hidden');
            // When in timer mode, the timer buttons should be shown in their initial state (Start visible)
            this.updateButtonVisibility('initial');
        }
    }

    /**
     * Manages the visibility of the countdown action buttons (Start, Pause, Continue, Clear)
     * within the timer controls section.
     * @param {'initial' | 'running' | 'paused'} state - The current state of the countdown.
     */
    updateButtonVisibility(state) {
        // Hide all action buttons by default
        this.startBtn.classList.add('hidden');
        this.pauseBtn.classList.add('hidden');
        this.continueBtn.classList.add('hidden');
        // The Clear timer button is always visible when in timer mode
        this.clearTimerBtn.classList.remove('hidden');

        // Show specific buttons based on the state
        if (state === 'initial') {
            this.startBtn.classList.remove('hidden');
        } else if (state === 'running') {
            this.pauseBtn.classList.remove('hidden');
        } else if (state === 'paused') {
            this.continueBtn.classList.remove('hidden');
        }
    }
}

/**
 * ViewManager Class
 * Handles navigation between different screens (Home, Stopwatch, Countdown)
 * and manages a custom alert/modal display.
 * Adheres to Single Responsibility Principle for UI navigation.
 */
class ViewManager {
    // Static properties to store references to DOM elements
    static homeScreen = document.getElementById('home-screen');
    static stopwatchScreen = document.getElementById('stopwatch-screen');
    static countdownScreen = document.getElementById('countdown-screen');
    static appContainer = document.getElementById('app-container'); // Main app container for overflow management
    static modalOverlay = document.getElementById('modal-overlay');
    static modalMessage = document.getElementById('modal-message');
    static modalCloseBtn = document.getElementById('modal-close-btn');
    static screenTitleElement = document.getElementById('current-screen-title');

    static currentView = 'home'; // Keeps track of the currently active view

    /**
     * Initializes the ViewManager by setting up event listeners
     * for screen selection and modal interactions.
     */
    static init() {
        // Set up event listeners for the Stopwatch and Countdown option icons
        document.getElementById('stopwatch-option').addEventListener('click', () => ViewManager.showView('stopwatch'));
        document.getElementById('countdown-option').addEventListener('click', () => ViewManager.showView('countdown'));

        // Set up event listeners for breadcrumb "Home" links
        document.querySelectorAll('.breadcrumb-home').forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                ViewManager.showView('home');
            });
        });

        // Set up event listener for the modal close button
        ViewManager.modalCloseBtn.addEventListener('click', () => ViewManager.hideAlert());
        // Close modal if user clicks outside the modal content
        ViewManager.modalOverlay.addEventListener('click', (e) => {
            if (e.target === ViewManager.modalOverlay) {
                ViewManager.hideAlert();
            }
        });

        // Initially display the home screen
        ViewManager.showView('home');
    }

    /**
     * Displays the specified view with a sliding animation.
     * Handles hiding the current view and showing the new one.
     * @param {'home' | 'stopwatch' | 'countdown'} viewName - The name of the view to show.
     */
    static showView(viewName) {
        console.log(`Attempting to navigate to: ${viewName}`);

        // Update the main title bar based on the selected view
        if (ViewManager.screenTitleElement) {
            if (viewName === 'stopwatch') {
                ViewManager.screenTitleElement.textContent = 'Stopwatch';
            } else if (viewName === 'countdown') {
                ViewManager.screenTitleElement.textContent = 'Countdown';
            } else {
                ViewManager.screenTitleElement.textContent = 'Timer App';
            }
        }

        // Add transition class to the app container to handle potential layout shifts
        ViewManager.appContainer.style.transition = 'none'; // Temporarily disable transition for quick reset
        requestAnimationFrame(() => {
            // Set all screens to their hidden (off-screen) state instantly
            ViewManager.homeScreen.classList.add('hidden', 'translate-x-full');
            ViewManager.stopwatchScreen.classList.add('hidden', 'translate-x-full');
            ViewManager.countdownScreen.classList.add('hidden', 'translate-x-full');

            // Allow browser to apply 'hidden' and 'translate-x-full' before transition
            requestAnimationFrame(() => {
                ViewManager.appContainer.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition

                let screenToShow;
                // Determine which screen to show
                if (viewName === 'home') {
                    screenToShow = ViewManager.homeScreen;
                } else if (viewName === 'stopwatch') {
                    screenToShow = ViewManager.stopwatchScreen;
                } else if (viewName === 'countdown') {
                    screenToShow = ViewManager.countdownScreen;
                }

                if (screenToShow) {
                    // Remove 'hidden' class to make it visible
                    screenToShow.classList.remove('hidden');
                    // Trigger the slide-in animation
                    requestAnimationFrame(() => {
                        screenToShow.classList.remove('translate-x-full');
                        screenToShow.classList.add('translate-x-0');
                        screenToShow.classList.remove('screen-hidden'); // Ensure screen-hidden is removed
                        screenToShow.classList.add('screen-active'); // Add active class
                    });
                }
                ViewManager.currentView = viewName;
                console.log(`Navigated to: ${viewName}`);
            });
        });
    }

    /**
     * Displays a custom alert modal with a given message.
     * @param {string} message - The message to display in the alert.
     */
    static showAlert(message) {
        ViewManager.modalMessage.textContent = message;
        ViewManager.modalOverlay.classList.remove('hidden');
        ViewManager.modalOverlay.classList.add('flex'); // Use flex to center the modal content
        console.log(`ALERT: ${message}`);
    }

    /**
     * Hides the custom alert modal.
     */
    static hideAlert() {
        ViewManager.modalOverlay.classList.add('hidden');
        ViewManager.modalOverlay.classList.remove('flex');
        console.log('ALERT: Closed.');
    }
}

// Initialize the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the ViewManager to handle screen navigation
    ViewManager.init();

    // Instantiate Stopwatch and Countdown objects, passing their respective DOM element IDs
    const stopwatch = new Stopwatch(
        'stopwatch-display',
        'start-stopwatch',
        'pause-stopwatch',
        'continue-stopwatch',
        'clear-stopwatch'
    );

    const countdown = new Countdown(
        'countdown-display',
        'countdown-input-controls',
        'countdown-timer-controls',
        'set-countdown',
        'clear-countdown-input',
        'start-countdown',
        'pause-countdown',
        'continue-countdown',
        'clear-countdown-timer'
    );

    // Ensure the countdown starts in its input setting mode
    countdown.resetInput();
});