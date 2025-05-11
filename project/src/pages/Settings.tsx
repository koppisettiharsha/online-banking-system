import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  Shield, 
  Mail, 
  Phone, 
  ToggleLeft, 
  ToggleRight,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  status: 'enabled' | 'disabled' | 'pending';
}

const demoNotificationSettings: NotificationSetting[] = [
  {
    id: '1',
    name: 'Transaction Alerts',
    description: 'Get notified for all transactions above $100',
    enabled: true
  },
  {
    id: '2',
    name: 'Bill Payment Reminders',
    description: 'Receive reminders 3 days before bill due dates',
    enabled: true
  },
  {
    id: '3',
    name: 'Security Alerts',
    description: 'Get notified about suspicious activities',
    enabled: true
  },
  {
    id: '4',
    name: 'Marketing Emails',
    description: 'Receive updates about new features and offers',
    enabled: false
  }
];

const demoSecuritySettings: SecuritySetting[] = [
  {
    id: '1',
    name: 'Two-Factor Authentication',
    description: 'Add an extra layer of security to your account',
    status: 'enabled'
  },
  {
    id: '2',
    name: 'Biometric Login',
    description: 'Use fingerprint or face recognition to log in',
    status: 'enabled'
  },
  {
    id: '3',
    name: 'Login Notifications',
    description: 'Get notified when someone logs into your account',
    status: 'enabled'
  }
];

export function Settings() {
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'security'>('account');
  const [notifications, setNotifications] = useState(demoNotificationSettings);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleNotificationToggle = (id: string) => {
    const updatedNotifications = notifications.map(setting => {
      if (setting.id === id) {
        return { ...setting, enabled: !setting.enabled };
      }
      return setting;
    });
    setNotifications(updatedNotifications);
    setSuccessMessage(`Notification settings updated`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {[
          { id: 'account', label: 'Account', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Lock }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-sm text-gray-500">john.doe@example.com</p>
                </div>
                <button className="ml-auto px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>john.doe@example.com</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Language</h3>
                  <p className="text-sm text-gray-500">English (US)</p>
                </div>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Time Zone</h3>
                  <p className="text-sm text-gray-500">Eastern Time (ET)</p>
                </div>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              {notifications.map(setting => (
                <div key={setting.id} className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium">{setting.name}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(setting.id)}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    style={{
                      backgroundColor: setting.enabled ? '#2563eb' : '#e5e7eb'
                    }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Security Features</h2>
            <div className="space-y-4">
              {demoSecuritySettings.map(setting => (
                <div key={setting.id} className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium">{setting.name}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {setting.status === 'enabled' ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Enabled
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-500">
                        <X className="h-4 w-4" />
                        Disabled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Password & Security</h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg">
                Change Password
              </button>
              <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg">
                Update Security Questions
              </button>
              <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg">
                View Login History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 