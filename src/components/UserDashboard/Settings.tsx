import { useState } from "react";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [theme, setTheme] = useState("light");

  const handleEmailNotificationsToggle = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleSmsNotificationsToggle = () => {
    setSmsNotifications(!smsNotifications);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  return (
    <div className="p-6 md:ml-80 sm:ml-0 overflow-x-hidden">
      <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black ">Settings</h3>

      {/* Account Settings */}
      <div className="bg-white shadow-md p-4 mb-6 rounded-md">
        <h4 className="text-xl font-semibold mb-4 text-blue-700">Account Settings</h4>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue="User"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue="user@email.com"
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white shadow-md p-4 mb-6 rounded-md">
        <h4 className="text-xl font-semibold mb-4 text-blue-700">Notification Settings</h4>
        <div className="flex items-center justify-between">
          <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
            Email Notifications
          </label>
          <input
            type="checkbox"
            id="emailNotifications"
            checked={emailNotifications}
            onChange={handleEmailNotificationsToggle}
            className="w-5 h-5"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700">
            SMS Notifications
          </label>
          <input
            type="checkbox"
            id="smsNotifications"
            checked={smsNotifications}
            onChange={handleSmsNotificationsToggle}
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white shadow-md p-4 mb-6 rounded-md">
        <h4 className="text-xl font-semibold mb-4 text-blue-700">Theme Settings</h4>
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
            Choose Theme
          </label>
          <select
            id="theme"
            value={theme}
            onChange={handleThemeChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

     
      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button className="bg-teal-800 text-white py-2 px-6 rounded-md hover:bg-teal-700">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
