const express = require("express");
const {
    createInvoice,
    getAllInvoices,
    getUserInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
} = require("../controllers/invoiceController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.post("/", protect, createInvoice);
router.get("/", protect, getAllInvoices);
router.get("/user", protect, getUserInvoices);
router.get("/:id", protect, getInvoiceById);
router.put("/:id", protect, updateInvoice);
router.delete("/:id", protect, deleteInvoice);
router.patch("/:id/status", protect, updateInvoiceStatus);

module.exports = router;
