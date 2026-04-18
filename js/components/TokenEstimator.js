import { AppState } from '../state/AppState.js';

export class TokenEstimator {
    constructor(inputId, containerId) {
        this.input = document.getElementById(inputId);
        this.container = document.getElementById(containerId);

        this.input.addEventListener('input', () => this.render());
    }

    render() {
        const text = this.input.value.trim();
        // Base estimada de tokens: 1 palabra ≈ 1.3 tokens (o separar por espacios)
        const wordCount = text ? text.split(/\s+/).length : 0;
        const tokens = Math.ceil(wordCount * 1.3);
        
        this.container.innerHTML = tokens > 0 ? `<small>✨ ~${tokens} tokens estimados por el prompt</small>` : '';
    }
}
