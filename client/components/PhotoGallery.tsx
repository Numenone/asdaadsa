import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2 } from "lucide-react";
import { StoredPhoto } from "@/lib/photoStorage";
import { generateCSSFilters } from "@/lib/filters";

interface PhotoGalleryProps {
  photos: StoredPhoto[];
  onDelete?: (index: number) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onDelete }) => {
  const [displayPhotos, setDisplayPhotos] = useState<StoredPhoto[]>(photos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update display photos when photos change
  useEffect(() => {
    setDisplayPhotos(photos);
  }, [photos]);

  // Auto-scroll gallery every 4 seconds
  useEffect(() => {
    if (displayPhotos.length === 0) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      return;
    }

    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
    }, 4000);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [displayPhotos.length]);

  // Scroll to current photo
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = currentIndex * (container.offsetWidth / 3);
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const downloadPhoto = (photoUrl: string) => {
    const link = document.createElement("a");
    link.href = photoUrl;
    link.download = `photo_${Date.now()}.jpg`;
    link.click();
  };

  const deletePhoto = (index: number) => {
    onDelete?.(index);
  };

  if (displayPhotos.length === 0) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500">
          <p className="text-lg font-medium">No photos yet</p>
          <p className="text-sm mt-2">Take your first photo to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Display */}
      <div className="bg-gradient-to-b from-gray-950 to-gray-900 rounded-2xl overflow-hidden shadow-2xl mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="aspect-video w-full relative overflow-hidden"
          >
            <img
              src={displayPhotos[currentIndex]}
              alt={`Gallery photo ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Photo Counter */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
              {currentIndex + 1} / {displayPhotos.length}
            </div>

            {/* Action Buttons Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4"
            >
              <button
                onClick={() => downloadPhoto(displayPhotos[currentIndex])}
                className="p-3 bg-white/90 hover:bg-white text-gray-900 rounded-full transition-all duration-200 hover:scale-110"
                title="Download photo"
              >
                <Download className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Strip with Auto-scroll */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 px-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {displayPhotos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <div
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                  index === currentIndex
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-transparent hover:border-gray-400 dark:hover:border-gray-600"
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                />

                {/* Hover Actions */}
                <motion.div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPhoto(photo);
                    }}
                    className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full transition-all duration-200"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePhoto(index);
                      }}
                      className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator */}
        {displayPhotos.length > 3 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none w-8 h-20" />
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 flex justify-center gap-1">
        {displayPhotos.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-500 w-8"
                : "bg-gray-300 dark:bg-gray-600 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
