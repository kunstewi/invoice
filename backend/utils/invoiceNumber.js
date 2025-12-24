const Invoice = require("../models/Invoice");

/**
 * Generate a unique invoice number in format: INV-YYYY-XXXX
 * Example: INV-2024-0001
 */
const generateInvoiceNumber = async () => {
    const currentYear = new Date().getFullYear();
    const prefix = `INV-${currentYear}-`;

    // Find the last invoice for the current year
    const lastInvoice = await Invoice.findOne({
        invoiceNumber: { $regex: `^${prefix}` },
    })
        .sort({ invoiceNumber: -1 })
        .select("invoiceNumber");

    let nextNumber = 1;

    if (lastInvoice) {
        // Extract the number part and increment
        const lastNumber = parseInt(lastInvoice.invoiceNumber.split("-")[2]);
        nextNumber = lastNumber + 1;
    }

    // Pad with zeros to make it 4 digits
    const paddedNumber = nextNumber.toString().padStart(4, "0");

    return `${prefix}${paddedNumber}`;
};

module.exports = generateInvoiceNumber;
