import { ApiClient } from '../api/ApiClient.js';
import { AppState } from '../state/AppState.js';

export class UpgradeModal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.mode = 'limit'; // 'limit' o 'startup'
        
        document.addEventListener('ShowUpgradeModal', (e) => this.show(e.detail || 'limit'));
        document.addEventListener('HideUpgradeModal', () => this.hide());
        document.addEventListener('UpgradeRequest', (e) => this.onUpgrade(e.detail));
    }

    show(mode = 'limit') {
        this.mode = mode;
        this.modal.classList.remove('hidden');
        this.render();
    }

    hide() {
        this.modal.classList.add('hidden');
    }

    async onUpgrade(plan) {
        const userId = AppState.getState('userId');
        try {
            await ApiClient.upgradePlan(userId, plan);
            const status = await ApiClient.getQuotaStatus(userId);
            
            AppState.setState({ 
                plan: status.plan,
                tokensLimit: status.plan === 'PRO' ? 500000 : status.plan === 'ENTERPRISE' ? Infinity : 50000,
                requestsLimit: status.plan === 'PRO' ? 60 : status.plan === 'ENTERPRISE' ? Infinity : 10
            });
            alert(this.mode === 'startup' ? "Bienvenido. Has seleccionado el plan " + plan : "Plan mejorado exitosamente a " + plan);
            this.hide();
        } catch (error) {
            alert('Error al seleccionar plan: ' + error.message);
        }
    }

    render() {
        const title = this.mode === 'startup' ? 'Bienvenido - Elige tu Suscripción' : 'Límite Excedido';
        const desc = this.mode === 'startup' ? 'Para comenzar a usar la plataforma de IA simulada, selecciona un plan.' : 'Has superado el límite de tu plan actual. Selecciona un plan superior para continuar.';
        const closeBtn = this.mode === 'startup' ? '' : '<button class="primary-btn" onclick="document.dispatchEvent(new CustomEvent(\'HideUpgradeModal\'))" style="margin-top:1rem;">Cerrar</button>';

        let html = "";
        html += "<h2>" + title + "</h2>";
        html += "<p>" + desc + "</p>";
        html += "<div class=\"plan-cards\">";
        
        if (this.mode === 'startup') {
            html += "<div class=\"plan-card\" onclick=\"document.dispatchEvent(new CustomEvent('UpgradeRequest', {detail: 'FREE'}))\">";
            html += "<h3>FREE</h3><p>50k Tokens/mes</p><p>10 req/min</p></div>";
        }
        
        html += "<div class=\"plan-card\" onclick=\"document.dispatchEvent(new CustomEvent('UpgradeRequest', {detail: 'PRO'}))\">";
        html += "<h3>PRO</h3><p>500k Tokens/mes</p><p>60 req/min</p></div>";
        
        html += "<div class=\"plan-card\" onclick=\"document.dispatchEvent(new CustomEvent('UpgradeRequest', {detail: 'ENTERPRISE'}))\">";
        html += "<h3>ENTERPRISE</h3><p>Tokens Ilimitados</p><p>Req Ilimitadas</p></div>";
        
        html += "</div>";
        html += closeBtn;

        this.modal.querySelector('.modal-content').innerHTML = html;
    }
}
