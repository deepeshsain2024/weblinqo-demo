import React, { useState } from 'react';
import { FaTimes, FaUpload, FaLink, FaYoutube, FaVideo } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import linkApi from '../../services/linkApi';
import { MdRefresh } from 'react-icons/md';
import useLoaderStore from '../../stores/loaderStore';

const VideoUploadModal = ({ isOpen, onClose, onVideoUpload, onVideoUrlSubmit, isLoading }) => {
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { showLoader, hideLoader } = useLoaderStore();

    // File selection handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file?.type?.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  // Delete existing video handler
  const handleDeleteVideo = async () => {
    showLoader();
    try {
      const result = await linkApi.deleteVideo();
      if (result) {
        handleClose();
      }
    } catch (error) {
      console.error("Error Deleting Video", error)
    } finally {
      hideLoader();
    }
  };

   // Drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file?.type?.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid video file');
      }
    }
  };

  // Trigger file upload callback for the selected video file
  const handleFileUpload = () => {
    if (selectedFile) {
      onVideoUpload(selectedFile);
    }
  };

  // Trigger URL submission callback
  const handleUrlSubmit = () => {
    if (videoUrl.trim()) {
      onVideoUrlSubmit(videoUrl.trim());
    }
  };

  // Reset modal form to initial state
  const resetForm = () => {
    setUploadType('file');
    setSelectedFile(null);
    setVideoUrl('');
    setDragActive(false);
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Modal background overlay
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Upload Video</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Upload Type Selection */}
              <div className="mb-6">
                <div className='flex items-center gap-3 mb-3'>
                  <h3 className="text-sm font-medium text-gray-700">Choose upload method:</h3>
                  <button onClick={()=>handleDeleteVideo()} className="bg-red-600 py-1 px-1.5 rounded-lg"><MdRefresh  className="text-size-16 text-white"/></button>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="uploadType"
                      value="file"
                      checked={uploadType === 'file'}
                      onChange={(e) => setUploadType(e.target.value)}
                      className="mr-3"
                    />
                    <FaUpload className="text-primary mr-2" />
                    <span className="font-medium">Upload Video File</span>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="uploadType"
                      value="url"
                      checked={uploadType === 'url'}
                      onChange={(e) => setUploadType(e.target.value)}
                      className="mr-3"
                    />
                    <FaLink className="text-primary mr-2" />
                    <span className="font-medium">Video URL</span>
                  </label>
                </div>
              </div>

              {/* File Upload Section */}
              {uploadType === 'file' && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Video File</h3>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="video-file-input"
                    />
                    <label htmlFor="video-file-input" className="cursor-pointer">
                      <FaVideo className="text-4xl text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedFile ? selectedFile.name : 'Click to select or drag and drop video file'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports MP4, WebM, OGG formats (Max 5MB)
                      </p>
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        Selected: {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-600">
                        Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* URL Input Section */}
              {uploadType === 'url' && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Enter Video URL</h3>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or https://loom.com/share/... or direct video URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FaYoutube className="text-red-500" />
                      <span>Supports YouTube, Loom, and direct video URLs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={uploadType === 'file' ? handleFileUpload : handleUrlSubmit}
                  disabled={
                    isLoading || 
                    (uploadType === 'file' && !selectedFile) ||
                    (uploadType === 'url' && !videoUrl.trim())
                  }
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    uploadType === 'file' ? 'Upload Video' : 'Add Video URL'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoUploadModal;
