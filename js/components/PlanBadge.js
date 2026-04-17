import { AppState } from '../state/AppState.js';

export class PlanBadge {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        AppState.subscribe('plan', () => this.render());
    }

    render() {
        const plan = AppState.getState('plan');
        this.container.innerHTML = `<span class="badge ${plan.toLowerCase()}">Plan: ${plan}</span>`;
    }
}
