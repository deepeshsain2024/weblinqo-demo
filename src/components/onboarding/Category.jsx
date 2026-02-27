import { useState } from "react";
import { motion } from "framer-motion";

const Category = ({ category, setCategory, saving }) => {
  const [otherText, setOtherText] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Updates the "Other" input text and syncs it with the parent category state
  const handleOtherChange = (e) => {
    const value = e.target.value;
    setOtherText(value);
    setCategory(value);
  };

  // Handles selection of a category button
  const handleCategorySelect = (item) => {
    if (item === "Other") {
      setIsOtherSelected(true);
      setCategory(otherText || "");
    } else {
      setIsOtherSelected(false);
      setCategory(item);
    }
  };

  // categories options
  const categories = [
    "Creator & Influencer",
    "Ecommerce & Retail",
    "Beauty & Wellness",
    "Real Estate",
    "Other"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-gray-600 text-center">
          This helps us customize your weblinqo experience
        </p>
      </div>

      {/* Category Buttons */}
      <div className="space-y-3">
        {categories.map((item) => (
          <motion.button
            key={item}
            whileTap={{ scale: 0.98 }}
            onClick={() => !saving && handleCategorySelect(item)}
            disabled={saving}
            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
              (item === "Other" && isOtherSelected) || category === item
                ? "border-primary bg-[#f8faf3]"
                : "border-gray-200 hover:border-primary/50 hover:bg-[#f8faf3]/50"
            } ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
            type="button"
          >
            <h3 className="font-semibold text-gray-900">{item}</h3>
          </motion.button>
        ))}

         {/* Input field for "Other" category */}    
        {(isOtherSelected || (!categories.includes(category) && category)) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2">
              <label htmlFor="otherCategory" className="block text-sm font-medium text-gray-700">
                Please specify
              </label>
              <input
                id="otherCategory"
                type="text"
                value={otherText}
                onChange={handleOtherChange}
                placeholder="Enter your business category"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-gray-50"
                disabled={saving}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Category;