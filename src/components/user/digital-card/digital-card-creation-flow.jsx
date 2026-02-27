import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCreditCard,
  FiUser,
  FiGlobe,
  FiShare2,
  FiArrowRight,
} from "react-icons/fi";

const DigitalCardCreationFlow = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  // Handler to start the digital card creation flow
  const handleCreateDigitalCard = async () => {
    setIsCreating(true);
    try {
      // Navigate to the Digital Card onboarding flow
      navigate("/onboarding/card-identity");
    } catch (error) {
      console.error("Error starting digital card creation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Steps displayed in the grid to guide the user
  const steps = [
    {
      icon: <FiUser className="w-6 h-6" />,
      title: "Personal Information",
      description: "Add your name, designation, and professional details",
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Contact Details",
      description: "Include your phone, email, website, and address",
    },
    {
      icon: <FiShare2 className="w-6 h-6" />,
      title: "Social Links",
      description: "Connect your social media profiles and websites",
    },
    {
      icon: <FiCreditCard className="w-6 h-6" />,
      title: "Choose Template",
      description: "Select a beautiful template for your digital card",
    },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 rounded-xl via-white to-purple-50 flex items-center justify-center p-4">
      {/* Animated container for smooth entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCreditCard className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-size-20 font-bold text-gray-900 mb-4">
            Create Your Digital Card
          </h1>
          <p className="text-size-14 text-gray-600 max-w-xl mx-auto">
            Build a professional digital business card that showcases your
            information beautifully. Share it with anyone, anywhere, anytime.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateDigitalCard}
            disabled={isCreating}
            className="group relative w-[60px] h-[60px] hover:w-[230px] bg-gradient-to-r from-primary to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <motion.div
              className="flex items-center justify-center h-full relative"
              whileHover={{
                width: "230px",
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              {/* Text that appears on hover */}
              <motion.span
                className="absolute left-4 font-semibold text-size-16 h-[50px] flex items-center justify-center text-white whitespace-nowrap"
                initial={{ opacity: 0, x: -20 }}
                whileHover={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.1, duration: 0.2 },
                }}
              >
                Create Digital Card
              </motion.span>

              {/* Arrow icon */}
              <motion.div
                className="flex items-center justify-center absolute right-4"
                whileHover={{
                  x: 0,
                  transition: { duration: 0.3 },
                }}
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiArrowRight className="w-6 h-6" />
                )}
              </motion.div>
            </motion.div>
          </motion.button>

          <p className="text-gray-500 text-sm mt-4">
            Takes less than 5 minutes to set up
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DigitalCardCreationFlow;
