import React from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AgeConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  linkTitle,
  linkUrl,
}) => {
  // Handler for confirming age (executes confirmation logic and closes modal)
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Handler for cancel action (closes modal without confirmation)
  const handleCancel = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Render modal only if isOpen is true */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCancel}
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
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <FaExclamationTriangle className="text-red-600" size={20} />
                </div>
                <h2 className="text-size-16 font-semibold text-gray-800">
                  Age Verification Required
                </h2>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="mb-4">
                  <FaExclamationTriangle
                    className="text-red-500 mx-auto mb-3"
                    size={48}
                  />
                </div>

                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Sensitive Content Warning
                </h3>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-sm font-medium">
                    ⚠️ This content is intended for viewers 18 years and older.
                  </p>
                </div>

                <p className="text-gray-600 text-sm">
                  By clicking "I'm 18+", you confirm that you are at least 18
                  years old and agree to view this content.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                I'm 18+
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgeConfirmationModal;
