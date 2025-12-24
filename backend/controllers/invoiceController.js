const Invoice = require("../models/Invoice");
const generateInvoiceNumber = require("../utils/invoiceNumber");

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res, next) => {
    try {
        const {
            clientName,
            clientEmail,
            clientAddress,
            items,
            tax,
            discount,
            issueDate,
            dueDate,
            notes,
            status,
        } = req.body;

        // Validate required fields
        if (!clientName || !clientEmail || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        if (!issueDate || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide issue date and due date",
            });
        }

        // Calculate totals for each item
        const processedItems = items.map((item) => ({
            ...item,
            total: item.quantity * item.price,
        }));

        // Calculate subtotal
        const subtotal = processedItems.reduce((sum, item) => sum + item.total, 0);

        // Calculate total
        const taxAmount = tax || 0;
        const discountAmount = discount || 0;
        const total = subtotal + taxAmount - discountAmount;

        // Generate invoice number
        const invoiceNumber = await generateInvoiceNumber();

        // Create invoice
        const invoice = await Invoice.create({
            userId: req.user._id,
            invoiceNumber,
            clientName,
            clientEmail,
            clientAddress: clientAddress || "",
            items: processedItems,
            subtotal,
            tax: taxAmount,
            discount: discountAmount,
            total,
            status: status || "draft",
            issueDate,
            dueDate,
            notes: notes || "",
        });

        res.status(201).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all invoices with pagination
// @route   GET /api/invoices
// @access  Private
const getAllInvoices = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const invoices = await Invoice.find(filter)
            .populate("userId", "name email businessName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Invoice.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: invoices,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's invoices
// @route   GET /api/invoices/user
// @access  Private
const getUserInvoices = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = { userId: req.user._id };
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const invoices = await Invoice.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Invoice.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: invoices,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate(
            "userId",
            "name email businessName businessAddress phone"
        );

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Check if user owns this invoice
        if (invoice.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to access this invoice",
            });
        }

        res.status(200).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Check if user owns this invoice
        if (invoice.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this invoice",
            });
        }

        const {
            clientName,
            clientEmail,
            clientAddress,
            items,
            tax,
            discount,
            issueDate,
            dueDate,
            notes,
            status,
        } = req.body;

        // Update fields
        if (clientName) invoice.clientName = clientName;
        if (clientEmail) invoice.clientEmail = clientEmail;
        if (clientAddress !== undefined) invoice.clientAddress = clientAddress;
        if (issueDate) invoice.issueDate = issueDate;
        if (dueDate) invoice.dueDate = dueDate;
        if (notes !== undefined) invoice.notes = notes;
        if (status) invoice.status = status;

        // Update items and recalculate if items are provided
        if (items && items.length > 0) {
            const processedItems = items.map((item) => ({
                ...item,
                total: item.quantity * item.price,
            }));

            invoice.items = processedItems;
            invoice.subtotal = processedItems.reduce(
                (sum, item) => sum + item.total,
                0
            );
        }

        // Update tax and discount
        if (tax !== undefined) invoice.tax = tax;
        if (discount !== undefined) invoice.discount = discount;

        // Recalculate total
        invoice.total = invoice.subtotal + invoice.tax - invoice.discount;

        const updatedInvoice = await invoice.save();

        res.status(200).json({
            success: true,
            data: updatedInvoice,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Check if user owns this invoice
        if (invoice.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this invoice",
            });
        }

        await invoice.deleteOne();

        res.status(200).json({
            success: true,
            message: "Invoice deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update invoice status
// @route   PATCH /api/invoices/:id/status
// @access  Private
const updateInvoiceStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Please provide status",
            });
        }

        const validStatuses = ["draft", "sent", "paid", "overdue"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Check if user owns this invoice
        if (invoice.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this invoice",
            });
        }

        invoice.status = status;
        await invoice.save();

        res.status(200).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getUserInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
};
