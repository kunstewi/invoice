import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import axiosInstance from "../../src/utils/axiosInstance";
import API_PATHS from "../../src/utils/apiPaths";
import { calculateInvoiceTotals, formatDateForInput } from "../../src/utils/helper";
import { DEFAULT_INVOICE_ITEM } from "../../src/utils/data";
import { Plus, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";

const CreateInvoices = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    items: [{ ...DEFAULT_INVOICE_ITEM }],
    tax: 0,
    discount: 0,
    issueDate: formatDateForInput(new Date()),
    dueDate: "",
    notes: "",
    status: "draft",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...DEFAULT_INVOICE_ITEM }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      toast.error("At least one item is required");
      return;
    }
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const totals = calculateInvoiceTotals(
    formData.items,
    formData.tax,
    formData.discount
  );

  const handleSubmit = async (e, status = "draft") => {
    e.preventDefault();

    // Validation
    if (!formData.clientName || !formData.clientEmail) {
      toast.error("Please fill in client information");
      return;
    }

    if (!formData.issueDate || !formData.dueDate) {
      toast.error("Please select issue and due dates");
      return;
    }

    if (formData.items.some((item) => !item.description || !item.quantity || !item.price)) {
      toast.error("Please fill in all item details");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.invoices.create, {
        ...formData,
        status,
      });

      if (response.data.success) {
        toast.success("Invoice created successfully!");
        navigate(`/invoices/${response.data.data._id}`);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create Invoice</h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a new invoice</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-6">
          {/* Client Information */}
          <Card title="Client Information">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Client Name"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
              <Input
                label="Client Email"
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4">
              <Input
                label="Client Address"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
              />
            </div>
          </Card>

          {/* Invoice Items */}
          <Card title="Invoice Items">
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Input
                      label="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      label="Qty"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      label="Price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      label="Total"
                      value={(item.quantity * item.price).toFixed(2)}
                      disabled
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mb-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="mt-4 gap-2"
            >
              <Plus size={20} />
              Add Item
            </Button>
          </Card>

          {/* Calculations */}
          <Card title="Calculations">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Tax ($)"
                  type="number"
                  name="tax"
                  min="0"
                  step="0.01"
                  value={formData.tax}
                  onChange={handleChange}
                />
                <Input
                  label="Discount ($)"
                  type="number"
                  name="discount"
                  min="0"
                  step="0.01"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${totals.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax:</span>
                  <span className="font-semibold">${totals.tax}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Discount:</span>
                  <span className="font-semibold">-${totals.discount}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2">
                  <span>Total:</span>
                  <span>${totals.total}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Dates and Notes */}
          <Card title="Additional Details">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Issue Date"
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Payment terms, thank you message, etc."
              ></textarea>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="gap-2"
            >
              <Save size={20} />
              {loading ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              type="button"
              variant="success"
              onClick={(e) => handleSubmit(e, "sent")}
              disabled={loading}
            >
              Save & Send
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/invoices")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateInvoices;