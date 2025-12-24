import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import axiosInstance from "../../src/utils/axiosInstance";
import API_PATHS from "../../src/utils/apiPaths";
import { formatCurrency, formatDate } from "../../src/utils/helper";
import { Edit, Trash2, FileText } from "lucide-react";
import toast from "react-hot-toast";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.invoices.getById(id));
      if (response.data.success) {
        setInvoice(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to load invoice");
      navigate("/invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axiosInstance.patch(
        API_PATHS.invoices.updateStatus(id),
        { status: newStatus }
      );

      if (response.data.success) {
        setInvoice(response.data.data);
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) {
      return;
    }

    try {
      const response = await axiosInstance.delete(API_PATHS.invoices.delete(id));
      if (response.data.success) {
        toast.success("Invoice deleted successfully");
        navigate("/invoices");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!invoice) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Invoice not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-gray-600 mt-1">Invoice Details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="danger" onClick={handleDelete} className="gap-2">
              <Trash2 size={18} />
              Delete
            </Button>
          </div>
        </div>

        {/* Invoice Card */}
        <Card>
          <div className="space-y-6">
            {/* Status and Dates */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <Badge status={invoice.status}>{invoice.status}</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="font-semibold">{formatDate(invoice.issueDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            {/* Client Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Client Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-800">{invoice.clientName}</p>
                <p className="text-gray-600">{invoice.clientEmail}</p>
                {invoice.clientAddress && (
                  <p className="text-gray-600 mt-1">{invoice.clientAddress}</p>
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Description
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-right">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4">
              <div className="max-w-xs ml-auto space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax:</span>
                  <span className="font-semibold">
                    {formatCurrency(invoice.tax)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Discount:</span>
                  <span className="font-semibold">
                    -{formatCurrency(invoice.discount)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Status Update */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Update Status</h3>
              <div className="flex gap-2">
                {["draft", "sent", "paid", "overdue"].map((status) => (
                  <Button
                    key={status}
                    variant={invoice.status === status ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleStatusUpdate(status)}
                    disabled={invoice.status === status}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceDetail;