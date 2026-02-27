import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdDragIndicator } from "react-icons/md";
import { FaEdit, FaTrash, FaInstagram, FaFacebookF, FaLinkedin, FaYoutube, FaTiktok, FaCamera, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { linkApi } from "../../../../services/linkApi";
import { userApi } from "../../../../services/userApi";
import { getIconForPlatform } from "../../../../utils/constant";
import { FaXTwitter } from "react-icons/fa6";
import Switch from "../../../common/ui/switch";
import useLoaderStore from "../../../../stores/loaderStore";

const LinkItem = ({ link, setLinks, onDeleteLink, isDraggable, features, onUpdateLink, onEditSocialLink, plan }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: link?.title,
    url: link?.url,
    startDate: link?.startDate ? new Date(link?.startDate).toISOString().slice(0, 10) : "",
    endDate: link?.endDate ? new Date(link?.endDate).toISOString().slice(0, 10) : "",
  });
  const fileInputRef = useRef(null);
  const [customIcon, setCustomIcon] = useState(null);
  const [customIconUrl, setCustomIconUrl] = useState(link?.iconUrl || "");
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const { showLoader, hideLoader } = useLoaderStore();

  // Handles uploading a custom icon to the server.
  const handleIconUpload = async (file) => {
    // console.log("file", file);
    if (!file) return;
    try {
      setIsUploadingIcon(true);
      const result = await linkApi.uploadLinkIcon(file);
      if (result && result.iconUrl) {
        setCustomIconUrl(result?.iconUrl);
      } else {
        setCustomIconUrl(result);
      }
    } catch (error) {
      console.error("Error uploading icon:", error);
    } finally {
      setIsUploadingIcon(false);
    }
  };

  // Triggered when user selects a file for custom icon upload.
  const handleIconFileSelect = (e) => {
    console.log("e", e);
    const file = e.target.files[0];
    console.log("file", file);
    if (file) {
      setCustomIcon(file);
      handleIconUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // reset input
      }
    }
  };

  // Toggles the visibility (enabled/disabled) of a link.
  const handleToggleVisibility = async () => {
    console.log("handleToggleVisibility");
    showLoader();
    try {
      const result = await linkApi?.toggleLink(link?.id, !link?.enabled);
      if (result) {
        const updatedProfile = await userApi.fetchUserProfile();
        if (updatedProfile) {
          setLinks(updatedProfile.links);
        } else {
          throw new Error("Failed to fetch updated user profile");
        }
      }
    } catch (error) {
      console.error("Error toggling link visibility:", error);
      toast.error("Failed to toggle link visibility");
    } finally {
      hideLoader();
    }
  };

  // Saves link changes after editing.
  const saveChanges = () => {
    if (!form.title.trim() || !form.url.trim()) {
      toast.error("Title and URL are required");
      return;
    }
    // Prevent scheduling if not available in plan
    if (!features?.linkScheduling && (form.startDate || form.endDate)) {
      toast.error("Link scheduling not allowed on your current plan");
      return;
    }
    // Trigger update callback
    onUpdateLink(link?.id, {
      title: form.title,
      url: form.url,
      startDate: form.startDate ? new Date(form.startDate) : null,
      endDate: form.endDate ? new Date(form.endDate) : null,
      platform: link?.platform,
      isActive: link?.isActive,
      iconUrl: customIconUrl,
    });
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`bg-offWhite rounded-lg border border-[#e0ddd9] px-4 py-3 transition-colors hover:shadow-sm`}>
      {isEditing ? (
        //  Editing Mode
        <div className="w-full space-y-2">
          {/* Title Input & URL Input  */}
          <input className="w-full px-2 py-1 border rounded text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="w-full px-2 py-1 border rounded text-sm" placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          {/* Custom Icon Upload Section (for CUSTOM_LINK only) */}
          {link?.platform === "CUSTOM_LINK" && (
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Custom Icon (Optional)</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleIconFileSelect} className="hidden" disabled={isUploadingIcon} />
                  <div className={`flex items-center gap-2 px-2 py-1 border border-gray-200 rounded text-xs hover:bg-gray-50 transition-colors ${isUploadingIcon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                    <FaCamera className="text-gray-400 text-xs" />
                    <span className="text-gray-600">{isUploadingIcon ? "Uploading..." : customIcon ? customIcon.name : "Upload Icon"}</span>
                    {isUploadingIcon && <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                  </div>
                </label>
                {/* Predefined Social Icons for Quick Selection */}
                <div className="flex items-center gap-1">
                  {[
                    { name: "Instagram", icon: <FaInstagram className="text-[#E1306C]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/174/174855.png" },
                    { name: "Facebook", icon: <FaFacebookF className="text-[#3b5998]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/124/124010.png" },
                    { name: "Twitter", icon: <FaXTwitter className="text-[#1DA1F2]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/124/124021.png" },
                    { name: "LinkedIn", icon: <FaLinkedin className="text-[#0077B5]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
                    { name: "YouTube", icon: <FaYoutube className="text-[#FF0000]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/174/174883.png" },
                    { name: "TikTok", icon: <FaTiktok className="text-black" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/3046/3046120.png" },
                  ].map((social, index) => (
                    <button key={index} onClick={() => { if (!isUploadingIcon) { setCustomIconUrl(social.url); } }} disabled={isUploadingIcon} className={`p-1 rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors ${isUploadingIcon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} title={`Use ${social.name} icon`}>
                      {social.icon}
                    </button>
                  ))}
                </div>
                 {/* Display current selected icon with option to remove */}
                {customIconUrl && (
                  <div className="flex items-center gap-1">
                    <img src={customIconUrl} alt="Custom Icon" className="w-4 h-4 rounded object-cover" />
                    <button onClick={() => { setCustomIcon(null); setCustomIconUrl(""); }} className="text-red-500 hover:text-red-600 transition-colors" title="Remove icon">
                      <FaTimes size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Link Scheduling Fields (if feature enabled) */}
          <div className="flex gap-2">
            <input type="date" className="w-full px-2 py-1 border rounded text-sm" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} disabled={!features?.linkScheduling} />
            <input type="date" className="w-full px-2 py-1 border rounded text-sm" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={!features?.linkScheduling} />
          </div>
          {/* Save / Cancel Buttons */}
          <div className="flex gap-2">
            <button className="text-sm text-white bg-black px-3 py-1 rounded hover:bg-primary" onClick={saveChanges}>Save</button>
            <button className="text-sm text-gray-600 border px-3 py-1 rounded hover:bg-gray-100" onClick={() => { setIsEditing(false); setCustomIcon(null); setCustomIconUrl(link.iconUrl || ""); }}>Cancel</button>
          </div>
        </div>
      ) : (
        // view mode
        <div className="flex items-center justify-between gap-2">
          {/* Drag handle */}
          <div className={`text-black ${isDraggable ? "cursor-grab" : "opacity-40 cursor-not-allowed"}`} title={isDraggable ? "Drag to reorder" : "Reordering not allowed on current plan"}>
            <MdDragIndicator size={20} />
          </div>
          {/* Platform Icon */}
          <div className="flex-shrink-0">{getIconForPlatform(link?.platform)}</div>
          {/* Link Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm text-blue-600 truncate">{link?.title}</p>
            </div>
          </div>
          {/* Visibility Toggle (hidden for built-in features) */}
          {link?.title !== "Appointments" && link?.title !== "Poles" && (
            <div className="flex-shrink-0">
              <Switch
                checked={link?.enabled !== false}
                onChange={handleToggleVisibility}
                ariaLabel={`${link?.enabled !== false ? "Hide" : "Show"} ${link?.title}`}
              />
            </div>
          )}
          {/* Edit Button */}
          <button onClick={() => { const isSocialLink = ["INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "YOUTUBE", "TIKTOK", "THREADS"].includes(link?.platform); if (isSocialLink && onEditSocialLink) { onEditSocialLink(link); } else { setIsEditing(true); } }} className="p-1 text-black hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-gray-100 active:scale-95 rounded-full transition-all duration-150" aria-label={`Edit ${link?.title}`} tabIndex={0}>
            <FaEdit size={16} />
          </button>
          {/* Delete Button (hidden for system links) */}
            <button onClick={() => onDeleteLink(link.id)} className="p-1 text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 hover:bg-gray-100 active:scale-95 rounded-full transition-all duration-150" aria-label={`Delete ${link?.title}`} tabIndex={0}>
              <FaTrash size={16} />
            </button>
        </div>
      )}
    </motion.div>
  );
};

export default LinkItem;


