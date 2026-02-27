import { useState, useEffect } from "react";
import { FaPalette } from "react-icons/fa";
import api from "../../../../services/api";
import useUserStore from "../../../../stores/userStore";
import toast from "react-hot-toast";
import DgTemplate from "../../../../pages/user/digital-card/template";


const TemplatesSection = ({ plan }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [open, setOpen] = useState(false);
  const { setUserDcProfile } = useUserStore();

  // Function to handle selecting a template
  const handleSelect = async (template) => {
    // Define which templates are allowed based on user plan
    const allowed = {
      free: ["FREE"],
      pro: ["FREE", "PRO"],
      premium: ["FREE", "PRO", "PREMIUM"],
    };
  
    // Check if user plan allows selecting this template
    if (!allowed[plan]?.includes(template.accessLevel)) {
      toast.error(
        `Upgrade to ${template.accessLevel} plan to use this template`
      );
      return;
    }

    // Set selected template locally
    setSelectedTemplate(template.id);
    try {
      // API call to mark template as selected
      await api.post(`/api/v1/template/card/${template.id}/select`, {
        headers: {
          'accept': '*/*'
        }
      });
      // Update global user digital card profile state
      setUserDcProfile({ template });
      toast.success(`Template applied successfully`);
    } catch (error) {
      console.error("Failed to select template:", error);
      toast.error("Failed to apply template");
    }
  };


  // Fetch all available templates.
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get("/api/v1/template/card");
        setTemplates(res.data.data);
      } catch (err) {
        console.error("Error fetching templates", err?.response?.data?.message);
        // toast.error("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  return (
    <>
    <div className="space-y-6">
       {/* Download Digital Card Section */}
      <div className="flex flex-col justify-between mb-6">
        <div className="text-sm text-gray-500">
          {templates.length} available
        </div>
      </div>

      {/* No Templates Available Message */}
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-offWhite rounded-full flex items-center justify-center mb-4">
            <FaPalette className="text-gray-400 text-xl" />
          </div>
          <h4 className="text-gray-600 font-medium mb-1">
            No templates available
          </h4>
          <p className="text-gray-500 text-sm">
            Check back later for new templates
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          // Available templates
          templates.map((template) => {
            return (
              <DgTemplate key={template.id} template={template} plan={plan} selectedTemplate={selectedTemplate} handleSelect={handleSelect}  />
            )}
          )
        }
      </div>
      )}
    </div>
    </>
  );
};

export default TemplatesSection;
