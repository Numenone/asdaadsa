import { FilterState, DEFAULT_FILTERS } from "./filters";

export interface StoredPhoto {
  url: string;
  filters: FilterState;
  timestamp: number;
}

// Convert old string[] to new StoredPhoto[]
export const migratePhotos = (
  photos: (string | StoredPhoto)[],
): StoredPhoto[] => {
  return photos.map((photo) => {
    if (typeof photo === "string") {
      return {
        url: photo,
        filters: DEFAULT_FILTERS,
        timestamp: Date.now(),
      };
    }
    return photo;
  });
};

// Save photos to localStorage
export const savePhotosToStorage = (photos: StoredPhoto[]): void => {
  localStorage.setItem("photos", JSON.stringify(photos));
};

// Load photos from localStorage
export const loadPhotosFromStorage = (): StoredPhoto[] => {
  try {
    const saved = localStorage.getItem("photos");
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    // Handle migration from old format
    if (Array.isArray(parsed) && parsed.length > 0) {
      if (typeof parsed[0] === "string") {
        return migratePhotos(parsed);
      }
      // Filter out invalid items
      return parsed.filter(
        (item): item is StoredPhoto =>
          item && typeof item === "object" && typeof item.url === "string"
      );
    }
    return [];
  } catch (error) {
    console.error("Error loading photos from storage:", error);
    return [];
  }
};

// Get photo URLs for gallery display
export const getPhotoUrls = (photos: StoredPhoto[]): string[] => {
  return photos.map((photo) => photo.url);
};
