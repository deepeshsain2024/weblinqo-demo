import { useState } from "react";
import { motion } from "framer-motion";
import TemplatesSection from "./templates-section";
import CustomizeSection from "./customize-section";
import DownloadableTemplateSection from "./downloadable-template-section";
import PlanBadge from "../../../common/ui/plan-badge";

const DCAppearanceTab = ({ plan }) => {
  const [activeTab, setActiveTab] = useState("Templates");

  return (
    <div className="w-full h-full flex flex-col">
      {/* Fixed Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab("Templates")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "Templates"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab("Customize")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "Customize"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Customize
        </button>
        <button
          disabled={plan?.toLowerCase() === 'free' ? true : false}
          onClick={() => setActiveTab("Download-Template")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${plan?.toLowerCase() === 'free' ? 'cursor-not-allowed' : 'cursor-pointer'} hover:text-gray-700 ${activeTab === "Download-Template"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Download Template {" "}
          {plan?.toLowerCase() === 'free' && <PlanBadge/>}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl px-1 py-6"
        >
          {activeTab === "Templates" && (
            // template section in digital card tab
            <TemplatesSection plan={plan} />
          )}

          {activeTab === "Customize" && (
            // customize template section in digital card tab
            <CustomizeSection plan={plan} />
          )}
          {activeTab === "Download-Template" && (
            <DownloadableTemplateSection />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DCAppearanceTab;