const API_BASE_URL = 'http://localhost:5000/api';

const api = {
    // Helper to get auth header
    async getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Get current user token if logged in
        // Assuming access to global auth object or window.currentUser
        const user = window.firebase ? window.firebase.auth().currentUser : null;
        if (user) {
            const token = await user.getIdToken();
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    },

    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: await this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error(`API GET ${endpoint} Error:`, error);
            throw error;
        }
    },

    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: await this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error(`API POST ${endpoint} Error:`, error);
            throw error;
        }
    }
};

window.api = api;
