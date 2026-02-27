import { useState, useEffect, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import useUserStore from "../../../../stores/userStore";
import customizationApi from "../../../../services/customizationApi";
import userApi from "../../../../services/userApi";
import dcLinkApi from "../../../../services/dcLinkApi";

// Color picker component
const ColorPicker = ({ color, onChange, label }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const pickerRef = useRef(null);

  // Update local state if the prop changes
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  // Close dropdown if clicked outside (currently disabled)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        // setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle color change and notify parent
  const handleColorChange = (newColor) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

  
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative" ref={pickerRef}>
          <div className="relative flex items-center justify-center">
            {/* Color preview button */}
            <button
              className="relative flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: localColor }}
              />
              <span className="text-sm font-medium">{localColor}</span>
            </button>
            {/* Native color input (hidden overlay) */}
            <input
              type="color"
              value={localColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer absolute opacity-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// CustomizeSection component
const CustomizeSection = ({ plan }) => {
  const [backgroundType, setBackgroundType] = useState('color'); // Upper background type
  const [backgroundType2, setBackgroundType2] = useState('color'); // Bottom background type
  const [backgroundColor, setBackgroundColor] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [textColor, setTextColor] = useState('');
  const [buttonTextColor, setButtonTextColor] = useState('');
  const [buttonBgColor, setButtonBgColor] = useState('');
  const [buttonStyle, setButtonStyle] = useState("solid");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [bottomBgColor, setBottomBgColor] = useState('');

  const { userDcProfile, updateDcNested } = useUserStore();


  // Function to fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      const profileData = await dcLinkApi.fetchDcData();
      if (profileData) {
        // toast.success("Profile data refreshed successfully!");
      }
      return profileData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Initialize with current user profile values
  useEffect(() => {
    if (userDcProfile?.template) {
      const template = userDcProfile.template;
      console.log(template)
      
      // Handle background - check if it's an image URL or hex code
      if (template.upperBgColor) {
        const isImageUrl = template?.upperBgColor?.startsWith('http') || template?.upperBgColor?.startsWith('data:');
        if (isImageUrl) {
          setBackgroundImage(template?.upperBgColor);
          setBackgroundType("image");
        } else {
          setBackgroundColor(template.upperBgColor);
          setBackgroundType("color");
        }
      }

      // Load existing saved customization values
      if (template.bottomBgColor) setBottomBgColor(template.bottomBgColor);
      if (template.textColor) setTextColor(template.textColor);
      if (template.buttonTextColor) setButtonTextColor(template.buttonTextColor);
      if (template.buttonColor) setButtonBgColor(template.buttonColor);
      if (template.buttonStyle) setButtonStyle(template.buttonStyle);
    } 
  }, [userDcProfile]);


  // Function to save customization to API
  const saveCustomizationToAPI = async (customizationData) => {
    try {
      setIsSaving(true);
      const payload = {
        upperBgColor: customizationData.upperBgColor || backgroundColor,
        bottomBgColor: customizationData.bottomBgColor || bottomBgColor,
        textColor: customizationData.textColor || textColor,
        buttonColor: customizationData.buttonColor || buttonBgColor,
        buttonTextColor: customizationData.buttonTextColor || buttonTextColor,
        buttonStyle: customizationData.buttonStyle || buttonStyle
      };

      const success = await customizationApi.saveDcCustomization(payload);
      fetchUserProfile(); // Refresh profile after saving
      if (success) {
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error saving customization:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to save all current customization settings
  const saveAllCustomizations = async () => {
    await saveCustomizationToAPI({
      upperBgColor: backgroundType === "image" ? backgroundImage : backgroundColor,
      bottomBgColor,
      textColor,
      buttonColor: buttonBgColor,
      buttonTextColor,
      buttonStyle
    });
  };

  // Handle color changes for different elements
  const handleColorChange = async (type, color) => {
    switch (type) {
      case "background":
        setBackgroundColor(color);
        updateDcNested("template.upperBgColor", color);
        setHasUnsavedChanges(true);
        break;
      case "bottombg":
        setBottomBgColor(color);
        updateDcNested("template.bottomBgColor", color);
        setHasUnsavedChanges(true);
        break;
      case "text":
        setTextColor(color);
        updateDcNested("template.textColor", color);
        setHasUnsavedChanges(true);
        break;
      case "button":
        setButtonTextColor(color);
        updateDcNested("template.buttonTextColor", color);
        setHasUnsavedChanges(true);
        break;
      case "buttonBg":
        setButtonBgColor(color);
        updateDcNested("template.buttonColor", color);
        setHasUnsavedChanges(true);
        break;
      default:
        break;
    }
  };

  // handle link button style change
  const handleButtonStyleChange = (style) => {
    setButtonStyle(style);
    updateDcNested("template.buttonStyle", style);
    setHasUnsavedChanges(true);
  };

  // Handle image upload for background
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsSaving(true);
        
        // Upload image using common API function
        const imageUrl = await customizationApi.uploadBackgroundImageDc(file);
        
        if (imageUrl) {
          setBackgroundImage(imageUrl);
          setBackgroundType("image");
          updateDcNested("template.upperBgColor", imageUrl);
          setHasUnsavedChanges(true);
        }
      } catch (error) {
        console.error('Error uploading background image:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Background section
  const BackgroundSection = () => (
    <div className="space-y-6">
      {/* Radio buttons in same row */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="bg-color"
            name="background-type"
            checked={backgroundType === "color"}
            onChange={() => {
              setBackgroundType("color");
              // Clear background image when switching to color
              // setBackgroundImage(null);
            }}
            className="w-4 h-4 text-primary"
          />
          <label htmlFor="bg-color" className="text-sm font-medium text-gray-700">
            Upper Background Color
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="bg-image"
            name="background-type"
            checked={backgroundType === "image"}
            onChange={() => {
              setBackgroundType("image");
              // setBackgroundColor('');
            }}
            className="w-4 h-4 text-primary"
          />
          <label htmlFor="bg-image" className="text-sm font-medium text-gray-700">
            Background Image
          </label>
        </div>
      </div>

      {/* Content based on selected option */}
      {backgroundType === "color" && (
        // render color picker
        <ColorPicker
          color={backgroundColor}
          onChange={(color) => handleColorChange("background", color)}
          label=""
        />
      )}

      {backgroundType === "image" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {/* Image upload button */}
            <button
              className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                isSaving 
                  ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => !isSaving && document.getElementById('background-image-upload').click()}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="w-4 h-4" />
                  Image
                </>
              )}
            </button>
            {/* Hidden input for image upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="background-image-upload"
            />
            {/* Image preview */}
            <div className="flex-1">
              <div className="w-fit h-28 border-2 p-3 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {backgroundImage ? (
                  <img
                    src={backgroundImage}
                    alt="Background preview"
                    className="h-full rounded-sm object-contain"
                  />
                ) : (
                  <span className="text-gray-500">Upload Image</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Background */}    
      <div className="flex items-center gap-3">
          <input
            type="radio"
            id="bg-color2"
            name="background-type2"
            checked={backgroundType2 === "color"}
            onChange={() => {
              setBackgroundType2("color");
            }}
            className="w-4 h-4 text-primary"
          />
          <label htmlFor="bg-color2" className="text-sm font-medium text-gray-700">
            Bottom Background Color
          </label>
      </div>

      {backgroundType2 === "color" && (
        <ColorPicker
          color={bottomBgColor}
          onChange={(color) => handleColorChange("bottombg", color)}
          label=""
        />
      )}
    </div>
  );

  return (
    <div className="space-y-8">

      {/* Background Customization */}
      <div className="space-y-6 p-4 bg-offWhite rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Background</h3>
        </div>
        <BackgroundSection />
      </div>

      {/* Text Color */}
      <div className="space-y-6 p-4 bg-offWhite rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Profile Text Color</h3>
        <ColorPicker
          color={textColor}
          onChange={(color) => handleColorChange("text", color)}
          label=""
        />
      </div>

      {/* Button Colors */}
      <div className="space-y-6 p-4 bg-offWhite rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Link Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPicker
            color={buttonTextColor}
            onChange={(color) => handleColorChange("button", color)}
            label="Link Text Color"
          />
          <ColorPicker
            color={buttonBgColor}
            onChange={(color) => handleColorChange("buttonBg", color)}
            label="Link Background Color"
          />
        </div>
      </div>

      {/* Button Style */}
      <div className="space-y-6 p-4 bg-offWhite rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Link Style</h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleButtonStyleChange("solid")}
            className={`flex-1 py-3 px-4 rounded-full border-2 transition-all duration-200 ${
              buttonStyle === "solid"
                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Solid</span>
            </div>
          </button>
          
          <button
            onClick={() => handleButtonStyleChange("outlined")}
            className={`flex-1 py-3 px-4 rounded-full border-2 transition-all duration-200 ${
              buttonStyle === "outlined"
                ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Outlined</span>
            </div>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center">

        {/* Save Button */}
        {hasUnsavedChanges && (
          <button
            onClick={saveAllCustomizations}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomizeSection;
