import { AppState } from '../state/AppState.js';

export class RateLimitCounter {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.countdownInterval = null;

        AppState.subscribe('requestsThisMinute', () => this.render());
        AppState.subscribe('countdownSeconds', () => this.render());

        document.addEventListener('RateLimitHit', () => this.startCountdown());
    }

    startCountdown() {
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        
        let secs = AppState.getState('countdownSeconds') || 60;
        
        this.countdownInterval = setInterval(() => {
            secs--;
            AppState.setState({ countdownSeconds: Math.max(0, secs) });
            
            if (secs <= 0) {
                clearInterval(this.countdownInterval);
                AppState.setState({ requestsThisMinute: 0 }); // optimistic reset
            }
        }, 1000);
    }

    render() {
        const used = AppState.getState('requestsThisMinute');
        const limit = AppState.getState('requestsLimit');
        const countdown = AppState.getState('countdownSeconds');

        if (used >= limit || countdown > 0) {
            this.container.innerHTML = `
                <div class="counter-big limit-hit">0</div>
                <div class="counter-sub">Espera ${countdown}s</div>
            `;
        } else {
            this.container.innerHTML = `
                <div class="counter-big">${limit - used}</div>
                <div class="counter-sub">disponibles ahora</div>
            `;
        }
    }
}
