import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import {
  FilterState,
  DEFAULT_FILTERS,
  FILTER_LABELS,
  FilterKey,
} from "@/lib/filters";

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: FilterKey, value: number) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFilterChange(DEFAULT_FILTERS);
  };

  const handleToggleFilter = (key: FilterKey) => {
    const currentValue = filters[key];
    const newValue = currentValue > 0 ? 0 : 50;
    handleFilterChange(key, newValue);
  };

  // Get range for each filter
  const getFilterRange = (key: FilterKey) => {
    switch (key) {
      case "desfoque":
        return { min: 0, max: 20 };
      case "brilho":
      case "contraste":
      case "saturacao":
      case "opacidade":
        return { min: 0, max: 200 };
      default:
        return { min: 0, max: 100 };
    }
  };

  const filterKeys: FilterKey[] = [
    "negativo",
    "opacidade",
    "saturacao",
    "brilho",
    "contraste",
    "desfoque",
    "escalacinza",
    "sepia",
    "vermelho",
    "verde",
    "azul",
    "amarelo",
  ];

  return (
    <div className="w-full">
      {/* Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-between"
      >
        <span>🎨 Filtros</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-gray-700/50 rounded-lg p-4 space-y-4"
          >
            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar Filtros
            </button>

            {/* Filter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filterKeys.map((key) => {
                const range = getFilterRange(key);
                const value = filters[key];
                const label = FILTER_LABELS[key];
                const isActive = value > 0;

                return (
                  <div
                    key={key}
                    className="bg-gray-600/50 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-white">
                        {label}
                      </label>
                      <button
                        onClick={() => handleToggleFilter(key)}
                        className={`text-xs px-2 py-1 rounded transition-all ${
                          isActive
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-gray-300"
                        }`}
                      >
                        {isActive ? "ON" : "OFF"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={range.min}
                        max={range.max}
                        value={value}
                        onChange={(e) =>
                          handleFilterChange(key, Number(e.target.value))
                        }
                        className="flex-1 h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <span className="text-xs text-gray-300 min-w-12 text-right">
                        {value}
                        {key === "desfoque" ? "px" : "%"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterControls;
