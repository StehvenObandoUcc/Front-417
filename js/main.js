import { ApiClient } from './api/ApiClient.js';
import { AppState } from './state/AppState.js';
import { PlanBadge } from './components/PlanBadge.js';
import { QuotaStatusBar } from './components/QuotaStatusBar.js';
import { RateLimitCounter } from './components/RateLimitCounter.js';
import { UsageBarChart } from './components/UsageBarChart.js';
import { ChatInterface } from './components/ChatInterface.js';
import { TokenEstimator } from './components/TokenEstimator.js';
import { UpgradeModal } from './components/UpgradeModal.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar Componentes Reutilizables
    new PlanBadge('plan-badge-container');
    new QuotaStatusBar('quota-status-bar');
    new RateLimitCounter('rate-limit-counter');
    new ChatInterface('chat-interface');
    new TokenEstimator('prompt-input', 'token-estimator');
    new UpgradeModal('upgrade-modal');
    
    // Gráfico carga sus datos de forma independiente
    setTimeout(() => new UsageBarChart('usage-bar-chart'), 500);

    // Cargar estado inicial del server
    const userId = AppState.getState('userId');
    try {
        const response = await ApiClient.getQuotaStatus(userId);
        
        const limitMap = { FREE: 50000, PRO: 500000, ENTERPRISE: Infinity };
        const reqMap = { FREE: 10, PRO: 60, ENTERPRISE: Infinity };

        AppState.setState({
            plan: response.plan,
            tokensUsed: response.used,
            tokensLimit: limitMap[response.plan],
            requestsLimit: reqMap[response.plan]
        });

    } catch (e) {
        console.error('Error instanciando estado inicial (puede que el backend de Render estÃ© dormido):', e);
        alert('El servidor backend de Render puede estar iniciando. Por favor, intenta interactuar en unos segundos.');
    } finally {
        // Mostrar plan selector la primera vez (para el demo del profe)
        document.dispatchEvent(new CustomEvent('ShowUpgradeModal', {detail: 'startup'}));
    }
});
