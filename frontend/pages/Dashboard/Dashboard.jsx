import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import axiosInstance from "../../src/utils/axiosInstance";
import API_PATHS from "../../src/utils/apiPaths";
import { formatCurrency, formatDate } from "../../src/utils/helper";
import { FileText, DollarSign, Clock, CheckCircle, PlusCircle } from "lucide-react";
import Button from "../../components/ui/Button";

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.invoices.getUserInvoices);
      if (response.data.success) {
        const invoiceData = response.data.data;
        setInvoices(invoiceData.slice(0, 5)); // Show only recent 5

        // Calculate stats
        const stats = {
          total: invoiceData.length,
          draft: invoiceData.filter((inv) => inv.status === "draft").length,
          sent: invoiceData.filter((inv) => inv.status === "sent").length,
          paid: invoiceData.filter((inv) => inv.status === "paid").length,
          overdue: invoiceData.filter((inv) => inv.status === "overdue").length,
        };
        setStats(stats);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Invoices",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Paid",
      value: stats.paid,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Pending",
      value: stats.sent,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: DollarSign,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
          </div>
          <Link to="/invoices/new">
            <Button variant="primary" className="gap-2">
              <PlusCircle size={20} />
              Create Invoice
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={stat.color} size={24} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Invoices */}
        <Card title="Recent Invoices">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">No invoices yet</p>
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
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {invoices.length > 0 && (
            <div className="mt-4 text-center">
              <Link to="/invoices">
                <Button variant="outline">View All Invoices</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;