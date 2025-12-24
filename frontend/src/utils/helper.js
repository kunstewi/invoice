import moment from "moment";

// Format date for display
export const formatDate = (date) => {
    if (!date) return "";
    return moment(date).format("MMM DD, YYYY");
};

// Format date for input fields
export const formatDateForInput = (date) => {
    if (!date) return "";
    return moment(date).format("YYYY-MM-DD");
};

// Format currency
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

// Get status badge color
export const getStatusColor = (status) => {
    const colors = {
        draft: "bg-gray-100 text-gray-800",
        sent: "bg-blue-100 text-blue-800",
        paid: "bg-green-100 text-green-800",
        overdue: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.draft;
};

// Calculate item total
export const calculateItemTotal = (quantity, price) => {
    return (parseFloat(quantity) || 0) * (parseFloat(price) || 0);
};

// Calculate invoice totals
export const calculateInvoiceTotals = (items, tax = 0, discount = 0) => {
    const subtotal = items.reduce((sum, item) => {
        return sum + calculateItemTotal(item.quantity, item.price);
    }, 0);

    const taxAmount = parseFloat(tax) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const total = subtotal + taxAmount - discountAmount;

    return {
        subtotal: subtotal.toFixed(2),
        tax: taxAmount.toFixed(2),
        discount: discountAmount.toFixed(2),
        total: total.toFixed(2),
    };
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

// Get initials from name
export const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Check if date is overdue
export const isOverdue = (dueDate, status) => {
    if (status === "paid") return false;
    return moment(dueDate).isBefore(moment(), "day");
};
