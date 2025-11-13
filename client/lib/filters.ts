// Filter configuration
export interface FilterState {
  negativo: number; // 0-100
  opacidade: number; // 0-100
  saturacao: number; // 0-100
  brilho: number; // 0-100
  contraste: number; // 0-100
  desfoque: number; // 0-100
  escalacinza: number; // 0-100
  sepia: number; // 0-100
  vermelho: number; // 0-100
  verde: number; // 0-100
  azul: number; // 0-100
  amarelo: number; // 0-100
}

export const DEFAULT_FILTERS: FilterState = {
  negativo: 0,
  opacidade: 100,
  saturacao: 100,
  brilho: 100,
  contraste: 100,
  desfoque: 0,
  escalacinza: 0,
  sepia: 0,
  vermelho: 0,
  verde: 0,
  azul: 0,
  amarelo: 0,
};

export const FILTER_LABELS = {
  negativo: "Negativo",
  opacidade: "Opacidade",
  saturacao: "Saturação",
  brilho: "Brilho",
  contraste: "Contraste",
  desfoque: "Desfoque",
  escalacinza: "Escala de Cinza",
  sepia: "Sepia",
  vermelho: "Vermelho",
  verde: "Verde",
  azul: "Azul",
  amarelo: "Amarelo",
};

export type FilterKey = keyof FilterState;

// Generate CSS filter string from filter state
export const generateCSSFilters = (filters: FilterState): string => {
  const parts: string[] = [];

  // Negativo (invert)
  if (filters.negativo > 0) {
    parts.push(`invert(${filters.negativo}%)`);
  }

  // Opacidade
  parts.push(`opacity(${filters.opacidade}%)`);

  // Saturação
  parts.push(`saturate(${filters.saturacao}%)`);

  // Brilho
  parts.push(`brightness(${filters.brilho}%)`);

  // Contraste
  parts.push(`contrast(${filters.contraste}%)`);

  // Desfoque
  if (filters.desfoque > 0) {
    parts.push(`blur(${filters.desfoque}px)`);
  }

  // Escala de cinza
  if (filters.escalacinza > 0) {
    parts.push(`grayscale(${filters.escalacinza}%)`);
  }

  // Sepia
  if (filters.sepia > 0) {
    parts.push(`sepia(${filters.sepia}%)`);
  }

  return parts.join(" ");
};

// Apply filters to image using Canvas API
export const applyFiltersToImage = async (
  imageSrc: string,
  filters: FilterState,
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Apply CSS filters via canvas
      ctx.filter = generateCSSFilters(filters);
      ctx.drawImage(img, 0, 0);

      // Apply color filters (vermelho, verde, azul, amarelo)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Vermelho
        if (filters.vermelho > 0) {
          data[i] = Math.min(255, r + (filters.vermelho * 255) / 100);
        }

        // Verde
        if (filters.verde > 0) {
          data[i + 1] = Math.min(255, g + (filters.verde * 255) / 100);
        }

        // Azul
        if (filters.azul > 0) {
          data[i + 2] = Math.min(255, b + (filters.azul * 255) / 100);
        }

        // Amarelo (vermelho + verde)
        if (filters.amarelo > 0) {
          data[i] = Math.min(255, r + (filters.amarelo * 255) / 100);
          data[i + 1] = Math.min(255, g + (filters.amarelo * 255) / 100);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
};

// Check if any filter is active
export const hasActiveFilters = (filters: FilterState): boolean => {
  return (
    filters.negativo > 0 ||
    filters.opacidade < 100 ||
    filters.saturacao !== 100 ||
    filters.brilho !== 100 ||
    filters.contraste !== 100 ||
    filters.desfoque > 0 ||
    filters.escalacinza > 0 ||
    filters.sepia > 0 ||
    filters.vermelho > 0 ||
    filters.verde > 0 ||
    filters.azul > 0 ||
    filters.amarelo > 0
  );
};

// Serialize filters to JSON for storage
export const serializeFilters = (filters: FilterState): string => {
  return JSON.stringify(filters);
};

// Deserialize filters from JSON
export const deserializeFilters = (json: string): FilterState => {
  try {
    return JSON.parse(json);
  } catch {
    return DEFAULT_FILTERS;
  }
};
