import React from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Zap, Shield, ArrowRight } from "lucide-react";
import Button from "../../components/ui/Button";

const LandingPage = () => {
  const features = [
    {
      icon: Zap,
      title: "Fast & Easy",
      description: "Create professional invoices in minutes with our intuitive interface",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is encrypted and stored securely in the cloud",
    },
    {
      icon: CheckCircle,
      title: "Track Payments",
      description: "Monitor invoice status and never miss a payment",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <FileText className="text-primary" size={32} />
              <span className="text-2xl font-bold text-gray-800">InvoiceGen</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Professional
            <span className="text-primary block mt-2">Invoices in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your billing process with our easy-to-use invoice generator.
            Track payments, manage clients, and get paid faster.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button variant="primary" size="lg" className="gap-2">
                Get Started Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose InvoiceGen?
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to manage your invoices efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of businesses using InvoiceGen to streamline their billing
          </p>
          <Link to="/signup">
            <Button variant="primary" size="lg" className="gap-2">
              Create Your Free Account
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText size={24} />
            <span className="text-xl font-bold">InvoiceGen</span>
          </div>
          <p className="text-gray-400">
            © 2024 InvoiceGen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;