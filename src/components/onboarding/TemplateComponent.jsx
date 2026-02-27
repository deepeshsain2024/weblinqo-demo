import { useEffect, useState } from "react";
import {
  FaCheck,
  FaLock,
  FaInstagram,
  FaFacebookF,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import api from "../../services/api";
import Avatar from "../../assets/avatar.jpg";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaXTwitter } from "react-icons/fa6";

const TemplateComponent = ({
  template,
  setTemplate,
  setUserProfile,
  currentPlan,
}) => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Access control map: defines which plans can access which template levels
  const accessMap = {
    free: ["FREE"],
    pro: ["FREE", "PRO"],
    premium: ["FREE", "PRO", "PREMIUM"],
  };

  // fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get("/api/v1/template/");
        setTemplates(response.data.data);
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Check if the user's plan allows selecting this template
  const handleSelect = (tpl) => {
    const allowedLevels = accessMap[currentPlan?.toLowerCase()] || [];
    if (!allowedLevels.includes(tpl.accessLevel)) {
      toast.error(
        `This template requires a ${tpl.accessLevel} plan. Upgrade to access premium templates.`
      );
      return;
    }

    setTemplate(tpl.id);
    setUserProfile({ template: tpl });
  };

  // access level badges
  const getAccessLevelBadge = (level) => {
    const baseClasses =
      "absolute top-3 left-3 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md z-10";
    switch (level) {
      case "FREE":
        return <span className={`${baseClasses} bg-green-500`}>Free</span>;
      case "PRO":
        return <span className={`${baseClasses} bg-blue-500`}>Pro</span>;
      case "PREMIUM":
        return (
          <span
            className={`${baseClasses} bg-gradient-to-r from-purple-600 to-pink-500`}
          >
            Premium
          </span>
        );
      default:
        return <span className={`${baseClasses} bg-gray-500`}>{level}</span>;
    }
  };

  // loading states
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-offWhite">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          {/* <p className="text-gray-600">Loading beautiful templates...</p> */}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 sm:px-6 py-12 bg-offWhite"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Choose Your Perfect Template
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a template that matches your style. Customize it to make it
            uniquely yours.
          </p>
        </motion.div>

        {/* Template Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl) => {
            const isLocked = !accessMap[currentPlan?.toLowerCase()]?.includes(
              tpl.accessLevel
            );
            const isSelected = tpl.id === template;

            return (
              <motion.div
                key={tpl.id}
                whileHover={!isLocked ? { scale: 1.02 } : {}}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
                onClick={() => !isLocked && handleSelect(tpl)}
                className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                  isSelected
                    ? "ring-4 ring-primary ring-opacity-70"
                    : "hover:shadow-xl"
                } ${
                  isLocked ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{
                  backgroundColor: tpl.backgroundColor || "#ffffff",
                  backgroundImage: tpl.backgroundImageUrl
                    ? `url(${tpl.backgroundImageUrl})`
                    : undefined,
                  background: tpl.background,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  fontFamily: tpl.font || "'DM Sans', sans-serif",
                  color: tpl.textColor || "#333333",
                  height: "520px",
                }}
              >
                {/* Access level badge */}
                {getAccessLevelBadge(tpl.accessLevel)}

                <div
                  className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-primary text-black shadow-md"
                      : "bg-white/90 border border-gray-200/80"
                  } z-10`}
                >
                  {isSelected && <FaCheck size={12} />}
                </div>

                {/* Lock overlay for restricted templates */}  
                {isLocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 z-20">
                    <div className="bg-white/10 p-4 rounded-full mb-4">
                      <FaLock size={24} />
                    </div>
                    <h4 className="font-bold text-lg mb-1">
                      {tpl.accessLevel} Template
                    </h4>
                  </div>
                )}

                {/* Template content */}
                <div
                  className={`flex flex-col items-center h-full p-6 ${
                    tpl.titlePlacement === "top"
                      ? "justify-start"
                      : "justify-center"
                  }`}
                >
                  <div className="relative mb-6 group">
                    {/* Avatar/Image */}
                    <img
                      src={tpl.imageUrl || Avatar}
                      alt="avatar"
                      className="w-28 h-28 rounded-full border-4 border-white/90 shadow-lg object-cover transition-transform group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse"></div>
                    )}
                  </div>

                  <div className="text-center mb-6">
                    {/* Title */}
                    <h2
                      className={`font-bold text-2xl text-center mb-2 flex-shrink-0 ${
                        tpl.textColor
                      } ${
                        tpl.titlePlacement === "top" ? "order-first" : ""
                      }`}
                    >
                      {tpl.name || "No title provided"}
                    </h2>

                    {/* Bio */}
                    <p
                      className={`text-sm text-center mb-6 px-4 leading-relaxed flex-shrink-0 ${
                        tpl.textColor
                      } ${
                        tpl.bioPlacement === "top"
                          ? "order-first mb-4"
                          : ""
                      }`}
                    >
                      {tpl.bio || "No bio provided."}
                    </p>
                  </div>

                  {/* Social Icons */}    
                  <div className="flex space-x-4 text-lg mb-8">
                    <FaInstagram className="hover:text-[#E1306C] transition-colors cursor-pointer" />
                    <FaFacebookF className="hover:text-[#3b5998] transition-colors cursor-pointer" />
                    <FaXTwitter className="hover:text-[#1DA1F2] transition-colors cursor-pointer" />
                    <FaLinkedin className="hover:text-[#0077b5] transition-colors cursor-pointer" />
                  </div>

                  {/* Call-to-action buttons */}    
                  <div className="w-full mt-auto space-y-3">
                    <button
                      className="w-full flex items-center justify-between gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-white/90 hover:bg-white transition-all shadow-sm"
                      style={{ color: tpl.buttonTextColor  }}
                    >
                      <FaYoutube className="text-red-500" /> <span className="text-sm" style={{color: tpl.buttonTextColor }}>YouTube</span> <span/>
                    </button>
                    <button
                      className="w-full flex items-center justify-between gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-white/90 hover:bg-white transition-all shadow-sm"
                      style={{ color: tpl.textColor || "#333333" }}
                    >
                      <FaInstagram className="text-pink-500" /> <span className="text-sm" style={{color: tpl.buttonTextColor }}>Instagram</span> <span/>
                    </button>
                    <button
                      className="w-full flex items-center justify-between gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-white/90 hover:bg-white transition-all shadow-sm"
                      style={{ color: tpl.textColor || "#333333" }}
                    >
                      <FaTiktok className="text-black" /> <span className="text-sm" style={{color: tpl.buttonTextColor }}>TikTok</span> <span/>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Optional section below templates */}  
        {template && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          ></motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TemplateComponent;
