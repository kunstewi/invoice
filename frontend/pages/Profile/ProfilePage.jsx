import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../src/utils/axiosInstance";
import API_PATHS from "../../src/utils/apiPaths";
import { User, Mail, Building, MapPin, Phone } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    businessName: user?.businessName || "",
    businessAddress: user?.businessAddress || "",
    phone: user?.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.user.updateProfile,
        profileData
      );

      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.put(API_PATHS.user.changePassword, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings</p>
        </div>

        {/* Profile Information */}
        <Card title="Profile Information">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <Input
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
            />

            <Input
              label="Business Name"
              name="businessName"
              value={profileData.businessName}
              onChange={handleProfileChange}
            />

            <Input
              label="Business Address"
              name="businessAddress"
              value={profileData.businessAddress}
              onChange={handleProfileChange}
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleProfileChange}
            />

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Card>

        {/* Change Password */}
        <Card title="Change Password">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;