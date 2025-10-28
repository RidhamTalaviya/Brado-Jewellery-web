import React, { useState, useRef, useCallback, useEffect } from "react";

const FilterSection = ({ filters, onFilterChange }) => {
 
  return (
    <div className="w-52 bg-white border-r border-gray-200 p-6 pl-0 h-screen overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        <div className="w-full h-px bg-gray-200 mt-3"></div>
      </div>

      {/* Price Filter */}
      <h3 className="text-base font-medium text-gray-900 mb-4">Price</h3>
      <div className="py-2">
        <div className="relative px-2">
          <div
            ref={sliderRef}
            className="relative h-2 bg-gray-200 rounded-lg cursor-pointer"
          >
            <div
              className="absolute h-2 bg-amber-600 rounded-lg"
              style={{
                left: `${getPercentage(priceRange[0])}%`,
                right: `${100 - getPercentage(priceRange[1])}%`,
              }}
            />
            {/* Handles */}
            <div
              className="absolute w-2.5 h-5 bg-white border border-amber-600 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-md hover:shadow-lg transition-shadow"
              style={{
                left: `${getPercentage(priceRange[0])}%`,
                top: "50%",
              }}
              onMouseDown={handleMouseDown(0)}
            />
            <div
              className="absolute w-2.5 h-5 bg-white border border-amber-600 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-md hover:shadow-lg transition-shadow"
              style={{
                left: `${getPercentage(priceRange[1])}%`,
                top: "50%",
              }}
              onMouseDown={handleMouseDown(1)}
            />
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-sm font-medium text-gray-700">
              ₹{priceRange[0].toLocaleString()}
            </span>
            <span className="text-sm font-medium text-gray-700">
              ₹{priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Polish */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-900 mb-4">Polish</h3>
        <div className="space-y-3">
          {polishOptions.map((polish) => (
            <label key={polish} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPolish.includes(polish)}
                onChange={() => handlePolishChange(polish)}
                className="mr-2 accent-amber-600"
              />
              <span className="text-sm text-gray-700">{polish}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Base Metal */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-900 mb-4">Base Metal</h3>
        <div className="space-y-3">
          {metalOptions.map((metal) => (
            <label key={metal} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMetal.includes(metal)}
                onChange={() => handleMetalChange(metal)}
                className="mr-2 accent-amber-600"
              />
              <span className="text-sm text-gray-700">{metal}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Earrings Sub Type */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Earrings Sub Type
        </h3>
        <div className="space-y-3">
          {earringTypes.map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedEarringType.includes(type)}
                onChange={() => handleEarringTypeChange(type)}
                className="mr-2 accent-amber-600"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={clearAllFilters}
          className="w-full px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
        >
          Clear All Filters
        </button>
      </div>

      {/* Active Filters */}
      {(selectedPolish.length > 0 ||
        selectedMetal.length > 0 ||
        selectedEarringType.length > 0) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Active Filters:
          </h4>
          <div className="space-y-1 text-xs text-gray-600">
            {selectedPolish.length > 0 && (
              <div>Polish: {selectedPolish.length} selected</div>
            )}
            {selectedMetal.length > 0 && (
              <div>Base Metal: {selectedMetal.length} selected</div>
            )}
            {selectedEarringType.length > 0 && (
              <div>Earring Type: {selectedEarringType.length} selected</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;