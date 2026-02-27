import React, { useState } from "react";
import {
  FaCamera,
  FaVideo,
  FaEnvelope,
  FaPlus,
  FaTimes,
  FaEdit,
  FaCheck,
  FaLink,
} from "react-icons/fa";
import { getIconForPlatform } from "../../../../utils/constant";
import { FiDownload } from "react-icons/fi";
import defaultImg from "../../../../assets/dummy-user.jpg";
import useLoaderStore from "../../../../stores/loaderStore";
import { TiBusinessCard } from "react-icons/ti";
import Modal from "../appearance/downloadable-templates-modal";
import useUserStore from "../../../../stores/userStore";
import PlanBadge from "../../../common/ui/plan-badge";

const ProfileCard = ({
  userProfile,
  isEditingName,
  isEditingTagline,
  setIsEditingName,
  setIsEditingTagline,
  handleNameSave,
  handleTaglineSave,
  onProfileChange,
  onProfileImageChange,
  uploadProfileImage,
  setIsVideoModalOpen,
  setIsCtaModalOpen,
  setIsSocialLinksModalOpen,
  onDeleteLink,
  handleEditSocialLink,
}) => {
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const { showLoader, hideLoader } = useLoaderStore();
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const { subscription } = useUserStore();

  // handle avatar image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const newImageUrl = await uploadProfileImage(formData);
        onProfileImageChange(newImageUrl);
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    }
  };

  // download qr code for the profile
  const downloadQRCode = async () => {
    showLoader();
    const imageUrl = `${API_URL}/qr-codes/${userProfile?.qrId}.png`;

    try {
      const response = await fetch(imageUrl, {
        method: "get",
      });

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `qr-code-${userProfile?.qrId}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
      return;
    } catch (error) {
      console.log("CORS fetch failed, trying alternative method:", error);
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="max-w-3xl flex justify-center flex-col items-center mx-auto bg-offWhite rounded-xl shadow-sm p-6 border border-[#e0ddd9] hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-8 md:gap-4 justify-between w-full flex-col md:flex-row items-center">
        {/* Left Column: Profile Info & Social Links */}
        <div className="flex flex-col items-center gap-6 bg-white p-4 md:p-6 rounded-xl w-full max-w-[290px] md:max-w-[328px]">
          <div className="flex items-center gap-4 w-full flex-col md:flex-row">
            <div className="relative flex-shrink-0">
              {/* Profile Avatar */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#e0ddd9]">
                <img
                  src={userProfile.avatar || defaultImg}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {/* Overlay for editing avatar */}
                <label
                  className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200 cursor-pointer ${
                    isHoveringImage ? "opacity-100" : "opacity-0"
                  }`}
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full flex flex-col items-center">
                    <FaCamera className="text-white text-sm mb-0.5" />
                    <span className="text-white text-xs font-medium">Edit</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col items-center justify-center space-y-2 grow w-3/4">
              {isEditingName ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <input
                      value={userProfile.name}
                      onChange={(e) => onProfileChange("name", e.target.value)}
                      onBlur={handleNameSave}
                      onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                      maxLength={20}
                      className="text-lg w-full font-semibold border-b border-primary focus:outline-none bg-transparent text-gray-800"
                      autoFocus
                      placeholder="Enter your name"
                    />
                    <button
                      onClick={handleNameSave}
                      className="text-white bg-primary p-1 rounded hover:bg-primary transition-colors flex-shrink-0"
                    >
                      <FaCheck size={12} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {userProfile.name?.length || 0}/20 characters
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors w-full"
                  onClick={() => setIsEditingName(true)}
                >
                  <span className="text-lg font-semibold text-gray-800 truncate flex-1">
                    {userProfile.name || "Your name here"}
                  </span>
                  <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <FaEdit className="text-gray-400 text-size-16 w-fit hover:text-primary transition-colors" />
                  </span>
                </div>
              )}

              {/* Tagline/Bio */}
              {isEditingTagline ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <input
                      value={userProfile.designation}
                      onChange={(e) =>
                        onProfileChange("designation", e.target.value)
                      }
                      onBlur={handleTaglineSave}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleTaglineSave()
                      }
                      maxLength={20}
                      className="text-sm w-full text-gray-600 border-b border-gray-300 focus:outline-none bg-transparent"
                      autoFocus
                      placeholder="Enter your bio"
                    />
                    <button
                      onClick={handleTaglineSave}
                      className="text-white bg-primary p-1 rounded hover:bg-primary transition-colors flex-shrink-0"
                    >
                      <FaCheck size={12} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {userProfile.designation?.length || 0}/20 characters
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors w-full"
                  onClick={() => setIsEditingTagline(true)}
                >
                  <span className="text-sm text-gray-600 truncate flex-1">
                    {userProfile.designation || "Your tagline here"}
                  </span>
                  <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <FaEdit className="text-gray-400 text-size-16 w-fit hover:text-primary transition-colors" />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer text-primary transition-colors underline hover:text-primary/80">
              <FaLink className="text-primary text-sm" />
              <span className="text-sm text-primary font-medium">
                Social Links
              </span>
              <div
                onClick={() => subscription?.planName?.toLowerCase() === 'free' ? ()=>{} : setIsSocialLinksModalOpen(true)}
                className={`flex items-center gap-2 px-2.5 py-1.5 bg-primary rounded-md ${subscription?.planName?.toLowerCase() === 'free' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} hover:bg-primary/90 transition-colors`}
              >
                <FaPlus className="text-white text-size-12" />
              </div>
              {subscription?.planName?.toLowerCase() === 'free' && <PlanBadge/>}
            </div>
            {userProfile?.socials && subscription?.planName?.toLowerCase() !== 'free' && 
              Object.values(userProfile.socials).some(
                (url) => url && url.trim() !== ""
              ) && (
                <div className="flex items-center justify-center flex-wrap gap-5 mt-2 ">
                  {Object.entries(userProfile.socials)
                    ?.filter(([platform, url]) => url && url.trim() !== "")
                    ?.map(([platform, url]) => (
                      <div key={platform} className="relative group">
                        <div
                          onClick={() =>
                            handleEditSocialLink({
                              platform: platform.toUpperCase(),
                              url,
                            })
                          }
                          className="w-8 h-8 bg-white rounded-full border-2 border-[#e0ddd9] flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                          {getIconForPlatform(platform.toUpperCase())}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLink(platform);
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center transition-opacity duration-200 hover:bg-red-600"
                          title={`Delete ${platform}`}
                        >
                          <FaTimes size={8} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>
        {/* QR Code Section */}
        <div className="flex flex-col relative items-center space-y-4">
          <div className="w-40 h-40 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
            {/* Placeholder QR Code - you can replace this with an actual QR code library */}
            <img
              id="qr-code-image"
              src={`${API_URL}/qr-codes/${userProfile?.qrId}.png`}
              alt="QR Code"
              className="w-full h-full rounded-lg"
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Scan to view the website
          </p>

          {/* Download QR Code Button */}
          <button
            onClick={downloadQRCode}
            className="flex items-center gap-2 px-2 absolute top-[-30px] right-[-10px] py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        onClick={() => subscription?.planName?.toLowerCase() === 'premium' || subscription?.planName?.toLowerCase() === 'pro' ? setOpenDownloadModal(true) : ()=>{}}
        className={`mt-5 flex items-center gap-2 ${subscription?.planName?.toLowerCase() === 'premium' || subscription?.planName?.toLowerCase() === 'pro' ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'} hover:text-gray-700`}
      >
        <TiBusinessCard color="#2848f0" size={"1.2rem"} />
        <p className="text-sm font-medium text-[#2848f0] mb-0.5">
          Download your Digital Virtual Card
        </p>
      </div>
      {/* Downloadable Templates Modal */}
      <Modal isOpen={openDownloadModal} onClose={() => setOpenDownloadModal(false)} />
    </div>
  );
};

export default React.memo(ProfileCard);
