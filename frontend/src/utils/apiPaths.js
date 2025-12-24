// API endpoint paths
const API_PATHS = {
    // Authentication
    auth: {
        register: "/auth/register",
        login: "/auth/login",
    },

    // User
    user: {
        profile: "/users/profile",
        updateProfile: "/users/profile",
        uploadProfilePicture: "/users/profile-picture",
        changePassword: "/users/change-password",
    },

    // Invoices
    invoices: {
        create: "/invoices",
        getAll: "/invoices",
        getUserInvoices: "/invoices/user",
        getById: (id) => `/invoices/${id}`,
        update: (id) => `/invoices/${id}`,
        delete: (id) => `/invoices/${id}`,
        updateStatus: (id) => `/invoices/${id}/status`,
    },

    // AI Features
    ai: {
        generateDescription: "/ai/generate-description",
        suggestItems: "/ai/suggest-items",
    },

    // Utility
    health: "/health",
};

export default API_PATHS;
