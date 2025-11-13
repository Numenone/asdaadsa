import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import CameraCapture from "@/components/CameraCapture";
import PhotoGallery from "@/components/PhotoGallery";
import { listPhotos, deletePhoto as deletePhotoFromSupabase } from "@/lib/supabase";
import { Camera } from "lucide-react";

export default function Index() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load photos from Supabase on mount
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const photoUrls = await listPhotos();
        setPhotos(photoUrls);
      } catch (err) {
        console.error("Error loading photos:", err);
        setError("Failed to load photos. Using local storage only.");
        // Try loading from localStorage as fallback
        const savedPhotos = localStorage.getItem("photos");
        if (savedPhotos) {
          setPhotos(JSON.parse(savedPhotos));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const handlePhotoCapture = useCallback(
    (photoUrl: string) => {
      setPhotos((prevPhotos) => {
        const updatedPhotos = [photoUrl, ...prevPhotos];
        // Save to localStorage as backup
        localStorage.setItem("photos", JSON.stringify(updatedPhotos));
        return updatedPhotos;
      });
    },
    []
  );

  const handleDeletePhoto = useCallback(
    async (index: number) => {
      const photoToDelete = photos[index];

      setPhotos((prevPhotos) => {
        const updatedPhotos = prevPhotos.filter((_, i) => i !== index);
        localStorage.setItem("photos", JSON.stringify(updatedPhotos));
        return updatedPhotos;
      });

      // Try to delete from Supabase
      if (
        photoToDelete.includes(
          (import.meta.env.VITE_SUPABASE_URL || "").split("/").pop() || ""
        )
      ) {
        const filename = photoToDelete.split("/").pop();
        if (filename) {
          await deletePhotoFromSupabase(`public/${filename}`);
        }
      }
    },
    [photos]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-700/50 backdrop-blur-md bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Camera className="w-8 h-8 text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                SnapShot
              </h1>
              <p className="text-sm text-gray-400 text-center">
                Capture, Share, Inspire
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-200 text-sm"
          >
            {error}
          </motion.div>
        )}

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Camera className="w-12 h-12 text-blue-400 mb-4" />
              </motion.div>
              <p className="text-gray-400">Loading photos...</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:gap-12">
            {/* Camera Capture Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm border border-gray-700/50"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Camera className="w-6 h-6 text-blue-400" />
                Capture
              </h2>
              <CameraCapture onPhotoCapture={handlePhotoCapture} />
            </motion.section>

            {/* Gallery Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm border border-gray-700/50"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🎞️</span>
                Gallery
                {photos.length > 0 && (
                  <span className="ml-auto text-sm font-normal text-gray-400">
                    {photos.length} photo{photos.length !== 1 ? "s" : ""}
                  </span>
                )}
              </h2>
              <PhotoGallery photos={photos} onDelete={handleDeletePhoto} />
            </motion.section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-700/50 backdrop-blur-md bg-black/30 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-500">
            SnapShot • Capture beautiful moments{" "}
            <span className="text-blue-400">•</span>{" "}
            <span className="text-gray-600">Built with React & Supabase</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
