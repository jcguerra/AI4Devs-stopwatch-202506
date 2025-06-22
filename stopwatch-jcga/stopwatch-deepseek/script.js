// script.js
/**
 * Timer Application
 * 
 * This script implements a Stopwatch and Countdown Timer application
 * following SOLID principles and with proper error handling.
 */

/**
 * Base Timer Class
 * Implements common timer functionality
 */
class Timer {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.animationFrame = null;
    }
    
    /**
     * Starts the timer
     */
    start() {
        if (this.isRunning) {
            console.warn('Timer is already running');
            return;
        }
        
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        this._update();
    }
    
    /**
     * Stops/pauses the timer
     */
    stop() {
        if (!this.isRunning) {
            console.warn('Timer is not running');
            return;
        }
        
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    /**
     * Resets the timer
     */
    reset() {
        this.stop();
        this.elapsedTime = 0;
    }
    
    /**
     * Internal update method for animation frame
     */
    _update() {
        if (!this.isRunning) return;
        
        this.elapsedTime = Date.now() - this.startTime;
        
        this.animationFrame = requestAnimationFrame(() => this._update());
    }
    
    /**
     * Formats time to HH:MM:SS.mmm format
     * @param {number} ms - Time in milliseconds
     * @returns {Object} Formatted time components
     */
    static formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        const milliseconds = (ms % 1000).toString().padStart(3, '0');
        
        return {
            hours,
            minutes,
            seconds,
            milliseconds,
            formatted: `${hours}:${minutes}:${seconds}`,
            fullFormatted: `${hours}:${minutes}:${seconds}.${milliseconds}`
        };
    }
}

/**
 * Stopwatch Class
 * Extends the base Timer functionality
 */
class Stopwatch extends Timer {
    constructor() {
        super();
    }
    
    /**
     * Gets the current formatted time
     * @returns {string} Formatted time string
     */
    getTime() {
        return Timer.formatTime(this.elapsedTime).formatted;
    }
    
    /**
     * Gets the current formatted time with milliseconds
     * @returns {string} Formatted time string with milliseconds
     */
    getTimeWithMs() {
        return Timer.formatTime(this.elapsedTime).fullFormatted;
    }
}

/**
 * CountdownTimer Class
 * Implements countdown functionality
 */
class CountdownTimer {
    constructor() {
        this.initialTime = 0;
        this.remainingTime = 0;
        this.isRunning = false;
        this.startTime = 0;
        this.animationFrame = null;
        this.hasExpired = false;
    }
    
    /**
     * Sets the countdown time
     * @param {number} ms - Time in milliseconds
     */
    setTime(ms) {
        if (ms <= 0) {
            throw new Error('Countdown time must be positive');
        }
        
        this.initialTime = ms;
        this.remainingTime = ms;
        this.hasExpired = false;
    }
    
    /**
     * Starts the countdown
     */
    start() {
        if (this.isRunning) {
            console.warn('Countdown is already running');
            return;
        }
        
        if (this.remainingTime <= 0) {
            console.warn('Countdown time is not set or expired');
            return;
        }
        
        this.isRunning = true;
        this.startTime = Date.now();
        this.hasExpired = false;
        this._update();
    }
    
    /**
     * Stops/pauses the countdown
     */
    stop() {
        if (!this.isRunning) {
            console.warn('Countdown is not running');
            return;
        }
        
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    /**
     * Resets the countdown to initial time
     */
    reset() {
        this.stop();
        this.remainingTime = this.initialTime;
        this.hasExpired = false;
    }
    
    /**
     * Clears the countdown
     */
    clear() {
        this.stop();
        this.initialTime = 0;
        this.remainingTime = 0;
        this.hasExpired = false;
    }
    
    /**
     * Internal update method for animation frame
     */
    _update() {
        if (!this.isRunning) return;
        
        const elapsed = Date.now() - this.startTime;
        this.remainingTime = Math.max(0, this.initialTime - elapsed);
        
        if (this.remainingTime <= 0) {
            this.isRunning = false;
            this.remainingTime = 0;
            this.hasExpired = true;
        }
        
        this.animationFrame = requestAnimationFrame(() => this._update());
    }
    
    /**
     * Gets the current formatted time
     * @returns {string} Formatted time string
     */
    getTime() {
        return Timer.formatTime(this.remainingTime).formatted;
    }
    
    /**
     * Gets the current formatted time with milliseconds
     * @returns {string} Formatted time string with milliseconds
     */
    getTimeWithMs() {
        return Timer.formatTime(this.remainingTime).fullFormatted;
    }
    
    /**
     * Checks if the countdown has expired
     * @returns {boolean} True if countdown has expired
     */
    isExpired() {
        return this.hasExpired;
    }
}

/**
 * UI Controller Class
 * Manages the application UI and interactions
 */
class UIController {
    constructor() {
        // Screen elements
        this.homeScreen = document.getElementById('home-screen');
        this.stopwatchScreen = document.getElementById('stopwatch-screen');
        this.countdownScreen = document.getElementById('countdown-screen');
        this.alertContainer = document.getElementById('alert-container');
        
        // Stopwatch elements
        this.stopwatchDisplay = document.getElementById('stopwatch-display');
        this.startStopwatchBtn = document.getElementById('start-stopwatch');
        this.pauseStopwatchBtn = document.getElementById('pause-stopwatch');
        this.continueStopwatchBtn = document.getElementById('continue-stopwatch');
        this.clearStopwatchBtn = document.getElementById('clear-stopwatch');
        this.backFromStopwatchBtn = document.getElementById('back-from-stopwatch');
        
        // Countdown elements
        this.countdownDisplay = document.getElementById('countdown-display');
        this.countdownInput = document.getElementById('countdown-input');
        this.countdownControls = document.getElementById('countdown-controls');
        this.startCountdownBtn = document.getElementById('start-countdown');
        this.pauseCountdownBtn = document.getElementById('pause-countdown');
        this.continueCountdownBtn = document.getElementById('continue-countdown');
        this.clearCountdownBtn = document.getElementById('clear-countdown');
        this.setCountdownBtn = document.getElementById('set-countdown');
        this.clearCountdownInputBtn = document.getElementById('clear-countdown-input');
        this.backFromCountdownBtn = document.getElementById('back-from-countdown');
        this.backspaceCountdownBtn = document.getElementById('backspace-countdown');
        this.numberButtons = document.querySelectorAll('.number-button:not(#set-countdown):not(#clear-countdown-input):not(#backspace-countdown)');
        
        // Timer instances
        this.stopwatch = new Stopwatch();
        this.countdownTimer = new CountdownTimer();
        
        // Initialize time input
        this.inputSequence = '';
        
        // Expiration flags
        this.stopwatchExpired = false;
        this.countdownExpired = false;
        
        // Initialize UI
        this._init();
    }
    
    /**
     * Initializes event listeners
     */
    _init() {
        // Navigation
        document.getElementById('stopwatch-card').addEventListener('click', () => this.showScreen('stopwatch'));
        document.getElementById('countdown-card').addEventListener('click', () => this.showScreen('countdown'));
        this.backFromStopwatchBtn.addEventListener('click', () => this.showScreen('home'));
        this.backFromCountdownBtn.addEventListener('click', () => this.showScreen('home'));
        
        // Stopwatch controls
        this.startStopwatchBtn.addEventListener('click', () => this.startStopwatch());
        this.pauseStopwatchBtn.addEventListener('click', () => this.pauseStopwatch());
        this.continueStopwatchBtn.addEventListener('click', () => this.continueStopwatch());
        this.clearStopwatchBtn.addEventListener('click', () => this.clearStopwatch());
        
        // Countdown controls
        this.setCountdownBtn.addEventListener('click', () => this.setCountdownTime());
        this.clearCountdownInputBtn.addEventListener('click', () => this.clearCountdownInput());
        this.startCountdownBtn.addEventListener('click', () => this.startCountdown());
        this.pauseCountdownBtn.addEventListener('click', () => this.pauseCountdown());
        this.continueCountdownBtn.addEventListener('click', () => this.continueCountdown());
        this.clearCountdownBtn.addEventListener('click', () => this.clearCountdown());
        this.backspaceCountdownBtn.addEventListener('click', () => this.handleBackspace());
        
        // Number buttons
        this.numberButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleNumberInput(e.target.textContent));
        });
        
        // Start update loop
        this._updateDisplays();
    }
    
    /**
     * Shows the specified screen
     * @param {string} screen - Screen to show (home|stopwatch|countdown)
     */
    showScreen(screen) {
        try {
            // Hide all screens
            this.homeScreen.classList.add('hidden');
            this.stopwatchScreen.classList.add('hidden');
            this.countdownScreen.classList.add('hidden');
            
            // Show selected screen
            if (screen === 'home') {
                this.homeScreen.classList.remove('hidden');
            } else if (screen === 'stopwatch') {
                this.stopwatchScreen.classList.remove('hidden');
                this.stopwatchExpired = false;
            } else if (screen === 'countdown') {
                this.countdownScreen.classList.remove('hidden');
                this.resetCountdownUI();
                this.countdownExpired = false;
            } else {
                throw new Error(`Invalid screen: ${screen}`);
            }
            
            console.log(`Switched to ${screen} screen`);
        } catch (error) {
            console.error(`Error switching screens: ${error.message}`);
        }
    }
    
    /**
     * Starts the stopwatch
     */
    startStopwatch() {
        try {
            this.stopwatch.start();
            this.startStopwatchBtn.classList.add('hidden');
            this.pauseStopwatchBtn.classList.remove('hidden');
            this.stopwatchExpired = false;
            console.log('Stopwatch started');
        } catch (error) {
            console.error(`Error starting stopwatch: ${error.message}`);
        }
    }
    
    /**
     * Pauses the stopwatch
     */
    pauseStopwatch() {
        try {
            this.stopwatch.stop();
            this.pauseStopwatchBtn.classList.add('hidden');
            this.continueStopwatchBtn.classList.remove('hidden');
            console.log('Stopwatch paused');
        } catch (error) {
            console.error(`Error pausing stopwatch: ${error.message}`);
        }
    }
    
    /**
     * Continues the stopwatch
     */
    continueStopwatch() {
        try {
            this.stopwatch.start();
            this.continueStopwatchBtn.classList.add('hidden');
            this.pauseStopwatchBtn.classList.remove('hidden');
            console.log('Stopwatch continued');
        } catch (error) {
            console.error(`Error continuing stopwatch: ${error.message}`);
        }
    }
    
    /**
     * Clears the stopwatch
     */
    clearStopwatch() {
        try {
            this.stopwatch.reset();
            this.startStopwatchBtn.classList.remove('hidden');
            this.pauseStopwatchBtn.classList.add('hidden');
            this.continueStopwatchBtn.classList.add('hidden');
            console.log('Stopwatch cleared');
            
            // Show reset alert
            this.showAlert('Stopwatch has been reset', 'success');
        } catch (error) {
            console.error(`Error clearing stopwatch: ${error.message}`);
        }
    }
    
    /**
     * Handles number input for countdown
     * @param {string} number - The number pressed
     */
    handleNumberInput(number) {
        try {
            // Add the new digit to the sequence
            this.inputSequence = (this.inputSequence + number).slice(-6);
            
            // Pad with zeros to get 6 digits
            const padded = this.inputSequence.padStart(6, '0');
            
            // Split into hours, minutes, seconds
            const hours = padded.substring(0, 2);
            const minutes = padded.substring(2, 4);
            const seconds = padded.substring(4, 6);
            
            // Update display
            this.countdownDisplay.innerHTML = `${hours}:${minutes}:${seconds}<span class="milliseconds">.000</span>`;
            
            console.log(`Input sequence: ${this.inputSequence}`);
        } catch (error) {
            console.error(`Error handling number input: ${error.message}`);
        }
    }
    
    /**
     * Handles backspace for countdown input
     */
    handleBackspace() {
        try {
            // Remove the last digit
            this.inputSequence = this.inputSequence.slice(0, -1);
            
            // Pad with zeros to get 6 digits
            const padded = this.inputSequence.padStart(6, '0');
            
            // Split into hours, minutes, seconds
            const hours = padded.substring(0, 2);
            const minutes = padded.substring(2, 4);
            const seconds = padded.substring(4, 6);
            
            // Update display
            this.countdownDisplay.innerHTML = `${hours}:${minutes}:${seconds}<span class="milliseconds">.000</span>`;
            
            console.log(`Backspace pressed. New sequence: ${this.inputSequence}`);
        } catch (error) {
            console.error(`Error handling backspace: ${error.message}`);
        }
    }
    
    /**
     * Clears the countdown input
     */
    clearCountdownInput() {
        try {
            this.inputSequence = '';
            this.countdownDisplay.innerHTML = '00:00:00<span class="milliseconds">.000</span>';
            console.log('Countdown input cleared');
        } catch (error) {
            console.error(`Error clearing countdown input: ${error.message}`);
        }
    }
    
    /**
     * Sets the countdown time
     */
    setCountdownTime() {
        try {
            // Pad with zeros to get 6 digits
            const padded = this.inputSequence.padStart(6, '0');
            
            // Split into hours, minutes, seconds
            const hours = parseInt(padded.substring(0, 2));
            const minutes = parseInt(padded.substring(2, 4));
            const seconds = parseInt(padded.substring(4, 6));
            
            // Calculate total milliseconds
            const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
            
            if (totalMs <= 0) {
                throw new Error('Countdown time must be greater than zero');
            }
            
            this.countdownTimer.setTime(totalMs);
            this.countdownInput.classList.add('hidden');
            this.countdownControls.classList.remove('hidden');
            this.startCountdownBtn.classList.remove('hidden');
            this.clearCountdownBtn.classList.remove('hidden');
            this.countdownExpired = false;
            
            console.log(`Countdown time set to: ${hours}h ${minutes}m ${seconds}s (${totalMs}ms)`);
        } catch (error) {
            console.error(`Error setting countdown time: ${error.message}`);
            this.showAlert('Please enter a valid time greater than zero', 'error');
        }
    }
    
    /**
     * Starts the countdown
     */
    startCountdown() {
        try {
            this.countdownTimer.start();
            this.startCountdownBtn.classList.add('hidden');
            this.pauseCountdownBtn.classList.remove('hidden');
            this.countdownExpired = false;
            console.log('Countdown started');
        } catch (error) {
            console.error(`Error starting countdown: ${error.message}`);
        }
    }
    
    /**
     * Pauses the countdown
     */
    pauseCountdown() {
        try {
            this.countdownTimer.stop();
            this.pauseCountdownBtn.classList.add('hidden');
            this.continueCountdownBtn.classList.remove('hidden');
            console.log('Countdown paused');
        } catch (error) {
            console.error(`Error pausing countdown: ${error.message}`);
        }
    }
    
    /**
     * Continues the countdown
     */
    continueCountdown() {
        try {
            this.countdownTimer.start();
            this.continueCountdownBtn.classList.add('hidden');
            this.pauseCountdownBtn.classList.remove('hidden');
            console.log('Countdown continued');
        } catch (error) {
            console.error(`Error continuing countdown: ${error.message}`);
        }
    }
    
    /**
     * Clears the countdown
     */
    clearCountdown() {
        try {
            this.countdownTimer.clear();
            this.resetCountdownUI();
            console.log('Countdown cleared');
            this.showAlert('Countdown has been cleared', 'success');
        } catch (error) {
            console.error(`Error clearing countdown: ${error.message}`);
        }
    }
    
    /**
     * Resets the countdown UI to initial state
     */
    resetCountdownUI() {
        this.countdownInput.classList.remove('hidden');
        this.countdownControls.classList.add('hidden');
        this.startCountdownBtn.classList.add('hidden');
        this.pauseCountdownBtn.classList.add('hidden');
        this.continueCountdownBtn.classList.add('hidden');
        this.clearCountdownBtn.classList.add('hidden');
        this.clearCountdownInput();
    }
    
    /**
     * Shows an alert message
     * @param {string} message - The message to display
     * @param {string} type - The type of alert (success, warning, error)
     */
    showAlert(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        
        // Create icon based on alert type
        let iconPath = '';
        if (type === 'success') {
            iconPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />';
        } else if (type === 'warning') {
            iconPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />';
        } else {
            iconPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />';
        }
        
        alertDiv.innerHTML = `
            <svg class="alert-icon w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                ${iconPath}
            </svg>
            <span>${message}</span>
        `;
        
        this.alertContainer.appendChild(alertDiv);
        
        // Remove alert after animation completes
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
    
    /**
     * Updates the display elements
     */
    _updateDisplays() {
        try {
            // Update stopwatch display
            if (!this.stopwatchScreen.classList.contains('hidden')) {
                this.stopwatchDisplay.textContent = this.stopwatch.getTime();
                this.stopwatchDisplay.innerHTML = this.stopwatch.getTimeWithMs().replace(/(\..*)/, '<span class="milliseconds">$1</span>');
            }
            
            // Update countdown display
            if (!this.countdownScreen.classList.contains('hidden')) {
                if (!this.countdownControls.classList.contains('hidden')) {
                    this.countdownDisplay.textContent = this.countdownTimer.getTime();
                    this.countdownDisplay.innerHTML = this.countdownTimer.getTimeWithMs().replace(/(\..*)/, '<span class="milliseconds">$1</span>');
                    
                    // Handle countdown completion
                    if (this.countdownTimer.isExpired() && !this.countdownExpired) {
                        this.countdownTimer.stop();
                        this.pauseCountdownBtn.classList.add('hidden');
                        this.startCountdownBtn.classList.remove('hidden');
                        
                        // Play completion sound
                        this._playCompletionSound();
                        
                        // Show expiration alert
                        this.showAlert('Countdown has expired!', 'warning');
                        this.countdownExpired = true;
                    }
                }
            }
            
            // Continue the loop
            requestAnimationFrame(() => this._updateDisplays());
        } catch (error) {
            console.error(`Error updating displays: ${error.message}`);
        }
    }
    
    /**
     * Plays a sound when countdown completes
     */
    _playCompletionSound() {
        try {
            // Create audio context if not available
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const context = new AudioContext();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 440;
            gainNode.gain.value = 0.3;
            
            oscillator.start();
            
            // Stop after 500ms
            setTimeout(() => {
                oscillator.stop();
                context.close();
            }, 500);
            
            console.log('Played countdown completion sound');
        } catch (error) {
            console.error(`Error playing completion sound: ${error.message}`);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const uiController = new UIController();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error(`Application initialization failed: ${error.message}`);
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-error';
            alertDiv.innerHTML = `
                <svg class="alert-icon w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Failed to initialize application. Please check console for details.</span>
            `;
            alertContainer.appendChild(alertDiv);
        }
    }
});