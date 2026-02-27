import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../../services/api";
import ProfileCardExt from "./profile-card";
import useLoaderStore from "../../../../stores/loaderStore";
import {
  FaAddressBook,
  FaCheck,
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";
import { dcLinkApi } from "../../../../services/dcLinkApi";
import Switch from "../../../common/ui/switch";
import PlanBadge from "../../../common/ui/plan-badge";

const DCLinksTab = ({ userDcProfile, setUserDcProfile, plan }) => {
  const [links, setLinks] = useState(userDcProfile.links || []);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...userDcProfile });
  const [features, setFeatures] = useState(null);
  const [removeBranding, setRemoveBranding] = useState(
    userDcProfile?.brandingEnabled || false
  );
  const [isSocialLinksModalOpen, setIsSocialLinksModalOpen] = useState(false);
  const [editingSocialLink, setEditingSocialLink] = useState(null);
  const { showLoader, hideLoader, loading } = useLoaderStore();
  const [fieldVisible, setFieldVisible] = useState({
    address: userDcProfile?.addressVisible,
    phone: userDcProfile?.phoneVisible,
    email: userDcProfile?.emailVisible,
    website: userDcProfile?.websiteVisible,
  });
  // Contact information states
  const [address, setAddress] = useState(userDcProfile?.address || "");
  const [phone, setPhone] = useState(userDcProfile?.phone || "");
  const [email, setEmail] = useState(userDcProfile?.email || "");
  const [website, setWebsite] = useState(userDcProfile?.website || "");

  // Editing states for each field
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  // Fetch latest digital card profile
  const fetchDcData = async () => {
    const res = await dcLinkApi.fetchDcData();
    if (res) {
      setUserDcProfile(res);
    }
  };

  // Fetch subscription features & initial DC profile
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await api.get("/api/v1/subscription/features");
        if (res.status === 200 || res.status === 201) {
          setFeatures(res.data.data);
        } else {
          console.log(res?.response?.data?.message);
        }
      } catch (error) {
        // toast.error("Failed to load plan features.");
        console.log(error?.response?.data?.message);
      }
    };
    fetchDcData();
    fetchFeatures();
  }, []);

  // Initialize remove branding state
  useEffect(() => {
    if (userDcProfile?.template) {
      if (userDcProfile?.brandingEnabled !== undefined) {
        setRemoveBranding(userDcProfile?.brandingEnabled);
      }
    }
  }, [userDcProfile]);

  // Update profile API call
  const updateProfile = async (data) => {
    showLoader();
    try {
      const res = await dcLinkApi.updateCard(data);
      return res.data;
    } finally {
      hideLoader();
    }
  };

  // Upload profile image & update Digital card profile
  const uploadProfileImage = async (file) => {
    showLoader();
    try {
      const res = await api.post("/api/v1/user/profile-image", file, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const profileImageUrl = res.data.data.profileImageUrl;

      // Save new image URL to user profile
      await updateProfile({
        name: editedProfile.name,
        designation: editedProfile.designation,
        avatar: profileImageUrl,
      });

      return profileImageUrl;
    } finally {
      hideLoader();
    }
  };

  // Delete a social link
  const deleteLink = async (platform) => {
    showLoader();
    try {
      const res = await dcLinkApi.deleteSocialLink(platform);
      if (res) {
        await dcLinkApi.fetchDcData();
        setEditedProfile(res);
      }
    } finally {
      hideLoader();
    }
  };

  // Save tagline
  const handleTaglineSave = useCallback(async () => {
    const { name, designation, avatar } = editedProfile;
    await updateProfile({ name, designation, avatar });
    setIsEditingTagline(false);
  }, [editedProfile]);

  // Save name
  const handleNameSave = useCallback(async () => {
    const { name, designation, avatar } = editedProfile;
    await updateProfile({ name, designation, avatar });
    setIsEditingName(false);
  }, [editedProfile]);

  // Update local edited profile
  const handleProfileChange = useCallback(
    (field, value) => {
      const updated = { ...editedProfile, [field]: value };
      setEditedProfile(updated);
      setUserDcProfile(updated);
    },
    [editedProfile, setUserDcProfile]
  );

  // handler for profile image change
  const handleProfileImageChange = useCallback(
    (url) => {
      const updated = { ...editedProfile, avatar: url };
      setEditedProfile(updated);
      setUserDcProfile(updated);
    },
    [editedProfile, setUserDcProfile]
  );

  // Open social links modal for editing
  const handleEditSocialLink = useCallback((link) => {
    // Check if the link is a social link
    const isSocialLink = [
      "INSTAGRAM",
      "FACEBOOK",
      "TWITTER",
      "LINKEDIN",
      "YOUTUBE",
      "TIKTOK",
      "THREADS",
    ].includes(link.platform);

    if (isSocialLink) {
      setEditingSocialLink(link);
      setIsSocialLinksModalOpen(true);
    }
  }, []);

  // Update a social link
  const handleUpdateSocialLink = useCallback(
    async (platform, url) => {
      try {
        showLoader();

        // Call the updateSocials API
        const result = await dcLinkApi.updateSocials({
          socials: {
            [platform.toLowerCase()]: url,
          },
        });

        if (result) {
          // Update the local state with the response data
          const updatedProfile = {
            ...editedProfile,
            socials: result.socials || { [platform.toLowerCase()]: url },
          };
          setEditedProfile(updatedProfile);
          setUserDcProfile(updatedProfile);

          // Close the modal
          setIsSocialLinksModalOpen(false);
          setEditingSocialLink(null);
        }
      } catch (error) {
        console.error("Error updating social links:", error);
      } finally {
        hideLoader();
      }
    },
    [editedProfile, setUserDcProfile]
  );

  // Delete a social link
  const handleDeleteSocialLink = useCallback(
    async (platform) => {
      try {
        showLoader();

        // Call the deleteSocialLink API
        const result = await dcLinkApi.deleteSocialLink(platform.toLowerCase());

        if (result) {
          // Update the local state by removing the social link
          const updatedSocials = { ...editedProfile.socials };
          delete updatedSocials[platform.toLowerCase()];

          const updatedProfile = { ...editedProfile, socials: updatedSocials };
          setEditedProfile(updatedProfile);
          setUserDcProfile(updatedProfile);
        }
      } catch (error) {
        console.error("Error deleting social link:", error);
      } finally {
        hideLoader();
      }
    },
    [editedProfile, setUserDcProfile]
  );

  // Toggle remove branding
  const handleBrandingToggle = useCallback(async () => {
    const newStatus = !removeBranding;

    try {
      showLoader();
      const result = await dcLinkApi.toggleBranding(newStatus);

      if (result) {
        // Update local state for immediate UI feedback
        setRemoveBranding(newStatus);
        // updateNested("template.removeBranding", newStatus);

        // Fetch updated profile to get the latest data
        const updatedProfile = await dcLinkApi.fetchDcData();
        if (updatedProfile) {
          // Success message is already handled in the linkApi service
        } else {
          throw new Error("Failed to fetch updated digital card profile");
        }
      } else {
        throw new Error("Failed to update branding status");
      }
    } catch (error) {
      console.error("Error toggling branding:", error);
      // Error message is already handled in the linkApi service
    } finally {
      hideLoader();
    }
  }, [removeBranding, setRemoveBranding]);

  // Toggle visibility of contact fields
  const handleFieldVisibleToggle = useCallback(
    async (field) => {
      const newStatus = !fieldVisible[field];

      try {
        showLoader();
        const result = await dcLinkApi.toggleFieldVisibility(field, newStatus);

        if (result) {
          // Update local state for immediate UI feedback
          setFieldVisible((prev) => ({
            ...prev,
            [field]: newStatus,
          }));
          // updateNested("template.removeBranding", newStatus);

          // Fetch updated profile to get the latest data
          const updatedProfile = await dcLinkApi.fetchDcData();
          if (updatedProfile) {
            // Success message is already handled in the linkApi service
          } else {
            throw new Error("Failed to fetch updated digital card profile");
          }
        } else {
          throw new Error("Failed to update field visibility status");
        }
      } catch (error) {
        console.error("Error toggling field visible:", error);
        // Error message is already handled in the linkApi service
      } finally {
        hideLoader();
      }
    },
    [fieldVisible, setFieldVisible]
  );

  // Reusable functions for contact field editing
  const handleEditClick = (field) => {
    setTempValues((prev) => ({
      ...prev,
      [field]: getFieldValue(field),
    }));
    setEditingField(field);
  };

  // Save contact field changes
  const handleSaveClick = async (field) => {
    const newValue = tempValues[field];
    setFieldValue(field, newValue);
    setEditingField(null);

    try {
      showLoader();
      const result = await dcLinkApi.updateCard({ [field]: newValue });
      if (result) {
        setUserDcProfile((prev) => ({
          ...prev,
          [field]: newValue,
        }));
        toast.success(
          `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } updated successfully`
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    } finally {
      hideLoader();
    }

    fetchDcData();
  };

  // handle cancel editing
  const handleCancelClick = () => {
    setEditingField(null);
  };

  // Helper functions
  const getFieldValue = (field) => {
    switch (field) {
      case "address":
        return address;
      case "phone":
        return phone;
      case "email":
        return email;
      case "website":
        return website;
      default:
        return "";
    }
  };

  const setFieldValue = (field, value) => {
    switch (field) {
      case "address":
        setAddress(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "website":
        setWebsite(value);
        break;
    }
  };

  // Get icons and labels for contact fields
  const getFieldIcon = (field) => {
    switch (field) {
      case "address":
        return FaAddressBook;
      case "phone":
        return FaPhone;
      case "email":
        return FaEnvelope;
      case "website":
        return FaGlobe;
      default:
        return FaAddressBook;
    }
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case "address":
        return "Address";
      case "phone":
        return "Phone";
      case "email":
        return "Email";
      case "website":
        return "Website";
      default:
        return field;
    }
  };

  // Reusable ContactField component
  const ContactField = ({ field, isFieldVisible }) => {
    const IconComponent = getFieldIcon(field);
    const label = getFieldLabel(field);
    const isEditing = editingField === field;
    const currentValue = getFieldValue(field);
    const tempValue = tempValues[field];

    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-3 lg:px-4 md:px-4 px-2 py-3 bg-offWhite rounded-lg border border-[#e0ddd9] relative">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2 flex-1 min-w-0">
            <IconComponent className="text-primary text-size-14 flex-shrink-0" />
            {/* {label} */}
            {isEditing ? (
              field === "phone" ? (
                <input
                  type="text"
                  className="text-sm border-none outline-none rounded-md px-2 py-1 font-medium text-gray-700 flex items-center gap-2 appearance-none lg:w-full md:w-full w-[10rem]"
                  value={tempValue}
                  onChange={(e) => {
                    const input = e.target.value;
                    // Allow only digits and limit to 12 characters
                    if (/^\d*$/.test(input) && input.length <= 12) {
                      setTempValues((prev) => ({
                        ...prev,
                        [field]: input,
                      }));
                    }
                  }}
                  placeholder="Enter phone number"
                  autoFocus
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ) : (
                <input
                  type="text"
                  className="text-sm border-none outline-none rounded-md px-2 py-1 font-medium text-gray-700 flex items-center gap-2 w-full min-w-0"
                  value={tempValue}
                  onChange={(e) =>
                    setTempValues((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  placeholder={`Enter ${label.toLowerCase()}`}
                  autoFocus
                />
              )
            ) : (
              <span className="text-sm font-medium py-1 text-gray-700 text-clip overflow-hidden w-full min-w-0">
                {currentValue || `please enter your ${label.toLowerCase()}`}
              </span>
            )}
          </span>
          <div className="flex items-center gap-3">
            {!isEditing && (
              <Switch
                checked={isFieldVisible}
                onChange={() => handleFieldVisibleToggle(field)}
                ariaLabel={`${label} visibility toggle`}
              />
            )}
            <button
              onClick={
                isEditing
                  ? () => handleSaveClick(field)
                  : () => handleEditClick(field)
              }
              className={`relative inline-flex h-6 w-6 items-center rounded-full transition-colors`}
            >
              {isEditing ? (
                <FaCheck className="text-primary text-size-14" />
              ) : (
                <FaEdit className="text-primary text-size-14" />
              )}
            </button>
            {isEditing && (
              <button
                onClick={handleCancelClick}
                className="relative inline-flex h-6 w-6 items-center rounded-full transition-colors"
              >
                <span className="text-gray-500 text-size-20">×</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-6 pb-6">
      {/* Profile card section */}
      <ProfileCardExt
        isDcProfile={true}
        userProfile={editedProfile}
        isEditingName={isEditingName}
        isEditingTagline={isEditingTagline}
        setIsEditingName={setIsEditingName}
        setIsEditingTagline={setIsEditingTagline}
        handleNameSave={handleNameSave}
        handleTaglineSave={handleTaglineSave}
        onProfileChange={handleProfileChange}
        onProfileImageChange={handleProfileImageChange}
        uploadProfileImage={uploadProfileImage}
        setEditedProfile={setEditedProfile}
        setUserDcProfile={setUserDcProfile}
        setIsSocialLinksModalOpen={setIsSocialLinksModalOpen}
        onDeleteLink={deleteLink}
        handleEditSocialLink={handleEditSocialLink}
      />

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 max-w-3xl mx-auto">
        {/* Remove Branding */}
        <div className="w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-offWhite rounded-lg border border-[#e0ddd9]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Remove Branding
              </span>

              {plan?.toLowerCase() === "free" && <PlanBadge />}
            </div>
            <Switch
              disabled={plan?.toLowerCase() === "free" ? true : false}
              checked={!removeBranding}
              onChange={handleBrandingToggle}
              ariaLabel="Remove Branding toggle"
            />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Contact Information
        </h3>
        <ContactField field="address" isFieldVisible={fieldVisible.address} />
        <ContactField field="phone" isFieldVisible={fieldVisible.phone} />
        <ContactField field="email" isFieldVisible={fieldVisible.email} />
        <ContactField field="website" isFieldVisible={fieldVisible.website} />
      </div>
    </section>
  );
};

export default DCLinksTab;
