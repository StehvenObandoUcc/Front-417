import { AppState } from '../state/AppState.js';

export class TokenEstimator {
    constructor(inputId, containerId) {
        this.input = document.getElementById(inputId);
        this.container = document.getElementById(containerId);

        this.input.addEventListener('input', () => this.render());
    }

    render() {
        const text = this.input.value.trim();
        // Base estimada de tokens: 1 palabra 1.3 tokens
        const wordCount = text ? text.split(/\s+/).length : 0;
        const tokens = Math.ceil(wordCount * 1.3);
        
        let html = "";
        if (tokens > 0) {
            html = "<small>~" + tokens + " tokens estimados por el prompt</small>";
        }
        this.container.innerHTML = html;
    }
}
