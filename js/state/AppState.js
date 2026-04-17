export const AppState = {
    state: {
        userId: "user-demo-1",
        plan: "FREE",
        tokensUsed: 0,
        tokensLimit: 50000,
        requestsThisMinute: 0,
        requestsLimit: 10,
        countdownSeconds: 60,
        chatHistory: [],
        usageHistory: []
    },
    listeners: {},

    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    },

    setState(partialState) {
        for (const key in partialState) {
            if (this.state[key] !== partialState[key]) {
                this.state[key] = partialState[key];
                this.notify(key);
            }
        }
    },

    getState(key) {
        return this.state[key];
    },

    notify(key) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(this.state[key], this.state));
        }
    }
};
