import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiX, FiCheck, FiShare2, FiEdit } from "react-icons/fi";
import { toast } from "react-hot-toast";
import userApi from "../../../services/userApi";

const DomainCard = ({ userProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSlug, setNewSlug] = useState(userProfile?.slug || "");
  const [slugAvailable, setSlugAvailable] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState("");
  const location = useLocation();

  // Checks if the provided slug is available for use.
  const checkSlugAvailability = async (slug) => {
    if (!slug) {
      setSlugAvailable(false);
      setSlugError("");
      return;
    }

    setCheckingSlug(true);
    setSlugError("");

    try {
      // api to check slug availability
      const available = await userApi.checkSlugAvailability(slug);
      setSlugAvailable(available);
    } catch (error) {
      // Handle API errors
      if (error.response?.status === 409) {
        setSlugError("This username is already taken");
      } else {
        setSlugError("Error checking username availability");
      }
      setSlugAvailable(false);
    } finally {
      setCheckingSlug(false);
    }
  };

  // Automatically re-check slug availability whenever the user changes it
  useEffect(() => {
    if (newSlug) {
      checkSlugAvailability(newSlug);
    }
  }, [newSlug]);

  // Updates the slug input field value while ensuring it's lowercase and contains only allowed characters (a–z, 0–9, hyphens).  
  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setNewSlug(value);
  };

  // Saves the new slug to the backend if it’s valid and available and Also updates the local userProfile object
  const saveSlug = async () => {
    if (!slugAvailable || checkingSlug || !newSlug) return;

    try {
      const api = (await import("../../../utils/api")).default;
      await api.post("/api/v1/user/slug", { slug: newSlug });
      userProfile.slug = newSlug;
      setIsEditing(false);
      toast.success("Username updated successfully");
    } catch (error) {
      setSlugError("Failed to save username. Please try again.");
    }
  };

  // Cancels editing mode and resets all temporary slug-related states.
  const cancelEditing = () => {
    setNewSlug(userProfile?.slug || "");
    setSlugError("");
    setSlugAvailable(false);
    setIsEditing(false);
  };

  // Copies the user’s public profile link (based on route) to the clipboard.
  const copyProfileLink = () => {
    if (location.pathname.includes("/digital-card")) {
      const profileUrl = `${window.location.origin}/card/${userProfile.slug}`;
      navigator.clipboard.writeText(profileUrl);
    } else {
      const profileUrl = `${window.location.origin}/link/${userProfile.slug}`;
      navigator.clipboard.writeText(profileUrl);
    }
    toast.success("Profile link copied to clipboard!");
  };

  // Hide component if user has no slug and is not currently editing
  if (!userProfile?.slug && !isEditing) {
    return null;
  }

  // Base URL depends on the section (digital card or link page)
  const baseUrl = location.pathname.includes("/digital-card") 
    ? 'weblinqo.com/card/' 
    : 'weblinqo.com/link/';

  return (
    <div
      className={`max-w-3xl mx-auto rounded-xl shadow-sm ${
        !isEditing ? "p-2" : "p-4"
      } border border-primary border-1 bg-primary/10 hover:shadow-md transition-all duration-200`}
    >
      {isEditing ? (
        // Edit mode
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-800">Edit Username</h3>
            <button
              onClick={cancelEditing}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX />
            </button>
          </div>

          {/* Editable Input Field */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 whitespace-nowrap mr-2">
                {baseUrl}
              </span>
              <div className="flex-1 relative">
                <input
                  value={newSlug}
                  onChange={handleSlugChange}
                  className="w-full py-2.5 px-3 text-sm rounded-lg border border-gray-300 focus:ring-1 focus:ring-grey focus:border-grey outline-none transition-all bg-white"
                  autoFocus
                  spellCheck={false}
                />
              </div>
            </div>


            {/* Slug Status */}
            <div className="text-xs flex items-center px-1">
              {checkingSlug ? (
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></span>
                  Checking availability...
                </span>
              ) : slugError ? (
                <span className="text-red-500 flex items-center gap-1.5">
                  <FiX size={10} /> {slugError}
                </span>
              ) : slugAvailable && newSlug ? (
                <span className="text-black flex items-center gap-1.5">
                  <FiCheck size={10} /> Available!
                </span>
              ) : null}
            </div>

             {/* Action Buttons: Cancel / Save */}    
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSlug}
                disabled={!slugAvailable || checkingSlug || !newSlug}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  slugAvailable && !checkingSlug && newSlug
                    ? "bg-black hover:bg-gray-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        // view mode
        <div className="flex items-center gap-1 rounded-lg transition-colors group">
          {/* Copy Link Button */}
          <button
            onClick={copyProfileLink}
            className="flex items-center gap-2 text-sm font-medium text-gray-900 px-4 py-1 min-w-0 w-full flex-1 text-left"
          >
            <span className="flex items-center gap-2 text-primary font-semibold">
              <span className="hidden md:block text-gray-500 font-medium">Your URL is live here :</span>{" "}
              {baseUrl}
              {userProfile.slug}
            </span>
          </button>
          <div className="flex border-l border-gray-300 h-full">
            {/* Open Profile in New Tab */}
            <button
              onClick={() => window.open(`${location.pathname.includes("/digital-card") ? `/card/${userProfile.slug}` : `/link/${userProfile.slug}`}`, "_blank")}
              className="p-2 text-gray-500 hover:text-black transition-colors"
              aria-label="Open profile"
            >
              <FiShare2 size={14} />
            </button>
            {/* Enable Edit Mode */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-black transition-colors"
              aria-label="Edit username"
            >
              <FiEdit size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(DomainCard);
