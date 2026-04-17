import { AppState } from '../state/AppState.js';

export class QuotaStatusBar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        AppState.subscribe('tokensUsed', () => this.render());
        AppState.subscribe('tokensLimit', () => this.render());
    }

    render() {
        const used = AppState.getState('tokensUsed');
        const limit = AppState.getState('tokensLimit');
        const percent = Math.min((used / limit) * 100, 100);
        
        let colorClass = '';
        if (percent > 90) colorClass = 'progress-danger';
        else if (percent > 75) colorClass = 'progress-warning';

        this.container.innerHTML = `
            <progress value="${used}" max="${limit}" class="${colorClass}"></progress>
            <span class="progress-text">${used.toLocaleString()} / ${limit.toLocaleString()} tokens</span>
        `;
    }
}
