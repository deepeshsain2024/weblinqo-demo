import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const AppointmentModal = ({
  isOpen,
  onClose,
  onCreateAppointment,
  onUpdateAppointment,
  isLoading,
  appointmentObj,
}) => {
  const [platform, setPlatform] = useState("CALENDLY");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  // Load existing appointment data when modal opens
  useEffect(() => {
    if (isOpen && appointmentObj) {
      setPlatform(appointmentObj.platform || "CALENDLY");
      setUrl(appointmentObj.url || "");
      setName(appointmentObj.title || "");
    } else if (isOpen && !appointmentObj) {
      // Reset form when opening without existing data
      setPlatform("CALENDLY");
      setUrl("");
      setName("");
    }
  }, [isOpen, appointmentObj]);

  // Supported appointment platforms
  const platformOptions = [
    { value: "CALENDLY", label: "Calendly" },
    { value: "GOOGLE_CALENDAR", label: "Google Calendar" },
    { value: "MICROSOFT_BOOKINGS", label: "Microsoft Bookings" },
    { value: "HUBSPOT_MEETINGS", label: "HubSpot Meetings" },
  ];

  // Handle form submission
  const handleSubmit = () => {
    if (!platform) {
      toast.error("Please select a platform");
      return;
    }

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (appointmentObj) {
      // Update existing appointment
      onUpdateAppointment(appointmentObj.id, {
        platform: platform,
        url: url.trim(),
        title: name.trim(),
      });
    } else {
      // Create new appointment
      onCreateAppointment(platform, url.trim(), name.trim());
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setPlatform("CALENDLY");
    setUrl("");
    setName("");
  };

  // Close modal and reset form
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Return URL input placeholder based on selected platform
  const getPlaceholder = () => {
    switch (platform) {
      case "CALENDLY":
        return "Enter your Calendly URL (e.g., https://calendly.com/yourname)";
      case "GOOGLE_CALENDAR":
        return "Enter your Google Calendar booking URL";
      case "MICROSOFT_BOOKINGS":
        return "Enter your Microsoft Bookings URL";
      case "HUBSPOT_MEETINGS":
        return "Enter your HubSpot Meetings URL";
      default:
        return "Enter appointment booking URL";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Modal overlay
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {appointmentObj?.isAppointment
                  ? "Edit Appointment Link"
                  : "Add Appointment Link"}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Platform Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Select Platform:
                </h3>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full border border-gray-200 bg-white rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {platformOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name Field */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Appointment Name:
                </h3>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter appointment name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* URL Field */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Booking URL:
                </h3>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isLoading || !platform || !url.trim() || !name.trim()
                  }
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {appointmentObj?.isAppointment
                        ? "Updating..."
                        : "Creating..."}
                    </div>
                  ) : appointmentObj?.isAppointment ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentModal;
