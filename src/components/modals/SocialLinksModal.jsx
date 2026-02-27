import React, { useState, useEffect, useMemo } from "react";
import {
  FaTimes,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaTiktok
} from "react-icons/fa";
import { RiThreadsLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import CustomDropdown from "../shared/custom-dropdown";
import { FaXTwitter } from "react-icons/fa6";

const SocialLinksModal = ({
  isOpen,
  onClose,
  onCreateSocialLink,
  onUpdateSocialLink,
  isLoading,
  socialLinkObj,
  allLinks,
  isEditMode = false,
  // New props for digital card profile mode
  isDcProfile = false,
  userDcProfile = null,
}) => {
  const [platform, setPlatform] = useState("INSTAGRAM");
  const [url, setUrl] = useState("");

  // Load existing social link data when modal opens
  useEffect(() => {
    if (isOpen && socialLinkObj) {
      if (isDcProfile) {
        // For digital card profile mode, socialLinkObj contains { platform, url }
        setPlatform(socialLinkObj.platform || "INSTAGRAM");
        setUrl(socialLinkObj.url || "");
      } else {
        // For regular links mode
        setPlatform(socialLinkObj.platform || "INSTAGRAM");
        setUrl(socialLinkObj.url || "");
      }
    } else if (isOpen && !socialLinkObj) {
      // Reset form when opening without existing data
      if (isDcProfile) {
        // For digital card profile mode, check userDcProfile.socials
        const availablePlatforms = platformOptions.filter(option => 
          !userDcProfile?.socials?.[option.value.toLowerCase()] || 
          userDcProfile.socials[option.value.toLowerCase()].trim() === ''
        );
        setPlatform(availablePlatforms.length > 0 ? availablePlatforms[0].value : 'INSTAGRAM');
        setUrl('');
      } else {
        // For regular links mode, use allLinks array
        const availablePlatforms = platformOptions.filter(option => 
          !(allLinks || []).some(link => 
            ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'THREADS'].includes(link.platform) && 
            link.platform === option.value
          )
        );
        setPlatform(availablePlatforms.length > 0 ? availablePlatforms[0].value : 'INSTAGRAM');
        setUrl('');
      }
    }
  }, [isOpen, socialLinkObj, allLinks, isDcProfile, userDcProfile]);

  // Supported social platforms with icons
  const platformOptions = [
    { value: 'INSTAGRAM', label: 'Instagram', icon: <FaInstagram /> },
    { value: 'FACEBOOK', label: 'Facebook', icon: <FaFacebook /> },
    { value: 'TWITTER', label: 'Twitter', icon: <FaXTwitter /> },
    { value: 'LINKEDIN', label: 'LinkedIn', icon: <FaLinkedin /> },
    { value: 'YOUTUBE', label: 'YouTube', icon: <FaYoutube /> },
    { value: 'TIKTOK', label: 'TikTok', icon: <FaTiktok /> },
    { value: 'THREADS', label: 'Threads', icon: <RiThreadsLine /> },
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

    if (isDcProfile) {
      // For digital card profile mode
      if (socialLinkObj) {
        // Update existing social link
        onUpdateSocialLink(platform, url.trim());
      } else {
        // Create new social link
        onCreateSocialLink(platform, url.trim());
      }
    } else {
      // For regular links mode
      if (socialLinkObj) {
        // Update existing social link
        onUpdateSocialLink(socialLinkObj.id, {
          platform: platform,
          url: url.trim(),
        });
      } else {
        // Create new social link
        onCreateSocialLink(platform, url.trim());
      }
    }
  };

  // reset form handler
  const resetForm = () => {
    if (isDcProfile) {
      // For digital card profile mode, check userDcProfile.socials
      const availablePlatforms = platformOptions?.filter(option => 
        !userDcProfile?.socials?.[option.value.toLowerCase()] || 
        userDcProfile.socials[option.value.toLowerCase()].trim() === ''
      );
      setPlatform(availablePlatforms.length > 0 ? availablePlatforms[0].value : "INSTAGRAM");
      setUrl("");
    } else {
      // For regular links mode, use allLinks array
      const availablePlatforms = platformOptions?.filter(
        (option) =>
          !(allLinks || []).some(
            (link) =>
              [
                "INSTAGRAM",
                "FACEBOOK",
                "TWITTER",
                "LINKEDIN",
                "YOUTUBE",
                "TIKTOK",
                "THREADS",
              ].includes(link.platform) && link.platform === option.value
          )
      );
      setPlatform(
        availablePlatforms.length > 0 ? availablePlatforms[0].value : "INSTAGRAM"
      );
      setUrl("");
    }
  };

  // Reset form to initial state
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Return URL input placeholder based on selected platform
  const getPlaceholder = () => {
    switch (platform) {
      case "INSTAGRAM":
        return "Enter your Instagram profile URL (e.g., https://instagram.com/username)";
      case "FACEBOOK":
        return "Enter your Facebook profile/page URL";
      case "TWITTER":
        return "Enter your Twitter profile URL (e.g., https://twitter.com/username)";
      case "LINKEDIN":
        return "Enter your LinkedIn profile URL";
      case "YOUTUBE":
        return "Enter your YouTube channel URL";
      case "TIKTOK":
        return "Enter your TikTok profile URL";
      case "THREADS":
        return "Enter your Threads profile URL";
      default:
        return "Enter social media profile URL";
    }
  };

  // Filter social links based on mode
  const socialLinks = useMemo(() => {
    if (isDcProfile) {
      // For digital card profile mode, convert socials object to array format
      return userDcProfile?.socials ? Object.entries(userDcProfile.socials)
        .filter(([platform, url]) => url && url.trim() !== '')
        .map(([platform, url]) => ({
          platform: platform.toUpperCase(),
          url: url
        })) : [];
    } else {
      // For regular links mode, filter from allLinks array
      return allLinks
        ? allLinks.filter((link) =>
            [
              "INSTAGRAM",
              "FACEBOOK",
              "TWITTER",
              "LINKEDIN",
              "YOUTUBE",
              "TIKTOK",
              "THREADS",
            ].includes(link?.platform)
          )
        : [];
    }
  }, [isDcProfile, userDcProfile, allLinks]);

  // Filter out already used platforms from dropdown options
  const availablePlatforms = platformOptions?.filter(
    (option) => !socialLinks.some((link) => link?.platform === option?.value)
  );

  // If editing, include the current platform in available options
  const finalPlatformOptions = socialLinkObj
    ? platformOptions?.filter(
        (option) =>
          option?.value === socialLinkObj?.platform ||
          !socialLinks.some((link) => link?.platform === option?.value)
      )
    : availablePlatforms;

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
                {socialLinkObj ? "Edit Social Link" : "Add Social Link"}
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
                <CustomDropdown
                  options={finalPlatformOptions}
                  value={platform}
                  onChange={setPlatform}
                  disabled={isEditMode && socialLinkObj}
                />
                {isEditMode && socialLinkObj && (
                  <p className="text-xs text-gray-500 mt-1">
                    Platform cannot be changed when editing existing links
                  </p>
                )}
              </div>

              {/* URL Field */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Profile URL:
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
                  disabled={isLoading || !platform || !url.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {socialLinkObj ? "Updating..." : "Creating..."}
                    </div>
                  ) : socialLinkObj ? (
                    "Update Social Link"
                  ) : (
                    "Create Social Link"
                  )}
                </button>
              </div>

              {/* Existing Social Links Display */}
              {/* {socialLinks.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Your Social Links:</h3>
                  <div className="space-y-2">
                    {socialLinks.map((link) => (
                      <div key={link.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-gray-600">
                              {getPlatformIcon(link.platform)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gray-600">
                                  {getPlatformLabel(link.platform)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 break-all">
                                {link.url}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setPlatform(link.platform);
                                setUrl(link.url);
                                // You can add logic here to switch to edit mode
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Edit Social Link"
                            >
                              <FaEdit size={14} />
                            </button>
                            {onDeleteSocialLink && (
                              <button
                                onClick={() => onDeleteSocialLink(link.id)}
                                className="p-1 text-red-400 hover:text-red-600 transition-colors"
                                title="Delete Social Link"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialLinksModal;
