import { motion, AnimatePresence } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import DownloadableTemplateSection from "./downloadable-template-section";

const DownloadbleTemplatesModal = ({ isOpen, onClose }) => {

  return (
    <AnimatePresence>
      {/* Modal for showing digital bussiness card */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm lg:p-4 md:p-4 p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-2xl w-full max-w-[50rem] max-h-[90vh] overflow-y-auto lg:px-10 lg:py-10 md:px-10 md:py-10 px-7 py-10 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <RxCross2 size={22} />
            </button>
            <DownloadableTemplateSection />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DownloadbleTemplatesModal;
