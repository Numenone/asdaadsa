import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, Download, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadPhoto } from "@/lib/supabase";
import FilterControls from "./FilterControls";
import {
  FilterState,
  DEFAULT_FILTERS,
  generateCSSFilters,
  applyFiltersToImage,
} from "@/lib/filters";

interface CameraCaptureProps {
  onPhotoCapture: (photoUrl: string, filters?: FilterState) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraFlash, setCameraFlash] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Handle countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCountdownActive && countdown !== null) {
      if (countdown > 0) {
        interval = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      } else if (countdown === 0) {
        capturePhoto();
        setIsCountdownActive(false);
        setCountdown(null);
      }
    }

    return () => clearTimeout(interval);
  }, [countdown, isCountdownActive]);

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCameraFlash(true);
      setTimeout(() => setCameraFlash(false), 200);

      setCapturedImage(imageSrc);

      // Try to upload to Supabase
      try {
        setIsUploading(true);
        const blob = await fetch(imageSrc).then((res) => res.blob());
        const filename = `photo_${Date.now()}.jpg`;
        const uploadedUrl = await uploadPhoto(blob, filename);

        if (uploadedUrl) {
          onPhotoCapture(uploadedUrl);
        } else {
          // Fallback: use local data URL
          onPhotoCapture(imageSrc);
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
        // Fallback: use local data URL
        onPhotoCapture(imageSrc);
      } finally {
        setIsUploading(false);
        setTimeout(() => setCapturedImage(null), 2000);
      }
    }
  }, [onPhotoCapture]);

  const startCountdown = (duration: number) => {
    setCountdown(duration);
    setIsCountdownActive(true);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = `photo_${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4">
      {/* Camera Container */}
      <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black mb-8">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          }}
          className="w-full h-full object-cover"
        />

        {/* Camera Flash Effect */}
        <AnimatePresence>
          {cameraFlash && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Countdown Display */}
        <AnimatePresence>
          {countdown !== null && isCountdownActive && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <div className="text-white text-9xl font-bold drop-shadow-lg">
                {countdown > 0 ? countdown : "✓"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera Icon Overlay When No Countdown */}
        {!isCountdownActive && (
          <div className="absolute bottom-4 right-4 text-white/50">
            <Camera className="w-6 h-6" />
          </div>
        )}

        {/* Uploading Indicator */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-white text-center">
              <div className="animate-spin mb-2">
                <Camera className="w-12 h-12" />
              </div>
              <p className="text-sm">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl space-y-6">
        {/* Capture Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => capturePhoto()}
            disabled={isUploading || isCountdownActive}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Capture
          </button>

          <button
            onClick={() => startCountdown(3)}
            disabled={isUploading || isCountdownActive}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            3s Timer
          </button>

          <button
            onClick={() => startCountdown(5)}
            disabled={isUploading || isCountdownActive}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            5s Timer
          </button>

          <button
            onClick={toggleFacingMode}
            disabled={isUploading || isCountdownActive}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RotateCw className="w-5 h-5" />
            Flip
          </button>
        </div>

        {/* Preview and Download */}
        <AnimatePresence>
          {capturedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <button
                  onClick={downloadImage}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CameraCapture;
