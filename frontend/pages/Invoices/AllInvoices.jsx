import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import axiosInstance from "../../src/utils/axiosInstance";
import API_PATHS from "../../src/utils/apiPaths";
import { formatCurrency, formatDate } from "../../src/utils/helper";
import { PlusCircle, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const url =
        filter === "all"
          ? API_PATHS.invoices.getUserInvoices
          : `${API_PATHS.invoices.getUserInvoices}?status=${filter}`;

      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setInvoices(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) {
      return;
    }

    try {
      const response = await axiosInstance.delete(API_PATHS.invoices.delete(id));
      if (response.data.success) {
        toast.success("Invoice deleted successfully");
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Invoices</h1>
            <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
          </div>
          <Link to="/invoices/new">
            <Button variant="primary" className="gap-2">
              <PlusCircle size={20} />
              Create Invoice
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by client or invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {["all", "draft", "sent", "paid", "overdue"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Invoices Table */}
        <Card>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No invoices found</p>
              <Link to="/invoices/new">
                <Button variant="primary">Create Your First Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Invoice #
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link
                          to={`/invoices/${invoice._id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-800">{invoice.clientName}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge status={invoice.status}>{invoice.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link to={`/invoices/${invoice._id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(invoice._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AllInvoices;