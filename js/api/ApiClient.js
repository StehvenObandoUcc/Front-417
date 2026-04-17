// Reemplaza esta URL con la que te asigne Render cuando el backend esté desplegado.
const API_BASE_URL = 'https://backend-417.onrender.com/api';

export class ApiClient {
    static async generate(userId, prompt) {
        const response = await fetch(`${API_BASE_URL}/ai/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, prompt })
        });

        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || 60;
            throw { status: 429, message: await response.text(), retryAfter: parseInt(retryAfter) };
        }
        if (response.status === 402) {
            throw { status: 402, message: await response.text() };
        }
        if (!response.ok) {
            throw { status: response.status, message: 'Server Error' };
        }

        return response.json();
    }

    static async getQuotaStatus(userId) {
        const response = await fetch(`${API_BASE_URL}/quota/status?userId=${userId}`);
        return response.json();
    }

    static async getUsageHistory(userId) {
        const response = await fetch(`${API_BASE_URL}/quota/history?userId=${userId}`);
        return response.json();
    }

    static async upgradePlan(userId, targetPlan) {
        const response = await fetch(`${API_BASE_URL}/quota/upgrade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, targetPlan })
        });
        return response.json();
    }
}
