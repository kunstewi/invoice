const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        clientName: {
            type: String,
            required: [true, "Please provide client name"],
            trim: true,
        },
        clientEmail: {
            type: String,
            required: [true, "Please provide client email"],
            trim: true,
            lowercase: true,
        },
        clientAddress: {
            type: String,
            trim: true,
            default: "",
        },
        items: [
            {
                description: {
                    type: String,
                    required: [true, "Please provide item description"],
                },
                quantity: {
                    type: Number,
                    required: [true, "Please provide quantity"],
                    min: [1, "Quantity must be at least 1"],
                },
                price: {
                    type: Number,
                    required: [true, "Please provide price"],
                    min: [0, "Price cannot be negative"],
                },
                total: {
                    type: Number,
                    required: true,
                },
            },
        ],
        subtotal: {
            type: Number,
            required: true,
            min: [0, "Subtotal cannot be negative"],
        },
        tax: {
            type: Number,
            default: 0,
            min: [0, "Tax cannot be negative"],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, "Discount cannot be negative"],
        },
        total: {
            type: Number,
            required: true,
            min: [0, "Total cannot be negative"],
        },
        status: {
            type: String,
            enum: ["draft", "sent", "paid", "overdue"],
            default: "draft",
        },
        issueDate: {
            type: Date,
            required: [true, "Please provide issue date"],
        },
        dueDate: {
            type: Date,
            required: [true, "Please provide due date"],
        },
        notes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
invoiceSchema.index({ userId: 1, createdAt: -1 });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
