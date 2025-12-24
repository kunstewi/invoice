// Invoice statuses
export const INVOICE_STATUSES = [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
];

// Default invoice item
export const DEFAULT_INVOICE_ITEM = {
    description: "",
    quantity: 1,
    price: 0,
};

// Form validation messages
export const VALIDATION_MESSAGES = {
    required: "This field is required",
    email: "Please enter a valid email address",
    password: "Password must be at least 6 characters",
    passwordMatch: "Passwords do not match",
    minLength: (length) => `Must be at least ${length} characters`,
    maxLength: (length) => `Must not exceed ${length} characters`,
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
    page: 1,
    limit: 10,
};
