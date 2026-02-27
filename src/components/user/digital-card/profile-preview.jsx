import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaInstagram,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaGithub,
  FaBehance,
  FaDribbble,
  FaPinterest,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import useUserStore from "../../../stores/userStore";
import logo from "../../../assets/images/logos/logo-icon.png";
import Avatar from "../../../assets/avatar.jpg";
import {
  trackCardTap,
  trackCardSocialTap,
} from "../../../services/dcAnalyticsApi";

const DcProfilePreview = ({
  template = null,
  userData = null,
  isPreview = false,
  className = "",
}) => {
  const { userDcProfile, userProfile, subscription } = useUserStore();
  // Use provided data or fallback to user store data
  const profileData = userData || userDcProfile;
  const templateData = template || profileData.template;

  // Default template colors if none provided
  const defaultTemplate = {
    id: 1,
    uppercolor: "#0D569A",
    bottomcolor: "rgba(13, 86, 154, 0.25)",
    textcolor: "white",
  };

  const currentTemplate = templateData || defaultTemplate;

  // Social media icons mapping
  const getSocialIcon = (platform) => {
    const iconMap = {
      facebook: <FaFacebookF className="text-blue-600" />,
      instagram: <FaInstagram className="text-pink-600" />,
      twitter: <FaXTwitter className="text-black" />,
      linkedin: <FaLinkedinIn className="text-blue-700" />,
      youtube: <FaYoutube className="text-red-600" />,
      tiktok: <FaTiktok className="text-black" />,
      snapchat: <FaSnapchat className="text-yellow-400" />,
      whatsapp: <FaWhatsapp className="text-green-600" />,
      telegram: <FaTelegram className="text-blue-500" />,
      discord: <FaDiscord className="text-indigo-600" />,
      github: <FaGithub className="text-gray-800" />,
      behance: <FaBehance className="text-blue-600" />,
      dribbble: <FaDribbble className="text-pink-500" />,
      pinterest: <FaPinterest className="text-red-600" />,
    };
    return (
      iconMap[platform?.toLowerCase()] || <FaGlobe className="text-gray-600" />
    );
  };

  // Contact info icons mapping
  const getContactIcon = (type) => {
    const iconMap = {
      address: (
        <FaHome
          style={{ color: currentTemplate.buttonTextColor }}
          className="text-blue-600"
        />
      ),
      email: (
        <FaEnvelope
          style={{ color: currentTemplate.buttonTextColor }}
          className="text-blue-600"
        />
      ),
      phone: (
        <FaPhone
          style={{ color: currentTemplate.buttonTextColor }}
          className="text-blue-600"
        />
      ),
      website: (
        <FaGlobe
          style={{ color: currentTemplate.buttonTextColor }}
          className="text-blue-600"
        />
      ),
    };
    return (
      iconMap[type?.toLowerCase()] || <FaGlobe className="text-blue-600" />
    );
  };

  // Convert socials object to array
  const socialArr = profileData.socials
    ? Object.entries(profileData.socials).map(([platform, url]) => ({
        platform,
        url,
      }))
    : [];

  // Filter and prepare social links
  const socialLinks =
    socialArr?.filter((link) =>
      [
        "facebook",
        "instagram",
        "twitter",
        "linkedin",
        "youtube",
        "tiktok",
        "snapchat",
        "whatsapp",
        "telegram",
        "discord",
        "github",
        "behance",
        "dribbble",
        "pinterest",
      ].includes(link.platform?.toLowerCase())
    ) || [];

  // Filter and prepare contact info
  const contactInfo =
    profileData.links?.filter((link) =>
      ["address", "email", "phone", "website"].includes(
        link.type?.toLowerCase()
      )
    ) || [];

  // Default contact info if none provided
  const defaultContactInfo = [
    {
      type: "ADDRESS",
      title: "Address",
      value: profileData.address || "Your Address",
      visible: profileData?.addressVisible,
    },
    {
      type: "EMAIL",
      title: "Email",
      value: profileData.email || "your.email@example.com",
      visible: profileData?.emailVisible,
    },
    {
      type: "PHONE",
      title: "Phone",
      value: profileData.phone || "+1 (555) 123-4567",
      visible: profileData?.phoneVisible,
    },
    {
      type: "WEBSITE",
      title: "Website",
      value: profileData.website || "www.yourwebsite.com",
      visible: profileData?.websiteVisible,
    },
  ];

  const displayContactInfo =
    contactInfo.length > 0 ? contactInfo : defaultContactInfo;

  // Handle contact info tap tracking and redirection
  const handleContactTap = async (type, value) => {
    if (!userDcProfile?.slug) return;

    try {
      // Track the tap (except for address)
      if (type !== "ADDRESS") {
        await trackCardTap(userDcProfile?.slug, type);
      }

      // Handle redirection based on contact type
      switch (type) {
        case "EMAIL":
          if (value && value.includes("@")) {
            window.open(`mailto:${value}`, "_blank");
          }
          break;
        case "CALL":
          if (value) {
            // Clean phone number (remove spaces, dashes, parentheses)
            const cleanPhone = value.replace(/[\s\-\(\)]/g, "");
            window.open(`tel:${cleanPhone}`, "_blank");
          }
          break;
        case "WEBSITE":
          if (value) {
            // Add https:// if no protocol is specified
            let url = value;
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
              url = `https://${url}`;
            }
            window.open(url, "_blank");
          }
          break;
        case "ADDRESS":
          if (value) {
            // Open Google Maps with the address
            const encodedAddress = encodeURIComponent(value);
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
              "_blank"
            );
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Failed to track contact tap:", error);
      // Don't show error to user as this is just tracking
    }
  };

  // Handle social link tap tracking without blocking navigation
  const handleSocialTap = (platform) => {
    try {
      if (userProfile?.slug && platform) {
        // Fire-and-forget to avoid blocking navigation
        trackCardSocialTap(userProfile.slug, platform.toLowerCase());
      }
    } catch (error) {
      // Swallow errors since this is best-effort analytics
      console.error("Failed to track social tap:", error);
    }
  };

  // background style
  const backgroundStyle =
    currentTemplate?.upperBgColor?.startsWith("http") ||
    currentTemplate?.upperBgColor?.startsWith("data:")
      ? {
          backgroundImage: `url(${currentTemplate?.upperBgColor})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // backgroundAttachment: 'fixed',
        }
      : {
          backgroundColor: currentTemplate?.upperBgColor || "transparent",
          background: currentTemplate?.upperBgColor,
        };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${className} w-full`}
    >
      <div
        style={{
          aspectRatio: "9/16",
          minHeight: "320px",
          maxHeight: !isPreview ? "90vh" : "100%",
          background: `${currentTemplate.bottomBgColor}`,
        }}
        className="rounded-xl shadow-lg overflow-auto scrollbar-hide flex flex-col max-w-sm mx-auto"
      >
        {/* Top Section */}
        <div
          style={backgroundStyle}
          className="text-center flex flex-col items-center p-6 py-8 rounded-t-xl relative"
        >
          {/* Profile Image */}
          <div className="relative">
            <img
              src={profileData.avatar || Avatar}
              alt={profileData.title || "Profile"}
              className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-white shadow-lg"
            />
          </div>

          {/* Name/Title */}
          <h2
            style={{ color: `${currentTemplate.textColor}` }}
            className="font-bold text-size-14 mt-3 text-center"
          >
            {profileData.title || profileData.name || "Your Name"}
          </h2>

          {/* Designation */}
          {profileData.designation && (
            <p
              style={{ color: `${currentTemplate.textColor}` }}
              className="text-xs mt-1 opacity-90 text-center max-w-[200px]"
            >
              {profileData.designation}
            </p>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 &&
          subscription?.planName?.toLowerCase() !== "free" ? (
            <div className="absolute flex justify-center gap-2 bottom-[-10px] flex-wrap max-w-[200px]">
              {socialLinks.slice(0, 4).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-1 rounded-full shadow hover:scale-105 transition-all duration-200"
                  title={link.title || link.platform}
                  onClick={() => handleSocialTap(link.platform)}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {/* Contact Info Section */}
        <div
          style={{ background: `${currentTemplate.bottomcolor}` }}
          className="flex-1 flex flex-col"
        >
          <div className="pb-1 pt-8 px-4 space-y-3 flex-1">
            {displayContactInfo
              .slice(0, 4)
              .filter((contact) => contact?.visible === true)
              .map((contact, index) => {
                const isOutlined = currentTemplate.buttonStyle === "outlined";
                return (
                  <div
                    key={index}
                    style={{
                      background: isOutlined
                        ? "transparent"
                        : currentTemplate.buttonColor,
                      border: isOutlined
                        ? `2px solid ${currentTemplate.buttonColor}`
                        : "none",
                    }}
                    className="flex items-start gap-3 bg-white p-2 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      handleContactTap(contact.type, contact.value)
                    }
                  >
                    <span className="flex items-center justify-center w-4 h-4 mt-0.5">
                      {getContactIcon(contact.type)}
                    </span>
                    <span
                      style={{ color: currentTemplate.buttonTextColor }}
                      className="text-size-12 text-gray-700 text-wrap break-words flex-1 min-w-0"
                    >
                      {contact.value || contact.title}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Footer with Logo */}
          <div className="py-3 px-4 justify-center items-center flex">
            {profileData?.brandingEnabled && (
              <img
                src={logo}
                className="h-14 object-contain opacity-80 bg-white rounded-full p-1"
                alt="Logo"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DcProfilePreview;
