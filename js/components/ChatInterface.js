import { AppState } from '../state/AppState.js';
import { ApiClient } from '../api/ApiClient.js';

export class ChatInterface {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.input = document.getElementById('prompt-input');
        this.btn = document.getElementById('send-btn');

        this.btn.addEventListener('click', () => this.onSendPrompt(this.input.value));
        
        AppState.subscribe('chatHistory', (history) => this.render(history));
    }

    async onSendPrompt(prompt) {
        if (!prompt.trim() || this.btn.disabled) return;

        this.input.value = '';
        this.btn.disabled = true;
        this.appendLocalMessage('user', prompt);

        const userId = AppState.getState('userId');
        try {
            const res = await ApiClient.generate(userId, prompt);
            this.appendLocalMessage('ai', `${res.text}\n<small style="color:#888; display:block; margin-top:0.5rem">(Tokens consumed: ${res.tokensUsed})</small>`);
            
            // Reload status 
            ApiClient.getQuotaStatus(userId).then(status => {
                AppState.setState({ 
                    tokensUsed: status.used,
                    requestsThisMinute: AppState.getState('requestsThisMinute') + 1
                });
            });

        } catch (error) {
            if (error.status === 429) {
                this.appendLocalMessage('error', `Rate Limit Exceeded: ${error.message} (Try again in ${error.retryAfter}s)`);
                AppState.setState({ countdownSeconds: error.retryAfter });
                document.dispatchEvent(new Event('RateLimitHit'));
            } else if (error.status === 402) {
                this.appendLocalMessage('error', `Quota Exceeded: ${error.message}`);
                document.dispatchEvent(new Event('ShowUpgradeModal'));
            } else {
                this.appendLocalMessage('error', `Error: ${error.message}`);
            }
        } finally {
            this.btn.disabled = false;
        }
    }

    appendLocalMessage(role, content) {
        const history = AppState.getState('chatHistory');
        history.push({ role, content });
        AppState.setState({ chatHistory: [...history] }); // trigger reactivity
    }

    render(history) {
        this.container.innerHTML = history.map(msg => 
            `<div class="message ${msg.role}">${msg.content}</div>`
        ).join('');
        this.container.scrollTop = this.container.scrollHeight;
    }
}
