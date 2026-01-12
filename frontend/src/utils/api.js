const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Get auth token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API
export const authAPI = {
    register: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }
        return response.json();
    },

    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }
        return response.json();
    },
};

// Events API
export const eventsAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/events`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    getByDate: async (date) => {
        const response = await fetch(`${API_URL}/events/date/${date}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    getByMonth: async (year, month) => {
        const response = await fetch(`${API_URL}/events/month/${year}/${month}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    getUpcoming: async () => {
        const response = await fetch(`${API_URL}/events/upcoming`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    getToday: async () => {
        const response = await fetch(`${API_URL}/events/today`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/events/${id}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch event');
        return response.json();
    },

    create: async (eventData) => {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(eventData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create event');
        }
        return response.json();
    },

    update: async (id, eventData) => {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(eventData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to update event');
        }
        return response.json();
    },

    delete: async (id) => {
        console.log('eventsAPI.delete called with id:', id);
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        console.log('Delete response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete failed:', errorText);
            throw new Error('Failed to delete event');
        }
        return true;
    },
};

export default { authAPI, eventsAPI };
