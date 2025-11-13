import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// Set these environment variables in your .env file:
// VITE_SUPABASE_URL=your_supabase_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Only create client if both URL and key are provided
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = () => !!supabase;

// Helper functions for photo operations
export const uploadPhoto = async (
  file: Blob,
  filename: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from("photos")
      .upload(`public/${filename}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(`public/${data.path}`);

    return publicUrl;
  } catch (error) {
    console.error("Upload exception:", error);
    return null;
  }
};

export const deletePhoto = async (filepath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from("photos").remove([filepath]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete exception:", error);
    return false;
  }
};

export const listPhotos = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from("photos")
      .list("public", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("List error:", error);
      return [];
    }

    return data
      .map((file) => {
        const {
          data: { publicUrl },
        } = supabase.storage.from("photos").getPublicUrl(`public/${file.name}`);
        return publicUrl;
      })
      .filter((url) => url.length > 0);
  } catch (error) {
    console.error("List exception:", error);
    return [];
  }
};
