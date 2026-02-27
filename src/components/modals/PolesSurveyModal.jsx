import { useState, useEffect } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { voteOnPoll } from "../../services/polesAPI";
import { userApi } from "../../services/userApi";

const PolesSurveyModal = ({ isOpen, onClose, userProfile }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [submittedOptionId, setSubmittedOptionId] = useState(null);

  // Get poll data from userProfile
  const poll = userProfile?.poll;
  
  // Calculate total votes from all options
  const totalVotes = poll?.options?.reduce((sum, option) => sum + (option.voteCount || 0), 0) || 0;

  // Check local storage when poll changes
  useEffect(() => {
    if (poll?.id) {
      const storageKey = `isPoleSubmitted_${poll.id}`;
      const submittedData = localStorage.getItem(storageKey);
      
      if (submittedData) {
        const { questionId, optionId } = JSON.parse(submittedData);
        
        // Check if this is the same question (by comparing question text or ID)
        if (poll.question === questionId || poll.id === questionId) {
          setHasVoted(true);
          setSubmittedOptionId(optionId);
        } else {
          // Question changed, clear the flag
          localStorage.removeItem(storageKey);
          setHasVoted(false);
          setSubmittedOptionId(null);
        }
      } else {
        setHasVoted(false);
        setSubmittedOptionId(null);
      }
    }
  }, [poll?.id, poll?.question]);

  // Handles vote submission to backend 
  const handleVote = async (optionId) => {
    if (isSubmitting) return;

    setSelectedOption(optionId);
    setIsSubmitting(true);

    try {
      // Call the real API to submit the vote using the actual poll ID
      const result = await voteOnPoll(poll.id, optionId);

      if (result) {
        // Update local state to show vote recorded
        setHasVoted(true);
        setSubmittedOptionId(optionId);
        
        // Store in local storage with poll ID, question, and timestamp
        const storageKey = `isPoleSubmitted_${poll.id}`;
        const submissionData = {
          questionId: poll.question,
          optionId: optionId,
          timestamp: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(submissionData));
        
        // Fetch updated user profile to get latest poll data
        try {
          await userApi.fetchUserProfile();
        } catch (error) {
          console.error('Error fetching updated profile:', error);
        }
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      // Reset selection on error
      setSelectedOption(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to calculate percentage for each option’s progress bar
  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  // Handles closing the modal and resets local selection
  const handleClose = () => {
    setSelectedOption(null);
    onClose();
  };

  // Don’t render anything if modal is not open
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleClose}
      >
        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4 flex flex-col"
          style={{ height: "calc(100% - 40px)" }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-size-18 font-bold text-gray-900">Poles & Surveys</h2>
              <p className="text-size-14 text-gray-600">
                Share your thoughts with {userProfile?.title || "this profile"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 absolute top-3 right-3 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {!poll ? (
              // No poll available
              <div className="text-center py-8">
                <p className="text-gray-600">No poll available at the moment.</p>
              </div>
            ) : hasVoted ? (
              // Show submitted answer with results
              <div className="space-y-2">
                <div className="text-center py-2">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-size-16 font-semibold text-gray-900 mb-2">
                    You've already voted!
                  </h3>
                  {/* <p className="text-gray-600">Here are the current results:</p> */}
                </div>

                {/* Display question */}
                <div>
                  <h3 className="text-size-16 font-semibold text-gray-900 mb-2">
                    {poll?.question || "No question available"}
                  </h3>
                </div>

                {/* Display poll results */}
                <div className="space-y-3">
                  {poll?.options && poll.options.length > 0 ? (
                    poll.options.map((option) => {
                      const percentage = calculatePercentage(
                        option.voteCount || 0,
                        totalVotes
                      );
                      const isSubmitted = submittedOptionId === option.id;

                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded-lg border ${
                            isSubmitted
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {/* Row: Circle + Text + Votes */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSubmitted
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-400"
                                }`}
                              >
                                {isSubmitted && (
                                  <FiCheck className="text-white text-xs" />
                                )}
                              </div>
                              <span className="font-medium text-gray-900">
                                {option.text}
                              </span>
                            </div>

                            <span className="text-sm font-medium text-gray-600">
                              {option.voteCount || 0}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                isSubmitted ? "bg-green-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600">No options available for this poll.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Poll options
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {poll?.question || "No question available"}
                  </h3>
                </div>

                <div className="space-y-3">
                  {poll?.options && poll.options.length > 0 ? (
                    poll.options.map((option) => {
                      const percentage = calculatePercentage(
                        option.voteCount || 0,
                        totalVotes
                      );
                      const isSelected = selectedOption === option.id;

                      return (
                        <motion.div
                          key={option.id}
                          onClick={() => handleVote(option.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 bg-white hover:bg-gray-50"
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Row: Circle + Text + Votes */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-400"
                                }`}
                              >
                                {isSelected && (
                                  <FiCheck className="text-white text-xs" />
                                )}
                              </div>
                              <span className="font-medium text-gray-900">
                                {option.text}
                              </span>
                            </div>

                            <span className="text-sm font-medium text-gray-600">
                              {option.voteCount || 0}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                isSelected ? "bg-primary" : ""
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600">No options available for this poll.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PolesSurveyModal;
