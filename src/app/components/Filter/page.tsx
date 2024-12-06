"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";

interface Recipe {
  title: string;
  commonTitle?: string;
  category: string;
  license: string;
  type?: string;
  difficulty?: number;
  defaultPersons?: number;
}

interface FilterProps {
  setFilteredRecipes: (recipes: Recipe[]) => void;
  recipes: Recipe[];
}

interface ActiveFilter {
  filterName: string;
  value: string;
}

const Filter: React.FC<FilterProps> = ({ setFilteredRecipes, recipes }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [license, setLicense] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [defaultPersons, setDefaultPersons] = useState<string>("");
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const addFilter = (filterName: string, value: string) => {
    if (filterName === "searchTerm") return;
    setActiveFilters((prevFilters) => [
      ...prevFilters.filter((filter) => filter.filterName !== filterName),
      { filterName, value },
    ]);
  };

  const removeFilter = (filterName: string) => {
    setActiveFilters((prevFilters) =>
      prevFilters.filter((filter) => filter.filterName !== filterName)
    );
  };

  const filterRecipes = useCallback(() => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (recipe.commonTitle &&
            recipe.commonTitle.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.filterName === "category" && filter.value) {
        filtered = filtered.filter((recipe) => recipe.category === filter.value);
      }
      if (filter.filterName === "license" && filter.value) {
        filtered = filtered.filter((recipe) => recipe.license === filter.value);
      }
      if (filter.filterName === "type" && filter.value) {
        filtered = filtered.filter((recipe) => recipe.type === filter.value);
      }
      if (filter.filterName === "difficulty" && filter.value) {
        filtered = filtered.filter(
          (recipe) => recipe.difficulty === parseInt(filter.value)
        );
      }
      if (filter.filterName === "defaultPersons" && filter.value) {
        filtered = filtered.filter(
          (recipe) => recipe.defaultPersons === parseInt(filter.value)
        );
      }
    });

    setFilteredRecipes(filtered);
  }, [recipes, activeFilters, searchTerm, setFilteredRecipes]);

  useEffect(() => {
    if (recipes.length > 0) {
      filterRecipes();
    }
  }, [activeFilters, filterRecipes, recipes]);

  return (
    <div className="filter-container p-6 border-b">
      <div className="flex justify-center items-center flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-2 text-gray-600" />
            <input
              type="text"
              className="pl-10 p-2 border border-gray-300 rounded-lg w-80"
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <FaFilter
            className="text-gray-600 cursor-pointer"
            size={20}
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          />
        </div>
        {isFilterVisible && (
          <div className="flex flex-wrap items-center justify-start space-x-4 mt-4">
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                addFilter("category", e.target.value);
              }}
            >
              <option value="">Catégorie</option>
              {[...new Set(recipes.map((recipe) => recipe.category))].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={license}
              onChange={(e) => {
                setLicense(e.target.value);
                addFilter("license", e.target.value);
              }}
            >
              <option value="">Licence</option>
              {[...new Set(recipes.map((recipe) => recipe.license))].map(
                (lic) => (
                  <option key={lic} value={lic}>
                    {lic}
                  </option>
                )
              )}
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                addFilter("type", e.target.value);
              }}
            >
              <option value="">Type</option>
              {[...new Set(recipes.map((recipe) => recipe.type))].map((typ) => (
                <option key={typ} value={typ}>
                  {typ}
                </option>
              ))}
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                addFilter("difficulty", e.target.value);
              }}
            >
              <option value="">Difficulté</option>
              {[...new Set(recipes.map((recipe) => recipe.difficulty))].map(
                (diff) => (
                  <option key={diff} value={diff}>
                    {diff === 1
                      ? "Facile"
                      : diff === 2
                      ? "Intermédiaire"
                      : "Difficile"}
                  </option>
                )
              )}
            </select>
            <input
              type="number"
              className="p-2 border border-gray-300 rounded-lg"
              placeholder="Nombre de personnes"
              value={defaultPersons}
              onChange={(e) => {
                setDefaultPersons(e.target.value);
                addFilter("defaultPersons", e.target.value);
              }}
            />
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-gray-200 px-3 py-1 rounded-lg"
            >
              <span>
                {filter.filterName}: {filter.value}
              </span>
              <FaTimes
                className="cursor-pointer text-red-500"
                onClick={() => removeFilter(filter.filterName)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
