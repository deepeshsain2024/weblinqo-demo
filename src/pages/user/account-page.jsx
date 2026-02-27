import { useEffect, useRef, useState } from "react";
import {
  getAccountProfileMeta,
  updateAccountAvatar,
  updateAccountInfo,
  updateAccountNotifications,
} from "../../services/accountApi";
// import LogoIcon from "../../assets/images/logos/gradientLogo.svg";
import { useNavigate } from "react-router-dom";
import useLoaderStore from "../../stores/loaderStore";
import { FaArrowLeft } from "react-icons/fa";
import userApi from "../../services/userApi";
import UserImg from "../../assets/dummy-user.jpg";
import useUserStore from "../../stores/userStore";
import { LuUpload } from "react-icons/lu";
import Switch from "../../components/common/ui/switch";
import LogoIcon from "../../assets/images/logos/logo-icon.png"

const AccountPage = () => {
  const [profileData, setProfileData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", phone: "" });
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderStore();
  const fileInputRef = useRef(null);
  const { userProfile } = useUserStore();

  // fetch user profile
  const fetchUserProfile = async () => {
    try {
      // showLoader();
      const res = await getAccountProfileMeta();
      setProfileData(res);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
    hideLoader();
  };

  // toggle edit mode / save mode
  const handleEditButton = async () => {
    if (!isEdit) {
      // Enable edit mode and populate form with current profile data
      setForm({
        name: profileData?.name || "",
        bio: profileData?.bio || "",
        phone: profileData?.phone || "",
      });
      setIsEdit(true);
      return;
    }

    // If already in edit mode, save changes
    try {
      showLoader();
      await updateAccountInfo({
        name: form.name,
        bio: form.bio,
        phone: form.phone,
      });
      setProfileData((prev) => ({ ...prev, ...form }));
      setIsEdit(false);
    } catch (e) {
      console.error("Failed to update account info", e);
    } finally {
      hideLoader();
    }
  };

  // toggle email notifications
  const handleToggle = async () => {
    try {
      showLoader();
      await updateAccountNotifications(!profileData?.emailNotificationsEnabled);
      await fetchUserProfile();
    } catch (e) {
      console.error("Failed to update notification preference", e);
    } finally {
      hideLoader();
    }
  };

  // upload avatar
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showLoader();
      // Upload image using api
      const uploadedUrl = await userApi.uploadProfileImage(file);

      if (uploadedUrl) {
        setProfileData((prev) => ({ ...prev, avatar: uploadedUrl }));
        try {
          // Persist avatar URL on server
          const res = await updateAccountAvatar({ avatarUrl: uploadedUrl });
          if (res?.status === 200 || res.status === 201) {
            // setProfileData((prev) => ({ ...prev, profileImage: uploadedUrl }));
          }
        } catch (apiErr) {
          console.error("Failed to persist avatar URL:", apiErr);
        }
      }
    } catch (err) {
      console.error("Failed to upload profile image:", err);
    } finally {
      hideLoader();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="bg-offWhite p-3 md:p-5 min-h-screen flex items-center justify-center">
      <div className="flex lg:flex-row md:flex-row flex-col items-center justify-center gap-2 lg:p-0">
        {/* left side */}
        <div className="flex flex-col items-center justify-between bg-[#2848F0E5] lg:max-w-xs md:max-w-xs max-w-xl w-full lg:h-[90vh] md:h-[90vh] h-auto py-10 rounded-xl shadow-lg">
          <div>
            {/* Logo */}
            <div className="flex justify-center py-3">
              <img
                onClick={() => navigate("/dashboard")}
                src={LogoIcon}
                alt="logo"
                className="h-14 object-cover sm:left-4 top-[1.5rem]"
              />
              {/* <h1 className="text-2xl font-bold text-gray-900">Weblinqo</h1> */}
            </div>
            {/* Profile Info */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="w-32 h-32 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 mb-2 mt-4 relative group">
                <img
                  src={profileData?.avatar || UserImg}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-lg text-white font-medium">
                {profileData?.name}
              </div>
              <div className="text-lg text-white">{profileData?.bio}</div>
              <div className="text-lg text-white">{profileData?.phone}</div>
              <div className="text-lg text-white">{userProfile?.email}</div>
            </div>
          </div>
          <div className="py-2 px-5">
            {/* Back Button */}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-white cursor-pointer font-medium"
            >
              <FaArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
        {/* right side */}
        <div className="bg-transparent border border-[#E0E0E0] lg:h-[90vh] md:h-[90vh] h-auto w-full max-w-4xl lg:p-10 md:p-10 p-4 rounded-xl shadow-lg relative overflow-auto">
          <div className="flex justify-between items-center">
             {/* Section Title */}
            <div className="text-[#1F2937] text-[18px] font-medium">
              Profile
            </div>
          </div>
          <hr
            style={{ borderTop: "2px dashed #BFC0C0", width: "100%" }}
            className="my-4"
          />
          {/* email section */}
          <div className="flex lg:flex-row md:flex-row flex-col gap-2 justify-between my-8">
            <div>
              <h1 className="text-[16px] text-[#333333] font-medium">Email</h1>
              <p className="text-[14px] text-[#333333]">
                Change your email from here
              </p>
            </div>
            <div className="bg-white rounded-lg max-w-md w-full py-6 px-4 flex flex-col gap-1">
              <h1 className="text-[16px] font-medium text-[#333333] mb-2">
                Email
              </h1>
              {isEdit ? (
                <input
                  type="text"
                  className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0]"
                  value={form?.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              ) : (
                <input
                  type="text"
                  className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0] cursor-not-allowed"
                  value={userProfile?.email}
                  disabled
                />
              )}
            </div>
          </div>

          <hr
            style={{ borderTop: "2px dashed #BFC0C0", width: "100%" }}
            className="my-4"
          />
          {/* avatar upload */}
          <div className="flex lg:flex-row md:flex-row flex-col gap-2 justify-between my-8">
            <div>
              <h1 className="text-[16px] text-[#333333] font-medium">Avatar</h1>
              <p className="text-[14px] text-[#333333] text-ellipsis max-w-xs">
                Upload your product image gallery here Demension of the avatar
                should be 140*140
              </p>
            </div>
            <div className="bg-white rounded-lg max-w-md w-full py-6 px-4 flex flex-col gap-1">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const fakeEvent = { target: { files: [file] } };
                    await handleAvatarFileChange(fakeEvent, "galleryImage");
                  }
                }}
                className="border border-[#D9D9D9] border-dashed py-16 px-6 flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <LuUpload size={"1.5rem"} />
                <p className="text-[14px] text-[#333333]">
                  Upload an image or drag and drop PNG, JPG
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarFileChange(e, "galleryImage")}
              />
              {/* avatar preview */}
              <div className="rounded-full w-20 h-20">
                <img
                  src={profileData?.avatar || UserImg}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          <hr
            style={{ borderTop: "2px dashed #BFC0C0", width: "100%" }}
            className="my-4"
          />

          {/* email notification toggle */}
          <div className="flex lg:flex-row md:flex-row flex-col gap-2 justify-between my-8">
            <div>
              <h1 className="text-[16px] text-[#333333] font-medium">
                Email Notification
              </h1>
              <p className="text-[14px] text-[#333333]">
                Set your email notification for messaging featur
              </p>
            </div>
            <div className="bg-white rounded-lg max-w-md w-full py-6 px-4 flex flex-col gap-1">
              <h1 className="text-[16px] font-medium text-[#333333] mb-2">
                Notification email
              </h1>
              <div className="flex items-center gap-2">
                <div className="mt-2">
                  <Switch
                    checked={profileData?.emailNotificationsEnabled}
                    onChange={handleToggle}
                    ariaLabel="Email notification toggle"
                  />
                </div>
                <p className="text-[16px] text-[#333333] mt-2">
                  Enable Notification
                </p>
              </div>
            </div>
          </div>

          <hr
            style={{ borderTop: "2px dashed #BFC0C0", width: "100%" }}
            className="my-4"
          />
          {/* profile information */}
          <div className="flex lg:flex-row md:flex-row flex-col gap-2 justify-between my-8">
            <div>
              <h1 className="text-[16px] text-[#333333] font-medium">
                Information
              </h1>
              <p className="text-[14px] text-[#333333]">
                Add your profile information from here
              </p>
            </div>
            <div className="bg-white rounded-lg max-w-md w-full py-6 px-4 flex flex-col gap-1">
              <h1 className="text-[16px] font-medium text-[#333333] mb-2">
                Name
              </h1>
              {isEdit ? (
                <input
                  type="text"
                  className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0]"
                  value={form?.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              ) : (
                <input
                  type="text"
                  className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0] cursor-not-allowed"
                  value={profileData?.name}
                  disabled
                />
              )}
              <h1 className="text-[16px] font-medium text-[#333333] mb-2">
                Bio
              </h1>
              {isEdit ? (
                <textarea
                  type="text"
                  rows={4}
                  className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0]"
                  value={form?.bio}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bio: e.target.value }))
                  }
                />
              ) : (
                <textarea
                  type="text"
                  rows={4}
                  className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0] cursor-not-allowed"
                  value={profileData?.bio}
                  disabled
                />
              )}
              <h1 className="text-[16px] font-medium text-[#333333] mb-2">
                Contact Number
              </h1>
              {isEdit ? (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={12}
                  className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0]"
                  value={form?.phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // use let
                    if (value.length > 12) value = value.slice(0, 12);
                    setForm((p) => ({ ...p, phone: value }));
                  }}
                />
              ) : (
                <input
                  type="text"
                  className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0] cursor-not-allowed"
                  value={profileData?.phone}
                  disabled
                />
              )}
            </div>
          </div>

          <hr
            style={{ borderTop: "2px dashed #BFC0C0", width: "100%" }}
            className="my-4"
          />

         {/* save / edit button  */}
          <div className="flex justify-end lg:my-8 md:my-8 mt-5">
            {isEdit ? (
              <button
                onClick={handleEditButton}
                className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg flex justify-center items-center w-[10rem]"
              >
                <p>Save</p>
              </button>
            ) : (
              <button
                onClick={handleEditButton}
                className="bg-gradient-to-br from-[#2848F0] to-[#AD71F6] text-white font-medium py-2 px-4 rounded-lg flex justify-center items-center w-[10rem]"
              >
                <p>Edit</p>
              </button>
            )}
          </div>

          {/* password section conditional if not OAuth */}
          <div>
            {!profileData?.isOAuth && (
              <>
                <hr
                  style={{ borderTop: "2px dashed #BFC0C0", width: "100%" }}
                  className="my-4"
                />
                <div className="flex lg:flex-row md:flex-row flex-col gap-2 justify-between my-8">
                  <div>
                    <h1 className="text-[16px] text-[#333333] font-medium">
                      Password
                    </h1>
                    <p className="text-[14px] text-[#333333]">
                      Change your password from here
                    </p>
                  </div>
                  <div className="bg-white rounded-lg max-w-md w-full py-6 px-4 flex flex-col gap-1">
                    <h1 className="text-[16px] font-medium text-[#333333] mb-2">
                      Old Password
                    </h1>
                    {isEdit ? (
                      <input
                        type="password"
                        className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0]"
                        value={form?.password}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, password: e.target.value }))
                        }
                      />
                    ) : (
                      <input
                        type="password"
                        className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0] cursor-not-allowed"
                        value={profileData?.password}
                        disabled
                      />
                    )}
                    <h1 className="text-[16px] font-medium text-[#333333] mb-2">
                      New Password
                    </h1>
                    {isEdit ? (
                      <input
                        type="password"
                        className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0]"
                        value={form?.password}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, password: e.target.value }))
                        }
                      />
                    ) : (
                      <input
                        type="password"
                        className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0] cursor-not-allowed"
                        value={profileData?.password}
                        disabled
                      />
                    )}
                    <h1 className="text-[16px] font-medium text-[#333333] mb-2">
                      Confirm Password
                    </h1>
                    {isEdit ? (
                      <input
                        type="password"
                        className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0]"
                        value={form?.password}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, password: e.target.value }))
                        }
                      />
                    ) : (
                      <input
                        type="password"
                        className="border rounded-lg py-1.5 px-2 text-gray-600 border-[#E0E0E0] cursor-not-allowed"
                        value={profileData?.password}
                        disabled
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-end lg:my-8 md:my-8 mt-5">
                  {/* Save / Change Password button */}
                  {isEdit ? (
                    <button
                      onClick={""}
                      className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg flex justify-center items-center w-auto"
                    >
                      <p>Save</p>
                    </button>
                  ) : (
                    <button
                      onClick={""}
                      className="bg-gradient-to-br from-[#2848F0] to-[#AD71F6] text-white font-medium py-2 px-4 rounded-lg flex justify-center items-center w-auto"
                    >
                      <p>Change Password</p>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
