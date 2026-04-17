import { ApiClient } from '../api/ApiClient.js';
import { AppState } from '../state/AppState.js';

export class UsageBarChart {
    constructor(containerId) {
        this.ctx = document.getElementById(containerId).getContext('2d');
        this.chart = null;

        AppState.subscribe('usageHistory', (data) => this.render(data));
        
        // Automatically fetch usage on init
        const userId = AppState.getState('userId');
        ApiClient.getUsageHistory(userId).then(data => {
            AppState.setState({ usageHistory: data });
        });
    }

    render(data) {
        if (this.chart) this.chart.destroy();
        
        const labels = data.map(d => d.date);
        const values = data.map(d => d.tokensUsed);

        this.chart = new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tokens Consumidos',
                    data: values,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}
